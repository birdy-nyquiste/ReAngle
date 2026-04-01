import { useState, useEffect, useCallback, useMemo } from "react"
import { Sparkles, X, Loader2, PanelLeftClose, PanelLeftOpen, Triangle, Wand2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppHeader from "@/components/AppHeader"
import { DeAngleView } from "@/components/DeAngleView"
import { ReAngleView } from "@/components/ReAngleView"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
// New Components
import { SourceSection } from "@/components/main-app/SourceSection"
import { RevealSection } from "@/components/main-app/RevealSection"
import { ReframeSection } from "@/components/main-app/ReframeSection"

// Types
interface InputItem {
    id: string
    type: 'text' | 'file' | 'url' | 'youtube'
    content?: string | File
    meta?: {
        title: string
        detail: string
    }
}

interface PaymentUsage {
    usage_count: number
    usage_limit: number
    tts_usage_count: number
    tts_usage_limit: number
    avatar_usage_count: number
    avatar_usage_limit: number
    subscription: {
        status: string
    } | null
}

export default function MainApp() {
    const AVATAR_SCRIPT_MAX_CHARS = 800

    const { t } = useLanguage()
    const { session: authSession } = useAuth()

    // Session ID — generated once per MainApp mount
    const [sessionId] = useState(() => crypto.randomUUID())

    // Helper: build headers with auth + session
    const getHeaders = useCallback((json = true) => {
        const headers: Record<string, string> = {
            "X-Session-Id": sessionId,
        }
        if (authSession?.access_token) {
            headers["Authorization"] = `Bearer ${authSession.access_token}`
        }
        if (json) {
            headers["Content-Type"] = "application/json"
        }
        return headers
    }, [sessionId, authSession])

    // Sidebar State
    const [sidebarExpanded, setSidebarExpanded] = useState(true)
    const [expandedSections, setExpandedSections] = useState({
        gather: true,
        deangle: false,
        reangle: false
    })

    const toggleSection = (section: "gather" | "deangle" | "reangle") => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // State
    const [activeInputTab, setActiveInputTab] = useState("text")
    const [inputItems, setInputItems] = useState<InputItem[]>([])
    const [inputsLocked, setInputsLocked] = useState(false)

    // Inputs
    const [inputText, setInputText] = useState("")
    const [inputUrl, setInputUrl] = useState("")
    const [inputFile, setInputFile] = useState<File | null>(null)
    const [inputsLoading, setInputsLoading] = useState(false)

    // DeAngle State
    const [deAngleLoading, setDeAngleLoading] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deAngleResult, setDeAngleResult] = useState<any>(null)
    const [selectedDeAngleIds, setSelectedDeAngleIds] = useState<Set<string>>(new Set())

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleToggleDeAngleSelect = useCallback((id: string, _type: "fact" | "angle") => {
        setSelectedDeAngleIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }, [])

    // Derived: selected facts & angles for display
    const selectedFacts = useMemo(() => {
        if (!deAngleResult?.facts) return []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return deAngleResult.facts.filter((f: any) => selectedDeAngleIds.has(f.id))
    }, [deAngleResult, selectedDeAngleIds])

    const selectedAngles = useMemo(() => {
        if (!deAngleResult?.angles) return []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return deAngleResult.angles.filter((a: any) => selectedDeAngleIds.has(a.id))
    }, [deAngleResult, selectedDeAngleIds])

    // Custom Manual Inputs
    const [customFacts, setCustomFacts] = useState<{ id: string, content: string }[]>([])
    const [customAngles, setCustomAngles] = useState<{ id: string, title: string }[]>([])

    const handleAddCustomFact = (content: string) => {
        setCustomFacts(prev => [...prev, { id: "cf_" + Math.random().toString(36).substring(7), content }])
    }
    const handleRemoveCustomFact = (id: string) => {
        setCustomFacts(prev => prev.filter(f => f.id !== id))
    }
    const handleAddCustomAngle = (title: string) => {
        setCustomAngles(prev => [...prev, { id: "ca_" + Math.random().toString(36).substring(7), title }])
    }
    const handleRemoveCustomAngle = (id: string) => {
        setCustomAngles(prev => prev.filter(a => a.id !== id))
    }

    // ReAngle State
    const [prompt, setPrompt] = useState("")
    const [reAngleLoading, setReAngleLoading] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [reAngleResult, setReAngleResult] = useState<any>(null)

    // Global UI
    const [activeResultTab, setActiveResultTab] = useState("DeAngle")
    const [error, setError] = useState<string | null>(null)
    const [isUsageLimitError, setIsUsageLimitError] = useState(false)
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)
    const [avatarUsage, setAvatarUsage] = useState<PaymentUsage | null>(null)
    const [avatarUsageLoading, setAvatarUsageLoading] = useState(false)

    // TTS State
    const [ttsLoading, setTtsLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    // Avatar Broadcast (数字人播报) State
    const [avatarPanelVisible, setAvatarPanelVisible] = useState(false)
    const [voiceoverScript, setVoiceoverScript] = useState<string | null>(null)
    const [voiceoverLoading, setVoiceoverLoading] = useState(false)
    const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null)
    const [avatarLoading, setAvatarLoading] = useState(false)

    const fetchAvatarUsage = useCallback(async () => {
        if (!authSession?.access_token) {
            setAvatarUsage(null)
            setAvatarUsageLoading(false)
            return
        }
        setAvatarUsageLoading(true)
        try {
            const res = await fetch("/api/v2/payment/usage", {
                headers: {
                    Authorization: `Bearer ${authSession.access_token}`,
                },
            })
            if (!res.ok) throw new Error("Failed to load avatar usage")
            const data = (await res.json()) as PaymentUsage
            setAvatarUsage(data)
        } catch (err) {
            console.error("Failed to fetch avatar usage:", err)
            setAvatarUsage(null)
        } finally {
            setAvatarUsageLoading(false)
        }
    }, [authSession?.access_token])

    useEffect(() => {
        fetchAvatarUsage()
    }, [fetchAvatarUsage])

    const avatarAccessKnown = avatarUsage !== null
    const avatarSubStatus = avatarUsage?.subscription?.status ?? null
    const avatarIsPro = avatarSubStatus === "active" || avatarSubStatus === "trialing"
    const avatarUsageCount = avatarUsage?.avatar_usage_count ?? 0
    const avatarUsageLimit = avatarUsage?.avatar_usage_limit ?? 0
    const avatarRemaining = avatarUsageLimit === -1
        ? Number.POSITIVE_INFINITY
        : Math.max(0, avatarUsageLimit - avatarUsageCount)
    const avatarFeatureEnabled = !authSession?.access_token
        ? false
        : !avatarAccessKnown
            ? true
            : avatarIsPro && (avatarUsageLimit === -1 || avatarRemaining > 0)

    const avatarDisabledReason = useMemo(() => {
        if (!authSession?.access_token) return t("mainApp.avatarSignInRequired")
        if (avatarUsageLoading) return t("mainApp.avatarCheckingAccess")
        if (!avatarAccessKnown) return null
        if (!avatarIsPro) return t("mainApp.avatarProOnly")
        if (avatarUsageLimit !== -1 && avatarRemaining <= 0) {
            return `Avatar usage limit reached for this billing cycle (${avatarUsageCount}/${avatarUsageLimit}).`
        }
        return null
    }, [
        authSession?.access_token,
        avatarUsageLoading,
        avatarAccessKnown,
        avatarIsPro,
        avatarUsageLimit,
        avatarRemaining,
        avatarUsageCount,
        t,
    ])



    const avatarQuotaText = useMemo(() => {
        if (!authSession?.access_token) return t("mainApp.avatarSignInRequiredQuota")
        if (avatarUsageLoading) return t("mainApp.avatarCheckingQuota")
        if (!avatarAccessKnown) return null
        if (!avatarIsPro) return t("mainApp.avatarProRequired")
        if (avatarUsageLimit === -1) return t("mainApp.avatarUsageCycleUnlimited").replace("{n}", String(avatarUsageCount))
        return t("mainApp.avatarUsageCycleUsed").replace("{used}", String(avatarUsageCount)).replace("{limit}", String(avatarUsageLimit))
    }, [
        t,
        authSession?.access_token,
        avatarUsageLoading,
        avatarAccessKnown,
        avatarIsPro,
        avatarUsageLimit,
        avatarUsageCount,
    ])

    // Detect ?checkout=success in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get("checkout") === "success") {
            setCheckoutSuccess(true)
            // Clean URL without reload
            window.history.replaceState({}, "", "/app")
            const timer = setTimeout(() => setCheckoutSuccess(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [])

    // Handlers
    const handleAddInput = () => {
        if (inputItems.length >= 3) {
            setError(t("mainApp.maxInputsAllowed"))
            return
        }

        const id = Math.random().toString(36).substring(7)
        let newItem: InputItem | null = null

        if (activeInputTab === "text" && inputText.trim()) {
            newItem = {
                id, type: "text", content: inputText,
                meta: { title: t("mainApp.textSnippet"), detail: `${inputText.length} chars` }
            }
            setInputText("")
        } else if (activeInputTab === "url" && inputUrl.trim()) {
            newItem = {
                id, type: "url", content: inputUrl,
                meta: { title: t("mainApp.url"), detail: inputUrl }
            }
            setInputUrl("")
        } else if (activeInputTab === "youtube" && inputUrl.trim()) {
            newItem = {
                id, type: "youtube", content: inputUrl,
                meta: { title: t("mainApp.youtube"), detail: inputUrl }
            }
            setInputUrl("")
        } else if (activeInputTab === "file" && inputFile) {
            newItem = {
                id, type: "file", content: inputFile,
                meta: { title: inputFile.name, detail: `${(inputFile.size / 1024).toFixed(1)} KB` }
            }
            setInputFile(null)
        }

        if (newItem) {
            setInputItems(prev => [...prev, newItem])
        }
    }

    const handleRemoveInput = (id: string) => {
        setInputItems(prev => prev.filter(i => i.id !== id))
    }

    const handleCompleteInputs = async () => {
        if (inputItems.length === 0) {
            setError(t("mainApp.errorAddItem"))
            return
        }

        setInputsLoading(true)
        setError(null)
        setIsUsageLimitError(false)

        try {
            const formData = new FormData()
            let fileIndex = 0

            const inputsPayload = inputItems.map((item) => {
                if (item.type === 'file' && item.content instanceof File) {
                    const key = `files_${fileIndex}`
                    formData.append("files", item.content)
                    fileIndex++
                    return { id: item.id, type: item.type, contentKey: key, meta: item.meta }
                }
                return { id: item.id, type: item.type, content: item.content, meta: item.meta }
            })

            formData.append("inputs", JSON.stringify(inputsPayload))

            const headers: Record<string, string> = { "X-Session-Id": sessionId }
            if (authSession?.access_token) {
                headers["Authorization"] = `Bearer ${authSession.access_token}`
            }

            const res = await fetch("/api/v2/inputs/", {
                method: "POST",
                headers,
                body: formData
            })

            if (res.status === 402) {
                setIsUsageLimitError(true)
                throw new Error(t("mainApp.usageLimitReached"))
            }
            if (!res.ok) {
                let errorMsg = t("mainApp.failedToProcessInputs")
                try {
                    const errData = await res.json()
                    if (res.status === 503 || errData?.code === "SERVICE_UNAVAILABLE") {
                        errorMsg = t("mainApp.peakCapacity")
                    } else if (errData?.code === "THEME_VALIDATION_ERROR") {
                        errorMsg = `${t("mainApp.themeValidationFailed")}: ${errData.error}`
                    } else if (errData?.error) {
                        errorMsg = errData.error
                    } else if (errData?.detail?.message) {
                        errorMsg = errData.detail.message
                    } else if (errData?.detail && Array.isArray(errData.detail)) {
                        errorMsg = errData.detail[0].msg
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (e: any) {
                    console.error("Failed to parse error JSON", e)
                }
                throw new Error(errorMsg)
            }

            setInputsLocked(true)
            setExpandedSections(prev => ({ ...prev, gather: false, deangle: true }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err)
            setError(err.message || t("mainApp.failedToProcessInputs"))
        } finally {
            setInputsLoading(false)
        }
    }

    const handleDeAngleProcess = async () => {
        if (!inputsLocked) {
            setError(t("mainApp.completeInputsFirst"))
            return
        }

        setDeAngleLoading(true)
        setError(null)
        setDeAngleResult(null)
        setReAngleResult(null)
        setActiveResultTab("DeAngle")

        try {
            const res = await fetch("/api/v2/deangle/", {
                method: "POST",
                headers: getHeaders(),
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 503 || data.code === "SERVICE_UNAVAILABLE") {
                    throw new Error("AI service is currently at peak capacity. Please wait a few seconds and try again.")
                }
                throw new Error(data.error || data.message || t("mainApp.deangleFailed"))
            }

            setDeAngleResult(data)
            setExpandedSections(prev => ({ ...prev, deangle: false, reangle: true }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to DeAngle")
        } finally {
            setDeAngleLoading(false)
        }
    }

    const handleReAngleProcess = async () => {
        if (!deAngleResult) {
            setError(t("mainApp.mustDeangleFirst"))
            return
        }

        setReAngleLoading(true)
        setError(null)
        setReAngleResult(null)
        setAudioUrl(null)
        setActiveResultTab("ReAngle")

        try {
            const res = await fetch("/api/v2/reangle/", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({
                    prompt,
                    selected_facts: [...selectedFacts, ...customFacts],
                    selected_angles: [...selectedAngles, ...customAngles]
                })
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 503 || data.code === "SERVICE_UNAVAILABLE") {
                    throw new Error("AI service is currently at peak capacity. Please wait a few seconds and try again.")
                }
                throw new Error(data.message || t("mainApp.reangleFailed"))
            }

            setReAngleResult(data)
            setExpandedSections(prev => ({ ...prev, reangle: false }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err)
            setError(err.message || t("mainApp.reangleFailed"))
        } finally {
            setReAngleLoading(false)
        }
    }

    const handlePlayTTS = async () => {
        if (!reAngleResult?.summary) return
        if (ttsLoading || audioUrl) return

        setError(null)
        setTtsLoading(true)
        try {
            const res = await fetch("/api/v2/media/tts", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ text: reAngleResult.summary })
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                if (res.status === 402) {
                    fetchAvatarUsage()
                }
                throw new Error(errData?.message || errData?.detail || "TTS failed");
            }

            const data = await res.json()
            setAudioUrl(data.audio_url)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("TTS Error:", err)
            setError(err.message || t("mainApp.failedToGenerateTTS"))
        } finally {
            setTtsLoading(false)
        }
    }

    const handleDownload = () => {
        if (!reAngleResult?.rewritten_content) return

        const element = document.createElement("a")
        const file = new Blob([reAngleResult.rewritten_content], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = "reangled_article.txt"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    const handleDownloadSummary = () => {
        if (!reAngleResult?.summary) return

        const element = document.createElement("a")
        const file = new Blob([reAngleResult.summary], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = "reangle_summary.txt"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    const scrollToAvatarSection = () => {
        const section = document.getElementById("avatar-broadcast-section")
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    // 点击 ReAngled Content 右侧视频图标：仅展开并滚动到 Avatar Broadcast 板块
    const handleOpenAvatarPanel = () => {
        if (!avatarFeatureEnabled) {
            setError(avatarDisabledReason || t("mainApp.avatarUnavailableGeneric"))
            return
        }
        setError(null)
        setAvatarPanelVisible(true)
        requestAnimationFrame(() => {
            requestAnimationFrame(scrollToAvatarSection)
        })
    }

    const handleGenerateVoiceover = async () => {
        if (!avatarFeatureEnabled) {
            setError(avatarDisabledReason || t("mainApp.avatarUnavailableGeneric"))
            return
        }
        if (!reAngleResult?.rewritten_content || voiceoverLoading) return
        setVoiceoverLoading(true)
        try {
            const res = await fetch("/api/v2/media/voiceover", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ text: reAngleResult.rewritten_content }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                if (res.status === 402) {
                    fetchAvatarUsage()
                }
                throw new Error(data?.error || data?.message || data?.detail || t("mainApp.voiceoverGenerateFailed"))
            }
            setVoiceoverScript(data.script ?? "")
        } catch (err) {
            console.error("Voiceover Error:", err)
            setError(err instanceof Error ? err.message : t("mainApp.voiceoverGenerateFailedRetry"))
        } finally {
            setVoiceoverLoading(false)
        }
    }

    const handleGenerateAvatar = async () => {
        if (!avatarFeatureEnabled) {
            setError(avatarDisabledReason || t("mainApp.avatarUnavailableGeneric"))
            return
        }
        const script = (voiceoverScript ?? "").trim()
        if (!script) {
            setError(t("mainApp.avatarConfirmScriptFirst"))
            return
        }
        if (script.length > AVATAR_SCRIPT_MAX_CHARS) {
            console.warn(`[Avatar] Voiceover exceeds ${AVATAR_SCRIPT_MAX_CHARS} chars, blocked.`)
            setError(t("mainApp.avatarScriptTooLong").replace("{n}", String(AVATAR_SCRIPT_MAX_CHARS)))
            return
        }
        setError(null)
        setAvatarVideoUrl(null)
        setAvatarLoading(true)
        try {
            const res = await fetch("/api/v2/media/avatar", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ text: script }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                if (res.status === 402) {
                    fetchAvatarUsage()
                }
                throw new Error(data?.error || data?.message || data?.detail || t("mainApp.avatarVideoGenerateFailed"))
            }
            setAvatarVideoUrl(data.video_url ?? null)
            fetchAvatarUsage()
        } catch (err) {
            console.error("Avatar Error:", err)
            setError(err instanceof Error ? err.message : t("mainApp.avatarVideoGenerateFailedRetry"))
        } finally {
            setAvatarLoading(false)
        }
    }

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Checkout Success Banner */}
            {checkoutSuccess ? (
                <div
                    className="fixed left-0 right-0 z-40 flex items-center justify-center gap-3 border-b border-green-500/30 bg-green-500/20 px-4 py-3 text-sm text-green-300 backdrop-blur"
                    style={{ top: "var(--app-header-offset)" }}
                >
                    <Sparkles className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span className="font-bold tracking-tight">{t("mainApp.checkoutBanner")}</span>
                    <button onClick={() => setCheckoutSuccess(false)} className="ml-auto opacity-70 hover:opacity-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : null}
            <AppHeader />

            {/* Main Content */}
            <main className="pt-2 flex w-full flex-1 gap-6 overflow-hidden px-4 pb-6">

                {/* Expandable Sidebar */}
                <div
                    className={cn(
                        "flex flex-col relative shrink-0 glass rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 ease-in-out",
                        sidebarExpanded ? "w-[340px]" : "w-[64px]"
                    )}
                >
                    {/* Sidebar Header / Toggle */}
                    <div className={cn("flex items-center shrink-0 border-b border-white/5 h-[60px]", sidebarExpanded ? "justify-between px-4" : "justify-center px-4")}>
                        <div className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            sidebarExpanded ? "w-[200px] opacity-100" : "w-0 opacity-0"
                        )}>
                            <span className="font-semibold text-sm text-foreground/90 whitespace-nowrap">{t("mainApp.configuration")}</span>
                        </div>
                        <button
                            onClick={() => setSidebarExpanded(!sidebarExpanded)}
                            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                            className="w-11 h-11 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            {sidebarExpanded ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 w-[100%] custom-scrollbar">


                        {/* Unified Sidebar Sections */}
                        <div className="flex flex-col space-y-4">

                            {/* Error Displays */}
                            {error && !isUsageLimitError && sidebarExpanded ? (
                                <div className={cn(
                                    "text-xs p-3 rounded-lg border mb-4 mx-1 transition-all animate-in fade-in zoom-in-95 duration-200",
                                    error.includes("peak capacity") || error.includes("try again")
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                )}>
                                    <div className="font-semibold mb-1 uppercase tracking-wider text-[10px] opacity-70">
                                        {error.includes("peak capacity") || error.includes("try again") ? t("mainApp.serverBusy") : t("mainApp.executionError")}
                                    </div>
                                    {error}
                                </div>
                            ) : null}

                            {/* Step 1: Source */}
                            <SourceSection
                                t={t}
                                expanded={expandedSections.gather}
                                completed={inputsLocked}
                                onToggle={() => {
                                    if (!sidebarExpanded) {
                                        setSidebarExpanded(true)
                                        setExpandedSections(prev => ({ ...prev, gather: true }))
                                    } else {
                                        toggleSection("gather")
                                    }
                                }}
                                sidebarExpanded={sidebarExpanded}
                                activeInputTab={activeInputTab}
                                setActiveInputTab={setActiveInputTab}
                                inputItems={inputItems}
                                onAddInput={handleAddInput}
                                onRemoveInput={handleRemoveInput}
                                onCompleteInputs={handleCompleteInputs}
                                inputsLoading={inputsLoading}
                                inputsLocked={inputsLocked}
                                inputText={inputText}
                                setInputText={setInputText}
                                inputUrl={inputUrl}
                                setInputUrl={setInputUrl}
                                setInputFile={setInputFile}
                            />

                            {/* Step 2: Reveal */}
                            <RevealSection
                                t={t}
                                expanded={expandedSections.deangle}
                                completed={deAngleResult !== null}
                                onToggle={() => {
                                    if (!sidebarExpanded) {
                                        setSidebarExpanded(true)
                                        setExpandedSections(prev => ({ ...prev, deangle: true }))
                                    } else {
                                        toggleSection("deangle")
                                    }
                                }}
                                sidebarExpanded={sidebarExpanded}
                                onDeAngleProcess={handleDeAngleProcess}
                                deAngleLoading={deAngleLoading}
                                inputsLocked={inputsLocked}
                            />

                            {/* Step 3: Reframe */}
                            <ReframeSection
                                t={t}
                                expanded={expandedSections.reangle}
                                completed={reAngleResult !== null}
                                onToggle={() => {
                                    if (!sidebarExpanded) {
                                        setSidebarExpanded(true)
                                        setExpandedSections(prev => ({ ...prev, reangle: true }))
                                    } else {
                                        toggleSection("reangle")
                                    }
                                }}
                                sidebarExpanded={sidebarExpanded}
                                selectedFacts={selectedFacts}
                                customFacts={customFacts}
                                onAddCustomFact={handleAddCustomFact}
                                onRemoveCustomFact={handleRemoveCustomFact}
                                selectedAngles={selectedAngles}
                                customAngles={customAngles}
                                onAddCustomAngle={handleAddCustomAngle}
                                onRemoveCustomAngle={handleRemoveCustomAngle}
                                onToggleDeAngleSelect={handleToggleDeAngleSelect}
                                prompt={prompt}
                                setPrompt={setPrompt}
                                onReAngleProcess={handleReAngleProcess}
                                reAngleLoading={reAngleLoading}
                                deAngleResult={deAngleResult}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Pane: Results Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-transparent gap-2">
                    {/* Error bar — always visible regardless of sidebar state */}
                    {error && !isUsageLimitError && !sidebarExpanded ? (
                        <div className={cn(
                            "shrink-0 text-xs px-4 py-2.5 rounded-xl border flex items-center gap-2",
                            error.includes("peak capacity") || error.includes("try again") || error.includes("繁忙") || error.includes("重试")
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                            <span className="font-semibold uppercase tracking-wider text-[10px] opacity-70 shrink-0">
                                {error.includes("peak capacity") || error.includes("繁忙") ? t("mainApp.serverBusy") : t("mainApp.executionError")}
                            </span>
                            <span>{error}</span>
                        </div>
                    ) : null}
                    {/* Collapsed Sidebar Mode (Split View) */}
                    {!sidebarExpanded ? (
                        <div className="flex-1 flex flex-row gap-6 h-full min-h-0 overflow-hidden animate-in fade-in zoom-in-[0.99] duration-300 fill-mode-both">
                            {/* Left: DeAngle Result */}
                            <div className="flex-1 flex flex-col h-full min-h-0 glass rounded-2xl border border-white/5 overflow-hidden shadow-sm">
                                <div className="flex items-center justify-center shrink-0 border-b-2 border-blue-500/50 h-[60px] bg-blue-500/5 transition-colors">
                                    <span className="font-medium text-blue-400">{t("mainApp.tabDeangle")}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {!deAngleResult && !deAngleLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground rounded-2xl">
                                            <Triangle className="w-12 h-12 mb-4 opacity-20" />
                                            <p>{t("mainApp.runDeangleToShowResult")}</p>
                                        </div>
                                    ) : deAngleLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                            <Loader2 className="w-7 h-7 animate-spin text-blue-400/60" />
                                            <p className="text-sm">{t("mainApp.revealAnalyzing")}</p>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl shrink-0">
                                            <DeAngleView
                                                facts={deAngleResult.facts}
                                                angles={deAngleResult.angles}
                                                selectedIds={selectedDeAngleIds}
                                                onToggleSelect={handleToggleDeAngleSelect}
                                                layout="col"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: ReAngle Result */}
                            <div className="flex-1 flex flex-col h-full min-h-0 glass rounded-2xl border border-white/5 overflow-hidden shadow-sm">
                                <div className="flex items-center justify-center shrink-0 border-b-2 border-purple-500/50 h-[60px] bg-purple-500/5 transition-colors">
                                    <span className="font-medium text-purple-400">{t("mainApp.tabReangle")}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {!reAngleResult && !reAngleLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground rounded-2xl">
                                            <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                                            <p>{t("mainApp.runReangleToShowResult")}</p>
                                        </div>
                                    ) : reAngleLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                            <Loader2 className="w-7 h-7 animate-spin text-purple-400/60" />
                                            <p className="text-sm">{t("mainApp.reframeGenerating")}</p>
                                        </div>
                                    ) : (
                                        <div className="h-full">
                                            <ReAngleView
                                                summary={reAngleResult.summary}
                                                rewrittenContent={reAngleResult.rewritten_content}
                                                ttsLoading={ttsLoading}
                                                audioUrl={audioUrl}
                                                onPlayTTS={handlePlayTTS}
                                                onDownload={handleDownload}
                                                onDownloadSummary={handleDownloadSummary}
                                                avatarPanelVisible={avatarPanelVisible}
                                                voiceoverScript={voiceoverScript}
                                                voiceoverLoading={voiceoverLoading}
                                                avatarVideoUrl={avatarVideoUrl}
                                                avatarLoading={avatarLoading}
                                                avatarScriptMaxChars={AVATAR_SCRIPT_MAX_CHARS}
                                                avatarEnabled={avatarFeatureEnabled}
                                                avatarDisabledReason={avatarDisabledReason}
                                                avatarQuotaText={avatarQuotaText}
                                                onOpenAvatarPanel={handleOpenAvatarPanel}
                                                onGenerateVoiceover={handleGenerateVoiceover}
                                                onGenerateAvatar={handleGenerateAvatar}
                                                onVoiceoverChange={setVoiceoverScript}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Expanded Sidebar Mode (Tabs View) */
                        <div className="flex-1 flex flex-col h-full min-h-0 glass rounded-2xl border border-white/5 overflow-hidden animate-in fade-in zoom-in-[0.99] duration-300 fill-mode-both shadow-sm">
                            <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="h-full flex flex-col">
                                <TabsList className="bg-transparent border-b border-white/10 w-full rounded-none px-0 h-[60px] p-0 flex">
                                    <TabsTrigger
                                        value="DeAngle"
                                        className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500/50 data-[state=active]:bg-blue-500/5 data-[state=active]:text-blue-400 text-muted-foreground data-[state=active]:shadow-none cursor-pointer transition-all hover:bg-white/5 font-medium"
                                    >
                                        {t("mainApp.tabDeangle")}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="ReAngle"
                                        className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500/50 data-[state=active]:bg-purple-500/5 data-[state=active]:text-purple-400 text-muted-foreground data-[state=active]:shadow-none cursor-pointer transition-all hover:bg-white/5 font-medium"
                                    >
                                        {t("mainApp.tabReangle")}
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex-1 overflow-hidden">
                                    <TabsContent value="DeAngle" className="h-full m-0 outline-none">
                                        {!deAngleResult && !deAngleLoading ? (
                                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground rounded-2xl">
                                                <Triangle className="w-12 h-12 mb-4 opacity-20" />
                                                <p>{t("mainApp.runDeangleToShowResult")}</p>
                                            </div>
                                        ) : deAngleLoading ? (
                                            <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground rounded-2xl">
                                                <Loader2 className="w-7 h-7 animate-spin text-blue-400/60" />
                                                <p className="text-sm">{t("mainApp.revealAnalyzing")}</p>
                                            </div>
                                        ) : (
                                            <div className="h-full rounded-2xl overflow-hidden">
                                                <DeAngleView
                                                    facts={deAngleResult.facts}
                                                    angles={deAngleResult.angles}
                                                    selectedIds={selectedDeAngleIds}
                                                    onToggleSelect={handleToggleDeAngleSelect}
                                                />
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="ReAngle" className="h-full m-0 outline-none">
                                        {!reAngleResult && !reAngleLoading ? (
                                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground rounded-2xl">
                                                <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                                                <p>{t("mainApp.runReangleToShowResult")}</p>
                                            </div>
                                        ) : reAngleLoading ? (
                                            <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground rounded-2xl">
                                                <Loader2 className="w-7 h-7 animate-spin text-purple-400/60" />
                                                <p className="text-sm">{t("mainApp.reframeGenerating")}</p>
                                            </div>
                                        ) : (
                                            <div className="h-full">
                                                <ReAngleView
                                                    summary={reAngleResult.summary}
                                                    rewrittenContent={reAngleResult.rewritten_content}
                                                    ttsLoading={ttsLoading}
                                                    audioUrl={audioUrl}
                                                    onPlayTTS={handlePlayTTS}
                                                    onDownload={handleDownload}
                                                    onDownloadSummary={handleDownloadSummary}
                                                    avatarPanelVisible={avatarPanelVisible}
                                                    voiceoverScript={voiceoverScript}
                                                    voiceoverLoading={voiceoverLoading}
                                                    avatarVideoUrl={avatarVideoUrl}
                                                    avatarLoading={avatarLoading}
                                                    avatarScriptMaxChars={AVATAR_SCRIPT_MAX_CHARS}
                                                    avatarEnabled={avatarFeatureEnabled}
                                                    avatarDisabledReason={avatarDisabledReason}
                                                    avatarQuotaText={avatarQuotaText}
                                                    onOpenAvatarPanel={handleOpenAvatarPanel}
                                                    onGenerateVoiceover={handleGenerateVoiceover}
                                                    onGenerateAvatar={handleGenerateAvatar}
                                                    onVoiceoverChange={setVoiceoverScript}
                                                />
                                            </div>
                                        )}
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    )
                    }
                </div >
            </main >
        </div >
    )
}
