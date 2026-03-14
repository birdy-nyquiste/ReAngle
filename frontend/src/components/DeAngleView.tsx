import { useMemo } from "react"
import { CheckCircle2, XCircle, HelpCircle, Compass, ListChecks, AlertTriangle, Info } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export interface Fact {
    id: string
    content: string
    status: "SUPPORTED" | "MOSTLY_SUPPORTED" | "PARTIALLY_SUPPORTED" | "CONTRADICTED" | "UNVERIFIABLE"
}

export interface Angle {
    id: string
    title: string
    description: string
    color: string
}

interface DeAngleViewProps {
    facts: Fact[]
    angles: Angle[]
    selectedIds: Set<string>
    onToggleSelect: (id: string, type: "fact" | "angle") => void
    layout?: "row" | "col"
}

const statusConfig = {
    "SUPPORTED": {
        icon: CheckCircle2,
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20"
    },
    "MOSTLY_SUPPORTED": {
        icon: Info,
        color: "text-teal-400",
        bg: "bg-teal-500/10",
        border: "border-teal-500/20"
    },
    "PARTIALLY_SUPPORTED": {
        icon: AlertTriangle,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20"
    },
    "CONTRADICTED": {
        icon: XCircle,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
    },
    "UNVERIFIABLE": {
        icon: HelpCircle,
        color: "text-slate-400",
        bg: "bg-slate-500/10",
        border: "border-slate-500/20"
    }
}

// Map backend color strings to tailwind classes mapping similar to fact status
const angleColorConfig: Record<string, { color: string, bg: string, border: string }> = {
    blue: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    purple: { color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    orange: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    green: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    red: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    default: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" }
}

// Statuses to render in order
const FACT_STATUSES = ["SUPPORTED", "MOSTLY_SUPPORTED", "PARTIALLY_SUPPORTED", "CONTRADICTED", "UNVERIFIABLE"] as const

export function DeAngleView({ facts, angles, selectedIds, onToggleSelect, layout = "row" }: DeAngleViewProps) {
    const { t } = useLanguage()
    const factLabels: Record<string, string> = useMemo(() => ({
        SUPPORTED: t("mainApp.factSupported"),
        MOSTLY_SUPPORTED: t("mainApp.factMostlySupported"),
        PARTIALLY_SUPPORTED: t("mainApp.factPartiallySupported"),
        CONTRADICTED: t("mainApp.factContradicted"),
        UNVERIFIABLE: t("mainApp.factUnverifiable"),
    }), [t])
    // Single-pass grouping
    const groupedFacts = useMemo(() => {
        const groups: Record<string, Fact[]> = { 
            SUPPORTED: [], MOSTLY_SUPPORTED: [], PARTIALLY_SUPPORTED: [], CONTRADICTED: [], UNVERIFIABLE: [] 
        }
        for (const f of facts) {
            groups[f.status]?.push(f)
        }
        return groups
    }, [facts])

    return (
        <div className={`flex flex-col ${layout === "row" ? "lg:flex-row h-full overflow-hidden" : ""} gap-4 lg:gap-6 p-4 lg:p-6`}>
            {/* Left Column: Facts Extraction */}
            <div className={`flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden ${layout === "row" ? "flex-1 min-w-0" : "flex-none min-h-[300px] max-h-[500px]"}`}>
                <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-white/5 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-base">{t("mainApp.originalFacts")}</h3>
                    <span className="ml-auto text-xs text-muted-foreground">{t("mainApp.selectFactsHint")}</span>
                </div>
                <div className="p-4 lg:p-5 overflow-y-auto flex-1 custom-scrollbar">
                    {FACT_STATUSES.map(status => {
                        const group = groupedFacts[status]
                        if (group.length === 0) return null
                        const Config = statusConfig[status]
                        const Icon = Config.icon
                        return (
                            <div key={status} className="space-y-3 mb-6">
                                <div className={`flex items-center gap-2 text-xs font-bold ${Config.color}`}>
                                    <Icon className="w-4 h-4" />
                                    {factLabels[status]}
                                </div>
                                {group.map(fact => {
                                    const isSelected = selectedIds.has(fact.id)
                                    return (
                                        <div 
                                            key={fact.id} 
                                            onClick={() => onToggleSelect(fact.id, "fact")}
                                            className={`p-3 lg:p-4 rounded-xl text-sm border cursor-pointer transition-all duration-200 
                                                ${isSelected ? `${Config.bg} ${Config.border} ring-1 ring-white/20` : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                        >
                                            {/* Process content to safely split out [Analysis] if it was appended by backend */}
                                            {fact.content.split('\n\n[Analysis]:').map((part, i) => (
                                                <div key={i} className={i === 1 ? "mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground" : ""}>
                                                    {i === 1 && <strong className="block mb-1 text-white/70">{t("mainApp.analysisLabel")}</strong>}
                                                    {part}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}

                    {facts.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                            {t("mainApp.noFactsYet")}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Right Column: Origin Angles */}
            <div className={`flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden ${layout === "row" ? "flex-1 min-w-0" : "flex-none min-h-[300px] max-h-[500px]"}`}>
                <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-white/5 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-base">{t("mainApp.originalOpinions")}</h3>
                    <span className="ml-auto text-xs text-muted-foreground">{t("mainApp.selectOpinionsHint")}</span>
                </div>
                <div className="p-4 lg:p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
                    {angles.map(angle => {
                        const isSelected = selectedIds.has(angle.id)
                        const Config = angleColorConfig.purple
                        return (
                            <div 
                                key={angle.id} 
                                onClick={() => onToggleSelect(angle.id, "angle")}
                                className={`p-3 lg:p-4 rounded-xl text-sm border cursor-pointer transition-all duration-200 
                                    ${isSelected ? `${Config.bg} ${Config.border} ring-1 ring-white/20` : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                            >
                                <div className="leading-relaxed">
                                    {angle.title}
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground">
                                    <strong className="block mb-1 text-white/70">{t("mainApp.descriptionLabel")}</strong>
                                    {angle.description}
                                </div>
                            </div>
                        )
                    })}

                    {angles.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                            {t("mainApp.noOpinionsYet")}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
