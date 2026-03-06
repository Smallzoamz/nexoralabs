'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Lock, Eye, EyeOff, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

function UpdatePasswordContent() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const checkSession = async () => {
            // Wait for Supabase to process the URL hash
            await new Promise(resolve => setTimeout(resolve, 500))

            const { data: { session } } = await supabase.auth.getSession()

            // Check if there's a hash token in the URL
            const hasHashToken = window.location.hash.includes('access_token') ||
                window.location.hash.includes('type=recovery')

            if (!session && !hasHashToken) {
                setError('ลิงก์นี้หมดอายุ หรือไม่ถูกต้อง กรุณาขอลิงก์ใหม่อีกครั้ง')
            }
            setIsLoading(false)
        }

        checkSession()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password.length < 6) {
            setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
            return
        }

        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const { error: supabaseError } = await supabase.auth.updateUser({
                password: password
            })

            if (supabaseError) throw supabaseError

            setIsSuccess(true)

            setTimeout(() => {
                router.push('/login')
            }, 2000)

        } catch (err: unknown) {
            console.error('Update password error:', err)
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
            setError(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">VELOZI | Dev</h1>
                        <p className="text-slate-400 mt-2">ตั้งรหัสผ่านใหม่</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">กำลังตรวจสอบ...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error && !password) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">VELOZI | Dev</h1>
                        <p className="text-slate-400 mt-2">ตั้งรหัสผ่านใหม่</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">ลิงก์ไม่ถูกต้อง</h2>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            กลับไปหน้าเข้าสู่ระบบ
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">VELOZI | Dev</h1>
                        <p className="text-slate-400 mt-2">ตั้งรหัสผ่านใหม่</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">เปลี่ยนรหัสผ่านสำเร็จ</h2>
                        <p className="text-slate-600 mb-4">กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่</p>
                        <p className="text-sm text-slate-500">กำลังนำไปยังหน้าเข้าสู่ระบบ...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">VELOZI | Dev</h1>
                    <p className="text-slate-400 mt-2">ตั้งรหัสผ่านใหม่</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                รหัสผ่านใหม่
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="รหัสผ่านใหม่"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                ยืนยันรหัสผ่านใหม่
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="ยืนยันรหัสผ่านใหม่"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!password || !confirmPassword || isSubmitting}
                            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    กำลังดำเนินการ...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    บันทึกรหัสผ่านใหม่
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push('/login')}
                            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            กลับไปหน้าเข้าสู่ระบบ
                        </button>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-sm mt-8">
                    © 2026 VELOZI | Dev. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default function UpdatePasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <UpdatePasswordContent />
        </Suspense>
    )
}
