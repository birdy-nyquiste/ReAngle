import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Layers, Zap, Mic2, Filter, PenTool, Sparkles, LayoutDashboard, BrainCircuit, Users } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import AppHeader from "@/components/AppHeader"
import { useLanguage } from "@/context/LanguageContext"

// Static background — hoisted outside component to avoid recreation on every render
const AtmosphericBackground = (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[140px] mix-blend-screen animate-glow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[140px] mix-blend-screen animate-glow" style={{ animationDelay: '2s' }} />
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
        />
    </div>
)

// Preload route on hover for perceived speed
const preloadRegister = () => import("./RegisterPage")
const preloadApp = () => import("./MainApp")

export default function LandingPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useLanguage()

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 overflow-x-hidden font-sans">
            {/* Atmospheric Background — hoisted static JSX */}
            {AtmosphericBackground}

            <AppHeader />

            <main className="flex-1 flex flex-col relative z-10 pt-16">

                {/* --- Section 1: Hero --- */}
                <section className="min-h-[85vh] flex items-center justify-center pt-20 pb-16 px-4">
                    <div className="container max-w-5xl mx-auto flex flex-col items-center text-center gap-8">


                        <h1 className="animate-slide-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] font-heading">
                            {t("landing.heroTitleLine1")} <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                                {t("landing.heroTitleLine2")}
                            </span>
                        </h1>

                        <p className="animate-slide-up delay-100 max-w-3xl text-lg sm:text-xl md:text-2xl text-muted-foreground/90 leading-relaxed font-light mt-2">
                            {t("landing.heroSubheadline")}
                        </p>

                        <div className="animate-slide-up delay-200 mt-6 flex flex-col sm:flex-row gap-4 items-center">
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg font-semibold rounded-full shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 group"
                                onClick={() => navigate(user ? "/app" : "/register")}
                                onMouseEnter={user ? preloadApp : preloadRegister}
                                onFocus={user ? preloadApp : preloadRegister}
                            >
                                {t("landing.heroCta")}
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
                                {t("landing.insightTitle1")}<br />
                                <span className="text-muted-foreground">{t("landing.insightTitle2")}</span>
                            </h2>
                            <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                                <p>{t("landing.insightSameEventCanBe")}</p>
                                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-medium text-foreground/80 py-2">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("landing.insightHeroized")}</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("landing.insightMoralized")}</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("landing.insightScandalized")}</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("landing.insightInstitutionalized")}</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("landing.insightIdeologized")}</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {t("landing.insightEntertained")}</li>
                                </ul>
                            </div>
                            <div className="pl-6 border-l-2 border-primary/50 text-xl font-medium italic text-foreground/80">
                                {t("landing.insightQuote")}
                            </div>
                            <p className="text-lg text-foreground font-medium">
                                {t("landing.insightReasonPrefix")}{" "}
                                <span className="text-primary font-bold">{t("landing.insightReasonHighlight")}</span>
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-violet-500/20 rounded-3xl blur-3xl opacity-50" />
                            <div className="glass-strong rounded-3xl p-8 relative overflow-hidden border border-white/10 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                                        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400"><Filter className="w-5 h-5" /></div>
                                        <div>
                                            <div className="font-semibold text-sm">{t("landing.insightSourceA")}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{t("landing.insightSourceAQuote")}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10 ml-8">
                                        <div className="p-3 rounded-lg bg-rose-500/20 text-rose-400"><Filter className="w-5 h-5" /></div>
                                        <div>
                                            <div className="font-semibold text-sm">{t("landing.insightSourceB")}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{t("landing.insightSourceBQuote")}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center py-2">
                                        <div className="h-10 border-l border-dashed border-white/20"></div>
                                    </div>

                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-primary/10 border border-primary/30 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                        <div className="p-3 rounded-lg bg-primary/20 text-primary"><PenTool className="w-5 h-5" /></div>
                                        <div>
                                            <div className="font-bold text-primary">{t("landing.insightYourNarrative")}</div>
                                            <div className="text-sm text-foreground/80 mt-2 leading-relaxed">
                                                {t("landing.insightYourNarrativeQuote")}
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
                                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
                                    {t("landing.engineTitle")}
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {t("landing.engineIntro")}
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
                                <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">
                                    {t("landing.engineFeature1Title")}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {t("landing.engineFeature1Desc")}
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                                    <Mic2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">
                                    {t("landing.engineFeature2Title")}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {t("landing.engineFeature2Desc")}
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">
                                    {t("landing.engineFeature3Title")}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {t("landing.engineFeature3Desc")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Section 4: How to ReAngle --- */}
                <section className="py-24 px-4 container max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
                                {t("landing.howToTitle")}
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t("landing.howToIntro")}
                            </p>
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
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">
                                {t("landing.howToStep1Title")}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {t("landing.howToStep1Desc")}
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="absolute top-8 right-8 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none">02</div>
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">
                                {t("landing.howToStep2Title")}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {t("landing.howToStep2Desc")}
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="absolute top-8 right-8 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none">03</div>
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">
                                {t("landing.howToStep3Title")}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {t("landing.howToStep3Desc")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- Section 5: Who is ReAngling? --- */}
                <section className="py-24 px-4 container max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
                                {t("landing.whoTitle")}
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t("landing.whoIntro")}
                            </p>
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
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">
                                {t("landing.whoAudience1Title")}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {t("landing.whoAudience1Desc")}
                            </p>
                        </div>

                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                                <Mic2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">
                                {t("landing.whoAudience2Title")}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {t("landing.whoAudience2Desc")}
                            </p>
                        </div>

                        <div className="glass-strong p-8 rounded-3xl group hover:-translate-y-1 transition-transform duration-300 relative">
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                                <Filter className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading text-foreground group-hover:text-primary transition-colors">
                                {t("landing.whoAudience3Title")}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {t("landing.whoAudience3Desc")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- Section 6: Final CTA --- */}
                <section className="py-32 px-4 relative overflow-hidden border-t border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

                    <div className="container max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter mb-8 leading-tight">
                            {t("landing.finalCtaTitle")}
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                size="lg"
                                className="h-16 px-10 text-xl font-bold rounded-full shadow-[0_0_40px_-5px_var(--tw-shadow-color)] shadow-primary/50 hover:shadow-primary/80 transition-all duration-300"
                                onClick={() => navigate(user ? "/app" : "/register")}
                                onMouseEnter={user ? preloadApp : preloadRegister}
                                onFocus={user ? preloadApp : preloadRegister}
                            >
                                {t("landing.finalCtaButton")}
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
                        {t("landing.footerCopy")}
                    </p>
                </div>
            </footer>
        </div>
    )
}
