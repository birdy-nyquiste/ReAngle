import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight, LogIn, Layers, Zap, Mic2, Filter, PenTool, Sparkles, LayoutDashboard, BrainCircuit } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function LandingPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 overflow-x-hidden font-sans">
            {/* Atmospheric Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[140px] mix-blend-screen animate-glow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[140px] mix-blend-screen animate-glow" style={{ animationDelay: '2s' }} />

                {/* Minimal Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />
            </div>

            {/* Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 backdrop-blur-md">
                <div className="container flex h-16 items-center px-6 mx-auto max-w-7xl">
                    <div className="flex items-center gap-3 font-bold text-xl tracking-tight font-heading cursor-pointer" onClick={() => navigate("/")}>
                        <img src="/favicon.png" alt="ReAngle" className="h-8 w-8 rounded-lg" />
                        <span>ReAngle</span>
                    </div>
                    <nav className="ml-auto flex items-center gap-4">
                        <Button
                            variant="ghost"
                            className="text-sm font-medium hover:bg-white/5"
                            onClick={() => navigate("/pricing")}
                        >
                            Pricing
                        </Button>
                        {user ? (
                            <>
                                <Button
                                    variant="ghost"
                                    className="text-sm font-medium hover:bg-white/5"
                                    onClick={() => navigate("/profile")}
                                >
                                    Profile
                                </Button>
                                <Button
                                    className="text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                                    onClick={() => navigate("/app")}
                                >
                                    Open App
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className="text-sm font-medium hover:bg-white/5 hidden sm:flex"
                                    onClick={() => navigate("/login")}
                                >
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Button>
                                <Button
                                    className="text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group"
                                    onClick={() => navigate("/register")}
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex flex-col relative z-10 pt-16">

                {/* --- Section 1: Hero --- */}
                <section className="min-h-[85vh] flex items-center justify-center pt-20 pb-16 px-4">
                    <div className="container max-w-5xl mx-auto flex flex-col items-center text-center gap-8">


                        <h1 className="animate-slide-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] font-heading">
                            Don't Consume the Narrative. <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 glow-primary">
                                ReAngle It.
                            </span>
                        </h1>

                        <p className="animate-slide-up delay-100 max-w-3xl text-lg sm:text-xl md:text-2xl text-muted-foreground/90 leading-relaxed font-light mt-2">
                            Events are objective. Narratives are constructed. We take multiple, noisy sources of a single event and reshape them into one unified, perfectly-angled article—in your exact voice and stance.
                        </p>

                        <div className="animate-slide-up delay-200 mt-6 flex flex-col sm:flex-row gap-4 items-center">
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg font-semibold rounded-full shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 group"
                                onClick={() => navigate(user ? "/app" : "/register")}
                            >
                                Start ReAngling Today
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* --- Section 2: The Insight --- */}
                <section className="py-24 px-4 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent relative border-y border-white/5">
                    <div className="container max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight tracking-tight">
                                Events are objective.<br />
                                <span className="text-muted-foreground">Narratives are constructed.</span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                The exact same fact can be heroized, scandalized, institutionalized, or entertained. You are reading prejudices processed by others every day.
                            </p>
                            <div className="pl-6 border-l-2 border-primary/50 text-xl font-medium italic text-foreground/80">
                                "Look at a mountain from the front, it's a ridge; from the side, a peak. Near, far, high, or low, no two views are identical."
                            </div>
                            <p className="text-lg text-foreground font-medium">
                                <span className="text-primary font-bold">Break the cycle.</span> ReAngle brings "Narrative Capability" to everyone, democratizing the power to disassemble, reconstruct, and design your own story out of the noise.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-violet-500/20 rounded-3xl blur-3xl opacity-50" />
                            <div className="glass-strong rounded-3xl p-8 relative overflow-hidden border border-white/10 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                                        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400"><Filter className="w-5 h-5" /></div>
                                        <div>
                                            <div className="font-semibold text-sm">Source A: Tech News</div>
                                            <div className="text-xs text-muted-foreground mt-1">"AI regulation stifles market innovation..."</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10 ml-8">
                                        <div className="p-3 rounded-lg bg-rose-500/20 text-rose-400"><Filter className="w-5 h-5" /></div>
                                        <div>
                                            <div className="font-semibold text-sm">Source B: Ethics Daily</div>
                                            <div className="text-xs text-muted-foreground mt-1">"Unchecked AI poses existential risk..."</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center py-2">
                                        <div className="h-10 border-l border-dashed border-white/20"></div>
                                    </div>

                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-primary/10 border border-primary/30 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                        <div className="p-3 rounded-lg bg-primary/20 text-primary"><PenTool className="w-5 h-5" /></div>
                                        <div>
                                            <div className="font-bold text-primary">Your ReAngled Narrative</div>
                                            <div className="text-sm text-foreground/80 mt-2 leading-relaxed">
                                                "While sweeping regulations aim to mitigate existential risks, they must be surgical to avoid crushing the rapid innovation cycle that defines our era."
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Section 3: How to ReAngle --- */}
                <section className="py-24 px-4 container max-w-6xl mx-auto text-center">
                    <div className="max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">How to ReAngle</h2>
                        <p className="text-xl text-muted-foreground">From the chaotic noise of the internet to a polished masterpiece in three simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="glass h-full rounded-3xl p-8 text-left hover:bg-white/10 transition-all duration-300 relative group">
                            <div className="absolute top-8 right-8 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none">01</div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                                <Layers className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 font-heading">Gather</h3>
                            <p className="text-muted-foreground leading-relaxed">Drop URLs, keywords, or documents. Feed the raw, conflicting events from around the web into the engine.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="glass h-full rounded-3xl p-8 text-left hover:bg-white/10 transition-all duration-300 relative group">
                            <div className="absolute top-8 right-8 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none">02</div>
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
                                <BrainCircuit className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 font-heading">Set the Angle</h3>
                            <p className="text-muted-foreground leading-relaxed">Heroize? Criticize? Analyze? Dial in your parameters and choose the exact stance you want to take.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="glass h-full rounded-3xl p-8 text-left hover:bg-white/10 transition-all duration-300 relative group">
                            <div className="absolute top-8 right-8 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none">03</div>
                            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400">
                                <Sparkles className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 font-heading">ReAngle</h3>
                            <p className="text-muted-foreground leading-relaxed">Watch the engine spin facts through your unique perspective into a polished, unified long-form article.</p>
                        </div>
                    </div>
                </section>

                {/* --- Section 4: Features --- */}
                <section className="py-20 px-4 bg-muted/30 border-t border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                    <div className="container max-w-5xl mx-auto relative z-10">
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 tracking-tight">The Arsenal of Creation</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl">Everything you need to assert your narrative authority.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="glass-strong p-6 rounded-3xl flex flex-col justify-between group">
                                <div>
                                    <div className="mb-4 inline-flex p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                                        <LayoutDashboard className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 font-heading group-hover:text-primary transition-colors">The Angle Dials</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Infinite perspective templates. Objective analysis, harsh criticism, or humorous deconstruction. The perspective is yours to define.
                                    </p>
                                </div>
                            </div>

                            <div className="glass-strong p-6 rounded-3xl flex flex-col justify-between group">
                                <div>
                                    <div className="mb-4 inline-flex p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                                        <Mic2 className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 font-heading group-hover:text-primary transition-colors">Voice Cloning</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Ensure every reshaping of text carries the DNA of your brand. Our AI perfectly maps and mimics your unique writing tone.
                                    </p>
                                </div>
                            </div>

                            <div className="glass-strong p-6 rounded-3xl sm:col-span-2 flex flex-col md:flex-row items-center gap-6 group">
                                <div className="flex-1">
                                    <div className="mb-4 inline-flex p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 font-heading group-hover:text-primary transition-colors">Zero-Touch Automation</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        From complex, conflicting information to perfect long-form content. What used to take hours of painstaking research and drafting, compressed into a hundredfold leap in efficiency.
                                    </p>
                                </div>
                                <div className="w-full md:w-1/4 aspect-video md:aspect-[4/3] rounded-2xl glass flex items-center justify-center p-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                    <Zap className="w-12 h-12 text-primary/50 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Section 5: Who is ReAngling? --- */}
                <section className="py-24 px-4 container max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">Who is ReAngling?</h2>
                        <p className="text-xl text-muted-foreground">Democratizing narrative power across industries.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                            <h3 className="text-xl font-bold mb-3 text-white">Newsletter Creators</h3>
                            <p className="text-muted-foreground">Synthesize weekly news into sharp, long-form articles loaded with your personal insight and signature tone.</p>
                        </div>
                        <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                            <h3 className="text-xl font-bold mb-3 text-white">PR & Marketers</h3>
                            <p className="text-muted-foreground">Draft rapid market responses and press releases that perfectly align with and violently defend your brand's stance.</p>
                        </div>
                        <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                            <h3 className="text-xl font-bold mb-3 text-white">Analysts & Researchers</h3>
                            <p className="text-muted-foreground">Filter out industry noise and distill multiple reports into core research perspectives tailored to your firm's thesis.</p>
                        </div>
                    </div>
                </section>

                {/* --- Section 6: Final CTA --- */}
                <section className="py-32 px-4 relative overflow-hidden border-t border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

                    <div className="container max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter mb-8 leading-tight">
                            Take back the power of the narrative.
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                size="lg"
                                className="h-16 px-10 text-xl font-bold rounded-full shadow-[0_0_40px_-5px_var(--tw-shadow-color)] shadow-primary/50 hover:shadow-primary/80 transition-all duration-300"
                                onClick={() => navigate(user ? "/app" : "/register")}
                            >
                                Start using ReAngle
                                <ArrowRight className="ml-3 h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 relative z-10 bg-background/80 backdrop-blur-lg">
                <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 px-4 mx-auto">
                    <div className="flex items-center gap-3 font-bold text-lg text-foreground/80">
                        <img src="/favicon.png" alt="ReAngle" className="h-6 w-6 rounded" />
                        <span>ReAngle</span>
                    </div>



                    <p className="text-sm text-muted-foreground font-medium">
                        © 2026 ReAngle. Let narratives serve you.
                    </p>
                </div>
            </footer>
        </div>
    )
}
