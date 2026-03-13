import { useEffect, useMemo, useState } from "react"
import AppHeader from "@/components/AppHeader"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

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

  const canSave = useMemo(() => Boolean(form) && !saving, [form, saving])

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
      <main className="flex-1 flex items-start justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-4xl space-y-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-xl">{t("settings.title")}</CardTitle>
              <CardDescription>{t("settings.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}
              {error && <p className="text-sm text-red-400">{error}</p>}
              {message && <p className="text-sm text-emerald-400">{message}</p>}

              {!loading && form && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
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

                  <div className="space-y-2">
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
