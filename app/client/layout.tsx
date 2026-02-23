'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, AuthProvider } from '@/lib/auth-context'
import { ModalProvider } from '@/lib/modal-context'
import { LogOut } from 'lucide-react'

function ClientContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isAdmin, isClient, isLoading, user, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && isAuthenticated && isAdmin) {
            // Admins should be redirected out of the client portal
            router.push('/admin')
        }
    }, [isLoading, isAuthenticated, isAdmin, router])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isLoading, isAuthenticated, router])

    if (isLoading || !isAuthenticated || !isClient) {
        return null // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation for Client */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-indigo-600">Nexora Labs</h1>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">Customer Portal</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="text-right flex flex-col justify-center">
                            <p className="text-sm font-medium text-gray-900 leading-tight">
                                {user?.user_metadata?.name || 'Customer'}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                        </div>

                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                            <button
                                onClick={logout}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                title="ออกจากระบบ"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ModalProvider>
                <ClientContent>{children}</ClientContent>
            </ModalProvider>
        </AuthProvider>
    )
}
