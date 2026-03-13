/**
 * Tests for RegisterPage
 * Covers: form renders, successful sign-up shows confirmation,
 *         password mismatch error, short password error, API error
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import RegisterPage from "@/pages/RegisterPage"
import { LanguageProvider } from "@/context/LanguageContext"

vi.mock("@/context/AuthContext", () => ({
    useAuth: vi.fn(),
}))

import { useAuth } from "@/context/AuthContext"
const mockUseAuth = vi.mocked(useAuth)

const mockSignUp = vi.fn()

function renderPage() {
    return render(
        <LanguageProvider>
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        </LanguageProvider>
    )
}

describe("RegisterPage", () => {
    beforeEach(() => {
        mockSignUp.mockReset()
        mockUseAuth.mockReturnValue({
            user: null, session: null, loading: false,
            signIn: vi.fn(), signOut: vi.fn(), signUp: mockSignUp,
        })
    })

    it("renders email, password, and confirm password fields", () => {
        renderPage()
        expect(screen.getByLabelText("Email")).toBeInTheDocument()
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
        expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument()
    })

    it("shows confirmation screen on successful sign-up", async () => {
        mockSignUp.mockResolvedValue({ error: null })

        renderPage()
        await userEvent.type(screen.getByLabelText("Email"), "new@example.com")
        await userEvent.type(screen.getByLabelText("Password"), "password123")
        await userEvent.type(screen.getByLabelText("Confirm Password"), "password123")
        await userEvent.click(screen.getByRole("button", { name: "Create Account" }))

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith("new@example.com", "password123")
            expect(screen.getByText("Check your email")).toBeInTheDocument()
        })
    })

    it("shows error when passwords do not match", async () => {
        renderPage()
        await userEvent.type(screen.getByLabelText("Email"), "test@example.com")
        await userEvent.type(screen.getByLabelText("Password"), "password123")
        await userEvent.type(screen.getByLabelText("Confirm Password"), "different!")
        await userEvent.click(screen.getByRole("button", { name: "Create Account" }))

        expect(screen.getByText("Passwords do not match")).toBeInTheDocument()
        expect(mockSignUp).not.toHaveBeenCalled()
    })

    it("shows error when password is too short", async () => {
        renderPage()
        await userEvent.type(screen.getByLabelText("Email"), "test@example.com")
        await userEvent.type(screen.getByLabelText("Password"), "abc")
        await userEvent.type(screen.getByLabelText("Confirm Password"), "abc")
        await userEvent.click(screen.getByRole("button", { name: "Create Account" }))

        expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument()
        expect(mockSignUp).not.toHaveBeenCalled()
    })

    it("shows API error message when sign-up fails", async () => {
        mockSignUp.mockResolvedValue({ error: new Error("Email already registered") })

        renderPage()
        await userEvent.type(screen.getByLabelText("Email"), "existing@example.com")
        await userEvent.type(screen.getByLabelText("Password"), "password123")
        await userEvent.type(screen.getByLabelText("Confirm Password"), "password123")
        await userEvent.click(screen.getByRole("button", { name: "Create Account" }))

        expect(await screen.findByText("Email already registered")).toBeInTheDocument()
    })

    it("shows a link to the sign-in page", () => {
        renderPage()
        const link = screen.getByRole("link", { name: "Sign in" })
        expect(link).toHaveAttribute("href", "/login")
    })
})
