/**
 * Tests for AuthContext
 * Covers: useAuth guard, provider values exposed to consumers
 */
import { describe, it, expect } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react"
import { AuthProvider, useAuth } from "@/context/AuthContext"

// Mock Supabase so we don't need real credentials in tests
vi.mock("@/lib/supabase", () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({
                data: { session: null },
            }),
            onAuthStateChange: vi.fn().mockReturnValue({
                data: { subscription: { unsubscribe: vi.fn() } },
            }),
        },
    },
}))

describe("useAuth", () => {
    it("throws when used outside AuthProvider", () => {
        // Suppress expected React error boundary output
        const spy = vi.spyOn(console, "error").mockImplementation(() => { })
        expect(() => {
            renderHook(() => useAuth())
        }).toThrow("useAuth must be used within an AuthProvider")
        spy.mockRestore()
    })

    it("exposes user, session, and loading from AuthProvider", async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        })

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current).toMatchObject({
            user: null,
            session: null,
        })
        expect(typeof result.current.signIn).toBe("function")
        expect(typeof result.current.signOut).toBe("function")
        expect(typeof result.current.signUp).toBe("function")
    })

    it("renders children without crashing", async () => {
        render(
            <AuthProvider>
                <p>child content</p>
            </AuthProvider>
        )
        await waitFor(() => {
            expect(screen.getByText("child content")).toBeInTheDocument()
        })
    })
})
