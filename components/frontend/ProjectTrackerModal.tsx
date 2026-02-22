'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, CheckCircle2, Clock, Map, PenTool, Code2, ShieldCheck, Flag, X } from 'lucide-react'

// Define the steps locally
const trackingSteps = [
    { id: 'pending', label: 'รอดำเนินการ', desc: 'ได้รับข้อมูลเบื้องต้นและรอการเริ่มต้นโครงการ', icon: Clock },
    { id: 'planning', label: 'กำลังวางแผน', desc: 'วิเคราะห์โครงสร้างระบบและรวบรวม Requirement', icon: Map },
    { id: 'designing', label: 'กำลังออกแบบ', desc: 'ออกแบบ UI/UX และกำหนด Design System', icon: PenTool },
    { id: 'developing', label: 'กำลังพัฒนา', desc: 'เขียนโปรแกรมและขึ้นโครงสร้างระบบ (Coding)', icon: Code2 },
    { id: 'testing', label: 'กำลังทดสอบ', desc: 'ตรวจสอบคุณภาพ หาบัค และปรับความปลอดภัย', icon: ShieldCheck },
    { id: 'completed', label: 'ส่งมอบงานแล้ว', desc: 'ระบบเสร็จสมบูรณ์ 100% และพร้อมใช้งานจริง', icon: Flag }
]

interface ProjectTrackerModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ProjectTrackerModal({ isOpen, onClose }: ProjectTrackerModalProps) {
    const [trackingCode, setTrackingCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [result, setResult] = useState<{
        client: string;
        package: string;
        status: string;
        started_at: string;
        last_updated: string;
    } | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!trackingCode.trim()) {
            setErrorMsg('กรุณากรอกรหัสติดตามงาน')
            return
        }

        setIsLoading(true)
        setErrorMsg('')
        setResult(null)

        try {
            const res = await fetch('/api/lookup-tracker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingCode: trackingCode.toUpperCase().trim() })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'เกิดข้อผิดพลาดในการตรวจสอบ')
            }

            setResult(data.data)

        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการตรวจสอบ กรุณาลองใหม่')
        } finally {
            setIsLoading(false)
        }
    }

    const currentStepIndex = result ? trackingSteps.findIndex(s => s.id === result.status) : -1

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-slate-900">
                                    ตรวจสอบสถานะงาน
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    กรอก Tracking Code เพื่อดูความคืบหน้าของโครงการ
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="relative mb-6">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={trackingCode}
                                        onChange={e => setTrackingCode(e.target.value)}
                                        placeholder="Tracking Code (e.g. NXL-XXXXXX)"
                                        className="w-full pl-5 pr-32 py-3.5 text-base border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all uppercase placeholder:normal-case font-mono"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !trackingCode.trim()}
                                        className="absolute right-2 top-2 bottom-2 px-5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all disabled:opacity-70 disabled:hover:bg-primary-600 flex items-center justify-center min-w-[100px]"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4 mr-2" />
                                                ค้นหา
                                            </>
                                        )}
                                    </button>
                                </div>
                                {errorMsg && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-sm mt-2 text-center"
                                    >
                                        {errorMsg}
                                    </motion.p>
                                )}
                            </form>

                            {/* Result */}
                            <AnimatePresence mode="wait">
                                {result && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="border border-slate-100 rounded-2xl overflow-hidden"
                                    >
                                        {/* Project Header */}
                                        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 p-6 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 blur-3xl rounded-full" />
                                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />

                                            <div className="relative z-10">
                                                <div className="flex flex-wrap items-end justify-between gap-3 mb-2">
                                                    <div>
                                                        <p className="text-primary-200 text-xs font-medium mb-1 tracking-wider uppercase flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                            Live Status
                                                        </p>
                                                        <h3 className="text-xl font-bold font-display leading-tight">{result.client}</h3>
                                                    </div>
                                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 font-mono text-sm tracking-widest font-bold">
                                                        {trackingCode.toUpperCase()}
                                                    </div>
                                                </div>
                                                <p className="text-primary-100/80 text-sm mt-1">แพ็กเกจ: <span className="text-white font-medium">{result.package}</span></p>
                                            </div>
                                        </div>

                                        {/* Timeline Stepper */}
                                        <div className="p-6">
                                            <h4 className="text-sm font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">ไทม์ไลน์การทำงาน</h4>

                                            <div className="space-y-6 relative">
                                                {/* Vertical line connecting steps */}
                                                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-slate-200" aria-hidden="true" />

                                                {trackingSteps.map((step, index) => {
                                                    const isCompleted = index <= currentStepIndex
                                                    const isCurrent = index === currentStepIndex
                                                    const Icon = step.icon

                                                    return (
                                                        <div key={step.id} className="relative flex items-start group">
                                                            {/* Left Icon Node */}
                                                            <div className={`
                                                                relative z-10 flex shrink-0 items-center justify-center w-10 h-10 rounded-full border-4 transition-colors duration-500
                                                                ${isCurrent ? 'border-primary-100 bg-primary-600 text-white shadow-lg shadow-primary-500/30' : ''}
                                                                ${!isCurrent && isCompleted ? 'border-emerald-100 bg-emerald-500 text-white' : ''}
                                                                ${!isCompleted && !isCurrent ? 'border-slate-50 bg-slate-100 text-slate-400' : ''}
                                                            `}>
                                                                {isCompleted && !isCurrent ? (
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                ) : (
                                                                    <Icon className="w-4 h-4" />
                                                                )}
                                                            </div>

                                                            {/* Content */}
                                                            <div className="ml-4 min-w-0 flex-1 pt-1">
                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                                    <h5 className={`text-sm font-bold ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                                                                        {step.label}
                                                                    </h5>
                                                                    {isCurrent && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 shrink-0">
                                                                            ขั้นตอนปัจจุบัน
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className={`mt-0.5 text-xs ${isCurrent ? 'text-slate-600' : 'text-slate-400'}`}>
                                                                    {step.desc}
                                                                </p>

                                                                {isCurrent && result.last_updated && (
                                                                    <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1 font-mono">
                                                                        <Clock className="w-3 h-3" />
                                                                        อัปเดตล่าสุด: {new Date(result.last_updated).toLocaleString('th-TH')}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )

    // Only render on client side
    if (typeof window === 'undefined') return null

    return createPortal(modalContent, document.body)
}
