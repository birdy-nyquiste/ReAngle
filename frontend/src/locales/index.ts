/**
 * Locales and helper for t(key) lookup.
 * Use getMessage(messages, "nav.pricing") to resolve nested keys.
 */

export { en, type LocaleEn } from "./en"
export { zh } from "./zh"
export { es } from "./es"

export type LocaleMessages = Record<string, unknown>

/**
 * Get a string from a locale object by dot-separated key.
 * e.g. getMessage(messages, "nav.pricing") => messages.nav.pricing
 * Returns the key if the path is missing (fallback for missing translations).
 */
export function getMessage(messages: LocaleMessages, key: string): string {
  const value = key.split(".").reduce<unknown>((obj, k) => {
    if (obj != null && typeof obj === "object" && k in obj) {
      return (obj as Record<string, unknown>)[k]
    }
    return undefined
  }, messages)
  return typeof value === "string" ? value : key
}
