'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Lock, Mail, Eye, EyeOff, LogIn, RefreshCw, AlertTriangle } from 'lucide-react'
import { ForgotPasswordModal } from './ForgotPasswordModal'
import { logAdminAction } from '@/lib/admin-logger'

export function LoginPage() {
    const { login, isLoading: authLoading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

    // Security States
    const [failedAttempts, setFailedAttempts] = useState(0)
    const [lockoutTimer, setLockoutTimer] = useState(0)

    // CAPTCHA States
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, result: 0 })
    const [userCaptcha, setUserCaptcha] = useState('')

    const generateCaptcha = () => {
        const n1 = Math.floor(Math.random() * 10) + 1
        const n2 = Math.floor(Math.random() * 10) + 1
        setCaptcha({ num1: n1, num2: n2, result: n1 + n2 })
        setUserCaptcha('')
    }

    // Initialize CAPTCHA and handle lockout timer
    useEffect(() => {
        generateCaptcha()
    }, [])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (lockoutTimer > 0) {
            timer = setInterval(() => {
                setLockoutTimer(prev => prev - 1)
            }, 1000)
        } else if (lockoutTimer === 0 && failedAttempts >= 3) {
            // Reset attempts after lockout period
            setFailedAttempts(0)
        }
        return () => clearInterval(timer)
    }, [lockoutTimer, failedAttempts])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Block if locked out
        if (lockoutTimer > 0) {
            setError(`ระงับการใช้งานชั่วคราว กรุณารอ ${lockoutTimer} วินาที`)
            return
        }

        // Verify CAPTCHA
        if (parseInt(userCaptcha) !== captcha.result) {
            setError('การยืนยันตัวตน (Math CAPTCHA) ไม่ถูกต้อง')
            generateCaptcha() // Regenerate on fail
            return
        }

        setIsLoading(true)

        const result = await login(email, password)

        if (!result.success) {
            setError(result.error || 'เกิดข้อผิดพลาด')
            const nextAttempts = failedAttempts + 1
            setFailedAttempts(nextAttempts)

            // Trigger 60s lockout on 3rd fail
            if (nextAttempts >= 3) {
                setLockoutTimer(60)
                setError('ใส่รหัสผ่านผิดเกินกำหนด ระงับการใช้งาน 60 วินาที')
            }
            generateCaptcha() // Regenerate captcha on failed login
        } else {
            // Reset on success
            setFailedAttempts(0)
            setLockoutTimer(0)

            try {
                // Background log
                logAdminAction(email, 'LOGIN', 'เข้าสู่ระบบสำเร็จ')
            } catch (e) {
                console.error(e)
            }
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-4">
                        <Lock className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-primary-100">Nexora Labs</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-6 text-center">
                        เข้าสู่ระบบ
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                อีเมล
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="admin@nexoralabs.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                รหัสผ่าน
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    required
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

                        {/* Math CAPTCHA Field */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                ยืนยันว่าเป็นมนุษย์: {captcha.num1} + {captcha.num2} = ?
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={userCaptcha}
                                    onChange={(e) => setUserCaptcha(e.target.value)}
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="ใส่คำตอบ"
                                    required
                                    disabled={lockoutTimer > 0}
                                />
                                <button
                                    type="button"
                                    onClick={generateCaptcha}
                                    disabled={lockoutTimer > 0}
                                    className="px-4 bg-secondary-100 hover:bg-secondary-200 text-secondary-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
                                    title="เปลี่ยนโจทย์"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Error Message & Lockout Feedback */}
                        {error && (
                            <div className={`p-3 border rounded-xl text-sm flex items-start gap-2 ${lockoutTimer > 0
                                ? 'bg-orange-50 border-orange-200 text-orange-700'
                                : 'bg-red-50 border-red-200 text-red-600'
                                }`}>
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">{error}</p>
                                    {failedAttempts > 0 && lockoutTimer === 0 && (
                                        <p className="text-xs mt-1 opacity-80">
                                            เหลือโอกาสอีก {3 - failedAttempts} ครั้ง
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Forgot Password Link */}
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => setIsForgotPasswordOpen(true)}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors focus:outline-none"
                            >
                                ลืมรหัสผ่าน?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || authLoading || lockoutTimer > 0}
                            className={`w-full py-3 px-4 mt-6 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 ${lockoutTimer > 0
                                ? 'bg-secondary-400 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    กำลังเข้าสู่ระบบ...
                                </>
                            ) : lockoutTimer > 0 ? (
                                <>
                                    <Lock className="w-5 h-5" />
                                    รอ {lockoutTimer} วินาที
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    เข้าสู่ระบบ
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-primary-100 text-sm mt-6">
                    © 2024 Nexora Labs. All rights reserved.
                </p>
            </div>

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
            />
        </div>
    )
}
