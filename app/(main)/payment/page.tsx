'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, CheckCircle2, CreditCard, Building2, Wallet } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PaymentSettings {
    promptpay_number: string
    promptpay_name: string
    bank_name: string
    bank_account_no: string
    bank_account_name: string
}

export default function PaymentPage() {
    const [settings, setSettings] = useState<PaymentSettings | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('payment_settings')
                    .select('*')
                    .limit(1)
                    .single()

                if (error) throw error
                if (data) setSettings(data)
            } catch (error) {
                console.error('Error fetching payment settings:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()
    }, [])

    const handleCopy = (text: string, fieldType: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(fieldType)
        setTimeout(() => setCopiedField(null), 2000)
    }

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!settings) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-secondary-200 max-w-md w-full">
                    <Wallet className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-secondary-900 mb-2">ยังไม่มีข้อมูลการชำระเงิน</h2>
                    <p className="text-secondary-600">กรุณาติดต่อผู้ดูแลระบบเพื่อตั้งค่าช่องทางการชำระเงิน</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-3xl mx-auto w-full relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-primary-900/5 border border-secondary-100 mb-8 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent" />
                        <CreditCard className="w-10 h-10 text-primary-600 relative z-10" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-secondary-900 mb-4 sm:mb-6 font-display tracking-tight"
                    >
                        ช่องทางการชำระเงิน
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-secondary-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2"
                    >
                        คุณสามารถชำระค่าบริการผ่านช่องทางด้านล่างนี้ และส่งหลักฐานการโอนเงินโดยการตอบกลับอีเมล E-Invoice ที่ได้รับ
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* PromptPay Card */}
                    {settings.promptpay_number && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-secondary-800/90 backdrop-blur-xl p-5 sm:p-8 rounded-3xl shadow-xl border border-secondary-700 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors" />

                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="w-12 h-12 bg-primary-900/30 text-primary-400 rounded-xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-50">พร้อมเพย์ (PromptPay)</h3>
                                    <p className="text-secondary-300">โอนเงินเข้าเบอร์พร้อมเพย์</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-secondary-400 mb-1">หมายเลขพร้อมเพย์</p>
                                    <div className="flex items-center justify-between p-3 sm:p-4 bg-secondary-950/50 rounded-2xl border border-secondary-700 break-all sm:break-normal">
                                        <p className="text-lg sm:text-xl font-bold text-white tracking-wider font-mono mr-2">{settings.promptpay_number}</p>
                                        <button
                                            onClick={() => handleCopy(settings.promptpay_number, 'promptpay')}
                                            className="p-2 sm:p-3 hover:bg-secondary-800 rounded-xl transition-colors text-secondary-300 hover:text-white shadow-sm flex-shrink-0"
                                            title="คัดลอกหมายเลข"
                                        >
                                            {copiedField === 'promptpay' ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <p className="text-xs sm:text-sm font-medium text-secondary-400 mb-1">ชื่อบัญชี</p>
                                    <p className="text-sm sm:text-base font-medium text-white px-1">{settings.promptpay_name}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Bank Transfer Card */}
                    {settings.bank_account_no && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-secondary-800/90 backdrop-blur-xl p-5 sm:p-8 rounded-3xl shadow-xl border border-secondary-700 relative group overflow-hidden mt-4 md:mt-0"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full blur-3xl group-hover:bg-accent-500/10 transition-colors" />

                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="w-12 h-12 bg-accent-900/30 text-accent-400 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-50">โอนผ่านบัญชีธนาคาร</h3>
                                    <p className="text-secondary-300">{settings.bank_name}</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-secondary-400 mb-1">เลขที่บัญชี</p>
                                    <div className="flex items-center justify-between p-3 sm:p-4 bg-secondary-950/50 rounded-2xl border border-secondary-700 break-all sm:break-normal">
                                        <p className="text-lg sm:text-xl font-bold text-white tracking-wider font-mono mr-2">{settings.bank_account_no}</p>
                                        <button
                                            onClick={() => handleCopy(settings.bank_account_no, 'bank')}
                                            className="p-2 sm:p-3 hover:bg-secondary-800 rounded-xl transition-colors text-secondary-300 hover:text-white shadow-sm flex-shrink-0"
                                            title="คัดลอกเลขบัญชี"
                                        >
                                            {copiedField === 'bank' ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <p className="text-xs sm:text-sm font-medium text-secondary-400 mb-1">ชื่อบัญชี</p>
                                    <p className="text-sm sm:text-base font-medium text-white px-1">{settings.bank_account_name}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
