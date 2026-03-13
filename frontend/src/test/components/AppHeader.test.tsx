import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import AppHeader from "@/components/AppHeader"

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

function renderHeader(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<AppHeader />} />
      </Routes>
    </MemoryRouter>
  )
}

describe("AppHeader", () => {
  it("shows Sign Up / Sign In when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
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
      t: (key: string) =>
        ({
          "nav.signIn": "Sign In",
          "nav.signUp": "Sign Up",
          "nav.pricing": "Pricing",
        }[key] || key),
    })

    renderHeader("/")

    expect(screen.getByText("Sign In")).toBeInTheDocument()
    expect(screen.getByText("Sign Up")).toBeInTheDocument()
  })

  it("shows account menu items after clicking email trigger", async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: { email: "alice@example.com" } as any,
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
      t: (key: string) =>
        ({
          "nav.profile": "Profile",
          "nav.settings": "Settings",
          "nav.signOut": "Sign Out",
          "nav.openApp": "Open App",
          "nav.pricing": "Pricing",
        }[key] || key),
    })

    renderHeader("/")
    await user.click(screen.getByRole("button", { name: /alice@example.com/i }))

    expect(screen.getByText("Profile")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
    expect(screen.getByText("Sign Out")).toBeInTheDocument()
  })
})
