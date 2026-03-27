import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight, FolderInput, Triangle, Wand2, BookOpen, Activity, Eye } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import AppHeader from "@/components/AppHeader"
import { useLanguage } from "@/context/LanguageContext"

// Preload routes
const preloadRegister = () => import("./RegisterPage")
const preloadApp = () => import("./MainApp")

export default function LandingPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useLanguage()

    return (
        <div className="min-h-screen flex flex-col prism-bg text-foreground selection:bg-white/10 selection:text-white overflow-x-hidden">
            <AppHeader />

            <main className="relative z-10 flex flex-1 flex-col pb-32 pt-header-offset">

                {/* --- Section 1: Hero (Refractive Display) --- */}
                <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                        <div className="scanning-bar" />
                    </div>

                    <div className="container max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-8 flex flex-col items-start translate-x-0 lg:-translate-x-12">
                            <h1 className="text-[clamp(4.5rem,14vw,11.5rem)] font-bold tracking-tighter leading-[0.85] font-heading mb-12 reveal-skew">
                                {t("landing.heroTitleLine1")}
                            </h1>

                            <div className="max-w-2xl mb-16 reveal-skew animation-delay-100">
                                <span className="text-[clamp(1.25rem,3vw,2.25rem)] font-light leading-snug text-white/50 block">
                                    {t("landing.heroTitleLine2").split(' ').map((word, i) => {
                                        const cleanWord = word.replace(/[.,]/g, '').toLowerCase()
                                        const isHighlight = cleanWord === 'reframe' || cleanWord === 'angle'
                                        return (
                                            <span key={i} className={isHighlight ? "font-bold text-white underline decoration-white/20 decoration-2 underline-offset-8" : ""}>
                                                {word}{' '}
                                            </span>
                                        )
                                    })}
                                </span>
                            </div>

                            <div className="reveal-skew animation-delay-200">
                                <Button
                                    size="lg"
                                    className="h-16 px-12 text-xl font-medium rounded-sm shadow-2xl hover:bg-white hover:text-black transition-all duration-500 group bg-white/5 text-white backdrop-blur-xl border border-white/10"
                                    onClick={() => navigate(user ? "/app" : "/register")}
                                    onMouseEnter={user ? preloadApp : preloadRegister}
                                >
                                    {t("landing.heroCta")}
                                    <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </div>
                        </div>

                        <div className="hidden lg:col-span-4 lg:flex justify-end pr-12 reveal-skew animation-delay-300">
                            <div className="w-px h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                        </div>
                    </div>
                </section>


                {/* --- Section 2: Core Steps (Kinetic Grid) --- */}
                <section className="py-12 px-6 relative border-y border-white/[0.03]">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex flex-col mb-24 space-y-8">
                            <h2 className="text-[clamp(3.5rem,6vw,5.5rem)] font-bold font-heading leading-none tracking-tighter text-white">
                                {t("landing.engineTitle")}
                            </h2>
                            <div className="h-1.5 w-16 bg-white/10 rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    {
                                        id: "01",
                                        icon: <FolderInput className="w-5 h-5" />,
                                        title: t("landing.engineFeature1Title"),
                                        desc: t("landing.engineFeature1Desc"),
                                    },
                                    {
                                        id: "02",
                                        icon: <Triangle className="w-5 h-5" />,
                                        title: t("landing.engineFeature2Title"),
                                        desc: t("landing.engineFeature2Desc"),
                                    },
                                    {
                                        id: "03",
                                        icon: <Wand2 className="w-5 h-5" />,
                                        title: t("landing.engineFeature3Title"),
                                        desc: t("landing.engineFeature3Desc"),
                                    }
                                ].map((feature, i) => (
                                    <div key={i} className="group glass-card p-12 transition-all duration-700 hover:bg-white/[0.03] hover:border-white/10 overflow-hidden relative">
                                        <span className="absolute -right-8 -bottom-8 text-9xl font-bold text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-700 select-none">
                                            {feature.id}
                                        </span>
                                        <div className="relative z-10 space-y-8">
                                            <div className="p-4 rounded-full bg-white/5 w-fit border border-white/5 transition-colors group-hover:border-white/20">
                                                {feature.icon}
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-bold font-heading text-white">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-xl text-white/50 font-light leading-relaxed max-w-md">
                                                    {feature.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>


                {/* --- Section 3: Glossary (Term Index) --- */}
                <section className="py-12 px-6">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex flex-col mb-24">
                            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-bold font-heading leading-tight tracking-tighter text-white">
                                {t("landing.howToTitle")}
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-px bg-white/[0.05] border border-white/[0.05] shadow-2xl overflow-hidden rounded-[2rem]">
                            {[
                                {
                                    icon: <BookOpen className="w-5 h-5" />,
                                    title: t("landing.howToStep1Title"),
                                    desc: t("landing.howToStep1Desc"),
                                },
                                {
                                    icon: <Activity className="w-5 h-5" />,
                                    title: t("landing.howToStep2Title"),
                                    desc: t("landing.howToStep2Desc"),
                                },
                                {
                                    icon: <Eye className="w-5 h-5" />,
                                    title: t("landing.howToStep3Title"),
                                    desc: t("landing.howToStep3Desc"),
                                }
                            ].map((feature, i) => (
                                <div key={i} className="p-16 bg-[#050505] hover:bg-white/[0.01] transition-colors group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                                    <div className="mb-12 text-white/40 group-hover:text-white transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-6 font-heading text-white group-hover:translate-x-1 transition-transform">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg text-white/50 leading-relaxed font-light">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Final CTA (Darkness to Light) */}
                <section className="py-16 px-6 relative text-center overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-white/[0.03] blur-[200px] rounded-full pointer-events-none" />
                    <div className="relative z-10 max-w-5xl mx-auto space-y-16">
                        <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[1.1] tracking-tighter text-white">
                            {t("landing.finalCtaTitle")}
                        </h2>
                        <Button
                            size="lg"
                            className="h-20 px-16 text-2xl font-medium rounded-sm transition-all duration-700 bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_100px_rgba(255,255,255,0.1)]"
                            onClick={() => navigate(user ? "/app" : "/register")}
                        >
                            {t("landing.finalCtaButton")}
                            <ArrowRight className="ml-4 h-7 w-7" />
                        </Button>
                    </div>
                </section>

            </main>

            <footer className="py-12 px-6 flex flex-col items-center text-center text-xs font-bold tracking-widest text-white/20 uppercase border-t border-white/[0.03] relative z-10">
                <div className="container max-w-7xl mx-auto flex flex-col items-center justify-center">
                    <span>{t("landing.footerCopy")}</span>
                </div>
            </footer>
        </div>
    )
}
