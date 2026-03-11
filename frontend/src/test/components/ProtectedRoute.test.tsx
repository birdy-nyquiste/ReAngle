/**
 * Tests for ProtectedRoute component
 * Covers: loading state, unauthenticated redirect, authenticated render
 */
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock AuthContext
vi.mock("@/context/AuthContext", () => ({
    useAuth: vi.fn(),
}))

import { useAuth } from "@/context/AuthContext"
const mockUseAuth = vi.mocked(useAuth)

function renderWithRouter(ui: React.ReactNode, initialPath = "/app") {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="/app" element={ui} />
                <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
        </MemoryRouter>
    )
}

describe("ProtectedRoute", () => {
    it("shows loading indicator while auth is resolving", () => {
        mockUseAuth.mockReturnValue({
            user: null, session: null, loading: true,
            signIn: vi.fn(), signOut: vi.fn(), signUp: vi.fn(),
        })

        renderWithRouter(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        )

        expect(screen.getByText("Loading...")).toBeInTheDocument()
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
    })

    it("redirects unauthenticated users to /login", () => {
        mockUseAuth.mockReturnValue({
            user: null, session: null, loading: false,
            signIn: vi.fn(), signOut: vi.fn(), signUp: vi.fn(),
        })

        renderWithRouter(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        )

        expect(screen.getByText("Login Page")).toBeInTheDocument()
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument()
    })

    it("renders children for authenticated users", () => {
        mockUseAuth.mockReturnValue({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user: { id: "123", email: "test@example.com" } as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            session: { access_token: "tok" } as any,
            loading: false,
            signIn: vi.fn(), signOut: vi.fn(), signUp: vi.fn(),
        })

        renderWithRouter(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        )

        expect(screen.getByText("Protected Content")).toBeInTheDocument()
        expect(screen.queryByText("Login Page")).not.toBeInTheDocument()
    })
})
