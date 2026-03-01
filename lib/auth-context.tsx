'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export type UserRole = 'superadmin' | 'moderator' | 'admin' | 'client'

interface AuthContextType {
    user: User | null
    userRole: UserRole | null
    isAdmin: boolean
    isSuperAdmin: boolean
    isModerator: boolean
    isClient: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [userRole, setUserRole] = useState<UserRole | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const resolveRole = (currentUser: User | null): UserRole | null => {
            if (!currentUser) return null

            const role = currentUser.user_metadata?.role
            if (role === 'client') return 'client'
            if (role === 'superadmin') return 'superadmin'
            if (role === 'moderator') return 'moderator'

            // Assume 'admin' for backward compatibility if not client
            return 'admin'
        }

        // Initialize session
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const sessionUser = session?.user || null
            setUser(sessionUser)
            setUserRole(resolveRole(sessionUser))
            setIsLoading(false)
        }

        initSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const sessionUser = session?.user || null
                setUser(sessionUser)
                setUserRole(resolveRole(sessionUser))
                setIsLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
            }

            return { success: true }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
            return { success: false, error: errorMessage }
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                userRole,
                isAdmin: ['superadmin', 'admin', 'moderator'].includes(userRole as string),
                isSuperAdmin: ['superadmin', 'admin'].includes(userRole as string),
                isModerator: userRole === 'moderator',
                isClient: userRole === 'client',
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
