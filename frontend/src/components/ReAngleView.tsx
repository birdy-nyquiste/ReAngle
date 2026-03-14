import { useState, useMemo } from "react"
import { Download, Loader2, Headphones, Copy, FileText, CheckCircle2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/context/LanguageContext"
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
    avatarScriptMaxChars?: number
    avatarEnabled?: boolean
    avatarDisabledReason?: string | null
    avatarQuotaText?: string | null
    onOpenAvatarPanel?: () => void
    onGenerateVoiceover?: () => void
    onGenerateAvatar?: () => void
    onVoiceoverChange?: (script: string) => void
}

const actionButtonClass = "h-8 w-8 shrink-0 hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-50"

/** 与后端/生成校验保持一致：使用字符串字符长度（trim 后） */
function getTextLength(text: string): number {
    return (text || "").trim().length
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
    avatarScriptMaxChars = 800,
    avatarEnabled = true,
    avatarDisabledReason = null,
    avatarQuotaText = null,
    onOpenAvatarPanel,
    onGenerateVoiceover,
    onGenerateAvatar,
    onVoiceoverChange,
}: ReAngleViewProps) {
    const { t } = useLanguage()
    const [copiedSummary, setCopiedSummary] = useState(false)
    const [copiedContent, setCopiedContent] = useState(false)

    const summaryLength = useMemo(() => getTextLength(summary), [summary])
    const contentLength = useMemo(() => getTextLength(rewrittenContent), [rewrittenContent])
    const voiceoverLength = useMemo(() => getTextLength(voiceoverScript ?? ""), [voiceoverScript])

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
                        <h3 className="font-semibold text-base">{t("mainApp.summary")}</h3>
                        {summary ? (
                            <span className="text-xs text-muted-foreground tabular-nums">{t("mainApp.summaryLengthChars").replace("{n}", String(summaryLength))}</span>
                        ) : null}
                    </div>
                    <div className="min-w-[7.5rem] flex items-center justify-end gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handlePlayClick}
                            disabled={ttsLoading || !summary || !!audioUrl}
                            className={actionButtonClass}
                            title={t("mainApp.readAloud")}
                        >
                            {ttsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Headphones className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopy(summary, setCopiedSummary)}
                            disabled={!summary}
                            className={actionButtonClass}
                            title={t("mainApp.copySummary")}
                        >
                            {copiedSummary ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onDownloadSummary}
                            disabled={!summary || !onDownloadSummary}
                            className={actionButtonClass}
                            title={t("mainApp.downloadSummaryTxt")}
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="p-4 lg:p-5 space-y-3">
                    {summary ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{summary}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">{t("mainApp.noSummaryGenerated")}</p>
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
                            <span className="text-xs text-muted-foreground tabular-nums">Length: {contentLength} chars</span>
                        ) : null}
                    </div>
                    <div className="min-w-[7.5rem] flex items-center justify-end gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onOpenAvatarPanel}
                            disabled={!rewrittenContent || !onOpenAvatarPanel || !avatarEnabled}
                            className={actionButtonClass}
                            title={avatarEnabled ? t("mainApp.avatarBroadcast") : (avatarDisabledReason || t("mainApp.avatarUnavailable"))}
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
                            title={t("mainApp.downloadAsTxt")}
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="p-4 lg:p-5">
                    {rewrittenContent ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{rewrittenContent}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">{t("mainApp.noContentGenerated")}</p>
                    )}
                </div>
            </div>

            {/* Avatar Broadcast */}
            {avatarPanelVisible && (
                <div id="avatar-broadcast-section" className="flex-none bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 lg:px-5 lg:py-4 flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-base">{t("mainApp.avatarBroadcast")}</h3>
                    </div>
                    <div className="px-4 pb-4 lg:px-5 lg:pb-4">
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-muted-foreground space-y-1">
                            <p className="text-foreground/90 font-medium">{t("mainApp.howToCreateAvatarVideo")}</p>
                            <p>{t("mainApp.avatarStep1").replace("{n}", String(avatarScriptMaxChars))}</p>
                            <p>{t("mainApp.avatarStep2")}</p>
                            {avatarQuotaText ? (
                                <p className="pt-1 text-xs text-foreground/80">{avatarQuotaText}</p>
                            ) : null}
                        </div>
                    </div>
                    {!avatarEnabled && avatarDisabledReason ? (
                        <div className="px-4 pb-4 lg:px-5">
                            <div className="text-sm rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-300 px-3 py-2">
                                {avatarDisabledReason}
                            </div>
                        </div>
                    ) : null}

                    {/* Broadcast Script */}
                    <div className="border-t border-white/5">
                        <div className="px-4 py-3 lg:px-5 lg:py-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{t("mainApp.broadcastScript")}</h4>
                                {voiceoverScript?.trim() ? (
                                    <span className="text-xs text-muted-foreground tabular-nums">{t("mainApp.summaryLengthChars").replace("{n}", `${voiceoverLength}/${avatarScriptMaxChars}`)}</span>
                                ) : null}
                            </div>
                            <Button
                                variant="outline"
                                className="h-8 px-3 border-white/10 bg-white/5 hover:bg-white/10"
                                onClick={onGenerateVoiceover}
                                disabled={voiceoverLoading || !rewrittenContent || !onGenerateVoiceover || !avatarEnabled}
                            >
                                {voiceoverLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("mainApp.generateScript")}
                            </Button>
                        </div>
                        <div className="px-4 pb-4 lg:px-5 lg:pb-5 space-y-3">
                            {voiceoverLoading ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating script...
                                </div>
                            ) : (
                                <Textarea
                                    value={voiceoverScript ?? ""}
                                    onChange={e => onVoiceoverChange?.(e.target.value)}
                                    placeholder={t("mainApp.voiceoverPlaceholder")}
                                    className="min-h-[240px] lg:min-h-[280px] bg-black/20 border-white/5 text-sm resize-none focus-visible:ring-1"
                                    disabled={!avatarEnabled}
                                />
                            )}
                        </div>
                    </div>

                    {/* Avatar Video */}
                    <div className="border-t border-white/5">
                        <div className="px-4 py-3 lg:px-5 lg:py-4 flex items-center justify-between">
                            <h4 className="font-medium text-sm">{t("mainApp.avatarVideo")}</h4>
                            <div className="min-w-[7.5rem] flex items-center justify-end gap-1">
                                <Button
                                    variant="default"
                                    className="h-8 px-3"
                                    onClick={onGenerateAvatar}
                                    disabled={avatarLoading || voiceoverLoading || !voiceoverScript?.trim() || !onGenerateAvatar || !avatarEnabled}
                                >
                                    {avatarLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Generate Avatar Video
                                </Button>
                                {avatarVideoUrl && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className={actionButtonClass}
                                        title={t("mainApp.downloadAvatarVideo")}
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
                        </div>
                        <div className="px-4 pb-4 lg:px-5 lg:pb-5">
                            {avatarLoading ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {t("mainApp.generatingAvatarVideo")}
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
                                <p className="text-sm text-muted-foreground italic py-4">{t("mainApp.noAvatarVideoYet")}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
