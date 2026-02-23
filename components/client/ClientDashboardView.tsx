'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Activity, CheckCircle2, AlertCircle, KeySquare } from 'lucide-react'
import { ChangePasswordModal } from './ChangePasswordModal'

interface Invoice {
    package_details: string;
    due_date: string;
}

// Define the steps that match our DB enum for project_status
const PROJECT_STEPS = [
    { id: 'pending', label: 'รอดำเนินการ' },
    { id: 'planning', label: 'กำลังวางแผน' },
    { id: 'designing', label: 'กำลังออกแบบ' },
    { id: 'developing', label: 'กำลังพัฒนา' },
    { id: 'testing', label: 'กำลังทดสอบ' },
    { id: 'completed', label: 'ส่งมอบงานแล้ว' }
]

export function ClientDashboardView() {
    const { user } = useAuth()
    const [projectStatus, setProjectStatus] = useState<string>('pending')
    const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

    useEffect(() => {
        if (!user?.email) return

        const fetchData = async () => {
            try {
                // 1. Fetch latest invoice to determine project status
                // Since invoices hold project_status, we grab the most recent one for this email
                const { data: invoices, error: invoiceError } = await supabase
                    .from('invoices')
                    .select('*')
                    .eq('client_email', user.email)
                    .order('created_at', { ascending: false })
                    .limit(1)

                if (invoiceError) throw invoiceError

                if (invoices && invoices.length > 0) {
                    const latest = invoices[0]
                    setProjectStatus(latest.project_status || 'pending')

                    // Check if they have an unpaid invoice
                    const { data: unpaidInvoices } = await supabase
                        .from('invoices')
                        .select('*')
                        .eq('client_email', user.email)
                        .eq('status', 'pending')
                        .order('due_date', { ascending: true })
                        .limit(1)

                    if (unpaidInvoices && unpaidInvoices.length > 0) {
                        setActiveInvoice(unpaidInvoices[0])
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [user])

    const currentStepIndex = PROJECT_STEPS.findIndex(s => s.id === projectStatus)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Warning for Unpaid Invoices */}
            {activeInvoice && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-4 shadow-sm">
                    <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="text-orange-800 font-bold">แจ้งเตือนยอดชำระค้าง</h3>
                        <p className="text-orange-700 text-sm mt-1">
                            คุณมียอดค้างชำระ ({activeInvoice.package_details}) กำหนดชำระภายใน {new Date(activeInvoice.due_date).toLocaleDateString('th-TH')}
                        </p>
                    </div>
                </div>
            )}

            {/* Project Tracker Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">สถานะโปรเจกต์ (Project Tracker)</h2>
                        <p className="text-sm text-gray-500">ติดตามความคืบหน้าการพัฒนาเว็บไซต์ของคุณ</p>
                    </div>
                    <div className="ml-auto">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-indigo-600 transition-colors shadow-sm text-sm"
                        >
                            <KeySquare className="w-4 h-4" />
                            <span className="hidden sm:inline">เปลี่ยนรหัสผ่าน</span>
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {/* Stepper */}
                    <div className="relative">
                        {/* Connecting Line background */}
                        <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 rounded-full" />

                        {/* Progress Line */}
                        <div
                            className="absolute top-5 left-8 h-1 bg-indigo-500 rounded-full transition-all duration-1000"
                            style={{
                                width: `${(Math.max(0, currentStepIndex) / (PROJECT_STEPS.length - 1)) * 100}%`
                                // Decrease width slightly so it doesn't overshoot the last circle, but since it's absolute with left/right padding visually it works.
                                // Actually better logic for connecting lines between circles:
                            }}
                        />
                        <div
                            className="absolute top-5 left-4 h-1 bg-indigo-500 rounded-full transition-all duration-1000 z-0"
                            style={{ width: `calc(${(Math.max(0, currentStepIndex) / (PROJECT_STEPS.length - 1)) * 100}% - 32px)` }}
                        />

                        <div className="relative z-10 flex justify-between">
                            {PROJECT_STEPS.map((step, index) => {
                                const isCompleted = index < currentStepIndex
                                const isCurrent = index === currentStepIndex

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-3 w-24">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 bg-white ${isCompleted
                                                ? 'border-indigo-500 text-indigo-500'
                                                : isCurrent
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md scale-110'
                                                    : 'border-gray-200 text-gray-300'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : isCurrent ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                                            ) : (
                                                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs font-medium text-center ${isCurrent ? 'text-indigo-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    )
}
