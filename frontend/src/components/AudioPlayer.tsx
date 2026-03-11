import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
    audioUrl: string
    onDownload?: () => void
    className?: string
}

export function AudioPlayer({ audioUrl, onDownload, className }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const setAudioData = () => {
            setDuration(audio.duration)
            setCurrentTime(audio.currentTime)
        }

        const setAudioTime = () => setCurrentTime(audio.currentTime)
        const handleEnded = () => setIsPlaying(false)

        audio.addEventListener("loadeddata", setAudioData)
        audio.addEventListener("timeupdate", setAudioTime)
        audio.addEventListener("ended", handleEnded)

        return () => {
            audio.removeEventListener("loadeddata", setAudioData)
            audio.removeEventListener("timeupdate", setAudioTime)
            audio.removeEventListener("ended", handleEnded)
        }
    }, [audioUrl])

    const togglePlayPause = () => {
        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    const toggleMute = () => {
        const audio = audioRef.current
        if (!audio) return

        audio.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const handleVolumeChange = (value: number[]) => {
        const audio = audioRef.current
        if (!audio) return

        const newVolume = value[0]
        audio.volume = newVolume
        setVolume(newVolume)
        if (newVolume === 0) {
            setIsMuted(true)
            audio.muted = true
        } else if (isMuted) {
            setIsMuted(false)
            audio.muted = false
        }
    }

    const handleProgressChange = (value: number[]) => {
        const audio = audioRef.current
        if (!audio) return

        const newTime = value[0]
        audio.currentTime = newTime
        setCurrentTime(newTime)
    }

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return "0:00"
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = Math.floor(timeInSeconds % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    return (
        <div className={cn("flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2", className)}>
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full hover:bg-white/10 text-primary hover:text-primary transition-colors cursor-pointer"
                onClick={togglePlayPause}
            >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>

            <div className="flex-1 min-w-[40px] px-1">
                <Slider
                    defaultValue={[0]}
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleProgressChange}
                    className="cursor-pointer"
                />
            </div>

            <div className="flex items-center gap-1 shrink-0 px-1 select-none">
                <span className="text-[10px] font-medium tabular-nums text-foreground/70 min-w-[28px] text-right">
                    {formatTime(currentTime)}
                </span>
                <span className="text-[10px] text-muted-foreground/40">/</span>
                <span className="text-[10px] font-medium tabular-nums text-muted-foreground min-w-[28px]">
                    {formatTime(duration)}
                </span>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    onClick={toggleMute}
                >
                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <div className="w-14 hidden lg:block mr-1">
                    <Slider
                        defaultValue={[1]}
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="cursor-pointer"
                    />
                </div>

                {onDownload && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        onClick={onDownload}
                        title="Download Audio"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
