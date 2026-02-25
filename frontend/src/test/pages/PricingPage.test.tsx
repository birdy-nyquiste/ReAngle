/**
 * Tests for PricingPage
 * Covers: renders cards, unauthenticated CTA, authenticated checkout call,
 *         loading spinner, API error message
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import PricingPage from "@/pages/PricingPage"

// Mock useNavigate so we can spy on it
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
    return { ...actual, useNavigate: () => mockNavigate }
})

// Mock AuthContext
vi.mock("@/context/AuthContext", () => ({
    useAuth: vi.fn(),
}))

import { useAuth } from "@/context/AuthContext"
const mockUseAuth = vi.mocked(useAuth)

function renderPage() {
    return render(
        <MemoryRouter>
            <PricingPage />
        </MemoryRouter>
    )
}

describe("PricingPage", () => {
    beforeEach(() => {
        mockNavigate.mockReset()
        vi.restoreAllMocks()
    })

    describe("when unauthenticated", () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                user: null, session: null, loading: false,
                signIn: vi.fn(), signOut: vi.fn(), signUp: vi.fn(),
            })
        })

        it("renders Free and Pro plan cards", () => {
            renderPage()
            expect(screen.getByText("Free")).toBeInTheDocument()
            expect(screen.getByText("Pro")).toBeInTheDocument()
            expect(screen.getByText("$0")).toBeInTheDocument()
            expect(screen.getByText("$9.99")).toBeInTheDocument()
        })

        it("Free plan 'Get Started' button navigates to /register", async () => {
            renderPage()
            await userEvent.click(screen.getByText("Get Started"))
            expect(mockNavigate).toHaveBeenCalledWith("/register")
        })

        it("Pro plan 'Upgrade to Pro' button navigates to /register", async () => {
            renderPage()
            await userEvent.click(screen.getByText("Upgrade to Pro"))
            expect(mockNavigate).toHaveBeenCalledWith("/register")
        })

        it("shows Login button in header and navigates to /login", async () => {
            renderPage()
            await userEvent.click(screen.getByRole("button", { name: "Login" }))
            expect(mockNavigate).toHaveBeenCalledWith("/login")
        })
    })

    describe("when authenticated", () => {
        const mockSession = { access_token: "test-token" } as any
        const mockUser = { id: "user-1", email: "test@example.com" } as any

        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                user: mockUser, session: mockSession, loading: false,
                signIn: vi.fn(), signOut: vi.fn(), signUp: vi.fn(),
            })
        })

        it("Free plan shows 'Go to App' button and navigates to /app", async () => {
            renderPage()
            await userEvent.click(screen.getByText("Go to App"))
            expect(mockNavigate).toHaveBeenCalledWith("/app")
        })

        it("calls checkout session API on 'Upgrade to Pro'", async () => {
            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ url: "https://checkout.stripe.com/test" }),
            })
            vi.stubGlobal("fetch", mockFetch)
            const locationSpy = vi.spyOn(window, "location", "get").mockReturnValue({
                ...window.location, href: "",
            } as Location)

            renderPage()
            await userEvent.click(screen.getByText("Upgrade to Pro"))

            await waitFor(() => {
                expect(mockFetch).toHaveBeenCalledWith(
                    "/api/v1/payment/create-checkout-session",
                    expect.objectContaining({
                        method: "POST",
                        headers: expect.objectContaining({
                            Authorization: "Bearer test-token",
                        }),
                    })
                )
            })
            locationSpy.mockRestore()
        })

        it("shows loading spinner while checkout request is in flight", async () => {
            let resolve: (v: Response) => void
            const pendingFetch = new Promise<Response>((res) => { resolve = res })
            vi.stubGlobal("fetch", vi.fn().mockReturnValue(pendingFetch))

            renderPage()
            await userEvent.click(screen.getByText("Upgrade to Pro"))

            expect(await screen.findByText("Please wait...")).toBeInTheDocument()
            expect(screen.getByRole("button", { name: /please wait/i })).toBeDisabled()

            // cleanup
            resolve!({ ok: true, json: async () => ({}) } as Response)
        })

        it("shows error message when API call fails", async () => {
            vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))

            renderPage()
            await userEvent.click(screen.getByText("Upgrade to Pro"))

            expect(
                await screen.findByText("Something went wrong. Please try again.")
            ).toBeInTheDocument()
        })
    })
})
