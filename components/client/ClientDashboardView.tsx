'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Activity, CheckCircle2, AlertCircle, KeySquare } from 'lucide-react'
import { ChangePasswordModal } from './ChangePasswordModal'

interface Invoice {
    id: string;
    client_name: string;
    status: string;
    project_status: string;
    package_details: string;
    due_date: string;
    created_at: string;
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
    const [projects, setProjects] = useState<Record<string, { status: string, invoices: Invoice[] }>>({})
    const [projectNames, setProjectNames] = useState<string[]>([])
    const [selectedProject, setSelectedProject] = useState<string>('')
    const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

    useEffect(() => {
        if (!user?.email) return

        const fetchData = async () => {
            try {
                // 1. Fetch ALL invoices for this email
                const { data: allInvoices, error: invoiceError } = await supabase
                    .from('invoices')
                    .select('*')
                    .eq('client_email', user.email)
                    .order('created_at', { ascending: false })

                if (invoiceError) throw invoiceError

                if (allInvoices && allInvoices.length > 0) {
                    // Group by client_name (project name)
                    const grouped: Record<string, { status: string, invoices: Invoice[] }> = {}
                    const unpaid: Invoice[] = []

                    allInvoices.forEach(inv => {
                        if (inv.status === 'pending') {
                            unpaid.push(inv)
                        }

                        if (!grouped[inv.client_name]) {
                            grouped[inv.client_name] = {
                                status: inv.project_status || 'pending',
                                invoices: []
                            }
                        }
                        grouped[inv.client_name].invoices.push(inv)

                        // If current project tracking status is pending but this invoice has a real status, update it
                        // (Since we ordered by created_at desc, the first one seen is the latest)
                        if (grouped[inv.client_name].invoices.length === 1) {
                            grouped[inv.client_name].status = inv.project_status || 'pending'
                        }
                    })

                    const names = Object.keys(grouped)
                    setProjects(grouped)
                    setProjectNames(names)
                    setUnpaidInvoices(unpaid)

                    if (names.length > 0) {
                        setSelectedProject(names[0])
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

    const currentProject = projects[selectedProject]
    const projectStatus = currentProject?.status || 'pending'
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
            {/* Warning for Unpaid Invoices - Shows all projects now */}
            {unpaidInvoices.length > 0 && (
                <div className="space-y-3">
                    {unpaidInvoices.map((inv, idx) => (
                        <div key={inv.id || idx} className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-orange-800 font-bold">แจ้งเตือนยอดชำระค้าง: {inv.client_name}</h3>
                                <p className="text-orange-700 text-sm mt-1">
                                    คุณมียอดค้างชำระ ({inv.package_details}) กำหนดชำระภายใน {new Date(inv.due_date).toLocaleDateString('th-TH')}
                                </p>
                            </div>
                            <button
                                onClick={() => window.open(`/payment/${inv.id}`, '_blank')}
                                className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-sm self-center"
                            >
                                ชำระเงิน
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Project Tracker Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">สถานะโปรเจกต์ (Project Tracker)</h2>
                            <p className="text-sm text-gray-500">ติดตามความคืบหน้าการพัฒนาเว็บไซต์ของคุณ</p>
                        </div>
                    </div>

                    <div className="md:ml-auto flex items-center gap-2">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-indigo-600 transition-colors shadow-sm text-sm"
                        >
                            <KeySquare className="w-4 h-4" />
                            <span className="hidden sm:inline">เปลี่ยนรหัสผ่าน</span>
                        </button>
                    </div>
                </div>

                {/* Project Selector - ONLY if there are multiple projects */}
                {projectNames.length > 1 && (
                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 overflow-x-auto">
                        <div className="flex items-center gap-2 min-w-max">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">เลือกโปรเจกต์:</span>
                            {projectNames.map(name => (
                                <button
                                    key={name}
                                    onClick={() => setSelectedProject(name)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedProject === name
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                                        }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-8">
                    {!selectedProject ? (
                        <div className="text-center py-10 text-gray-400">
                            <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>ไม่มีข้อมูลโปรเจกต์ที่กำลังดำเนินการ</p>
                        </div>
                    ) : (
                        /* Stepper */
                        <div className="relative pt-4">
                            {/* Connecting Line background */}
                            <div className="absolute top-9 left-8 right-8 h-1 bg-gray-100 rounded-full" />

                            {/* Progress Line */}
                            <div
                                className="absolute top-9 left-8 h-1 bg-indigo-500 rounded-full transition-all duration-1000 z-0"
                                style={{
                                    width: `calc(${(Math.max(0, currentStepIndex) / (PROJECT_STEPS.length - 1)) * 100}% - 32px)`,
                                    opacity: currentStepIndex >= 0 ? 1 : 0
                                }}
                            />

                            <div className="relative z-10 flex justify-between">
                                {PROJECT_STEPS.map((step, index) => {
                                    const isCompleted = index < currentStepIndex
                                    const isCurrent = index === currentStepIndex

                                    return (
                                        <div key={step.id} className="flex flex-col items-center gap-4 w-24">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 bg-white ${isCompleted
                                                    ? 'border-indigo-500 text-indigo-500'
                                                    : isCurrent
                                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg scale-110'
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
                                                className={`text-[10px] md:text-xs font-bold text-center tracking-tight leading-tight ${isCurrent ? 'text-indigo-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                                                    }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {selectedProject && (
                    <div className="px-8 pb-8 flex justify-center">
                        <div className="px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-700 text-xs font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            โปรเจกต์: <span className="font-bold">{selectedProject}</span>
                        </div>
                    </div>
                )}
            </div>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    )
}
