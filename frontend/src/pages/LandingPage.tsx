import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight, LogIn, Layers, Zap, Mic2, Filter, PenTool, Sparkles, LayoutDashboard, BrainCircuit, Users } from "lucide-react"
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
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
                            <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                                <p>The exact same objective event can be:</p>
                                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-medium text-foreground/80 py-2">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Heroized</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Moralized</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Scandalized</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Institutionalized</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Ideologized</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Entertained</li>
                                </ul>
                            </div>
                            <div className="pl-6 border-l-2 border-primary/50 text-xl font-medium italic text-foreground/80">
                                "Look at a mountain from the front, it's a ridge; from the side, a peak. Near, far, high, or low, no two views are identical."
                            </div>
                            <p className="text-lg text-foreground font-medium">
                                In the flood of the information explosion, most people are merely passive consumers; they lack the capability to disassemble, reconstruct, or actively design their own narratives. <span className="text-primary font-bold">This is the very reason ReAngle was born.</span>
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

                {/* --- Section 3: The Narrative Engine --- */}
                <section className="py-24 px-4 bg-muted/30 border-t border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="container max-w-5xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                            <div className="flex-1">
                                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">The Narrative Engine</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Not just another AI summarization tool. ReAngle is a purpose-built engine granting you absolute control over how a story is told and distributed.
                                </p>
                            </div>
                            <div className="hidden md:flex flex-shrink-0 w-32 h-32 rounded-full border border-white/10 glass-strong items-center justify-center relative">
                                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                                <BrainCircuit className="w-10 h-10 text-primary animate-pulse" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                                    <LayoutDashboard className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">Re-tell The Story</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Refuse to accept pre-packaged viewpoints. Change the angle of observation and re-tell the story yourself.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                                    <Mic2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">Productized Capability</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Narrative capability is no longer the exclusive privilege of PR giants. We encapsulate it into an accessible service for creators.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">Streamlined Workflow</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Compress hours of cross-referencing, multi-source research, and drafting into just a few clicks.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Section 4: How to ReAngle --- */}
                <section className="py-24 px-4 container max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">How to ReAngle</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">From the chaotic noise of the internet to a polished masterpiece in three simple steps.</p>
                        </div>
                        <div className="hidden md:flex flex-shrink-0 w-32 h-32 rounded-full border border-white/10 glass-strong items-center justify-center relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="absolute top-8 right-8 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none">01</div>
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">Gather</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Toss in a bunch of URLs, Youtube, PDF, or plain text, throwing the chaos of the internet into the engine.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="absolute top-8 right-8 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none">02</div>
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">Set the Angle</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Heroize? Criticize? Analyze? Dial in your parameters and choose the exact stance you want to take.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="absolute top-8 right-8 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none">03</div>
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">ReAngle</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Watch the engine spin facts through your unique perspective into a polished, unified long-form article.</p>
                        </div>
                    </div>
                </section>

                {/* --- Section 5: Who is ReAngling? --- */}
                <section className="py-24 px-4 container max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">Who is ReAngling?</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">Democratizing narrative power across industries.</p>
                        </div>
                        <div className="hidden md:flex flex-shrink-0 w-32 h-32 rounded-full border border-white/10 glass-strong items-center justify-center relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                            <Users className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                                <PenTool className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">Newsletter & Content Creators</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Synthesize weekly news into sharp, insightful long-form pieces layered with a personal signature tone.</p>
                        </div>

                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                                <Mic2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">PR & Digital Marketers</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Draft rapid, market-ready responses and press releases that vehemently align with and defend brand positioning.</p>
                        </div>

                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                                <Filter className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">Analysts & Researchers</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Filter out industry hysteria to distill multiple data sources into core research perspectives tailored to a specific firm's thesis.</p>
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
