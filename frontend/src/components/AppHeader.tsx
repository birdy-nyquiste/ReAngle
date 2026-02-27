import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowRight, LogIn, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useLanguage, type Language } from "@/context/LanguageContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const isLanding = location.pathname === "/"
  const isApp = location.pathname.startsWith("/app")
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"
  const isProfilePage = location.pathname === "/profile"

  const headerClassName = isLanding
    ? "fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 backdrop-blur-md"
    : "floating-nav"

  const containerClassName = isLanding
    ? "container flex h-16 items-center px-6 mx-auto max-w-7xl"
    : "container flex h-14 items-center px-6"

  const logoNode = (
    <>
      <img src="/favicon.png" alt="ReAngle" className={isLanding ? "h-8 w-8 rounded-lg" : "h-8 w-8 rounded-lg"} />
      <span className={isLanding ? "font-bold text-xl tracking-tight font-heading" : "font-bold text-lg"}>ReAngle</span>
    </>
  )

  const triggerLabel =
    language === "en"
      ? "Language: EN"
      : language === "zh"
      ? "语言：中文"
      : "Idioma: ES"

  const allLanguages: Language[] = ["en", "zh", "es"]

  return (
    <header className={headerClassName}>
      <div className={containerClassName}>
        <div
          className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${isLanding ? "gap-3" : "gap-2.5"}`}
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          {logoNode}
        </div>

        {/* Language toggle: 紧挨 Logo 右侧（红圈位置） */}
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value as Language)}
        >
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

        <div className="ml-auto flex items-center gap-4">
          {/* Nav: App (email + Profile + Sign Out) */}
          {isApp && user && (
            <>
              <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer text-muted-foreground hover:text-foreground text-sm font-medium hover:bg-white/5"
                onClick={() => window.location.href = "/profile"}
              >
                {t("nav.profile")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer text-muted-foreground hover:text-foreground text-sm font-medium hover:bg-white/5"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                {t("nav.signOut")}
              </Button>
            </>
          )}

          {/* Nav: Profile page (Open App only) */}
          {isProfilePage && (
            <Button size="sm" className="cursor-pointer text-sm font-medium" onClick={() => navigate("/app")}>
              {t("nav.openApp")}
            </Button>
          )}

          {/* Nav: Auth pages (login/register) - no right nav besides lang */}
          {isAuthPage && null}

          {/* Nav: Landing, Pricing, etc. (Pricing + user menu) */}
          {!isApp && !isAuthPage && !isProfilePage && (
            <>
              <Button
                variant="ghost"
                className="text-sm font-medium hover:bg-white/5"
                onClick={() => navigate("/pricing")}
              >
                {t("nav.pricing")}
              </Button>
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:bg-white/5"
                    onClick={() => navigate("/profile")}
                  >
                    {t("nav.profile")}
                  </Button>
                  <Button
                    className="text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    onClick={() => navigate("/app")}
                  >
                    {t("nav.openApp")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:bg-white/5 hidden sm:flex"
                    onClick={() => navigate("/login")}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    {t("nav.login")}
                  </Button>
                  <Button
                    className="text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group"
                    onClick={() => navigate("/register")}
                  >
                    {t("nav.getStarted")}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
