import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * 保护路由组件。
 * 未登录用户会被重定向到 /login。
 * 加载中时显示简单的 loading 状态。
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}
