import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowRight, Check, ChevronDown, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useLanguage, type Language } from "@/context/LanguageContext"

const logoNode = (
  <>
    <img src="/favicon.png" alt="ReAngle" className="h-8 w-8 rounded-lg" />
    <span className="font-bold text-lg font-heading tracking-tight">ReAngle</span>
  </>
)

export default function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const languageMenuRef = useRef<HTMLDivElement | null>(null)

  const isApp = location.pathname.startsWith("/app")
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"
  const isProfilePage = location.pathname === "/profile"
  const isSettingsPage = location.pathname === "/settings"

  const triggerLabel =
    language === "en"
      ? "Language: EN"
      : language === "zh"
        ? "语言：中文"
        : "Idioma: ES"

  const allLanguages: Language[] = ["en", "zh", "es"]
  const languageLabelMap: Record<Language, string> = {
    en: "English",
    zh: "中文",
    es: "Español",
  }

  const showPricing = !isApp && !isAuthPage && !isProfilePage && !isSettingsPage
  const showOpenApp = Boolean(user) && !isApp

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(target)) {
        setLanguageMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        setLanguageMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <header className="floating-nav" data-testid="app-header-shell">
      <div className="flex h-14 min-h-14 w-full items-center gap-2 px-3 sm:px-5" data-testid="app-header-inner">
        <div
          className="flex shrink-0 items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          {logoNode}
        </div>

        <div className="relative ml-1 shrink-0 sm:ml-2" ref={languageMenuRef}>
          <button
            type="button"
            data-testid="app-header-language-trigger"
            className="flex h-9 w-[7.25rem] items-center justify-between rounded-md border border-white/10 bg-white/5 px-2 text-xs font-medium hover:bg-white/10 sm:w-[9rem] sm:text-sm"
            onClick={() => setLanguageMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={languageMenuOpen}
          >
            <span className="truncate">{triggerLabel}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>

          {languageMenuOpen && (
            <div
              className="absolute left-0 mt-2 w-[10rem] rounded-md border border-white/10 bg-background/95 p-1 shadow-xl backdrop-blur z-50"
              role="menu"
            >
              {allLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-white/10"
                  disabled={lang === language}
                  onClick={() => {
                    setLanguage(lang)
                    setLanguageMenuOpen(false)
                  }}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    {lang === language ? <Check className="h-4 w-4 text-primary" /> : null}
                  </span>
                  <span>{languageLabelMap[lang]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          {showPricing && (
            <Button
              variant="ghost"
              className="hidden h-9 px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground md:inline-flex"
              onClick={() => navigate("/pricing")}
            >
              {t("nav.pricing")}
            </Button>
          )}

          {showOpenApp && (
            <Button
              className="hidden h-9 px-4 text-sm font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 sm:inline-flex"
              onClick={() => navigate("/app")}
            >
              {t("nav.openApp")}
            </Button>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="flex h-9 max-w-[12rem] items-center gap-2 truncate rounded-md border border-white/10 bg-white/5 px-3 text-sm transition-colors hover:bg-white/10 sm:max-w-[14rem]"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="truncate">{user.email}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md border border-white/10 bg-background/95 backdrop-blur p-1 shadow-xl z-50"
                  role="menu"
                >
                  <button
                    className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-white/10 cursor-pointer"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate("/profile")
                    }}
                  >
                    {t("nav.profile")}
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-white/10 cursor-pointer"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate("/settings")
                    }}
                  >
                    {t("nav.settings")}
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-white/10 cursor-pointer flex items-center gap-2 text-red-300"
                    onClick={async () => {
                      setMenuOpen(false)
                      await signOut()
                      navigate("/")
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="hidden h-9 px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground sm:inline-flex"
                onClick={() => navigate("/login")}
              >
                {t("nav.signIn")}
              </Button>
              <Button
                className="group h-9 px-3 text-sm font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 sm:px-4"
                onClick={() => navigate("/register")}
              >
                {t("nav.signUp")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
