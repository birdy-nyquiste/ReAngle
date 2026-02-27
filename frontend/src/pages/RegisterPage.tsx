import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import { useLanguage } from '@/context/LanguageContext'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { signUp } = useAuth()
    const { t } = useLanguage()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError(t('auth.passwordMismatch'))
            return
        }

        if (password.length < 6) {
            setError(t('auth.passwordTooShort'))
            return
        }

        setLoading(true)
        const { error } = await signUp(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex flex-col bg-background aurora-bg">
                <AppHeader />
                <main className="flex-1 flex items-center justify-center pt-24 pb-12">
                    <div className="w-full max-w-sm mx-auto px-4">
                        <div className="glass rounded-2xl p-8 text-center">
                            <h1 className="text-2xl font-bold mb-2">
                                {t('auth.registerSuccessTitle')}
                            </h1>
                            <p className="text-sm text-muted-foreground mb-6">
                                {t('auth.registerSuccessPrefix')} <strong>{email}</strong>.{" "}
                                {t('auth.registerSuccessSuffix')}
                            </p>
                            <Link to="/login">
                                <Button className="cursor-pointer">{t('auth.goToLogin')}</Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background aurora-bg">
            <AppHeader />

            {/* Form */}
            <main className="flex-1 flex items-center justify-center pt-24 pb-12">
                <div className="w-full max-w-sm mx-auto px-4">
                    <div className="glass rounded-2xl p-8">
                        <h1 className="text-2xl font-bold text-center mb-2">
                            {t('auth.registerTitle')}
                        </h1>
                        <p className="text-sm text-muted-foreground text-center mb-6">
                            {t('auth.registerSubtitle')}
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

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                                    {t('auth.confirmPasswordLabel')}
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder={t('auth.passwordPlaceholder')}
                                />
                            </div>

                            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                                {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
                            </Button>
                        </form>

                        <p className="text-sm text-muted-foreground text-center mt-6">
                            {t('auth.alreadyHaveAccount')}{' '}
                            <Link to="/login" className="text-primary hover:underline">
                                {t('auth.registerSignInLink')}
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
