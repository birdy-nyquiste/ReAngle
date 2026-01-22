import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight, FileText, Sparkles, Zap } from "lucide-react"

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col bg-background aurora-bg">
            {/* Floating Navigation */}
            <header className="floating-nav">
                <div className="container flex h-14 items-center px-6">
                    <div className="flex items-center gap-2.5 font-bold text-lg">
                        <img src="/favicon.png" alt="ReAngle" className="h-8 w-8 rounded-lg" />
                        <span>ReAngle</span>
                    </div>
                    <nav className="ml-auto">
                        {/* Clean nav - no extra links */}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col">
                <section className="flex-1 flex items-center justify-center pt-24 pb-12">
                    <div className="container flex max-w-4xl flex-col items-center gap-8 text-center px-4">
                        {/* Badge */}
                        <div className="animate-fade-in">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                <Sparkles className="h-3.5 w-3.5" />
                                AI-Powered Content Transformation
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="animate-slide-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                            Same Story,{" "}
                            <span className="gradient-text">
                                Fresh Angle
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="animate-slide-up delay-100 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                            Transform your articles with AI precision. Rewrite content to match any tone,
                            style, or audience—while keeping the core message intact.
                        </p>

                        {/* CTA Button */}
                        <div className="animate-slide-up delay-200 pt-4">
                            <Button
                                size="lg"
                                className="text-base px-8 glow-primary hover:glow-primary-sm cursor-pointer"
                                onClick={() => navigate("/app")}
                            >
                                Start Rewriting
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container py-16 md:py-24">
                    <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
                        {/* Feature 1 */}
                        <div className="group glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                            <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Smart Rewriting</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Powered by GPT-5, Gemini, and more. Adapt content to any style,
                                tone, or audience with a single click.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                            <div className="mb-4 inline-flex p-3 rounded-xl bg-violet-500/10">
                                <FileText className="h-6 w-6 text-violet-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Multi-Format Input</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Process text, PDFs, Word documents, URLs, and even YouTube
                                videos. All in one place.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1">
                            <div className="mb-4 inline-flex p-3 rounded-xl bg-cyan-500/10">
                                <Zap className="h-6 w-6 text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Instant Analysis</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Get summaries, side-by-side comparisons, and readability
                                metrics in seconds.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8">
                <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <img src="/favicon.png" alt="ReAngle" className="h-5 w-5 rounded" />
                        <span>ReAngle</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © 2026 ReAngle. Built for content creators.
                    </p>
                </div>
            </footer>
        </div>
    )
}
