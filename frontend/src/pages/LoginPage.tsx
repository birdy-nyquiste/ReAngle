import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import AppHeader from '@/components/AppHeader'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const { error } = await signIn(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate('/app')
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background aurora-bg">
            <AppHeader />

            {/* Form */}
            <main className="flex-1 flex items-center justify-center pt-24 pb-12">
                <div className="w-full max-w-sm mx-auto px-4">
                    <div className="glass rounded-2xl p-8">
                        <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
                        <p className="text-sm text-muted-foreground text-center mb-6">
                            Sign in to your account
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="••••••••"
                                />
                            </div>

                            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <p className="text-sm text-muted-foreground text-center mt-6">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="text-center mt-4">
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
