'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, ShieldAlert, Eye, EyeOff, GripVertical } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'
import { z } from 'zod'

interface FAQ {
    id: string
    question: string
    answer: string
    sort_order: number
    is_active: boolean
    created_at: string
}

const faqSchema = z.object({
    question: z.string().min(1, 'กรุณากรอกคำถาม'),
    answer: z.string().min(1, 'กรุณากรอกคำตอบ'),
})

export function FAQManager() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
    const { showAlert, showConfirm } = useModal()

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        is_active: true
    })

    useEffect(() => {
        fetchFaqs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchFaqs = async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('sort_order', { ascending: true })

            if (error) throw error
            setFaqs(data || [])
        } catch (error) {
            console.error('Error fetching FAQs:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูล FAQ ได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (faq?: FAQ) => {
        if (faq) {
            setEditingFaq(faq)
            setFormData({
                question: faq.question,
                answer: faq.answer,
                is_active: faq.is_active
            })
        } else {
            setEditingFaq(null)
            setFormData({
                question: '',
                answer: '',
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

            if (editingFaq) {
                const { error } = await supabase
                    .from('faqs')
                    .update({
                        question: formData.question,
                        answer: formData.answer,
                        is_active: formData.is_active,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingFaq.id)

                if (error) throw error
                showAlert('สำเร็จ', 'อัปเดต FAQ เรียบร้อยแล้ว', 'success')
            } else {
                // Find max sort_order
                const maxSortOrder = faqs.reduce((max, f) => (f.sort_order > max ? f.sort_order : max), 0)

                const { error } = await supabase
                    .from('faqs')
                    .insert([{
                        question: formData.question,
                        answer: formData.answer,
                        is_active: formData.is_active,
                        sort_order: maxSortOrder + 1,
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
            `คุณแน่ใจหรือไม่ที่จะลบคำถาม "${question}"? ข้อมูลนี้จะไม่สามารถกู้คืนได้`
        )
        if (!confirmed) return

        try {
            const { error } = await supabase
                .from('faqs')
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
                .from('faqs')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error
            setFaqs(faqs.map(f => f.id === id ? { ...f, is_active: !currentStatus } : f))
        } catch (error) {
            console.error('Error toggling active status:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถเปลี่ยนสถานะได้', 'error')
        }
    }

    const moveOrder = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === faqs.length - 1) return

        const newFaqs = [...faqs]
        const swapIndex = direction === 'up' ? index - 1 : index + 1

        // Swap sort_orders locally
        const currentFaq = newFaqs[index]
        const swapFaq = newFaqs[swapIndex]

        const tempOrder = currentFaq.sort_order
        currentFaq.sort_order = swapFaq.sort_order
        swapFaq.sort_order = tempOrder

        // Swap array positions for immediate UI update
        newFaqs[index] = swapFaq
        newFaqs[swapIndex] = currentFaq
        setFaqs(newFaqs)

        // Sync to DB
        try {
            await Promise.all([
                supabase.from('faqs').update({ sort_order: currentFaq.sort_order }).eq('id', currentFaq.id),
                supabase.from('faqs').update({ sort_order: swapFaq.sort_order }).eq('id', swapFaq.id)
            ])
        } catch (error) {
            console.error('Error updating order:', error)
            showAlert('ข้อผิดพลาด', 'จัดเรียงลำดับล้มเหลว', 'error')
            fetchFaqs() // Re-fetch to reset logic
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-secondary-900">จัดการคำถามที่พบบ่อย (FAQ)</h2>
                    <p className="text-sm text-secondary-500">เพิ่ม ลบ หรือแก้ไขข้อความ Q&A</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    เพิ่มคำถาม
                </button>
            </div>

            {/* Empty State */}
            {faqs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-secondary-200 p-12 text-center text-secondary-500">
                    <ShieldAlert className="w-12 h-12 mx-auto text-secondary-300 mb-4" />
                    <p>ยังไม่มีคำถามในระบบ</p>
                </div>
            ) : (
                /* FAQ List */
                <div className="bg-white rounded-2xl border border-secondary-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary-50 border-b border-secondary-200 text-sm font-semibold text-secondary-600">
                                    <th className="p-4 w-12 text-center">จัดเรียง</th>
                                    <th className="p-4">คำถาม</th>
                                    <th className="p-4 w-32">สถานะ</th>
                                    <th className="p-4 w-24 text-center">ลำดับ</th>
                                    <th className="p-4 w-32 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100">
                                {faqs.map((faq, index) => (
                                    <tr key={faq.id} className="hover:bg-secondary-50/50 transition-colors">
                                        <td className="p-4 text-center cursor-move text-secondary-400 hover:text-secondary-600">
                                            <div className="flex flex-col items-center gap-1">
                                                <button onClick={() => moveOrder(index, 'up')} disabled={index === 0} className="hover:text-primary-600 disabled:opacity-30">▲</button>
                                                <GripVertical className="w-4 h-4" />
                                                <button onClick={() => moveOrder(index, 'down')} disabled={index === faqs.length - 1} className="hover:text-primary-600 disabled:opacity-30">▼</button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-secondary-900 line-clamp-1">{faq.question}</div>
                                            <div className="text-sm text-secondary-500 line-clamp-1 mt-1">{faq.answer}</div>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleActive(faq.id, faq.is_active)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${faq.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'}`}
                                            >
                                                {faq.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                {faq.is_active ? 'แสดงผล' : 'ซ่อน'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-center text-sm font-medium text-secondary-500">
                                            {faq.sort_order}
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

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-secondary-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-secondary-900">
                                {editingFaq ? 'แก้ไขคำถาม' : 'เพิ่มคำถามใหม่'}
                            </h3>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 cursor-pointer">
                                    <span className={formData.is_active ? 'text-green-600' : 'text-secondary-400'}>
                                        {formData.is_active ? 'เปิดแสดงผล' : 'ซ่อนไว้ก่อน'}
                                    </span>
                                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_active ? 'bg-green-500' : 'bg-secondary-200'}`}>
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">คำถาม</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    placeholder="เช่น ทำไมถึงต้องเลือกใช้บริการกับเรา?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">คำตอบ</label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-y"
                                    placeholder="ใส่คำอธิบายพร้อมรายละเอียดเพิ่มเติมที่นี่..."
                                />
                                <p className="text-sm text-secondary-500 mt-2">สามารถใส่ข้อความแบบเว้นบรรทัดได้ตามปกติ</p>
                            </div>
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
