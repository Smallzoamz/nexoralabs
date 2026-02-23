'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, CheckCircle2, Loader2, Save } from 'lucide-react'

// Variable reference (used inline in useEffect for replacement logic)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VARIABLES = [
    { label: 'ชื่อลูกค้า', value: '[CLIENT_NAME]', key: 'clientName' },
    { label: 'เบอร์โทร', value: '[CLIENT_PHONE]', key: 'clientPhone' },
    { label: 'อีเมล', value: '[CLIENT_EMAIL]', key: 'clientEmail' },
    { label: 'ชื่อโปรเจกต์', value: '[PROJECT_NAME]', key: 'projectName' },
    { label: 'วันที่เริ่มงาน', value: '[START_DATE]', key: 'startDate' },
    { label: 'วันที่สิ้นสุด', value: '[END_DATE]', key: 'endDate' },
    { label: 'ราคาแพ็กเกจ', value: '[PACKAGE_PRICE]', key: 'packagePrice' },
    { label: 'ยอดรวมสุทธิ', value: '[TOTAL_PRICE]', key: 'totalPrice' },
    { label: 'วันที่ออกสัญญา', value: '[CURRENT_DATE]', key: 'currentDate' },
]

interface Template {
    id: string
    name: string
    content: string
}

interface ContractData {
    clientName: string
    clientPhone: string
    clientEmail: string
    projectName: string
    startDate: string
    endDate: string
    packagePrice: string
    totalPrice: string
}

interface ContractGeneratorModalProps {
    isOpen: boolean
    onClose: () => void
    clientId: string
    templates: Template[]
    prefilledData: Partial<ContractData>
    onGenerate: (templateId: string, title: string, finalContent: string) => Promise<void>
}

export default function ContractGeneratorModal({
    isOpen,
    onClose,
    templates,
    prefilledData,
    onGenerate
}: ContractGeneratorModalProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('')
    const [title, setTitle] = useState('')
    const [formData, setFormData] = useState<ContractData>({
        clientName: prefilledData.clientName || '',
        clientPhone: prefilledData.clientPhone || '',
        clientEmail: prefilledData.clientEmail || '',
        projectName: prefilledData.projectName || '',
        startDate: prefilledData.startDate || new Date().toISOString().split('T')[0],
        endDate: prefilledData.endDate || '',
        packagePrice: prefilledData.packagePrice || '0',
        totalPrice: prefilledData.totalPrice || '0',
    })
    const [previewContent, setPreviewContent] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Handle variable binding
    useEffect(() => {
        if (!selectedTemplate) {
            setPreviewContent('')
            return
        }

        const template = templates.find(t => t.id === selectedTemplate)
        if (!template) return

        let html = template.content

        // Replace all variables
        const now = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })

        html = html.replace(/\[CLIENT_NAME\]/g, formData.clientName || '_______________')
        html = html.replace(/\[CLIENT_PHONE\]/g, formData.clientPhone || '_______________')
        html = html.replace(/\[CLIENT_EMAIL\]/g, formData.clientEmail || '_______________')
        html = html.replace(/\[PROJECT_NAME\]/g, formData.projectName || '_______________')

        // Format dates if provided
        const formatThDate = (dString: string) => dString ? new Date(dString).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '_______________'
        html = html.replace(/\[START_DATE\]/g, formatThDate(formData.startDate))
        html = html.replace(/\[END_DATE\]/g, formatThDate(formData.endDate))

        // Format money
        const formatMoney = (val: string) => val ? Number(val).toLocaleString('th-TH') + ' บาท' : '_______________'
        html = html.replace(/\[PACKAGE_PRICE\]/g, formatMoney(formData.packagePrice))
        html = html.replace(/\[TOTAL_PRICE\]/g, formatMoney(formData.totalPrice))

        html = html.replace(/\[CURRENT_DATE\]/g, now)

        setPreviewContent(html)
    }, [selectedTemplate, formData, templates])

    const handleInputChange = (field: keyof ContractData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!selectedTemplate || !title.trim() || !previewContent) return

        setIsGenerating(true)
        try {
            await onGenerate(selectedTemplate, title, previewContent)
            setIsSuccess(true)
            setTimeout(() => {
                setIsSuccess(false)
                onClose()
            }, 2000)
        } catch (error) {
            console.error('Failed to generate contract:', error)
            alert('เกิดข้อผิดพลาดในการสร้างสัญญา')
        } finally {
            setIsGenerating(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                <motion.div
                    className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">สร้างสัญญาอัตโนมัติ</h2>
                                <p className="text-sm text-slate-500">รวมข้อมูลลูกค้าเข้ากับเทมเพลตสัญญา</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                        {/* Left Panel: Configuration */}
                        <div className="w-full lg:w-[400px] border-r border-slate-200 bg-white overflow-y-auto p-6 space-y-6">

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">หัวข้อสัญญา (สำหรับอ้างอิง) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="เช่น สัญญาจ้างพัฒนาเว็บ - บริษัท ABC"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">เลือกเทมเพลต <span className="text-red-500">*</span></label>
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => {
                                        setSelectedTemplate(e.target.value)
                                        if (!title && e.target.value) {
                                            const t = templates.find(t => t.id === e.target.value)
                                            if (t) setTitle(`${t.name} - ${formData.clientName}`)
                                        }
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all bg-white"
                                >
                                    <option value="">-- เลือกเทมเพลตที่ต้องการแบบร่าง --</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="font-semibold text-slate-800 mb-4">ข้อมูลตัวแปรอัตโนมัติ</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อลูกค้า [CLIENT_NAME]</label>
                                            <input type="text" value={formData.clientName} onChange={e => handleInputChange('clientName', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อโปรเจกต์ [PROJECT_NAME]</label>
                                            <input type="text" value={formData.projectName} onChange={e => handleInputChange('projectName', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">เบอร์โทร [CLIENT_PHONE]</label>
                                            <input type="text" value={formData.clientPhone} onChange={e => handleInputChange('clientPhone', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">อีเมล [CLIENT_EMAIL]</label>
                                            <input type="text" value={formData.clientEmail} onChange={e => handleInputChange('clientEmail', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">เริ่มงาน [START_DATE]</label>
                                            <input type="date" value={formData.startDate} onChange={e => handleInputChange('startDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">ส่งหมอบ [END_DATE]</label>
                                            <input type="date" value={formData.endDate} onChange={e => handleInputChange('endDate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">ราคาแพ็กเกจ (บาท)</label>
                                            <input type="number" value={formData.packagePrice} onChange={e => handleInputChange('packagePrice', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">ยอดรวมสุทธิ (บาท)</label>
                                            <input type="number" value={formData.totalPrice} onChange={e => handleInputChange('totalPrice', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Preview */}
                        <div className="flex-1 bg-slate-100 flex flex-col p-6 overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-700">พรีวิวสัญญาฉบับสมบูรณ์ (Preview)</h3>
                                {selectedTemplate && (
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-medium">Auto-replaced</span>
                                )}
                            </div>

                            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto p-8 lg:p-12">
                                {selectedTemplate ? (
                                    <div
                                        className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-indigo-600 prose-img:rounded-xl"
                                        dangerouslySetInnerHTML={{ __html: previewContent }}
                                    />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                        <FileText className="w-16 h-16 opacity-20" />
                                        <p>กรุณาเลือกเทมเพลตสัญญาจากเมนูด้านซ้าย</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!selectedTemplate || !title.trim() || isGenerating}
                            className="btn-primary py-2.5 px-6 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                            {isSuccess ? 'บันทึกสัญญาสำเร็จ!' : 'ออกสัญญาฉบับนี้'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
