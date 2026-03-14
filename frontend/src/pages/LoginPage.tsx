import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import { useLanguage } from '@/context/LanguageContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const { t } = useLanguage()

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
            <main className="pt-header-offset flex flex-1 items-center justify-center pb-12">
                <div className="w-full max-w-sm mx-auto px-4">
                    <div className="glass rounded-2xl p-8">
                        <h1 className="text-2xl font-bold text-center mb-2">
                            {t('auth.loginTitle')}
                        </h1>
                        <p className="text-sm text-muted-foreground text-center mb-6">
                            {t('auth.loginSubtitle')}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                                    {t('auth.emailLabel')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder={t('auth.emailPlaceholder')}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                                    {t('auth.passwordLabel')}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder={t('auth.passwordPlaceholder')}
                                />
                            </div>

                            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                                {loading ? t('auth.signingIn') : t('auth.signIn')}
                            </Button>
                        </form>

                        <p className="text-sm text-muted-foreground text-center mt-6">
                            {t('auth.noAccount')}{' '}
                            <Link to="/register" className="text-primary hover:underline">
                                {t('auth.signUp')}
                            </Link>
                        </p>
                    </div>

                    <div className="text-center mt-4">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                            <ArrowLeft className="h-3 w-3" />
                            {t('common.backHome')}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
