'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, ArrowLeft, Send } from 'lucide-react'

interface ForgotPasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus('loading')
        setMessage('')

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                // redirectTo: `${window.location.origin}/admin/update-password`, // Optional: send to a specific page
            })

            if (error) throw error

            setStatus('success')
            setMessage('ส่งลิงก์ตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณเรียบร้อยแล้ว โปรดตรวจสอบกล่องจดหมาย')
        } catch (err: unknown) {
            console.error('Reset password error:', err)
            setStatus('error')
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งอีเมล กรุณาลองใหม่'
            setMessage(errorMessage)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="text-center mt-6 mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
                        <Mail className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-secondary-900 mb-2">ลืมรหัสผ่าน?</h2>
                    <p className="text-sm text-secondary-500">
                        กรุณากรอกอีเมลที่ใช้ลงทะเบียน<br />
                        ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้คุณ
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="p-4 bg-green-50 text-green-700 rounded-xl mb-6 text-sm">
                            {message}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
                        >
                            กลับไปหน้าเข้าสู่ระบบ
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                อีเมลของคุณ
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="your-email@example.com"
                                    required
                                    disabled={status === 'loading'}
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading' || !email}
                            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {status === 'loading' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    กำลังดำเนินการ...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
