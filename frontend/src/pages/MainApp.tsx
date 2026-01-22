import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DiffView } from "@/components/DiffView"
import { Loader2, Trash2, FileText, Link as LinkIcon, Youtube, Type, Play, Download, Sparkles, Settings2, FolderInput } from "lucide-react"

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
    // State
    const [activeInputTab, setActiveInputTab] = useState("text")
    const [inputItems, setInputItems] = useState<InputItem[]>([])

    // Inputs
    const [inputText, setInputText] = useState("")
    const [inputUrl, setInputUrl] = useState("")
    const [inputFile, setInputFile] = useState<File | null>(null)

    // Settings
    const [prompt, setPrompt] = useState("")
    const [model, setModel] = useState("gpt-5")
    const [isLoading, setIsLoading] = useState(false)

    // Result
    const [result, setResult] = useState<RewriteResult | null>(null)
    const [activeResultTab, setActiveResultTab] = useState("summary")
    const [error, setError] = useState<string | null>(null)

    // TTS State
    const [ttsLoading, setTtsLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Handlers
    const handleAddInput = () => {
        const id = Math.random().toString(36).substring(7)
        let newItem: InputItem | null = null

        if (activeInputTab === "text" && inputText.trim()) {
            newItem = {
                id, type: "text", content: inputText,
                meta: { title: "Text Snippet", detail: `${inputText.length} chars` }
            }
            setInputText("")
        } else if (activeInputTab === "url" && inputUrl.trim()) {
            newItem = {
                id, type: "url", content: inputUrl,
                meta: { title: "URL", detail: inputUrl }
            }
            setInputUrl("")
        } else if (activeInputTab === "youtube" && inputUrl.trim()) {
            newItem = {
                id, type: "youtube", content: inputUrl,
                meta: { title: "YouTube", detail: inputUrl }
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
            setError("Please add at least one input item.")
            return
        }

        setIsLoading(true)
        setError(null)
        setResult(null)
        setAudioUrl(null)

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

            const res = await fetch("/api/v1/rewrite", {
                method: "POST",
                body: formData
            })

            if (!res.ok) {
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
            {/* Floating Navigation */}
            <header className="floating-nav">
                <div className="container flex h-14 items-center px-6">
                    <a href="/" className="flex items-center gap-2.5 font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="/favicon.png" alt="ReAngle" className="h-8 w-8 rounded-lg" />
                        <span>ReAngle</span>
                    </a>
                    {/* Right side reserved for future use */}
                </div>
            </header>

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
                                <h2 className="font-semibold text-sm">Input Sources</h2>
                                <p className="text-xs text-muted-foreground">Add content to transform</p>
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
                                            placeholder="Paste your text here..."
                                            className="min-h-[100px] bg-transparent border-white/10 placeholder:text-muted-foreground/50 resize-none"
                                            value={inputText}
                                            onChange={e => setInputText(e.target.value)}
                                        />
                                    )}
                                    {(activeInputTab === 'url' || activeInputTab === 'youtube') && (
                                        <Input
                                            placeholder={activeInputTab === 'url' ? "https://example.com/article" : "https://youtube.com/watch?v=..."}
                                            value={inputUrl}
                                            onChange={e => setInputUrl(e.target.value)}
                                            className="bg-transparent border-white/10 placeholder:text-muted-foreground/50"
                                        />
                                    )}
                                    {activeInputTab === 'file' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="file" className="text-xs text-muted-foreground">Upload File</Label>
                                            <Input
                                                id="file"
                                                type="file"
                                                onChange={e => setInputFile(e.target.files?.[0] || null)}
                                                className="bg-transparent border-white/10 file:bg-white/10 file:border-0 file:text-foreground file:text-xs file:mr-3 cursor-pointer"
                                            />
                                            <p className="text-xs text-muted-foreground/70">Supported: TXT, PDF, DOCX</p>
                                        </div>
                                    )}

                                    <Button
                                        className="w-full mt-4 bg-white/10 hover:bg-white/15 border-0 cursor-pointer"
                                        variant="outline"
                                        onClick={handleAddInput}
                                    >
                                        Add to Queue
                                    </Button>
                                </div>
                            </Tabs>

                            {/* Queue */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">
                                    Queue ({inputItems.length})
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
                                            No items in queue
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
                            <h2 className="font-semibold text-sm">Configuration</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">AI Model</Label>
                                <Select value={model} onValueChange={setModel}>
                                    <SelectTrigger className="bg-white/5 border-white/10 cursor-pointer">
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e293b] border-white/10">
                                        <SelectItem value="gpt-5" className="cursor-pointer">GPT-5 (Best Quality)</SelectItem>
                                        <SelectItem value="gemini-2.5-flash" className="cursor-pointer">Gemini 2.5 Flash</SelectItem>
                                        <SelectItem value="qwen-flash" className="cursor-pointer">Qwen Flash</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs text-muted-foreground">Style Instructions</Label>
                                    <Select onValueChange={handlePreset}>
                                        <SelectTrigger className="h-7 w-[100px] text-xs bg-white/5 border-white/10 cursor-pointer">
                                            <SelectValue placeholder="Presets" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1e293b] border-white/10">
                                            <SelectItem value="Humorous Tone" className="cursor-pointer text-xs">Humorous</SelectItem>
                                            <SelectItem value="Academic Tone" className="cursor-pointer text-xs">Academic</SelectItem>
                                            <SelectItem value="Journalistic Tone" className="cursor-pointer text-xs">Journalistic</SelectItem>
                                            <SelectItem value="Blog style" className="cursor-pointer text-xs">Blog Post</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Textarea
                                    placeholder="e.g. Make it more professional and concise..."
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
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Transform Content
                                    </>
                                )}
                            </Button>

                            {error && (
                                <div className="text-xs text-red-400 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                    {error}
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
                            <p className="text-sm">Add sources and click "Transform Content" to see results</p>
                        </div>
                    ) : (
                        <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="flex-1 flex flex-col overflow-hidden">
                            <div className="border-b border-white/5 px-5 py-3 flex items-center bg-white/5">
                                <TabsList className="bg-transparent gap-1">
                                    <TabsTrigger
                                        value="summary"
                                        className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-lg px-4 cursor-pointer"
                                    >
                                        Summary
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="rewritten"
                                        className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-lg px-4 cursor-pointer"
                                    >
                                        Rewritten
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="compare"
                                        className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-lg px-4 cursor-pointer"
                                    >
                                        Compare
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <TabsContent value="summary" className="mt-0 h-full">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">Summary</h3>
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
                                                        Read Aloud
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
                                            <h3 className="text-lg font-semibold">Rewritten Content</h3>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleDownload}
                                                className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
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
                            </div>
                        </Tabs>
                    )}
                </div>
            </main>
        </div>
    )
}
