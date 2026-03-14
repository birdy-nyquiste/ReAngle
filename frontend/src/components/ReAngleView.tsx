import { useState, useMemo } from "react"
import { Download, Loader2, Headphones, Copy, FileText, CheckCircle2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AudioPlayer } from "./AudioPlayer"

interface ReAngleViewProps {
    summary: string
    rewrittenContent: string
    ttsLoading: boolean
    audioUrl: string | null
    onPlayTTS: () => void
    onDownload: () => void
    onDownloadSummary?: () => void
    avatarPanelVisible?: boolean
    voiceoverScript?: string | null
    voiceoverLoading?: boolean
    avatarVideoUrl?: string | null
    avatarLoading?: boolean
    onOpenAvatarPanel?: () => void
    onGenerateAvatar?: () => void
    onVoiceoverChange?: (script: string) => void
}

const actionButtonClass = "h-8 w-8 shrink-0 hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-50"

/** 字数/词数统计：中文等按字数，英文等按词数，仅返回 count 用于展示 */
function getTextCount(text: string): number {
    const t = (text || "").trim()
    if (!t) return 0
    const cjk = (t.match(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || []).length
    const letters = (t.match(/\p{L}/gu) || []).length
    const totalLetters = letters + cjk
    if (totalLetters === 0) return t.length
    if (cjk / totalLetters >= 0.3) return t.length
    return t.split(/\s+/).filter(Boolean).length
}

export function ReAngleView({
    summary,
    rewrittenContent,
    ttsLoading,
    audioUrl,
    onPlayTTS,
    onDownload,
    onDownloadSummary,
    avatarPanelVisible = false,
    voiceoverScript = null,
    voiceoverLoading = false,
    avatarVideoUrl = null,
    avatarLoading = false,
    onOpenAvatarPanel,
    onGenerateAvatar,
    onVoiceoverChange,
}: ReAngleViewProps) {
    const [copiedSummary, setCopiedSummary] = useState(false)
    const [copiedContent, setCopiedContent] = useState(false)
    const [copiedVoiceover, setCopiedVoiceover] = useState(false)

    const summaryCount = useMemo(() => getTextCount(summary), [summary])
    const contentCount = useMemo(() => getTextCount(rewrittenContent), [rewrittenContent])
    const voiceoverCount = useMemo(() => getTextCount(voiceoverScript ?? ""), [voiceoverScript])

    const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePlayClick = () => {
        if (!audioUrl) {
            onPlayTTS()
        }
    }

    const handleDownloadAudio = () => {
        if (!audioUrl) return
        const element = document.createElement("a")
        element.href = audioUrl
        element.download = "reangle_summary_audio.mp3"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto p-4 lg:p-6 gap-4 lg:gap-6 custom-scrollbar">
            {/* Summary Block */}
            <div className="flex-none bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-base">Summary</h3>
                        {summary ? (
                            <span className="text-xs text-muted-foreground tabular-nums">{summaryCount}</span>
                        ) : null}
                    </div>
                    <div className="min-w-[7.5rem] flex items-center justify-end gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handlePlayClick}
                            disabled={ttsLoading || !summary || !!audioUrl}
                            className={actionButtonClass}
                            title="Read Aloud"
                        >
                            {ttsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Headphones className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopy(summary, setCopiedSummary)}
                            disabled={!summary}
                            className={actionButtonClass}
                            title="Copy Summary"
                        >
                            {copiedSummary ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onDownloadSummary}
                            disabled={!summary || !onDownloadSummary}
                            className={actionButtonClass}
                            title="Download Summary as TXT"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="p-4 lg:p-5 space-y-3">
                    {summary ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{summary}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No summary generated.</p>
                    )}
                </div>
                {audioUrl && (
                    <div className="px-4 pb-4 lg:px-5 lg:pb-5">
                        <AudioPlayer audioUrl={audioUrl} onDownload={handleDownloadAudio} />
                    </div>
                )}
            </div>

            {/* ReAngled Content Block */}
            <div className="flex-none flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden min-h-[300px]">
                <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <h3 className="font-semibold text-base">ReAngled Content</h3>
                        {rewrittenContent ? (
                            <span className="text-xs text-muted-foreground tabular-nums">{contentCount}</span>
                        ) : null}
                    </div>
                    <div className="min-w-[7.5rem] flex items-center justify-end gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onOpenAvatarPanel}
                            disabled={!rewrittenContent || !onOpenAvatarPanel}
                            className={actionButtonClass}
                            title="Avatar Broadcast"
                        >
                            <Video className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopy(rewrittenContent, setCopiedContent)}
                            disabled={!rewrittenContent}
                            className={actionButtonClass}
                            title="Copy Content"
                        >
                            {copiedContent ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onDownload}
                            disabled={!rewrittenContent}
                            className={actionButtonClass}
                            title="Download as TXT"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="p-4 lg:p-5">
                    {rewrittenContent ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{rewrittenContent}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No content generated.</p>
                    )}
                </div>
            </div>

            {/* Avatar Broadcast: Script + Avatar Video */}
            {avatarPanelVisible && (
                <div className="flex-none flex flex-col gap-4 lg:gap-6">
                    <h3 className="text-base font-semibold text-foreground/90 flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        Avatar Broadcast
                    </h3>

                    {/* Script */}
                    <div className="flex-none bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">Script</h4>
                                {voiceoverScript?.trim() ? (
                                    <span className="text-xs text-muted-foreground tabular-nums">{voiceoverCount}</span>
                                ) : null}
                            </div>
                            <div className="min-w-[7.5rem] flex items-center justify-end gap-1">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={onGenerateAvatar}
                                    disabled={avatarLoading || voiceoverLoading || !rewrittenContent || !onGenerateAvatar}
                                    className={actionButtonClass}
                                    title="Generate Avatar Video"
                                >
                                    {avatarLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleCopy(voiceoverScript ?? "", setCopiedVoiceover)}
                                    disabled={!voiceoverScript?.trim()}
                                    className={actionButtonClass}
                                    title="Copy Script"
                                >
                                    {copiedVoiceover ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                        const script = (voiceoverScript ?? "").trim()
                                        if (!script) return
                                        const blob = new Blob([script], { type: "text/plain" })
                                        const a = document.createElement("a")
                                        a.href = URL.createObjectURL(blob)
                                        a.download = "voiceover_script.txt"
                                        document.body.appendChild(a)
                                        a.click()
                                        document.body.removeChild(a)
                                        URL.revokeObjectURL(a.href)
                                    }}
                                    disabled={!voiceoverScript?.trim()}
                                    className={actionButtonClass}
                                    title="Download Script (TXT)"
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 lg:p-5">
                            {voiceoverLoading ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating script…
                                </div>
                            ) : (
                                <Textarea
                                    value={voiceoverScript ?? ""}
                                    onChange={e => onVoiceoverChange?.(e.target.value)}
                                    placeholder="Click the video icon above to generate a script first, or edit here then click Generate Avatar."
                                    className="min-h-[120px] bg-black/20 border-white/5 text-sm resize-none focus-visible:ring-1"
                                />
                            )}
                        </div>
                    </div>

                    {/* Avatar Video */}
                    <div className="flex-none bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-white/5 flex items-center justify-between">
                            <h4 className="font-medium text-sm">Avatar Video</h4>
                            {avatarVideoUrl && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={actionButtonClass}
                                    title="Download Avatar Video"
                                    onClick={async () => {
                                        const downloadUrl = `/api/v2/media/avatar/download?url=${encodeURIComponent(avatarVideoUrl!)}`
                                        try {
                                            const res = await fetch(downloadUrl, { credentials: "include" })
                                            if (!res.ok) throw new Error("Download failed")
                                            const blob = await res.blob()
                                            const u = URL.createObjectURL(blob)
                                            const a = document.createElement("a")
                                            a.href = u
                                            a.download = "avatar_broadcast.mp4"
                                            document.body.appendChild(a)
                                            a.click()
                                            document.body.removeChild(a)
                                            URL.revokeObjectURL(u)
                                        } catch {
                                            window.open(downloadUrl, "_blank")
                                        }
                                    }}
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <div className="p-4 lg:p-5">
                            {avatarLoading ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating avatar video, please wait…
                                </div>
                            ) : avatarVideoUrl ? (
                                <div className="space-y-3">
                                    <video
                                        src={avatarVideoUrl}
                                        controls
                                        className="w-full max-h-[360px] rounded-lg bg-black/30"
                                        preload="metadata"
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic py-4">After generating the voiceover script, you may edit it as needed (recommended within 700 words). Click &quot;Generate Avatar&quot; to create the video, which can then be previewed or downloaded here. Video generation usually takes about 5–10 minutes.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
