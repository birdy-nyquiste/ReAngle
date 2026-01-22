import { useMemo } from "react"
import { alignParagraphs, computeSmartDiff } from "@/lib/diff-utils"
import { cn } from "@/lib/utils"

interface DiffViewProps {
    original: string
    rewritten: string
}

export function DiffView({ original, rewritten }: DiffViewProps) {
    const alignPairs = useMemo(() => alignParagraphs(original, rewritten), [original, rewritten])

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex gap-4 font-semibold text-sm pb-3 border-b border-white/10">
                <div className="flex-1 text-muted-foreground">Original</div>
                <div className="flex-1">Rewritten</div>
            </div>

            {/* Diff rows */}
            {alignPairs.map((pair, idx) => (
                <div
                    key={idx}
                    className="flex gap-4 items-start min-h-[3em] py-3 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg transition-colors duration-150"
                >
                    <div className="flex-1 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap px-2">
                        {pair.original || <span className="text-white/10 select-none">—</span>}
                    </div>
                    <div className="flex-1 text-sm leading-relaxed whitespace-pre-wrap px-2">
                        {pair.rewritten ? (
                            <DiffParagraph original={pair.original} rewritten={pair.rewritten} />
                        ) : (
                            <span className="text-white/10 select-none">—</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

function DiffParagraph({ original, rewritten }: { original: string; rewritten: string }) {
    const parts = useMemo(() => computeSmartDiff(original, rewritten), [original, rewritten])

    return (
        <>
            {parts.map((part, i) => (
                <span
                    key={i}
                    className={cn(
                        part.type === 'insert' && "bg-emerald-500/20 text-emerald-300 decoration-emerald-400 underline decoration-1 underline-offset-2",
                        part.type === 'delete' && "bg-red-500/10 text-red-400/50 line-through decoration-red-400/30 hidden",
                        part.type === 'equal' && "text-foreground"
                    )}
                    title={part.type !== 'equal' ? part.type : undefined}
                >
                    {part.text}
                </span>
            ))}
        </>
    )
}
