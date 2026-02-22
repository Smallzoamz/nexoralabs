'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Lock, X, Save, Eye, EyeOff } from 'lucide-react'

interface AccountSettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AccountSettingsModal({ isOpen, onClose }: AccountSettingsModalProps) {
    const { logout } = useAuth()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword.length < 6) {
            setStatus('error')
            setMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
            return
        }

        if (newPassword !== confirmPassword) {
            setStatus('error')
            setMessage('รหัสผ่านไม่ตรงกัน')
            return
        }

        setStatus('loading')
        setMessage('')

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error

            setStatus('success')
            setMessage('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่')

            // Wait 2 seconds then logout
            setTimeout(() => {
                logout()
            }, 2000)

        } catch (err: unknown) {
            console.error('Update password error:', err)
            setStatus('error')
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน กรุณาลองใหม่'
            setMessage(errorMessage)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mt-2 mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 mb-4">
                        <Lock className="w-6 h-6 text-primary-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-secondary-900">เปลี่ยนรหัสผ่าน</h2>
                    <p className="text-sm text-secondary-500 mt-1">
                        ตั้งรหัสผ่านใหม่สำหรับเข้าสู่ระบบ
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-4">
                        <div className="p-4 bg-green-50 text-green-700 rounded-xl mb-4 font-medium">
                            {message}
                        </div>
                        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                รหัสผ่านใหม่
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2.5 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="อย่างน้อย 6 ตัวอักษร"
                                    required
                                    disabled={status === 'loading'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                ยืนยันรหัสผ่านใหม่
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2.5 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                                    required
                                    disabled={status === 'loading'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
                                {message}
                            </div>
                        )}

                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={status === 'loading'}
                                className="flex-1 py-2.5 px-4 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                disabled={status === 'loading' || !newPassword || !confirmPassword}
                                className="flex-1 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        กำลังบันทึก...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        บันทึกรหัสผ่าน
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
