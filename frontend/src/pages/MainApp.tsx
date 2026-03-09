import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DiffView } from "@/components/DiffView"
import { Loader2, Trash2, FileText, Link as LinkIcon, Youtube, Type, Play, Download, Sparkles, Settings2, FolderInput, Zap, X, Video, Copy } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
import AppHeader from "@/components/AppHeader"

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

interface RewriteResult {
    original: string
    rewritten: string
    summary: string
}

export default function MainApp() {
    const { session } = useAuth()
    const { t } = useLanguage()

    // State
    const [activeInputTab, setActiveInputTab] = useState("text")
    const [inputItems, setInputItems] = useState<InputItem[]>([])

    // Inputs
    const [inputText, setInputText] = useState("")
    const [inputUrl, setInputUrl] = useState("")
    const [inputFile, setInputFile] = useState<File | null>(null)

    // Settings
    const [prompt, setPrompt] = useState("")
    const [model, setModel] = useState("gpt-5-mini")
    const [isLoading, setIsLoading] = useState(false)

    // Result
    const [result, setResult] = useState<RewriteResult | null>(null)
    const [activeResultTab, setActiveResultTab] = useState("summary")
    const [error, setError] = useState<string | null>(null)
    const [isUsageLimitError, setIsUsageLimitError] = useState(false)
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)

    // TTS State
    const [ttsLoading, setTtsLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Avatar State
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null)
    const [voiceoverLoading, setVoiceoverLoading] = useState(false)
    const [voiceover, setVoiceover] = useState<string | null>(null)

    const voiceoverStats = useMemo(() => {
        if (!voiceover) return null
        const text = voiceover.trim()
        if (!text) return null
        // 粗略判断是否主要为英文：全部为 ASCII 时按“词”统计，否则按“字”统计
        const isAscii = /^[\x00-\x7F]+$/.test(text)
        if (isAscii) {
            const words = text.split(/\s+/).filter(Boolean).length
            return { type: "words" as const, count: words }
        }
        const chars = text.replace(/\s/g, "").length
        return { type: "chars" as const, count: chars }
    }, [voiceover])

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
            setInputItems([...inputItems, newItem])
        }
    }

    const handleRemoveInput = (id: string) => {
        setInputItems(inputItems.filter(i => i.id !== id))
    }

    const handleProcess = async () => {
        if (inputItems.length === 0) {
            setError(t("mainApp.errorAddItem"))
            return
        }

        setIsLoading(true)
        setError(null)
        setIsUsageLimitError(false)
        setResult(null)
        setAudioUrl(null)
        setAvatarVideoUrl(null)
        setVoiceover(null)

        try {
            const formData = new FormData()

            // Construct payload
            const payloadItems = inputItems.map(item => {
                if (item.type === 'file') {
                    const fileKey = `file_${item.id}`
                    formData.append(fileKey, item.content as File)
                    return {
                        id: item.id,
                        type: item.type,
                        contentKey: fileKey,
                        meta: { filename: (item.content as File).name }
                    }
                } else {
                    return {
                        id: item.id,
                        type: item.type,
                        content: item.content
                    }
                }
            })

            formData.append("inputs", JSON.stringify(payloadItems))
            formData.append("prompt", prompt)
            formData.append("llm_type", model)

            const headers: HeadersInit = {}
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`
            }

            const res = await fetch("/api/v1/rewrite", {
                method: "POST",
                headers,
                body: formData
            })

            if (!res.ok) {
                if (res.status === 402) {
                    setIsUsageLimitError(true)
                    throw new Error(t("mainApp.errorUsageLimit"))
                }
                if (res.status === 401) {
                    throw new Error(t("mainApp.errorSessionExpired"))
                }
                throw new Error(`Server error: ${res.status}`)
            }

            const data = await res.json()
            setResult(data)
            setActiveResultTab("summary")

        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to process request")
        } finally {
            setIsLoading(false)
        }
    }

    const handlePreset = (preset: string) => {
        setPrompt(preset)
    }

    const handlePlayTTS = async () => {
        if (!result?.summary) return
        if (audioUrl) {
            audioRef.current?.play()
            return
        }

        if (result.summary.length > 600) {
            alert("Summary is too long for Read Aloud (max 600 characters).")
            return
        }

        setTtsLoading(true)
        try {
            const res = await fetch("/api/v1/rewrite/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: result.summary })
            })

            if (!res.ok) throw new Error("TTS failed")

            const data = await res.json()
            setAudioUrl(data.audio_url)
        } catch (err) {
            console.error("TTS Error:", err)
        } finally {
            setTtsLoading(false)
        }
    }

    const generateVoiceoverInternal = async (): Promise<string | null> => {
        if (!result?.rewritten) return null

        setVoiceoverLoading(true)
        try {
            const res = await fetch("/api/v1/rewrite/voiceover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: result.rewritten })
            })

            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                const msg = data?.error || data?.message || res.statusText || "生成口播稿失败"
                throw new Error(msg)
            }

            if (typeof data.voiceover === "string" && data.voiceover.trim()) {
                setVoiceover(data.voiceover)
                return data.voiceover as string
            }

            throw new Error("生成口播稿失败")
        } catch (err) {
            console.error("Voiceover Error:", err)
            const msg = err instanceof Error ? err.message : "生成口播稿失败"
            alert(msg)
            return null
        } finally {
            setVoiceoverLoading(false)
        }
    }

    const handleGenerateVoiceover = async () => {
        if (!result?.rewritten) return

        setVoiceover(null)
        await generateVoiceoverInternal()
    }

    const handleGenerateAvatar = async () => {
        if (!result?.rewritten && !voiceover) return

        let script = (voiceover || "").trim()

        // 如果还没有口播稿，则先自动生成口播稿，再用生成的口播稿来生成数字人视频
        if (!script) {
            const generated = await generateVoiceoverInternal()
            if (!generated) return
            script = generated.trim()
        }

        if (!script) return

        // Video Agent 的 prompt/长度要控一下，先做保守限制
        if (script.length > 3000) {
            alert("文章内容过长，暂不支持生成数字人播报，请先缩短后再试。")
            return
        }

        setAvatarLoading(true)
        setAvatarVideoUrl(null)
        try {
            const res = await fetch("/api/v1/rewrite/video-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: script })
            })

            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                const msg = data?.error || data?.message || res.statusText || "请求失败"
                throw new Error(msg)
            }

            setAvatarVideoUrl(data.video_url)
        } catch (err) {
            console.error("Avatar Error:", err)
            const msg = err instanceof Error ? err.message : "数字人播报生成失败，请稍后重试。"
            alert(msg)
        } finally {
            setAvatarLoading(false)
        }
    }

    const handleDownload = () => {
        if (!result?.rewritten) return

        const element = document.createElement("a")
        const file = new Blob([result.rewritten], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = "rewritten_article.txt"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    return (
        <div className="flex h-screen flex-col bg-background aurora-bg">
            {/* Checkout Success Banner */}
            {checkoutSuccess && (
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 bg-green-500/20 border-b border-green-500/30 backdrop-blur px-4 py-3 text-sm text-green-300">
                    <Sparkles className="h-4 w-4 flex-shrink-0" />
                    <span>🎉 {t("mainApp.checkoutBanner")}</span>
                    <button onClick={() => setCheckoutSuccess(false)} className="ml-auto opacity-70 hover:opacity-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
            <AppHeader />

            {/* Main Content */}
            <main className="flex-1 container pt-24 pb-6 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Left Pane: Inputs & Settings */}
                <div className="w-full lg:w-4/12 flex flex-col gap-5 overflow-y-auto pr-2 pb-4 min-h-0 lg:max-h-[calc(100vh-7rem)]">

                    {/* Input Section */}
                    <div className="glass rounded-2xl overflow-hidden flex-shrink-0">
                        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FolderInput className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-sm">{t("mainApp.inputSources")}</h2>
                                <p className="text-xs text-muted-foreground">{t("mainApp.addContentToTransform")}</p>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            <Tabs value={activeInputTab} onValueChange={setActiveInputTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-4 bg-white/5">
                                    <TabsTrigger value="text" className="data-[state=active]:bg-white/10 cursor-pointer">
                                        <Type className="w-4 h-4" />
                                    </TabsTrigger>
                                    <TabsTrigger value="file" className="data-[state=active]:bg-white/10 cursor-pointer">
                                        <FileText className="w-4 h-4" />
                                    </TabsTrigger>
                                    <TabsTrigger value="url" className="data-[state=active]:bg-white/10 cursor-pointer">
                                        <LinkIcon className="w-4 h-4" />
                                    </TabsTrigger>
                                    <TabsTrigger value="youtube" className="data-[state=active]:bg-white/10 cursor-pointer">
                                        <Youtube className="w-4 h-4" />
                                    </TabsTrigger>
                                </TabsList>

                                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    {activeInputTab === 'text' && (
                                        <Textarea
                                            placeholder={t("mainApp.pastePlaceholder")}
                                            className="min-h-[100px] bg-transparent border-white/10 placeholder:text-muted-foreground/50 resize-none"
                                            value={inputText}
                                            onChange={e => setInputText(e.target.value)}
                                        />
                                    )}
                                    {(activeInputTab === 'url' || activeInputTab === 'youtube') && (
                                        <Input
                                            placeholder={activeInputTab === 'url' ? t("mainApp.urlPlaceholder") : t("mainApp.ytPlaceholder")}
                                            value={inputUrl}
                                            onChange={e => setInputUrl(e.target.value)}
                                            className="bg-transparent border-white/10 placeholder:text-muted-foreground/50"
                                        />
                                    )}
                                    {activeInputTab === 'file' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="file" className="text-xs text-muted-foreground">{t("mainApp.uploadFile")}</Label>
                                            <Input
                                                id="file"
                                                type="file"
                                                onChange={e => setInputFile(e.target.files?.[0] || null)}
                                                className="bg-transparent border-white/10 file:bg-white/10 file:border-0 file:text-foreground file:text-xs file:mr-3 cursor-pointer"
                                            />
                                            <p className="text-xs text-muted-foreground/70">{t("mainApp.supportedFormats")}</p>
                                        </div>
                                    )}

                                    <Button
                                        className="w-full mt-4 bg-white/10 hover:bg-white/15 border-0 cursor-pointer"
                                        variant="outline"
                                        onClick={handleAddInput}
                                    >
                                        {t("mainApp.addToQueue")}
                                    </Button>
                                </div>
                            </Tabs>

                            {/* Queue */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">
                                    {t("mainApp.queue")} ({inputItems.length})
                                </Label>
                                <div className="space-y-2 max-h-[140px] overflow-y-auto">
                                    {inputItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 text-sm group">
                                            <div className="truncate flex-1 pr-2">
                                                <div className="font-medium truncate text-xs">{item.meta?.title}</div>
                                                <div className="text-xs text-muted-foreground truncate">{item.meta?.detail}</div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 opacity-50 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                                                onClick={() => handleRemoveInput(item.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                    {inputItems.length === 0 && (
                                        <div className="text-xs text-muted-foreground/50 text-center py-6 border border-dashed border-white/10 rounded-lg">
                                            {t("mainApp.noItemsInQueue")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Section */}
                    <div className="glass rounded-2xl flex-shrink-0">
                        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-500/10">
                                <Settings2 className="h-4 w-4 text-violet-400" />
                            </div>
                            <h2 className="font-semibold text-sm">{t("mainApp.configuration")}</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">{t("mainApp.aiModel")}</Label>
                                <Select value={model} onValueChange={setModel}>
                                    <SelectTrigger className="bg-white/5 border-white/10 cursor-pointer">
                                        <SelectValue placeholder={t("mainApp.selectModel")} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e293b] border-white/10">
                                        <SelectItem value="gpt-5-mini" className="cursor-pointer">{t("mainApp.modelGpt")}</SelectItem>
                                        <SelectItem value="gemini-3-flash-preview" className="cursor-pointer">{t("mainApp.modelGemini")}</SelectItem>
                                        <SelectItem value="qwen-flash" className="cursor-pointer">{t("mainApp.modelQwen")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs text-muted-foreground">{t("mainApp.styleInstructions")}</Label>
                                    <Select onValueChange={handlePreset}>
                                        <SelectTrigger className="h-7 w-[100px] text-xs bg-white/5 border-white/10 cursor-pointer">
                                            <SelectValue placeholder={t("mainApp.presets")} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1e293b] border-white/10">
                                            <SelectItem value="Humorous Tone" className="cursor-pointer text-xs">{t("mainApp.presetHumorous")}</SelectItem>
                                            <SelectItem value="Academic Tone" className="cursor-pointer text-xs">{t("mainApp.presetAcademic")}</SelectItem>
                                            <SelectItem value="Journalistic Tone" className="cursor-pointer text-xs">{t("mainApp.presetJournalistic")}</SelectItem>
                                            <SelectItem value="Blog style" className="cursor-pointer text-xs">{t("mainApp.presetBlog")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Textarea
                                    placeholder={t("mainApp.promptPlaceholder")}
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    className="bg-white/5 border-white/10 placeholder:text-muted-foreground/50 resize-none min-h-[80px]"
                                />
                            </div>

                            <Button
                                size="lg"
                                className="w-full font-semibold glow-primary hover:glow-primary-sm cursor-pointer"
                                onClick={handleProcess}
                                disabled={isLoading || inputItems.length === 0}
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("mainApp.processing")}</>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        {t("mainApp.transformContent")}
                                    </>
                                )}
                            </Button>

                            {error && !isUsageLimitError && (
                                <div className="text-xs text-red-400 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            {isUsageLimitError && (
                                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg space-y-2">
                                    <div className="flex items-center gap-2 text-primary text-xs font-semibold">
                                        <Zap className="h-3.5 w-3.5" />
                                        {t("mainApp.monthlyLimitReached")}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{t("mainApp.upgradeProDesc")}</p>
                                    <Button
                                        size="sm"
                                        className="w-full cursor-pointer"
                                        onClick={() => window.location.href = "/pricing"}
                                    >
                                        {t("mainApp.upgradeToPro")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Pane: Results */}
                <div className="w-full lg:w-8/12 flex flex-col overflow-hidden glass rounded-2xl">
                    {!result ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                            <div className="p-6 rounded-2xl bg-white/5 mb-6">
                                <Sparkles className="w-10 h-10 opacity-20" />
                            </div>
                            <p className="text-sm">{t("mainApp.addSourcesHint")}</p>
                        </div>
                    ) : (
                        <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="flex-1 flex flex-col overflow-hidden">
                            <div className="border-b border-white/5 px-5 py-3 flex items-center bg-white/5">
                                <TabsList className="bg-transparent gap-1">
                                    <TabsTrigger
                                        value="summary"
                                        className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-lg px-4 cursor-pointer"
                                    >
                                        {t("mainApp.summary")}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="rewritten"
                                        className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-lg px-4 cursor-pointer"
                                    >
                                        {t("mainApp.rewritten")}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="compare"
                                        className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-lg px-4 cursor-pointer"
                                    >
                                        {t("mainApp.compare")}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="avatar"
                                        className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-lg px-4 cursor-pointer"
                                    >
                                        Avatar
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <TabsContent value="summary" className="mt-0 h-full">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{t("mainApp.summary")}</h3>
                                            <div className="flex items-center gap-2">
                                                {audioUrl ? (
                                                    <audio ref={audioRef} controls src={audioUrl} className="h-8" />
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={handlePlayTTS}
                                                        disabled={ttsLoading}
                                                        className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                                                    >
                                                        {ttsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                                                        {t("mainApp.readAloud")}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{result.summary}</p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="rewritten" className="mt-0 h-full">
                                    <div className="space-y-4 h-full flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{t("mainApp.rewrittenContent")}</h3>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleDownload}
                                                className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                {t("mainApp.download")}
                                            </Button>
                                        </div>
                                        <div className="flex-1 p-5 rounded-xl bg-white/5 border border-white/5 overflow-auto">
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{result.rewritten}</p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="compare" className="mt-0 h-full">
                                    <DiffView original={result.original} rewritten={result.rewritten} />
                                </TabsContent>

                                <TabsContent value="avatar" className="mt-0 h-full">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">Avatar 播报</h3>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleGenerateVoiceover}
                                                    disabled={voiceoverLoading || !result?.rewritten}
                                                    className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                                                >
                                                    {voiceoverLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 mr-2" />
                                                    )}
                                                    生成口播稿
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleGenerateAvatar}
                                                    disabled={avatarLoading || (!result?.rewritten && !voiceover)}
                                                    className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                                                >
                                                    {avatarLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Video className="w-4 h-4 mr-2" />
                                                    )}
                                                    生成数字人播报
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                可以先生成口播稿并根据需要进行编辑，数字人将按照当前口播稿的内容进行播报。
                                                请尽量将口播稿控制在约 600 字以内，
                                                以避免视频过长。生成数字人播报通常需要 10–20 分钟，请耐心等待。
                                            </p>

                                            {voiceover && (
                                                <div className="pt-2 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-medium">口播稿</h4>
                                                            {voiceoverStats && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {voiceoverStats.type === "chars"
                                                                        ? `${voiceoverStats.count} 字`
                                                                        : `${voiceoverStats.count} words`}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 px-2 text-xs cursor-pointer"
                                                            onClick={() => {
                                                                try {
                                                                    navigator.clipboard.writeText(voiceover)
                                                                    alert("口播稿已复制到剪贴板")
                                                                } catch {
                                                                    alert("复制失败，请手动选择文本复制")
                                                                }
                                                            }}
                                                        >
                                                            <Copy className="w-3 h-3 mr-1" />
                                                            复制
                                                        </Button>
                                                    </div>
                                                    <Textarea
                                                        value={voiceover}
                                                        onChange={e => setVoiceover(e.target.value)}
                                                        className="max-h-64 min-h-[140px] rounded-lg bg-black/10 border border-white/10 text-sm leading-relaxed whitespace-pre-wrap resize-vertical"
                                                    />
                                                </div>
                                            )}

                                            {avatarVideoUrl ? (
                                                <div className="pt-2 space-y-2">
                                                    <h4 className="text-sm font-medium">视频预览</h4>
                                                    <video
                                                        src={avatarVideoUrl}
                                                        controls
                                                        className="w-full rounded-xl border border-white/10 bg-black"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            const downloadUrl = `/api/v1/rewrite/video-download?url=${encodeURIComponent(avatarVideoUrl)}`
                                                            window.open(downloadUrl, "_blank", "noopener,noreferrer")
                                                        }}
                                                        className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        下载视频
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground/70 pt-2">
                                                    {avatarLoading ? "视频生成中…" : "还没有生成视频。"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    )}
                </div>
            </main>
        </div>
    )
}
