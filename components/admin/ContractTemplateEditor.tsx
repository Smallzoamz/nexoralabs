'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { PlusCircle, Save, Loader2, FileText, CheckCircle2, ChevronLeft } from 'lucide-react'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to disable Server-Side Rendering (SSR)
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <div className="h-96 w-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl animate-pulse"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>
})

interface ContractTemplateEditorProps {
    initialData?: {
        id?: string
        name: string
        description: string
        content: string
    }
    onSave: (data: { name: string, description: string, content: string }) => Promise<void>
    onBack?: () => void
}

const VARIABLES = [
    { label: 'ชื่อลูกค้า', value: '[CLIENT_NAME]' },
    { label: 'เบอร์โทร', value: '[CLIENT_PHONE]' },
    { label: 'อีเมล', value: '[CLIENT_EMAIL]' },
    { label: 'ชื่อโปรเจกต์', value: '[PROJECT_NAME]' },
    { label: 'วันที่เริ่มงาน', value: '[START_DATE]' },
    { label: 'วันที่สิ้นสุด', value: '[END_DATE]' },
    { label: 'ราคาแพ็กเกจ', value: '[PACKAGE_PRICE]' },
    { label: 'ยอดรวมสุทธิ', value: '[TOTAL_PRICE]' },
    { label: 'วันที่ออกสัญญา', value: '[CURRENT_DATE]' },
]

export default function ContractTemplateEditor({ initialData, onSave, onBack }: ContractTemplateEditorProps) {
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [content, setContent] = useState(initialData?.content || '')
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    // Quill formatting modules
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ],
    }), [])

    const handleSave = async () => {
        if (!name.trim() || !content.trim()) return

        setIsSaving(true)
        try {
            await onSave({ name, description, content })
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (error) {
            console.error('Failed to save template:', error)
            alert('เกิดข้อผิดพลาดในการบันทึกเทมเพลต')
        } finally {
            setIsSaving(false)
        }
    }

    const insertVariable = (variableValue: string) => {
        // Appends variable to the end of the content. 
        // For more complex insertion at cursor, a ref to the Quill instance is needed. 
        setContent(prev => prev + ` ${variableValue} `)
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-5 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                {initialData?.id ? 'แก้ไขเทมเพลตสัญญา' : 'สร้างเทมเพลตสัญญาใหม่'}
                            </h2>
                            <p className="text-sm text-slate-500">ออกแบบและกำหนดตัวแปรอัตโนมัติ</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving || !name.trim() || !content.trim()}
                    className="btn-primary py-2 px-5 disabled:opacity-50 flex items-center gap-2 text-sm"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saveSuccess ? 'บันทึกสำเร็จ' : 'บันทึกเทมเพลต'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x border-slate-200">
                {/* Editor Content Area */}
                <div className="lg:col-span-3 p-6 space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">ชื่อเทมเพลต <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="เช่น สัญญาจ้างพัฒนาเว็บไซต์ ฉบับมาตรฐาน"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">คำอธิบาย (ทางเลือก)</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="รายละเอียดสั้นๆ เกี่ยวกับรูปแบบสัญญานี้..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">เนื้อหาสัญญา <span className="text-red-500">*</span></label>
                        <div className="quill-editor-container border border-slate-300 rounded-xl overflow-hidden">
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                className="bg-white min-h-[400px]"
                            />
                        </div>
                        {/* Custom CSS to inject to make ReactQuill container look taller */}
                        <style jsx global>{`
                            .quill-editor-container .ql-container {
                                min-height: 400px;
                                font-size: 16px;
                                font-family: inherit;
                            }
                            .quill-editor-container .ql-editor {
                                min-height: 400px;
                            }
                            .quill-editor-container .ql-toolbar {
                                border-bottom: 1px solid #cbd5e1 !important;
                                border-top: none !important;
                                border-left: none !important;
                                border-right: none !important;
                                background-color: #f8fafc;
                            }
                            .quill-editor-container .ql-container.ql-snow {
                                border: none !important;
                            }
                        `}</style>
                    </div>
                </div>

                {/* Sidebar: Variables */}
                <div className="p-6 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-indigo-600" />
                        ตัวแปรไดนามิก
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                        คลิกเพื่อแทรกโค้ดตัวแปรลงท้ายเนื้อหา ระบบจะดึงข้อมูลจริงของลูกค้ามาแทนที่ตอนสร้างสัญญาแบบอัตโนมัติ
                    </p>

                    <div className="space-y-2">
                        {VARIABLES.map(variable => (
                            <button
                                key={variable.value}
                                onClick={() => insertVariable(variable.value)}
                                className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-left group"
                                title="แทรกตัวแปร"
                            >
                                <span className="text-sm font-medium text-slate-700">{variable.label}</span>
                                <code className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded bg-opacity-0 group-hover:bg-opacity-100 transition-colors">
                                    {variable.value}
                                </code>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
