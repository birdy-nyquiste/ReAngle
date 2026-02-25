import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate, Link } from "react-router-dom"
import { Check, Sparkles, ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function PricingPage() {
    const navigate = useNavigate()
    const { user, session } = useAuth()
    const [upgradeLoading, setUpgradeLoading] = useState(false)
    const [upgradeError, setUpgradeError] = useState<string | null>(null)

    // Check if user is already Pro by fetching usage data
    // We rely on the action returned from the checkout session API to distinguish
    const handleUpgrade = async () => {
        if (!user || !session) {
            navigate("/register")
            return
        }

        setUpgradeError(null)
        setUpgradeLoading(true)
        try {
            const res = await fetch("/api/v1/payment/create-checkout-session", {
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
        } catch (err: any) {
            console.error("Failed to create checkout session:", err)
            setUpgradeError("Something went wrong. Please try again.")
            setUpgradeLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex flex-col bg-background aurora-bg">
            {/* Header */}
            <header className="floating-nav">
                <div className="container flex h-14 items-center px-6">
                    <Link to="/" className="flex items-center gap-2.5 font-bold text-lg">
                        <img src="/favicon.png" alt="ReAngle" className="h-8 w-8 rounded-lg" />
                        <span>ReAngle</span>
                    </Link>
                    <nav className="ml-auto flex items-center gap-3">
                        {user ? (
                            <>
                                <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => navigate("/profile")}>
                                    Profile
                                </Button>
                                <Button size="sm" className="cursor-pointer" onClick={() => navigate("/app")}>
                                    Open App
                                </Button>
                            </>
                        ) : (
                            <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => navigate("/login")}>
                                Login
                            </Button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Pricing Cards */}
            <main className="flex-1 flex items-center justify-center pt-24 pb-12">
                <div className="container max-w-4xl px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Simple pricing</h1>
                        <p className="text-muted-foreground">Start free, upgrade when you need more.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Free Plan */}
                        <div className="glass rounded-2xl p-6 flex flex-col">
                            <h3 className="text-lg font-semibold mb-1">Free</h3>
                            <div className="text-3xl font-bold mb-1">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                            <p className="text-sm text-muted-foreground mb-6">For trying things out</p>

                            <ul className="space-y-3 mb-8 flex-1">
                                {["5 rewrites per month", "All AI models", "All input formats", "Summary & comparison"].map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant="outline"
                                className="w-full bg-white/5 border-white/10 cursor-pointer"
                                onClick={() => navigate(user ? "/app" : "/register")}
                            >
                                {user ? "Go to App" : "Get Started"}
                            </Button>
                        </div>

                        {/* Pro Plan */}
                        <div className="glass rounded-2xl p-6 flex flex-col ring-2 ring-primary/50 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                    <Sparkles className="h-3 w-3" /> Popular
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold mb-1">Pro</h3>
                            <div className="text-3xl font-bold mb-1">$9.99<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                            <p className="text-sm text-muted-foreground mb-6">For power users</p>

                            <ul className="space-y-3 mb-8 flex-1">
                                {["Unlimited rewrites", "All AI models", "All input formats", "Summary & comparison", "Priority support", "TTS & Avatar"].map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full glow-primary hover:glow-primary-sm cursor-pointer"
                                onClick={user ? handleUpgrade : () => navigate("/register")}
                                disabled={upgradeLoading}
                            >
                                {upgradeLoading ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Please wait...</>
                                ) : (
                                    "Upgrade to Pro"
                                )}
                            </Button>

                            {upgradeError && (
                                <p className="text-xs text-red-400 mt-2 text-center">{upgradeError}</p>
                            )}
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                            <ArrowLeft className="h-3 w-3" />
                            Back to home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
