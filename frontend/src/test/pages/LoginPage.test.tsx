/**
 * Tests for LoginPage
 * Covers: form renders, successful sign-in navigation, error display,
 *         button disabled during loading
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import LoginPage from "@/pages/LoginPage"

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
    return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock("@/context/AuthContext", () => ({
    useAuth: vi.fn(),
}))

import { useAuth } from "@/context/AuthContext"
const mockUseAuth = vi.mocked(useAuth)

const mockSignIn = vi.fn()

function renderPage() {
    return render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    )
}

describe("LoginPage", () => {
    beforeEach(() => {
        mockNavigate.mockReset()
        mockSignIn.mockReset()
        mockUseAuth.mockReturnValue({
            user: null, session: null, loading: false,
            signIn: mockSignIn, signOut: vi.fn(), signUp: vi.fn(),
        })
    })

    it("renders email, password fields and sign-in button", () => {
        renderPage()
        expect(screen.getByLabelText("Email")).toBeInTheDocument()
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
    })

    it("navigates to /app on successful sign-in", async () => {
        mockSignIn.mockResolvedValue({ error: null })

        renderPage()
        await userEvent.type(screen.getByLabelText("Email"), "user@example.com")
        await userEvent.type(screen.getByLabelText("Password"), "password123")
        await userEvent.click(screen.getByRole("button", { name: "Sign In" }))

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith("user@example.com", "password123")
            expect(mockNavigate).toHaveBeenCalledWith("/app")
        })
    })

    it("shows error message when sign-in fails", async () => {
        mockSignIn.mockResolvedValue({ error: new Error("Invalid credentials") })

        renderPage()
        await userEvent.type(screen.getByLabelText("Email"), "bad@example.com")
        await userEvent.type(screen.getByLabelText("Password"), "wrong")
        await userEvent.click(screen.getByRole("button", { name: "Sign In" }))

        expect(await screen.findByText("Invalid credentials")).toBeInTheDocument()
        expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("disables button and shows 'Signing in...' while loading", async () => {
        let resolve: (v: { error: null }) => void
        mockSignIn.mockReturnValue(new Promise((r) => { resolve = r }))

        renderPage()
        await userEvent.type(screen.getByLabelText("Email"), "user@example.com")
        await userEvent.type(screen.getByLabelText("Password"), "password123")
        await userEvent.click(screen.getByRole("button", { name: "Sign In" }))

        expect(await screen.findByRole("button", { name: "Signing in..." })).toBeDisabled()

        // cleanup
        resolve!({ error: null })
    })

    it("shows a link to the register page", () => {
        renderPage()
        const link = screen.getByRole("link", { name: "Sign up" })
        expect(link).toHaveAttribute("href", "/register")
    })
})
