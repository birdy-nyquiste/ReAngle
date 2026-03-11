import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { en, zh, es, getMessage } from "@/locales"

const STORAGE_KEY = "reangle-lang"

export type Language = "en" | "zh" | "es"

function isBrowserChinese(): boolean {
  const lang =
    navigator.language ||
    (navigator.languages && navigator.languages[0]) ||
    ""
  return /^zh(\b|-)/i.test(lang)
}

function isBrowserSpanish(): boolean {
  const lang =
    navigator.language ||
    (navigator.languages && navigator.languages[0]) ||
    ""
  return /^es(\b|-)/i.test(lang)
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en"
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null
  if (stored === "en" || stored === "zh" || stored === "es") return stored
  if (isBrowserChinese()) return "zh"
  if (isBrowserSpanish()) return "es"
  return "en"
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const messages = { en, zh, es } as const

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang =
      lang === "zh" ? "zh-CN" : lang === "es" ? "es-ES" : "en"
  }, [])

  const t = useCallback(
    (key: string) => getMessage(messages[language], key),
    [language]
  )

  useEffect(() => {
    document.documentElement.lang =
      language === "zh" ? "zh-CN" : language === "es" ? "es-ES" : "en"
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
