import { useRef, useState } from "react"
import { Download, Loader2, Headphones, Copy, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReAngleViewProps {
    summary: string
    rewrittenContent: string
    ttsLoading: boolean
    audioUrl: string | null
    onPlayTTS: () => void
    onDownload: () => void
}

export function ReAngleView({
    summary,
    rewrittenContent,
    ttsLoading,
    audioUrl,
    onPlayTTS,
    onDownload
}: ReAngleViewProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [copiedSummary, setCopiedSummary] = useState(false)
    const [copiedContent, setCopiedContent] = useState(false)

    const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePlayClick = () => {
        if (audioUrl) {
            audioRef.current?.play()
        } else {
            onPlayTTS()
        }
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto p-6 gap-6">
            {/* Summary Block */}
            <div className="flex-none bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-base">Summary</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handlePlayClick}
                            disabled={ttsLoading || !summary}
                            className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                            title="Read Aloud"
                        >
                            {ttsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Headphones className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopy(summary, setCopiedSummary)}
                            disabled={!summary}
                            className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                            title="Copy Summary"
                        >
                            {copiedSummary ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
                <div className="p-5 space-y-3">
                    <h4 className="text-sm font-semibold">Abstract</h4>
                    {summary ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{summary}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No summary generated.</p>
                    )}
                </div>
                {/* Audio Element Hidden */}
                {audioUrl ? <audio ref={audioRef} src={audioUrl} className="hidden" /> : null}
            </div>

            {/* ReAngled Content Block */}
            <div className="flex-1 flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden min-h-[300px]">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <h3 className="font-semibold text-base">ReAngled Content</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* We could add TTS for full content later, for now just copy and download */}
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopy(rewrittenContent, setCopiedContent)}
                            disabled={!rewrittenContent}
                            className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                            title="Copy Content"
                        >
                            {copiedContent ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onDownload}
                            disabled={!rewrittenContent}
                            className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                            title="Download as TXT"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex-1 p-5 overflow-y-auto">
                    {rewrittenContent ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{rewrittenContent}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No content generated.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
