'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Save } from 'lucide-react'
import { useModal } from '@/lib/modal-context'

export function PaymentSettings() {
    const { showAlert } = useModal()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        id: '',
        promptpay_number: '',
        promptpay_name: '',
        bank_name: '',
        bank_account_no: '',
        bank_account_name: ''
    })

    const fetchPaymentSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('payment_settings')
                .select('*')
                .limit(1)
                .single()

            if (error) throw error

            if (data) {
                setFormData({
                    id: data.id,
                    promptpay_number: data.promptpay_number || '',
                    promptpay_name: data.promptpay_name || '',
                    bank_name: data.bank_name || '',
                    bank_account_no: data.bank_account_no || '',
                    bank_account_name: data.bank_account_name || ''
                })
            }
        } catch (error) {
            console.error('Error fetching payment settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPaymentSettings()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const updatePayload = {
                promptpay_number: formData.promptpay_number,
                promptpay_name: formData.promptpay_name,
                bank_name: formData.bank_name,
                bank_account_no: formData.bank_account_no,
                bank_account_name: formData.bank_account_name,
                updated_at: new Date().toISOString()
            }

            if (formData.id) {
                const { error } = await supabase
                    .from('payment_settings')
                    .update(updatePayload)
                    .eq('id', formData.id)

                if (error) throw error
                showAlert('สำเร็จ', 'บันทึกข้อมูลการชำระเงินเรียบร้อยแล้ว', 'success')
            } else {
                const { error } = await supabase
                    .from('payment_settings')
                    .insert([updatePayload])

                if (error) throw error
                showAlert('สำเร็จ', 'สร้างข้อมูลการชำระเงินเรียบร้อยแล้ว', 'success')
                fetchPaymentSettings() // Refetch to get the new ID
            }
        } catch (error: unknown) {
            console.error('Save error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            showAlert('ข้อผิดพลาด', `เกิดข้อผิดพลาดในการบันทึก: ${errorMessage}`, 'error')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-secondary-500">กำลังโหลดข้อมูล...</div>
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-secondary-900">ช่องทางการชำระเงิน (Payment Settings)</h2>
                <p className="text-secondary-600 mt-1">ตั้งค่าบัญชีธนาคารและพร้อมเพย์ สำหรับแสดงในใบแจ้งหนี้ (E-Invoice)</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                <form onSubmit={handleSave} className="p-6 space-y-8">

                    {/* PromptPay Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b border-secondary-100 pb-2">ระบบพร้อมเพย์ (PromptPay)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">เบอร์พร้อมเพย์ / หมายเลขโทรศัพท์ / บัตรปชช.</label>
                                <input
                                    type="text"
                                    value={formData.promptpay_number}
                                    onChange={e => setFormData({ ...formData, promptpay_number: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-secondary-300"
                                    placeholder="เช่น 080-000-0000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">ชื่อบัญชีพร้อมเพย์</label>
                                <input
                                    type="text"
                                    value={formData.promptpay_name}
                                    onChange={e => setFormData({ ...formData, promptpay_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-secondary-300"
                                    placeholder="เช่น บริษัท เน็กโซร่า จำกัด"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bank Account Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b border-secondary-100 pb-2">บัญชีธนาคาร (Bank Transfer)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">ธนาคาร</label>
                                <input
                                    type="text"
                                    value={formData.bank_name}
                                    onChange={e => setFormData({ ...formData, bank_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-secondary-300"
                                    placeholder="เช่น ธนาคารกสิกรไทย"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">เลขที่บัญชี</label>
                                <input
                                    type="text"
                                    value={formData.bank_account_no}
                                    onChange={e => setFormData({ ...formData, bank_account_no: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-secondary-300"
                                    placeholder="เช่น 123-4-56789-0"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-secondary-700 mb-2">ชื่อบัญชี</label>
                                <input
                                    type="text"
                                    value={formData.bank_account_name}
                                    onChange={e => setFormData({ ...formData, bank_account_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-secondary-300"
                                    placeholder="เช่น บริษัท เน็กโซร่า แล็บส์ จำกัด"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-secondary-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-primary-200"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    กำลังบันทึก...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    บันทึกการตั้งค่า
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
