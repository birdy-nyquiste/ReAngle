import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Trash2, FileText, Link as LinkIcon, Youtube, Type, Sparkles, FolderInput, X, ChevronRight, Triangle, Wand2, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import AppHeader from "@/components/AppHeader"
import { DeAngleView } from "@/components/DeAngleView"
import { ReAngleView } from "@/components/ReAngleView"
import { cn } from "@/lib/utils"

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

export default function MainApp() {
    const { t } = useLanguage()

    // Sidebar State
    const [sidebarExpanded, setSidebarExpanded] = useState(true)
    const [expandedSections, setExpandedSections] = useState({
        gather: true,
        deangle: true,
        reangle: true
    })

    const toggleSection = (section: "gather" | "deangle" | "reangle") => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // State
    const [activeInputTab, setActiveInputTab] = useState("text")
    const [inputItems, setInputItems] = useState<InputItem[]>([])

    // Inputs
    const [inputText, setInputText] = useState("")
    const [inputUrl, setInputUrl] = useState("")
    const [inputFile, setInputFile] = useState<File | null>(null)

    // DeAngle State
    const [deAngleLoading, setDeAngleLoading] = useState(false)
    const [deAngleResult, setDeAngleResult] = useState<any>(null) // Will hold facts and angles

    // ReAngle State
    const [prompt, setPrompt] = useState("")
    const [model, setModel] = useState("GPT-4o")
    const [reAngleLoading, setReAngleLoading] = useState(false)
    const [reAngleResult, setReAngleResult] = useState<any>(null) // Will hold summary and rewritten_content

    // Global UI
    const [activeResultTab, setActiveResultTab] = useState("DeAngle") // 'DeAngle' | 'ReAngle'
    const [error, setError] = useState<string | null>(null)
    const [isUsageLimitError, setIsUsageLimitError] = useState(false)
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)

    // TTS State
    const [ttsLoading, setTtsLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

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
            setInputItems(prev => [...prev, newItem])
        }
    }

    const handleRemoveInput = (id: string) => {
        setInputItems(prev => prev.filter(i => i.id !== id))
    }

    const handleDeAngleProcess = async () => {
        if (inputItems.length === 0) {
            setError(t("mainApp.errorAddItem"))
            return
        }

        setDeAngleLoading(true)
        setError(null)
        setIsUsageLimitError(false)
        setDeAngleResult(null)
        setReAngleResult(null)
        setActiveResultTab("DeAngle")

        try {
            // Using placeholder logic mapping to new DeAngle API
            const payload = {
                inputs: inputItems.map(item => ({ id: item.id, type: item.type, content: item.type !== 'file' ? item.content : 'file_placeholder' }))
            }

            const res = await fetch("/api/v1/deangle/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("DeAngle failed")

            const data = await res.json()
            setDeAngleResult(data)

            // Collapse DeAngle section and ensure ReAngle is open upon successful completion
            setExpandedSections(prev => ({ ...prev, deangle: false, reangle: true }))

        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to DeAngle")
        } finally {
            setDeAngleLoading(false)
        }
    }

    const handleReAngleProcess = async () => {
        if (!deAngleResult) {
            setError("Must perform DeAngle first.")
            return
        }

        setReAngleLoading(true)
        setError(null)
        setReAngleResult(null)
        setAudioUrl(null)
        setActiveResultTab("ReAngle")

        try {
            const payload = {
                llm_type: model,
                prompt: prompt
            }

            const res = await fetch("/api/v1/reangle/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("ReAngle failed")

            const data = await res.json()
            setReAngleResult(data)

            // Collapse ReAngle section upon successful completion
            setExpandedSections(prev => ({ ...prev, reangle: false }))

        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to ReAngle")
        } finally {
            setReAngleLoading(false)
        }
    }

    const handlePlayTTS = async () => {
        if (!reAngleResult?.summary) return
        if (audioUrl) return // already handled by component ref
        // TTS implementation remains similar but targets new text.
        setTtsLoading(true)
        try {
            const res = await fetch("/api/v1/rewrite/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: reAngleResult.summary })
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

    return (
        <div className="flex h-screen flex-col bg-background aurora-bg">
            {/* Checkout Success Banner */}
            {checkoutSuccess ? (
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 bg-green-500/20 border-b border-green-500/30 backdrop-blur px-4 py-3 text-sm text-green-300">
                    <Sparkles className="h-4 w-4 flex-shrink-0" />
                    <span>🎉 {t("mainApp.checkoutBanner")}</span>
                    <button onClick={() => setCheckoutSuccess(false)} className="ml-auto opacity-70 hover:opacity-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : null}
            <AppHeader />

            {/* Main Content */}
            <main className="flex-1 overflow-hidden w-full px-4 flex pt-24 pb-6 gap-6">

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
                            <span className="font-semibold text-sm text-foreground/90 whitespace-nowrap">Configure Your ReAngle</span>
                        </div>
                        <button
                            onClick={() => setSidebarExpanded(!sidebarExpanded)}
                            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            {sidebarExpanded ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 w-[100%] custom-scrollbar">
                        {/* Unified Sidebar Sections */}
                        <div className="flex flex-col space-y-4">

                            {/* Error Displays */}
                            {error && !isUsageLimitError && sidebarExpanded ? (
                                <div className="text-xs text-red-400 p-3 bg-red-500/10 rounded-lg border border-red-500/20 mb-4 mx-1">
                                    {error}
                                </div>
                            ) : null}

                            {/* Gather Inputs Section */}
                            <div className={cn(
                                "rounded-xl overflow-hidden flex flex-col transition-colors",
                                (expandedSections.gather && sidebarExpanded) ? "bg-white/5 border border-white/10 shadow-sm" : "border border-transparent hover:bg-white/5"
                            )}>
                                <button
                                    onClick={() => {
                                        if (!sidebarExpanded) {
                                            setSidebarExpanded(true)
                                            setExpandedSections(prev => ({ ...prev, gather: true }))
                                        } else {
                                            toggleSection("gather")
                                        }
                                    }}
                                    className="flex items-center w-full h-[40px] px-1 cursor-pointer group outline-none"
                                    title={!sidebarExpanded ? "Gather Inputs" : undefined}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center shrink-0 border transition-colors w-7 h-7 rounded-full",
                                        expandedSections.gather ? "bg-white/10 border-white/20 text-foreground" : "bg-white/5 border-white/10 text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        <FolderInput className="w-3.5 h-3.5" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap",
                                        sidebarExpanded ? "w-[266px] opacity-100 ml-3 pr-2" : "w-0 opacity-0 ml-0 pr-0"
                                    )}>
                                        <span className="font-medium text-sm">
                                            1. Gather Inputs
                                        </span>
                                        <ChevronRight className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300", expandedSections.gather && "rotate-90")} />
                                    </div>
                                </button>

                                {sidebarExpanded && expandedSections.gather && (
                                    <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                        <Tabs value={activeInputTab} onValueChange={setActiveInputTab} className="w-full">
                                            <TabsList className="grid w-full grid-cols-4 bg-black/20 h-9 p-1 rounded-lg">
                                                <TabsTrigger value="text" className="data-[state=active]:bg-white/10 text-xs py-1 cursor-pointer">
                                                    <Type className="w-3.5 h-3.5" />
                                                </TabsTrigger>
                                                <TabsTrigger value="file" className="data-[state=active]:bg-white/10 text-xs py-1 cursor-pointer">
                                                    <FileText className="w-3.5 h-3.5" />
                                                </TabsTrigger>
                                                <TabsTrigger value="url" className="data-[state=active]:bg-white/10 text-xs py-1 cursor-pointer">
                                                    <LinkIcon className="w-3.5 h-3.5" />
                                                </TabsTrigger>
                                                <TabsTrigger value="youtube" className="data-[state=active]:bg-white/10 text-xs py-1 cursor-pointer">
                                                    <Youtube className="w-3.5 h-3.5" />
                                                </TabsTrigger>
                                            </TabsList>

                                            <div className="mt-3">
                                                {activeInputTab === 'text' && (
                                                    <Textarea
                                                        placeholder={t("mainApp.pastePlaceholder")}
                                                        className="min-h-[100px] bg-black/20 border-white/5 text-sm resize-none focus-visible:ring-1"
                                                        value={inputText}
                                                        onChange={e => setInputText(e.target.value)}
                                                    />
                                                )}
                                                {(activeInputTab === 'url' || activeInputTab === 'youtube') && (
                                                    <Input
                                                        placeholder={activeInputTab === 'url' ? t("mainApp.urlPlaceholder") : t("mainApp.ytPlaceholder")}
                                                        value={inputUrl}
                                                        onChange={e => setInputUrl(e.target.value)}
                                                        className="bg-black/20 border-white/5 text-sm h-9"
                                                    />
                                                )}
                                                {activeInputTab === 'file' && (
                                                    <div className="space-y-2">
                                                        <Input
                                                            id="file"
                                                            type="file"
                                                            onChange={e => setInputFile(e.target.files?.[0] || null)}
                                                            className="bg-black/20 border-white/5 file:text-foreground file:text-xs h-9 text-xs py-1.5 cursor-pointer"
                                                        />
                                                    </div>
                                                )}

                                                <Button
                                                    className="w-full mt-3 bg-white/5 hover:bg-white/10 border border-white/5 text-xs h-8 cursor-pointer"
                                                    variant="outline"
                                                    onClick={handleAddInput}
                                                >
                                                    {t("mainApp.addToQueue")}
                                                </Button>
                                            </div>
                                        </Tabs>

                                        {/* Queue section */}
                                        <div className="pt-2">
                                            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                QUEUE ({inputItems.length})
                                            </div>
                                            <div className="space-y-1.5 max-h-[120px] overflow-y-auto custom-scrollbar">
                                                {inputItems.map(item => (
                                                    <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-black/20 border border-white/5 group">
                                                        <div className="truncate flex-1 pr-2">
                                                            <div className="text-xs truncate">{item.meta?.title}</div>
                                                        </div>
                                                        <button
                                                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 cursor-pointer p-0.5"
                                                            onClick={() => handleRemoveInput(item.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {inputItems.length === 0 && (
                                                    <div className="text-xs text-muted-foreground/40 text-center py-4 border border-dashed border-white/5 rounded-md">
                                                        No items in queue
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-9 cursor-pointer transition-all"
                                            onClick={() => setExpandedSections(prev => ({ ...prev, gather: false, deangle: true }))}
                                        >
                                            Complete & Continue
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* DeAngle Section */}
                            <div className={cn(
                                "rounded-xl overflow-hidden flex flex-col transition-colors",
                                (expandedSections.deangle && sidebarExpanded) ? "bg-white/5 border border-white/10 shadow-sm" : "border border-transparent hover:bg-white/5"
                            )}>
                                <button
                                    onClick={() => {
                                        if (!sidebarExpanded) {
                                            setSidebarExpanded(true)
                                            setExpandedSections(prev => ({ ...prev, deangle: true }))
                                        } else {
                                            toggleSection("deangle")
                                        }
                                    }}
                                    className="flex items-center w-full h-[40px] px-1 cursor-pointer group outline-none"
                                    title={!sidebarExpanded ? "DeAngle" : undefined}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center shrink-0 border transition-colors w-7 h-7 rounded-full",
                                        expandedSections.deangle ? "bg-white/10 border-white/20 text-foreground" : "bg-white/5 border-white/10 text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        <Triangle className="w-3.5 h-3.5" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap",
                                        sidebarExpanded ? "w-[266px] opacity-100 ml-3 pr-2" : "w-0 opacity-0 ml-0 pr-0"
                                    )}>
                                        <span className="font-medium text-sm">
                                            2. DeAngle
                                        </span>
                                        <ChevronRight className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300", expandedSections.deangle && "rotate-90")} />
                                    </div>
                                </button>

                                {sidebarExpanded && expandedSections.deangle && (
                                    <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                        <p className="text-xs text-muted-foreground/80 leading-relaxed">
                                            Detach Events from original Angles, then fact-check on every Events
                                        </p>
                                        <Button
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-9 cursor-pointer transition-all"
                                            onClick={handleDeAngleProcess}
                                            disabled={deAngleLoading || inputItems.length === 0}
                                        >
                                            {deAngleLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            Start DeAngle
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* ReAngle Section */}
                            <div className={cn(
                                "rounded-xl overflow-hidden flex flex-col transition-colors",
                                (expandedSections.reangle && sidebarExpanded) ? "bg-white/5 border border-white/10 shadow-sm" : "border border-transparent hover:bg-white/5"
                            )}>
                                <button
                                    onClick={() => {
                                        if (!sidebarExpanded) {
                                            setSidebarExpanded(true)
                                            setExpandedSections(prev => ({ ...prev, reangle: true }))
                                        } else {
                                            toggleSection("reangle")
                                        }
                                    }}
                                    className="flex items-center w-full h-[40px] px-1 cursor-pointer group outline-none"
                                    title={!sidebarExpanded ? "ReAngle" : undefined}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center shrink-0 border transition-colors w-7 h-7 rounded-full",
                                        expandedSections.reangle ? "bg-white/10 border-white/20 text-foreground" : "bg-white/5 border-white/10 text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        <Wand2 className="w-3.5 h-3.5" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap",
                                        sidebarExpanded ? "w-[266px] opacity-100 ml-3 pr-2" : "w-0 opacity-0 ml-0 pr-0"
                                    )}>
                                        <span className="font-medium text-sm">
                                            3. ReAngle
                                        </span>
                                        <ChevronRight className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300", expandedSections.reangle && "rotate-90")} />
                                    </div>
                                </button>

                                {sidebarExpanded && expandedSections.reangle && (
                                    <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-foreground/80">LLM Model Selector</label>
                                            <Select value={model} onValueChange={setModel}>
                                                <SelectTrigger className="bg-black/20 border-white/5 h-9 text-xs cursor-pointer">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1e293b] border-white/10">
                                                    <SelectItem value="GPT-4o" className="text-xs cursor-pointer">GPT-4o</SelectItem>
                                                    <SelectItem value="Claude-3.5-Sonnet" className="text-xs cursor-pointer">Claude-3.5-Sonnet</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-foreground/80">Set New Angle</label>
                                            <Textarea
                                                placeholder="Define your desired angle..."
                                                className="min-h-[100px] bg-black/20 border-white/5 text-sm resize-none focus-visible:ring-1"
                                                value={prompt}
                                                onChange={e => setPrompt(e.target.value)}
                                            />
                                        </div>

                                        <Button
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-9 cursor-pointer transition-all"
                                            onClick={handleReAngleProcess}
                                            disabled={reAngleLoading || !deAngleResult}
                                        >
                                            {reAngleLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            Start ReAngle
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Pane: Results Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-transparent">
                    {/* Collapsed Sidebar Mode (Split View) */}
                    {!sidebarExpanded ? (
                        <div className="flex-1 flex flex-row gap-6 h-full min-h-0 overflow-hidden animate-in fade-in zoom-in-[0.99] duration-300 fill-mode-both">
                            {/* Left: DeAngle Result */}
                            <div className="flex-1 flex flex-col h-full min-h-0 glass rounded-2xl border border-white/5 overflow-hidden shadow-sm">
                                <div className="flex items-center justify-center shrink-0 border-b-2 border-blue-500/50 h-[60px] bg-blue-500/5 transition-colors">
                                    <span className="font-medium text-blue-400">DeAngle</span>
                                </div>
                                <div className="flex-1 p-6 overflow-hidden">
                                    {!deAngleResult && !deAngleLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground rounded-2xl">
                                            <Triangle className="w-12 h-12 mb-4 opacity-20" />
                                            <p>Input sources and run DeAngle to populate.</p>
                                        </div>
                                    ) : deAngleLoading ? (
                                        <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" /></div>
                                    ) : (
                                        <div className="h-full rounded-2xl overflow-hidden">
                                            <DeAngleView facts={deAngleResult.facts} angles={deAngleResult.angles} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: ReAngle Result */}
                            <div className="flex-1 flex flex-col h-full min-h-0 glass rounded-2xl border border-white/5 overflow-hidden shadow-sm">
                                <div className="flex items-center justify-center shrink-0 border-b-2 border-purple-500/50 h-[60px] bg-purple-500/5 transition-colors">
                                    <span className="font-medium text-purple-400">ReAngle</span>
                                </div>
                                <div className="flex-1 p-6 overflow-hidden">
                                    {!reAngleResult && !reAngleLoading ? (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground rounded-2xl">
                                            <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                                            <p>Define an angle and run ReAngle to generate content.</p>
                                        </div>
                                    ) : reAngleLoading ? (
                                        <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" /></div>
                                    ) : (
                                        <div className="h-full">
                                            <ReAngleView
                                                summary={reAngleResult.summary}
                                                rewrittenContent={reAngleResult.rewritten_content}
                                                ttsLoading={ttsLoading}
                                                audioUrl={audioUrl}
                                                onPlayTTS={handlePlayTTS}
                                                onDownload={handleDownload}
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
                                        DeAngle
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="ReAngle"
                                        className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500/50 data-[state=active]:bg-purple-500/5 data-[state=active]:text-purple-400 text-muted-foreground data-[state=active]:shadow-none cursor-pointer transition-all hover:bg-white/5 font-medium"
                                    >
                                        ReAngle
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex-1 p-6 overflow-hidden">
                                    <TabsContent value="DeAngle" className="h-full m-0 outline-none">
                                        {!deAngleResult && !deAngleLoading ? (
                                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground rounded-2xl">
                                                <Triangle className="w-12 h-12 mb-4 opacity-20" />
                                                <p>Input sources and run DeAngle to populate.</p>
                                            </div>
                                        ) : deAngleLoading ? (
                                            <div className="h-full flex items-center justify-center rounded-2xl"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" /></div>
                                        ) : (
                                            <div className="h-full rounded-2xl overflow-hidden">
                                                <DeAngleView facts={deAngleResult.facts} angles={deAngleResult.angles} />
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="ReAngle" className="h-full m-0 outline-none">
                                        {!reAngleResult && !reAngleLoading ? (
                                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground rounded-2xl">
                                                <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                                                <p>Define an angle and run ReAngle to generate content.</p>
                                            </div>
                                        ) : reAngleLoading ? (
                                            <div className="h-full flex items-center justify-center rounded-2xl"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" /></div>
                                        ) : (
                                            <div className="h-full">
                                                <ReAngleView
                                                    summary={reAngleResult.summary}
                                                    rewrittenContent={reAngleResult.rewritten_content}
                                                    ttsLoading={ttsLoading}
                                                    audioUrl={audioUrl}
                                                    onPlayTTS={handlePlayTTS}
                                                    onDownload={handleDownload}
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
