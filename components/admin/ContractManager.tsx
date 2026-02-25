'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, FileText, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ContractTemplateEditor from './ContractTemplateEditor'

// Types
interface Template {
    id: string
    name: string
    description: string
    content: string
}

interface ClientContract {
    id: string
    title: string
    client_id: string
    status: string
    created_at: string
    clients?: {
        name: string
    }
}

export function ContractManager() {
    const [view, setView] = useState<'list' | 'editor'>('list')
    const [activeTab, setActiveTab] = useState<'client_contracts' | 'templates'>('client_contracts')

    // Data State
    const [templates, setTemplates] = useState<Template[]>([])
    const [contracts, setContracts] = useState<ClientContract[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Editor State
    const [editorData, setEditorData] = useState<Template | undefined>(undefined)

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            if (activeTab === 'templates') {
                const { data } = await supabase.from('contract_templates').select('*').order('created_at', { ascending: false })
                if (data) setTemplates(data)
            } else {
                const { data } = await supabase.from('client_contracts').select('*, clients(name)').order('created_at', { ascending: false })
                if (data) setContracts(data)
            }
        } catch (error) {
            console.error('Error fetching contracts data:', error)
        } finally {
            setIsLoading(false)
        }
    }, [activeTab])

    useEffect(() => {
        if (view === 'list') {
            fetchData()
        }
    }, [view, fetchData])

    const handleSaveTemplate = async (data: { name: string, description: string, content: string }) => {
        try {
            if (editorData?.id) {
                await supabase.from('contract_templates').update({
                    name: data.name,
                    description: data.description,
                    content: data.content
                }).eq('id', editorData.id)
            } else {
                await supabase.from('contract_templates').insert({
                    name: data.name,
                    description: data.description,
                    content: data.content
                })
            }
            setView('list')
        } catch (error) {
            throw error;
        }
    }

    const handleDeleteTemplate = async (id: string) => {
        if (!confirm('ยืนยันการลบเทมเพลตสัญญานี้? ข้อมูลเก่าที่เคยสร้างไปแล้วจะไม่ถูกลบ แต่จะไม่สามารถใช้เทมเพลตนี้สร้างใหม่ได้อีก')) return
        await supabase.from('contract_templates').delete().eq('id', id)
        fetchData()
    }

    const handleDeleteContract = async (id: string) => {
        if (!confirm('ยืนยันการลบเอกสารสัญญานี้?')) return
        await supabase.from('client_contracts').delete().eq('id', id)
        fetchData()
    }

    if (view === 'editor') {
        return (
            <div className="space-y-6">
                <ContractTemplateEditor
                    initialData={editorData}
                    onSave={handleSaveTemplate}
                    onBack={() => setView('list')}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">จัดการสัญญาอัตโนมัติ</h1>
                    <p className="text-sm text-slate-500 mt-1">สร้างเทมเพลตและออกสัญญาให้ลูกค้า</p>
                </div>

                {activeTab === 'templates' && (
                    <button
                        onClick={() => {
                            setEditorData(undefined)
                            setView('editor')
                        }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> สร้างเทมเพลตใหม่
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex gap-6">
                    <button
                        onClick={() => setActiveTab('client_contracts')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'client_contracts'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        ประวัติสัญญาที่ออกแล้ว
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'templates'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        เทมเพลตแบบร่าง
                    </button>
                </nav>
            </div>

            {/* Content Lists */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : activeTab === 'templates' ? (
                    <div className="divide-y divide-slate-200">
                        {templates.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p>ยังไม่มีเทมเพลตสัญญา</p>
                                <p className="text-sm mt-1">สร้างเทมเพลตเพื่อใช้เป็นตัวตั้งต้นในการออกสัญญา</p>
                            </div>
                        ) : templates.map(template => (
                            <div key={template.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-800">{template.name}</h3>
                                    <p className="text-sm text-slate-500">{template.description || 'ไม่มีคำอธิบาย'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditorData(template)
                                            setView('editor')
                                        }}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTemplate(template.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {contracts.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p>ยังไม่มีการออกสัญญาให้ลูกค้า</p>
                                <p className="text-sm mt-1">คุณสามารถสร้างสัญญาได้ในหน้ารายละเอียดลูกค้า (Client Info)</p>
                            </div>
                        ) : contracts.map(contract => (
                            <div key={contract.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-800">{contract.title}</h3>
                                    <p className="text-sm text-slate-500">
                                        สำหรับ: {contract.clients?.name || 'Unknown'} | วันที่: {new Date(contract.created_at).toLocaleDateString('th-TH')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${contract.status === 'DRAFT' ? 'bg-slate-100 text-slate-700' :
                                        contract.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                                            contract.status === 'SIGNED' ? 'bg-green-100 text-green-700' :
                                                'bg-slate-100 text-slate-700'
                                        }`}>
                                        {contract.status}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteContract(contract.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
