import { useEffect, useMemo, useState } from "react"
import AppHeader from "@/components/AppHeader"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight } from "lucide-react"

interface ModelOption {
  id: string
  label: string
}

interface SettingsResponse {
  deangle_model: string
  reangle_model: string
  deangle_detach_system_prompt: string
  deangle_fact_check_system_prompt: string
  reangle_system_prompt: string
  deangle_detach_uses_default: boolean
  deangle_fact_check_uses_default: boolean
  reangle_uses_default: boolean
  available_models: {
    deangle: ModelOption[]
    reangle: ModelOption[]
  }
}

interface SettingsForm {
  deangle_model: string
  reangle_model: string
  deangle_detach_system_prompt: string
  deangle_fact_check_system_prompt: string
  reangle_system_prompt: string
}

export default function SettingsPage() {
  const { session } = useAuth()
  const { t } = useLanguage()

  const [form, setForm] = useState<SettingsForm | null>(null)
  const [defaults, setDefaults] = useState({
    deangle_detach_uses_default: true,
    deangle_fact_check_uses_default: true,
    reangle_uses_default: true,
  })
  const [availableModels, setAvailableModels] = useState<{
    deangle: ModelOption[]
    reangle: ModelOption[]
  }>({ deangle: [], reangle: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    deangle: true,
    reangle: true,
    avatar: true,
  })

  const canSave = useMemo(() => Boolean(form) && !saving, [form, saving])

  const toggleSection = (section: "deangle" | "reangle" | "avatar") => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const fetchSettings = async () => {
    if (!session?.access_token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/v2/settings/", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      if (!res.ok) {
        let message = t("settings.loadError")
        try {
          const errData = await res.json()
          message = errData?.error || errData?.detail || message
        } catch {
          // keep fallback message
        }
        throw new Error(message)
      }
      const data = (await res.json()) as SettingsResponse
      setForm({
        deangle_model: data.deangle_model,
        reangle_model: data.reangle_model,
        deangle_detach_system_prompt: data.deangle_detach_system_prompt,
        deangle_fact_check_system_prompt: data.deangle_fact_check_system_prompt,
        reangle_system_prompt: data.reangle_system_prompt,
      })
      setDefaults({
        deangle_detach_uses_default: data.deangle_detach_uses_default,
        deangle_fact_check_uses_default: data.deangle_fact_check_uses_default,
        reangle_uses_default: data.reangle_uses_default,
      })
      setAvailableModels(data.available_models)
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : t("settings.loadError"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token])

  const patchSettings = async (body: Record<string, string | null>) => {
    if (!session?.access_token) return
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch("/api/v2/settings/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        let message = t("settings.saveError")
        try {
          const errData = await res.json()
          message = errData?.error || errData?.detail || message
        } catch {
          // keep fallback message
        }
        throw new Error(message)
      }
      const data = (await res.json()) as SettingsResponse
      setForm({
        deangle_model: data.deangle_model,
        reangle_model: data.reangle_model,
        deangle_detach_system_prompt: data.deangle_detach_system_prompt,
        deangle_fact_check_system_prompt: data.deangle_fact_check_system_prompt,
        reangle_system_prompt: data.reangle_system_prompt,
      })
      setDefaults({
        deangle_detach_uses_default: data.deangle_detach_uses_default,
        deangle_fact_check_uses_default: data.deangle_fact_check_uses_default,
        reangle_uses_default: data.reangle_uses_default,
      })
      setAvailableModels(data.available_models)
      setMessage(t("settings.saveSuccess"))
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : t("settings.saveError"))
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    if (!form) return
    await patchSettings({
      deangle_model: form.deangle_model,
      reangle_model: form.reangle_model,
      deangle_detach_system_prompt: form.deangle_detach_system_prompt.trim() || null,
      deangle_fact_check_system_prompt:
        form.deangle_fact_check_system_prompt.trim() || null,
      reangle_system_prompt: form.reangle_system_prompt.trim() || null,
    })
  }

  const handleReset = async () => {
    await patchSettings({
      deangle_model: null,
      reangle_model: null,
      deangle_detach_system_prompt: null,
      deangle_fact_check_system_prompt: null,
      reangle_system_prompt: null,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background aurora-bg">
      <AppHeader />
      <main className="pt-header-offset flex flex-1 items-start justify-center px-4 pb-12">
        <div className="w-full max-w-4xl space-y-6">
          <div className="space-y-1 px-1">
            <h1 className="text-xl font-semibold text-foreground">{t("settings.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
          </div>

          <div className="space-y-6">
            {loading && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}
            {message && <p className="text-sm text-emerald-400">{message}</p>}

            {!loading && form && (
              <>
                <div className="space-y-5">
                  <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-white/10 flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-foreground/95">{t("settings.sectionDeangle")}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => toggleSection("deangle")}
                        aria-expanded={expandedSections.deangle}
                        aria-controls="settings-deangle-content"
                        aria-label={expandedSections.deangle ? t("settings.collapseDeangle") : t("settings.expandDeangle")}
                        title={expandedSections.deangle ? t("settings.collapse") : t("settings.expand")}
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${expandedSections.deangle ? "rotate-90" : ""}`}
                        />
                      </Button>
                    </div>
                    {expandedSections.deangle && (
                      <div id="settings-deangle-content" className="p-4 lg:p-5 space-y-4">
                        <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                          <h4 className="text-sm font-medium text-foreground/90">{t("settings.modelLabel")}</h4>
                          <div className="space-y-2">
                            <Label>{t("settings.deangleModel")}</Label>
                            <Select
                              value={form.deangle_model}
                              onValueChange={(value) =>
                                setForm((prev) =>
                                  prev ? { ...prev, deangle_model: value } : prev
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableModels.deangle.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    {model.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-4">
                          <h4 className="text-sm font-medium text-foreground/90">Prompt</h4>

                          <div className="space-y-2">
                            <Label>{t("settings.deangleDetachPrompt")}</Label>
                            <div className="text-xs text-muted-foreground">
                              {defaults.deangle_detach_uses_default
                                ? t("settings.usingDefault")
                                : t("settings.customized")}
                            </div>
                            <Textarea
                              value={form.deangle_detach_system_prompt}
                              onChange={(e) =>
                                setForm((prev) =>
                                  prev
                                    ? {
                                      ...prev,
                                      deangle_detach_system_prompt: e.target.value,
                                    }
                                    : prev
                                )
                              }
                              className="min-h-[180px]"
                            />
                          </div>

                          <div className="border-t border-white/10 pt-4 space-y-2">
                            <Label>{t("settings.deangleFactCheckPrompt")}</Label>
                            <div className="text-xs text-muted-foreground">
                              {defaults.deangle_fact_check_uses_default
                                ? t("settings.usingDefault")
                                : t("settings.customized")}
                            </div>
                            <Textarea
                              value={form.deangle_fact_check_system_prompt}
                              onChange={(e) =>
                                setForm((prev) =>
                                  prev
                                    ? {
                                      ...prev,
                                      deangle_fact_check_system_prompt: e.target.value,
                                    }
                                    : prev
                                )
                              }
                              className="min-h-[180px]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-white/10 flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-foreground/95">{t("settings.sectionReangle")}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => toggleSection("reangle")}
                        aria-expanded={expandedSections.reangle}
                        aria-controls="settings-reangle-content"
                        aria-label={expandedSections.reangle ? t("settings.collapseReangle") : t("settings.expandReangle")}
                        title={expandedSections.reangle ? t("settings.collapse") : t("settings.expand")}
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${expandedSections.reangle ? "rotate-90" : ""}`}
                        />
                      </Button>
                    </div>
                    {expandedSections.reangle && (
                      <div id="settings-reangle-content" className="p-4 lg:p-5 space-y-4">
                        <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                          <h4 className="text-sm font-medium text-foreground/90">{t("settings.modelLabel")}</h4>
                          <div className="space-y-2">
                            <Label>{t("settings.reangleModel")}</Label>
                            <Select
                              value={form.reangle_model}
                              onValueChange={(value) =>
                                setForm((prev) =>
                                  prev ? { ...prev, reangle_model: value } : prev
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableModels.reangle.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    {model.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-2">
                          <h4 className="text-sm font-medium text-foreground/90">Prompt</h4>
                          <Label>{t("settings.reanglePrompt")}</Label>
                          <div className="text-xs text-muted-foreground">
                            {defaults.reangle_uses_default
                              ? t("settings.usingDefault")
                              : t("settings.customized")}
                          </div>
                          <Textarea
                            value={form.reangle_system_prompt}
                            onChange={(e) =>
                              setForm((prev) =>
                                prev
                                  ? { ...prev, reangle_system_prompt: e.target.value }
                                  : prev
                              )
                            }
                            className="min-h-[220px]"
                          />
                        </div>
                      </div>
                    )}
                  </section>

                  <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-white/10 flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-foreground/95">Avatar</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => toggleSection("avatar")}
                        aria-expanded={expandedSections.avatar}
                        aria-controls="settings-avatar-content"
                        aria-label={expandedSections.avatar ? t("settings.collapseAvatar") : t("settings.expandAvatar")}
                        title={expandedSections.avatar ? t("settings.collapse") : t("settings.expand")}
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${expandedSections.avatar ? "rotate-90" : ""}`}
                        />
                      </Button>
                    </div>
                    {expandedSections.avatar && (
                      <div id="settings-avatar-content" className="p-4 lg:p-5">
                        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-6 text-sm text-muted-foreground">
                          {t("settings.avatarComingSoon")}
                        </div>
                      </div>
                    )}
                  </section>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={handleSave} disabled={!canSave}>
                    {saving ? t("settings.saving") : t("settings.save")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={saving}
                  >
                    {t("settings.reset")}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
