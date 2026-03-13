import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowRight, ChevronDown, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useLanguage, type Language } from "@/context/LanguageContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const menuRef = useRef<HTMLDivElement | null>(null)

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

  const showPricing = !isApp && !isAuthPage && !isProfilePage && !isSettingsPage
  const showOpenApp = Boolean(user) && !isApp

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
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
    <header className="floating-nav">
      <div className="flex h-14 items-center px-6 w-full">
        <div
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          {logoNode}
        </div>

        <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
          <SelectTrigger className="ml-2 h-8 w-[9rem] bg-transparent border-0 text-sm font-medium hover:bg-white/5">
            <SelectValue placeholder={triggerLabel}>
              <span className="truncate">{triggerLabel}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background border-white/10">
            {allLanguages.map((lang) => (
              <SelectItem
                key={lang}
                value={lang}
                disabled={lang === language}
                className="cursor-pointer text-sm"
              >
                {lang === "en" ? "English" : lang === "zh" ? "中文" : "Español"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-3">
          {showPricing && (
            <Button
              variant="ghost"
              className="h-9 px-4 cursor-pointer text-muted-foreground hover:text-foreground text-sm font-medium hover:bg-white/5 transition-colors"
              onClick={() => navigate("/pricing")}
            >
              {t("nav.pricing")}
            </Button>
          )}

          {showOpenApp && (
            <Button
              className="h-9 px-4 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              onClick={() => navigate("/app")}
            >
              {t("nav.openApp")}
            </Button>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm max-w-[14rem] cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="truncate">{user.email}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
                className="h-9 px-4 cursor-pointer text-muted-foreground hover:text-foreground text-sm font-medium hover:bg-white/5 transition-colors"
                onClick={() => navigate("/login")}
              >
                {t("nav.signIn")}
              </Button>
              <Button
                className="h-9 px-4 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group"
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
