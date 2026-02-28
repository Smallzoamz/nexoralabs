'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, AuthProvider } from '@/lib/auth-context'
import { ModalProvider } from '@/lib/modal-context'
import { AccountSettingsModal } from '@/components/admin/AccountSettingsModal'
import { Settings, LogOut } from 'lucide-react'

function AdminContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isAdmin, isClient, isLoading, user, logout } = useAuth()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && isAuthenticated && isClient) {
            router.push('/client')
        }
    }, [isLoading, isAuthenticated, isClient, router])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isLoading, isAuthenticated, router])

    if (isLoading || !isAuthenticated || !isAdmin) {
        return null // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Top Navigation */}
            <header className="bg-white border-b border-secondary-200 sticky top-0 z-40">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-primary-600">VELOZI | Dev</h1>
                        <span className="text-secondary-400">|</span>
                        <span className="text-secondary-600">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="text-right flex flex-col justify-center">
                            <p className="text-sm font-medium text-secondary-900 leading-tight">
                                {user?.user_metadata?.name || 'Administrator'}
                            </p>
                            <p className="text-xs text-secondary-500 mt-0.5">{user?.email}</p>
                        </div>

                        <div className="flex items-center gap-2 border-l border-secondary-200 pl-4">
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                                title="ตั้งค่าบัญชี"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                            <button
                                onClick={logout}
                                className="p-2 text-secondary-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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

            {/* Account Settings Modal */}
            <AccountSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    )
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <ModalProvider>
                <AdminContent>{children}</AdminContent>
            </ModalProvider>
        </AuthProvider>
    )
}
