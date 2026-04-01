import React from "react"
import { Wand2, ChevronRight, X, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReframeSectionProps {
    t: (key: string) => string
    expanded: boolean
    onToggle: () => void
    sidebarExpanded: boolean
    selectedFacts: { id: string, content: string }[]
    customFacts: { id: string, content: string }[]
    onAddCustomFact: (content: string) => void
    onRemoveCustomFact: (id: string) => void
    selectedAngles: { id: string, title: string }[]
    customAngles: { id: string, title: string }[]
    onAddCustomAngle: (title: string) => void
    onRemoveCustomAngle: (id: string) => void
    onToggleDeAngleSelect: (id: string, type: "fact" | "angle") => void
    prompt: string
    setPrompt: (val: string) => void
    onReAngleProcess: () => void
    reAngleLoading: boolean
    deAngleResult: { facts: { id: string }[], angles: { id: string }[] } | null
    completed?: boolean
}

export const ReframeSection: React.FC<ReframeSectionProps> = ({
    t,
    expanded,
    onToggle,
    sidebarExpanded,
    selectedFacts,
    customFacts,
    onAddCustomFact,
    onRemoveCustomFact,
    selectedAngles,
    customAngles,
    onAddCustomAngle,
    onRemoveCustomAngle,
    onToggleDeAngleSelect,
    prompt,
    setPrompt,
    onReAngleProcess,
    reAngleLoading,
    deAngleResult,
    completed = false,
}) => {
    const [factInput, setFactInput] = React.useState("")
    const [angleInput, setAngleInput] = React.useState("")

    const handleToggleFactSelect = React.useCallback((id: string) => onToggleDeAngleSelect(id, "fact"), [onToggleDeAngleSelect])
    const handleToggleAngleSelect = React.useCallback((id: string) => onToggleDeAngleSelect(id, "angle"), [onToggleDeAngleSelect])

    return (
        <div className={cn(
            "rounded-xl overflow-hidden flex flex-col transition-colors",
            (expanded && sidebarExpanded) ? "section-active" : "border border-transparent hover:bg-white/5"
        )}>
            <button
                onClick={onToggle}
                className="flex items-center w-full h-[40px] px-1 group outline-none cursor-pointer"
                title={!sidebarExpanded ? t("mainApp.tabReangle") : undefined}
            >
                <div className={cn(
                    "flex items-center justify-center shrink-0 border transition-all w-7 h-7 rounded-full",
                    completed
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-white/5 border-white/10 text-muted-foreground group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-foreground"
                )}>
                    <span key={completed ? 'done' : 'idle'} className={completed ? "complete-pop block" : "block"}>
                        {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Wand2 className="w-3.5 h-3.5" />}
                    </span>
                </div>
                <div className={cn(
                    "flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap",
                    sidebarExpanded ? "w-[min(266px,75vw)] opacity-100 ml-3 pr-2" : "w-0 opacity-0 ml-0 pr-0"
                )}>
                    <span className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {t("mainApp.step3Reangle")}
                    </span>
                    <ChevronRight className={cn(
                        "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 group-hover:text-foreground",
                        expanded && "rotate-90"
                    )} />
                </div>
            </button>

            {sidebarExpanded && expanded && (
                <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                    <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-neutral-800 pl-3">
                        {t("mainApp.reframeDescription")}
                    </p>

                    {/* Selected & Custom Events */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                             {t("mainApp.selectedFacts")}
                        </label>
                        
                        {/* Select Section */}
                        <div className="space-y-2 pl-3 border-l-2 border-emerald-500/10">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{t("mainApp.selectFromReveal")}</label>
                            <div className="flex flex-wrap gap-1.5">
                                {selectedFacts.length > 0 ? selectedFacts.map((f: { id: string, content: string }) => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 cursor-pointer hover:bg-emerald-500/20 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
                                        onClick={() => handleToggleFactSelect(f.id)}
                                        aria-label={`${t("mainApp.fact")}: ${f.content?.split('\n')[0] || t("mainApp.fact")} — ${t("mainApp.removeSelection") || "remove"}`}
                                    >
                                        <span className="truncate max-w-[100px] sm:max-w-[140px] uppercase tracking-wide">{f.content?.split('\n')[0]?.slice(0, 30) || t("mainApp.fact")}...</span>
                                        <X className="w-2.5 h-2.5 shrink-0 opacity-40" />
                                    </button>
                                )) : (
                                    <span className="text-[11px] text-neutral-600 italic py-1">{t("mainApp.noEventsSelected")}</span>
                                )}
                            </div>
                        </div>

                        {/* Add Custom Section */}
                        <div className="space-y-2 pl-3 border-l-2 border-emerald-500/10">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{t("mainApp.addCustom")}</label>
                            {customFacts.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pb-1">
                                    {customFacts.map((f: { id: string, content: string }) => (
                                        <button
                                            key={f.id}
                                            type="button"
                                            className="tag-appear inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/30 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
                                            onClick={() => onRemoveCustomFact(f.id)}
                                            aria-label={`Remove custom fact: ${f.content}`}
                                        >
                                            <span className="truncate max-w-[100px] sm:max-w-[140px] tracking-wide">{f.content.slice(0, 30)}...</span>
                                            <X className="w-2.5 h-2.5 shrink-0 opacity-40" />
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input 
                                    value={factInput} 
                                    onChange={e => setFactInput(e.target.value)} 
                                    placeholder={t("mainApp.addCustomFactPlaceholder")}
                                    className="h-7 text-xs bg-black/20 border border-white/5 rounded-md px-2 flex-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && factInput.trim()) {
                                            onAddCustomFact(factInput.trim());
                                            setFactInput("");
                                        }
                                    }}
                                />
                                <Button 
                                    variant="outline" 
                                    className="h-7 px-3 text-xs bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                                    onClick={() => {
                                        if (factInput.trim()) {
                                            onAddCustomFact(factInput.trim());
                                            setFactInput("");
                                        }
                                    }}
                                >
                                    {t("mainApp.addCustom")}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Selected & Custom Angles */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
                             {t("mainApp.selectedOpinions")}
                        </label>
                        
                        {/* Select Section */}
                        <div className="space-y-2 pl-3 border-l-2 border-purple-500/10">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{t("mainApp.selectFromReveal")}</label>
                            <div className="flex flex-wrap gap-1.5">
                                {selectedAngles.length > 0 ? selectedAngles.map((a: { id: string, title: string }) => (
                                    <button
                                        key={a.id}
                                        type="button"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/10 cursor-pointer hover:bg-purple-500/20 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/50"
                                        onClick={() => handleToggleAngleSelect(a.id)}
                                        aria-label={`${t("mainApp.opinion")}: ${a.title || t("mainApp.opinion")} — ${t("mainApp.removeSelection") || "remove"}`}
                                    >
                                        <span className="truncate max-w-[100px] sm:max-w-[140px] uppercase tracking-wide">{a.title || t("mainApp.opinion")}</span>
                                        <X className="w-2.5 h-2.5 shrink-0 opacity-40" />
                                    </button>
                                )) : (
                                    <span className="text-[11px] text-neutral-600 italic py-1">{t("mainApp.noAnglesSelected")}</span>
                                )}
                            </div>
                        </div>

                        {/* Add Custom Section */}
                        <div className="space-y-2 pl-3 border-l-2 border-purple-500/10">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{t("mainApp.addCustom")}</label>
                            {customAngles.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pb-1">
                                    {customAngles.map((a: { id: string, title: string }) => (
                                        <button
                                            key={a.id}
                                            type="button"
                                            className="tag-appear inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 cursor-pointer hover:bg-purple-500/30 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/50"
                                            onClick={() => onRemoveCustomAngle(a.id)}
                                            aria-label={`Remove custom angle: ${a.title}`}
                                        >
                                            <span className="truncate max-w-[100px] sm:max-w-[140px] tracking-wide">{a.title}</span>
                                            <X className="w-2.5 h-2.5 shrink-0 opacity-40" />
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input 
                                    value={angleInput} 
                                    onChange={e => setAngleInput(e.target.value)} 
                                    placeholder={t("mainApp.addCustomAnglePlaceholder")}
                                    className="h-7 text-xs bg-black/20 border border-white/5 rounded-md px-2 flex-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/50"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && angleInput.trim()) {
                                            onAddCustomAngle(angleInput.trim());
                                            setAngleInput("");
                                        }
                                    }}
                                />
                                <Button 
                                    variant="outline" 
                                    className="h-7 px-3 text-xs bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                                    onClick={() => {
                                        if (angleInput.trim()) {
                                            onAddCustomAngle(angleInput.trim());
                                            setAngleInput("");
                                        }
                                    }}
                                >
                                    {t("mainApp.addCustom")}
                                </Button>
                            </div>
                        </div>
                    </div>



                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                             {t("mainApp.customization")}
                        </label>
                        <Textarea
                            placeholder={t("mainApp.customizationPlaceholder")}
                            className="min-h-[100px] bg-black/20 border-white/5 text-sm resize-none focus-visible:ring-1 rounded-lg"
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full bg-neutral-100 hover:bg-white text-neutral-900 font-bold h-10 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-black/10 text-xs uppercase tracking-widest"
                        onClick={onReAngleProcess}
                        disabled={reAngleLoading || !deAngleResult}
                    >
                        {reAngleLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {t("mainApp.startReangle")}
                    </Button>
                </div>
            )}
        </div>
    )
}
