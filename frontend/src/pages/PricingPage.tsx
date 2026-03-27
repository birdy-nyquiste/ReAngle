import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate, Link } from "react-router-dom"
import { Check, ArrowLeft, Loader2, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import AppHeader from "@/components/AppHeader"
import { useLanguage } from "@/context/LanguageContext"

export default function PricingPage() {
    const navigate = useNavigate()
    const { user, session } = useAuth()
    const [upgradeLoading, setUpgradeLoading] = useState(false)
    const [upgradeError, setUpgradeError] = useState<string | null>(null)
    const { t } = useLanguage()

    const handleUpgrade = async () => {
        if (!user || !session) {
            navigate("/register")
            return
        }

        setUpgradeError(null)
        setUpgradeLoading(true)
        try {
            const res = await fetch("/api/v2/payment/create-checkout-session", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session.access_token}`,
                },
            })
            if (!res.ok) throw new Error("Failed to create checkout session")
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Failed to create checkout session:", err)
            setUpgradeError(t('pricing.upgradeErrorGeneric'))
            setUpgradeLoading(false)
        }
    }

    const renderValue = (val: string, forceHighlight?: boolean) => {
        const isNegative = /Not Included|不包含|No incluido/i.test(val)
        const isPositive = /Included|包含|Incluido/i.test(val) && !isNegative

        if (isNegative) {
            return (
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 text-white/10 italic">
                    <X className="w-4 h-4" />
                    <span className="text-sm tracking-tight">{val}</span>
                </div>
            )
        }

        if (isPositive || forceHighlight) {
            return (
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 text-white">
                    <Check className="w-4 h-4 text-white/40" />
                    <span className="text-sm font-bold tracking-tight">{val}</span>
                </div>
            )
        }

        return (
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 text-white/60">
                <span className="text-sm font-medium tracking-tight">{val}</span>
            </div>
        )
    }

    const features = [
        { name: t("pricing.featWorkflow"), free: t("pricing.freeWorkflow"), pro: t("pricing.proWorkflow") },
        { name: t("pricing.featGenerations"), free: t("pricing.freeGenerations"), pro: t("pricing.proGenerations"), highlightPro: true },
        { name: t("pricing.featTTS"), free: t("pricing.freeTTS"), pro: t("pricing.proTTS") },
        { name: t("pricing.featAvatar"), free: t("pricing.freeAvatar"), pro: t("pricing.proAvatar") }
    ]

    return (
        <div className="min-h-screen flex flex-col prism-bg text-foreground selection:bg-white/10 selection:text-white overflow-x-hidden">
            <AppHeader />

            <main className="pt-header-offset flex flex-1 flex-col items-center pb-8 px-6 relative">
                <div className="container max-w-6xl">
                    <div className="text-center mb-8 pt-12 reveal-skew">
                        <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-bold tracking-tighter leading-none font-heading text-white">
                            {t("pricing.title")}
                        </h1>
                    </div>

                    <div className="glass-card rounded-[2.5rem] border border-white/[0.05] overflow-hidden shadow-2xl relative reveal-skew animation-delay-100">
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

                        {/* Top Headers */}
                        <div className="grid grid-cols-3 border-b border-white/[0.05] relative z-10 bg-white/[0.02] backdrop-blur-3xl">
                            <div className="p-12 flex items-end">
                                <span className="text-xs font-bold text-white/20 tracking-[0.3em] uppercase font-heading">Features</span>
                            </div>

                            {/* Free Header */}
                            <div className="p-12 flex flex-col items-center justify-end text-center border-l border-white/[0.05] relative">
                                <h3 className="text-2xl font-bold mb-4 font-heading text-white/80">{t('pricing.freeTitle')}</h3>
                                <div className="text-5xl font-bold mb-10 text-white tracking-tighter">$0<span className="text-xs font-bold text-white/20 uppercase tracking-widest ml-1">/mo</span></div>
                                <Button
                                    variant="outline"
                                    className="w-full max-w-[200px] h-12 bg-white/5 hover:bg-white/[0.08] border-white/10 text-white transition-all rounded-sm font-bold text-xs uppercase tracking-widest pointer-events-auto"
                                    onClick={() => navigate(user ? "/app" : "/register")}
                                >
                                    {user ? t('pricing.freeCtaGoToApp') : t('pricing.freeCtaGetStarted')}
                                </Button>
                            </div>

                            {/* Pro Header */}
                            <div className="p-12 flex flex-col items-center justify-end text-center border-l border-white/[0.1] bg-white/[0.04] relative">
                                <div className="absolute top-0 inset-x-0 h-[2px] bg-white opacity-40" />
                                <h3 className="text-2xl font-bold mb-4 font-heading text-white">{t('pricing.proTitle')}</h3>
                                <div className="text-5xl font-bold mb-10 text-white tracking-tighter">$9.99<span className="text-xs font-bold text-white/20 uppercase tracking-widest ml-1">/mo</span></div>
                                <Button
                                    className="w-full max-w-[200px] h-12 border-0 bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-sm font-bold text-xs uppercase tracking-widest pointer-events-auto shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                                    onClick={user ? handleUpgrade : () => navigate("/register")}
                                    disabled={upgradeLoading}
                                >
                                    {upgradeLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        t('pricing.proCta')
                                    )}
                                </Button>
                                {upgradeError && (
                                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-4 absolute -bottom-6 w-full text-center">{upgradeError}</p>
                                )}
                            </div>
                        </div>

                        {/* Feature Rows */}
                        <div className="divide-y divide-white/[0.03] relative z-10 bg-white/[0.01]">
                            {features.map((feature, i) => (
                                <div key={i} className="grid grid-cols-3 hover:bg-white/[0.02] transition-colors group">
                                    {/* Feature Name */}
                                    <div className="p-8 md:p-10 flex items-center text-sm font-bold text-white/40 tracking-tight transition-colors group-hover:text-white">
                                        {feature.name}
                                    </div>
                                    {/* Free Value */}
                                    <div className="p-8 md:p-10 flex items-center justify-center text-center border-l border-white/[0.03]">
                                        {renderValue(feature.free)}
                                    </div>
                                    {/* Pro Value */}
                                    <div className="p-8 md:p-10 flex items-center justify-center text-center border-l border-white/[0.05] bg-white/[0.02]">
                                        {renderValue(feature.pro, feature.highlightPro)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-24 reveal-skew animation-delay-300">
                        <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-white/60 inline-flex items-center gap-4 group transition-colors">
                            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-2 transition-transform" />
                            {t('common.backHome')}
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="py-12 px-6 flex flex-col items-center text-center text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase border-t border-white/[0.03] relative z-10">
                <div className="container max-w-7xl mx-auto flex flex-col items-center justify-center">
                    <span>{t("landing.footerCopy")}</span>
                </div>
            </footer>
        </div>
    )
}
