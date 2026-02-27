import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { en, zh, getMessage } from "@/locales"

const STORAGE_KEY = "reangle-lang"

export type Language = "en" | "zh"

function isBrowserChinese(): boolean {
  const lang =
    navigator.language ||
    (navigator.languages && navigator.languages[0]) ||
    ""
  return /^zh(\b|-)/i.test(lang)
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en"
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null
  if (stored === "en" || stored === "zh") return stored
  return isBrowserChinese() ? "zh" : "en"
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const messages = { en, zh } as const

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en"
  }, [])

  const t = useCallback(
    (key: string) => getMessage(messages[language], key),
    [language]
  )

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en"
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
