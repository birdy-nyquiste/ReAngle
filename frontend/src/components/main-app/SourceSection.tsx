import React from "react"
import { FolderInput, ChevronRight, Type, FileText, Link as LinkIcon, Youtube, Trash2, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InputItem {
    id: string
    type: 'text' | 'file' | 'url' | 'youtube'
    content?: string | File
    meta?: {
        title: string
        detail: string
    }
}

interface SourceSectionProps {
    t: (key: string) => string
    expanded: boolean
    onToggle: () => void
    sidebarExpanded: boolean
    completed?: boolean
    activeInputTab: string
    setActiveInputTab: (val: string) => void
    inputItems: InputItem[]
    onAddInput: () => void
    onRemoveInput: (id: string) => void
    onCompleteInputs: () => void
    inputsLoading: boolean
    inputsLocked: boolean
    inputText: string
    setInputText: (val: string) => void
    inputUrl: string
    setInputUrl: (val: string) => void
    setInputFile: (file: File | null) => void
}

export const SourceSection: React.FC<SourceSectionProps> = ({
    t,
    expanded,
    onToggle,
    sidebarExpanded,
    completed = false,
    activeInputTab,
    setActiveInputTab,
    inputItems,
    onAddInput,
    onRemoveInput,
    onCompleteInputs,
    inputsLoading,
    inputsLocked,
    inputText,
    setInputText,
    inputUrl,
    setInputUrl,
    setInputFile,
}) => {
    return (
        <div className={cn(
            "rounded-xl overflow-hidden flex flex-col transition-colors",
            (expanded && sidebarExpanded) ? "section-active" : "border border-transparent hover:bg-white/5"
        )}>
            <button
                onClick={onToggle}
                className="flex items-center w-full h-[40px] px-1 group outline-none cursor-pointer"
                title={!sidebarExpanded ? t("mainApp.gatherInputs") : undefined}
            >
                <div className={cn(
                    "flex items-center justify-center shrink-0 border transition-all w-7 h-7 rounded-full",
                    completed
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-white/5 border-white/10 text-muted-foreground group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-foreground"
                )}>
                    <span key={completed ? 'done' : 'idle'} className={completed ? "complete-pop block" : "block"}>
                        {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FolderInput className="w-3.5 h-3.5" />}
                    </span>
                </div>
                <div className={cn(
                    "flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap",
                    sidebarExpanded ? "w-[min(266px,75vw)] opacity-100 ml-3 pr-2" : "w-0 opacity-0 ml-0 pr-0"
                )}>
                    <span className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {t("mainApp.step1Gather")}
                    </span>
                    <ChevronRight className={cn(
                        "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 group-hover:text-foreground",
                        expanded && "rotate-90"
                    )} />
                </div>
            </button>

            {sidebarExpanded && expanded && (
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
                                    <label htmlFor="file" className="sr-only">{t("mainApp.uploadFile") || "Upload file"}</label>
                                    <Input
                                        id="file"
                                        type="file"
                                        onChange={e => setInputFile(e.target.files?.[0] || null)}
                                        className="bg-black/20 border-white/5 file:text-foreground file:text-xs h-9 text-xs py-1.5 cursor-pointer"
                                    />
                                </div>
                            )}

                            <Button
                                className="w-full mt-3 bg-white/5 hover:bg-white/10 border border-white/5 text-xs h-8 cursor-pointer rounded-lg uppercase tracking-wider font-semibold"
                                variant="outline"
                                onClick={onAddInput}
                            >
                                {t("mainApp.addToQueue")}
                            </Button>
                        </div>
                    </Tabs>

                    {/* Queue section */}
                    <div className="pt-2">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                            {t("mainApp.queue")} ({inputItems.length})
                        </div>
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto custom-scrollbar">
                            {inputItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5 group transition-colors hover:border-white/20">
                                    <div className="truncate flex-1 pr-2">
                                        <div className="text-xs truncate font-medium text-foreground/80">{item.meta?.title}</div>
                                        <div className="text-[9px] text-muted-foreground truncate">{item.meta?.detail}</div>
                                    </div>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-red-400 focus:text-red-400 cursor-pointer p-1 transition-opacity"
                                        onClick={() => onRemoveInput(item.id)}
                                        aria-label={`Remove ${item.meta?.title || "input"}`}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                            {inputItems.length === 0 && (
                                <div className="text-xs text-neutral-600 text-center py-6 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                                    {t("mainApp.noItemsInQueue")}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        className="w-full bg-neutral-100 hover:bg-white text-neutral-900 font-bold h-10 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-black/10 text-xs uppercase tracking-widest"
                        onClick={onCompleteInputs}
                        disabled={inputsLoading || inputsLocked || inputItems.length === 0}
                    >
                        {inputsLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {inputsLocked ? t("mainApp.inputsLocked") : t("mainApp.completeAndContinue")}
                    </Button>
                </div>
            )}
        </div>
    )
}
