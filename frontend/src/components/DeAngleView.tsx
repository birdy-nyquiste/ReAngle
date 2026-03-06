import { useMemo } from "react"
import { CheckCircle2, XCircle, HelpCircle, Compass, ListChecks } from "lucide-react"

interface Fact {
    id: string
    content: string
    status: "TRUE" | "FALSE" | "UNVERIFIABLE"
}

interface Angle {
    id: string
    title: string
    description: string
    color: string
}

interface DeAngleViewProps {
    facts: Fact[]
    angles: Angle[]
}

const statusConfig = {
    "TRUE": {
        icon: CheckCircle2,
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20"
    },
    "FALSE": {
        icon: XCircle,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
    },
    "UNVERIFIABLE": {
        icon: HelpCircle,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20"
    }
}

// Map backend color strings to tailwind classes for the left border indicator
const angleColors: Record<string, string> = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    red: "bg-red-500",
    default: "bg-primary"
}

// Statuses to render in order
const FACT_STATUSES = ["TRUE", "FALSE", "UNVERIFIABLE"] as const
const FACT_LABELS: Record<string, string> = { TRUE: "TRUE", FALSE: "FALSE", UNVERIFIABLE: "UNVERIFIABLE" }

export function DeAngleView({ facts, angles }: DeAngleViewProps) {
    // Single-pass grouping instead of 3 separate .filter() calls
    const groupedFacts = useMemo(() => {
        const groups: Record<string, Fact[]> = { TRUE: [], FALSE: [], UNVERIFIABLE: [] }
        for (const f of facts) {
            groups[f.status]?.push(f)
        }
        return groups
    }, [facts])

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full p-6 overflow-hidden">
            {/* Left Column: Facts Extraction */}
            <div className="flex-1 flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-base">Facts Extraction</h3>
                </div>
                <div className="p-5 overflow-y-auto flex-1">
                    {FACT_STATUSES.map(status => {
                        const group = groupedFacts[status]
                        if (group.length === 0) return null
                        const Config = statusConfig[status]
                        const Icon = Config.icon
                        return (
                            <div key={status} className="space-y-3 mb-6">
                                <div className={`flex items-center gap-2 text-xs font-bold ${Config.color}`}>
                                    <Icon className="w-4 h-4" />
                                    {FACT_LABELS[status]}
                                </div>
                                {group.map(fact => (
                                    <div key={fact.id} className={`p-4 rounded-xl text-sm ${Config.bg} ${Config.border} border`}>
                                        {fact.content}
                                    </div>
                                ))}
                            </div>
                        )
                    })}

                    {facts.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                            No facts extracted yet.
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Right Column: Origin Angles */}
            <div className="flex-1 flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-base">Origin Angles</h3>
                </div>
                <div className="p-5 overflow-y-auto flex-1 space-y-4">
                    {angles.map(angle => (
                        <div key={angle.id} className="relative p-5 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                            {/* Left indicator bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${angleColors[angle.color] || angleColors.default}`} />

                            <h4 className="font-semibold text-sm mb-2 pl-2">
                                {/* Bullet point matching the color */}
                                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle ${angleColors[angle.color] || angleColors.default}`}></span>
                                {angle.title}
                            </h4>
                            <p className="text-sm text-muted-foreground pl-2">{angle.description}</p>
                        </div>
                    ))}

                    {angles.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                            No angles detected yet.
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
