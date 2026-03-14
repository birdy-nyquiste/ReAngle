import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import type { ReactNode } from "react"
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import PricingPage from "@/pages/PricingPage"

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}))

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}))

import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

const mockUseAuth = vi.mocked(useAuth)
const mockUseLanguage = vi.mocked(useLanguage)

function setupMocks() {
  mockUseAuth.mockReturnValue({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: null as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: null as any,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
  })
  mockUseLanguage.mockReturnValue({
    language: "en",
    setLanguage: vi.fn(),
    t: (key: string) => key,
  })
}

function renderWithRouter(node: ReactNode, route: string) {
  return render(<MemoryRouter initialEntries={[route]}>{node}</MemoryRouter>)
}

describe("Pages use unified header top offset", () => {
  it("Landing page main uses pt-header-offset", () => {
    setupMocks()
    const { container } = renderWithRouter(<LandingPage />, "/")
    const main = container.querySelector("main")
    expect(main).toHaveClass("pt-header-offset")
  })

  it("Login page main uses pt-header-offset", () => {
    setupMocks()
    const { container } = renderWithRouter(<LoginPage />, "/login")
    const main = container.querySelector("main")
    expect(main).toHaveClass("pt-header-offset")
  })

  it("Pricing page main uses pt-header-offset", () => {
    setupMocks()
    const { container } = renderWithRouter(<PricingPage />, "/pricing")
    const main = container.querySelector("main")
    expect(main).toHaveClass("pt-header-offset")
  })
})
