import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { LogOut, CreditCard, BarChart3 } from "lucide-react"

interface UsageData {
    usage_count: number
    usage_limit: number
    subscription: {
        status: string
        price_id: string
        current_period_end: string
        cancel_at_period_end: boolean
        cancel_at: string | null
    } | null
}

export default function ProfilePage() {
    const navigate = useNavigate()
    const { user, session, signOut } = useAuth()
    const [usage, setUsage] = useState<UsageData | null>(null)
    const [loading, setLoading] = useState(true)
    const [portalLoading, setPortalLoading] = useState(false)

    useEffect(() => {
        fetchUsage()
    }, [])

    const fetchUsage = async () => {
        if (!session) return
        try {
            const res = await fetch("/api/v1/payment/usage", {
                headers: { "Authorization": `Bearer ${session.access_token}` },
            })
            if (res.ok) {
                const data = await res.json()
                setUsage(data)
            }
        } catch (err) {
            console.error("Failed to fetch usage:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleManageSubscription = async () => {
        if (!session) return
        setPortalLoading(true)
        try {
            const res = await fetch("/api/v1/payment/create-portal-session", {
                method: "POST",
                headers: { "Authorization": `Bearer ${session.access_token}` },
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (err) {
            console.error("Failed to create portal session:", err)
        } finally {
            setPortalLoading(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate("/")
    }

    const isProPlan = usage?.subscription?.status === "active" || usage?.subscription?.status === "trialing"
    const isCancelled = isProPlan && !!usage?.subscription?.cancel_at
    const periodEnd = (() => {
        const rawDate = isCancelled
            ? usage?.subscription?.cancel_at
            : usage?.subscription?.current_period_end
        if (!rawDate) return null
        return new Date(rawDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    })()
    const usageLimitDisplay = usage?.usage_limit === -1 ? "∞" : usage?.usage_limit ?? 5
    const usagePercent = usage?.usage_limit === -1 ? 0 : ((usage?.usage_count ?? 0) / (usage?.usage_limit ?? 5)) * 100

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
                        <Button size="sm" className="cursor-pointer" onClick={() => navigate("/app")}>
                            Open App
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-start justify-center pt-24 pb-12">
                <div className="container max-w-lg px-4 space-y-6">
                    {/* Account Card */}
                    <div className="glass rounded-2xl p-6">
                        <h1 className="text-xl font-bold mb-4">Account</h1>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Email</span>
                                <span className="text-sm font-medium">{user?.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Plan</span>
                                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${isProPlan
                                    ? "bg-primary/10 text-primary"
                                    : "bg-white/10 text-muted-foreground"
                                    }`}>
                                    {loading ? "..." : isProPlan ? "Pro" : "Free"}
                                </span>
                            </div>
                            {periodEnd && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {isCancelled ? "Expires" : "Renews"}
                                    </span>
                                    <span className="text-sm font-medium">{periodEnd}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Usage Card */}
                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            <h2 className="text-lg font-semibold">Usage</h2>
                        </div>

                        {loading ? (
                            <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Rewrites used</span>
                                    <span className="font-medium">{usage?.usage_count ?? 0} / {usageLimitDisplay}</span>
                                </div>

                                {usage?.usage_limit !== -1 && (
                                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${usagePercent >= 90 ? "bg-red-500" : usagePercent >= 70 ? "bg-amber-500" : "bg-primary"
                                                }`}
                                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Subscription Card */}
                    {!loading && (
                        <div className={`glass rounded-2xl p-6 ${isProPlan ? (isCancelled ? "ring-2 ring-amber-500/40" : "ring-2 ring-primary/30") : ""
                            }`}>
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="h-4 w-4 text-primary" />
                                <h2 className="text-lg font-semibold">Subscription</h2>
                            </div>

                            {isProPlan ? (
                                <>
                                    {/* Cancelled warning */}
                                    {isCancelled && periodEnd && (
                                        <div className="mb-4 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                                            Your Pro plan is active until <span className="font-semibold">{periodEnd}</span>. After that, you'll be moved to the Free plan.
                                        </div>
                                    )}

                                    {/* Renewing info */}
                                    {!isCancelled && periodEnd && (
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Your plan renews on <span className="font-medium text-foreground">{periodEnd}</span>.
                                        </p>
                                    )}

                                    <Button
                                        variant="outline"
                                        className="w-full bg-white/5 border-white/10 cursor-pointer"
                                        onClick={handleManageSubscription}
                                        disabled={portalLoading}
                                    >
                                        {portalLoading ? "Opening..." : "Manage Subscription"}
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                        {isCancelled
                                            ? "Reactivate, update payment method, or view invoices"
                                            : "Update payment method, cancel, or view invoices"}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Get unlimited rewrites, TTS & Avatar for $9.99/mo.
                                    </p>
                                    <Button
                                        className="w-full cursor-pointer"
                                        onClick={() => navigate("/pricing")}
                                    >
                                        View Plans
                                    </Button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Sign Out */}
                    <Button
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </main>
        </div>
    )
}
