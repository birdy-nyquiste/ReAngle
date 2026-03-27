import React from "react"
import { Triangle, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface RevealSectionProps {
    t: (key: string) => string
    expanded: boolean
    onToggle: () => void
    sidebarExpanded: boolean
    onDeAngleProcess: () => void
    deAngleLoading: boolean
    inputsLocked: boolean
}

export const RevealSection: React.FC<RevealSectionProps> = ({
    t,
    expanded,
    onToggle,
    sidebarExpanded,
    onDeAngleProcess,
    deAngleLoading,
    inputsLocked,
}) => {
    return (
        <div className={cn(
            "rounded-xl overflow-hidden flex flex-col transition-colors",
            (expanded && sidebarExpanded) ? "bg-white/5 border border-white/10 shadow-sm" : "border border-transparent hover:bg-white/5"
        )}>
            <button
                onClick={onToggle}
                className="flex items-center w-full h-[40px] px-1 group outline-none cursor-pointer"
                title={!sidebarExpanded ? t("mainApp.tabDeangle") : undefined}
            >
                <div className={cn(
                    "flex items-center justify-center shrink-0 border transition-colors w-7 h-7 rounded-full",
                    "bg-white/5 border-white/10 text-muted-foreground group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-foreground"
                )}>
                    <Triangle className="w-3.5 h-3.5" />
                </div>
                <div className={cn(
                    "flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap",
                    sidebarExpanded ? "w-[266px] opacity-100 ml-3 pr-2" : "w-0 opacity-0 ml-0 pr-0"
                )}>
                    <span className="font-medium text-sm text-neutral-400 group-hover:text-neutral-50 transition-colors">
                        {t("mainApp.step2Deangle")}
                    </span>
                    <ChevronRight className={cn(
                        "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 group-hover:text-foreground",
                        expanded && "rotate-90"
                    )} />
                </div>
            </button>

            {sidebarExpanded && expanded && (
                <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                    <p className="text-xs text-neutral-500 leading-relaxed italic border-l-2 border-neutral-800 pl-3">
                        {t("mainApp.deangleDescription")}
                    </p>
                    <Button
                        className="w-full bg-neutral-100 hover:bg-white text-neutral-900 font-bold h-10 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-black/10 text-xs uppercase tracking-widest"
                        onClick={onDeAngleProcess}
                        disabled={deAngleLoading || !inputsLocked}
                    >
                        {deAngleLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {t("mainApp.startDeangle")}
                    </Button>
                </div>
            )}
        </div>
    )
}
