'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, ShieldAlert, Eye, EyeOff, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'
import { z } from 'zod'

interface ChatbotFAQ {
    id: string
    question: string
    answer: string
    keywords: string[] | null
    is_active: boolean
    created_at: string
}

const faqSchema = z.object({
    question: z.string().min(1, 'กรุณากรอกคำถาม'),
    answer: z.string().min(1, 'กรุณากรอกคำตอบ'),
    keywords: z.string().optional()
})

export function ChatbotFAQManager() {
    const [faqs, setFaqs] = useState<ChatbotFAQ[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingFaq, setEditingFaq] = useState<ChatbotFAQ | null>(null)
    const { showAlert, showConfirm } = useModal()

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        keywords: '',
        is_active: true
    })

    useEffect(() => {
        fetchFaqs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchFaqs = async () => {
        try {
            const { data, error } = await supabase
                .from('chatbot_faqs')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setFaqs(data || [])
        } catch (error) {
            console.error('Error fetching FAQs:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูล FAQ ได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (faq?: ChatbotFAQ) => {
        if (faq) {
            setEditingFaq(faq)
            setFormData({
                question: faq.question,
                answer: faq.answer,
                keywords: faq.keywords ? faq.keywords.join(', ') : '',
                is_active: faq.is_active
            })
        } else {
            setEditingFaq(null)
            setFormData({
                question: '',
                answer: '',
                keywords: '',
                is_active: true
            })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingFaq(null)
    }

    const handleSave = async () => {
        try {
            faqSchema.parse(formData)
            setIsSaving(true)

            const keywordArray = formData.keywords
                ? formData.keywords.split(',').map(k => k.trim()).filter(k => k)
                : []

            if (editingFaq) {
                const { error } = await supabase
                    .from('chatbot_faqs')
                    .update({
                        question: formData.question,
                        answer: formData.answer,
                        keywords: keywordArray.length > 0 ? keywordArray : null,
                        is_active: formData.is_active,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingFaq.id)

                if (error) throw error
                showAlert('สำเร็จ', 'อัปเดต FAQ สำหรับบอทเรียบร้อยแล้ว', 'success')
            } else {
                const { error } = await supabase
                    .from('chatbot_faqs')
                    .insert([{
                        question: formData.question,
                        answer: formData.answer,
                        keywords: keywordArray.length > 0 ? keywordArray : null,
                        is_active: formData.is_active,
                    }])

                if (error) throw error
                showAlert('สำเร็จ', 'เพิ่ม FAQ ใหม่เรียบร้อยแล้ว', 'success')
            }

            handleCloseModal()
            fetchFaqs()
        } catch (error) {
            if (error instanceof z.ZodError) {
                showAlert('ข้อมูลไม่ถูกต้อง', error.errors[0].message, 'error')
            } else {
                const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
                showAlert('ข้อผิดพลาด', errorMessage, 'error')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string, question: string) => {
        const confirmed = await showConfirm(
            'ลบคำถาม',
            `คุณแน่ใจหรือไม่ที่จะลบคำถาม "${question}"?`
        )
        if (!confirmed) return

        try {
            const { error } = await supabase
                .from('chatbot_faqs')
                .delete()
                .eq('id', id)

            if (error) throw error

            setFaqs(faqs.filter(f => f.id !== id))
            showAlert('ลบสำเร็จ', 'ลบคำถามออกจากระบบแล้ว', 'success')
        } catch (error) {
            console.error('Error deleting FAQ:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถลบคำถามได้', 'error')
        }
    }

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('chatbot_faqs')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error
            setFaqs(faqs.map(f => f.id === id ? { ...f, is_active: !currentStatus } : f))
        } catch (error) {
            console.error('Error toggling active status:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถเปลี่ยนสถานะได้', 'error')
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-secondary-500">กำลังโหลดข้อมูล...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-secondary-900">ฐานความรู้บอท (Knowledge Base)</h2>
                        <p className="text-sm text-secondary-500">เพิ่มคำถาม-คำตอบเพื่อใช้สอน AI Bot</p>
                    </div>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    เพิ่มข้อมูลใหม่
                </button>
            </div>

            {faqs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-secondary-200 p-12 text-center text-secondary-500">
                    <ShieldAlert className="w-12 h-12 mx-auto text-secondary-300 mb-4" />
                    <p>ยังไม่มีข้อมูลในฐานความรู้บอท</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-secondary-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary-50 border-b border-secondary-200 text-sm font-semibold text-secondary-600">
                                    <th className="p-4">คำถาม / คำตอบ</th>
                                    <th className="p-4 w-40">Keywords (คีย์เวิร์ด)</th>
                                    <th className="p-4 w-32">เปิดใช้งาน</th>
                                    <th className="p-4 w-32 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100">
                                {faqs.map((faq) => (
                                    <tr key={faq.id} className="hover:bg-secondary-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-secondary-900 mb-1">{faq.question}</div>
                                            <div className="text-sm text-secondary-500 whitespace-pre-wrap line-clamp-2">{faq.answer}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {faq.keywords && faq.keywords.length > 0 ? (
                                                    faq.keywords.map((kw, i) => (
                                                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                                                            {kw}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-secondary-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleActive(faq.id, faq.is_active)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${faq.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'}`}
                                            >
                                                {faq.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                {faq.is_active ? 'ใช้งานอยู่' : 'ซ่อน'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(faq)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                                    title="แก้ไข"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(faq.id, faq.question)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    title="ลบ"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-secondary-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-secondary-900">
                                {editingFaq ? 'แก้ไขคำถาม' : 'เพิ่มคำถามใหม่'}
                            </h3>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">คำถามอ้างอิง</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    placeholder="เช่น บริษัทคุณรับทำเว็บอะไรบ้าง"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">คีย์เวิร์ดที่เกี่ยวข้อง (แยกด้วยจุลภาค ,)</label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                                    placeholder="เช่น ดูแลเว็บ, ทำเว็บไซต์, บริการหลังการขาย"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">คำตอบ (ข้อมูลให้บอท)</label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-y"
                                    placeholder="กรอกข้อมูลที่ถูกต้อง เพื่อให้บอทสามารถนำไปตอบคำถามได้"
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 cursor-pointer w-fit">
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_active ? 'bg-green-500' : 'bg-secondary-200'}`}>
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                                <span className={formData.is_active ? 'text-green-600' : 'text-secondary-400'}>
                                    เปิดใช้งาน
                                </span>
                            </label>
                        </div>

                        <div className="p-6 border-t border-secondary-100 flex justify-end gap-3 bg-secondary-50">
                            <button
                                onClick={handleCloseModal}
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-xl font-medium text-secondary-600 hover:bg-secondary-200 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="btn-primary"
                            >
                                {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
