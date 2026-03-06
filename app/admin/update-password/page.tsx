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
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    useEffect(() => {
        // Check if user has a valid recovery token
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                // No session, redirect to login
                setStatus('error')
                setMessage('ลิงก์นี้หมดอายุ หรือไม่ถูกต้อง กรุณาขอลิงก์ใหม่อีกครั้ง')
            }
        }
        checkSession()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password.length < 6) {
            setStatus('error')
            setMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
            return
        }

        if (password !== confirmPassword) {
            setStatus('error')
            setMessage('รหัสผ่านไม่ตรงกัน')
            return
        }

        setStatus('loading')
        setMessage('')

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            setStatus('success')
            setMessage('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่')

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login')
            }, 2000)

        } catch (err: unknown) {
            console.error('Update password error:', err)
            setStatus('error')
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
            setMessage(errorMessage)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">VELOZI | Dev</h1>
                    <p className="text-slate-400 mt-2">ตั้งรหัสผ่านใหม่</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">เปลี่ยนรหัสผ่านสำเร็จ</h2>
                            <p className="text-slate-600 mb-4">{message}</p>
                            <p className="text-sm text-slate-500">กำลังนำไปยังหน้าเข้าสู่ระบบ...</p>
                        </div>
                    ) : status === 'error' && !password ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">ลิงก์ไม่ถูกต้อง</h2>
                            <p className="text-slate-600 mb-6">{message}</p>
                            <button
                                onClick={() => router.push('/login')}
                                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                กลับไปหน้าเข้าสู่ระบบ
                            </button>
                        </div>
                    ) : (
                        <>
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
                                            disabled={status === 'loading'}
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
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                </div>

                                {status === 'error' && message && (
                                    <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
                                        {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading' || !password || !confirmPassword}
                                    className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? (
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
                        </>
                    )}
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
