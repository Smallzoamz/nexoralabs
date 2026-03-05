'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Save, ChevronDown, Check } from 'lucide-react'
import { useModal } from '@/lib/modal-context'
import { useAuth } from '@/lib/auth-context'
import { THAI_BANKS, getBankInfo } from '@/lib/banks'

export function PaymentSettings() {
    const { isReadOnly } = useAuth()
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
    const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false)
    const [customBankName, setCustomBankName] = useState('')

    const selectedBank = getBankInfo(formData.bank_name);

    // Helper to render bank logo from SVG
    const renderBankLogo = (logo: string, size: string = 'w-6 h-6') => {
        if (!logo) return null;
        return (
            <div
                className={`${size} rounded-lg flex items-center justify-center shrink-0 overflow-hidden`}
                dangerouslySetInnerHTML={{ __html: logo }}
            />
        );
    };

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
                const bankInfo = getBankInfo(data.bank_name || '');
                if (bankInfo?.code === 'CUSTOM') {
                    setCustomBankName(data.bank_name || '');
                }
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
        if (isReadOnly) {
            showAlert('Demo Mode', 'คุณอยู่ในโหมดทดลองใช้ ไม่สามารถบันทึกการตั้งค่าได้', 'warning')
            return
        }
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

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200">
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
                            <div className="relative">
                                <label className="block text-sm font-medium text-secondary-700 mb-2">ธนาคาร</label>

                                {/* Custom Dropdown Trigger */}
                                <button
                                    type="button"
                                    onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                                    className="w-full flex items-center justify-between px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                                >
                                    {selectedBank ? (
                                        <div className="flex items-center gap-3">
                                            {renderBankLogo(selectedBank.logo, 'w-8 h-8')}
                                            <span className="text-secondary-900 truncate">{selectedBank.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-secondary-400">เลือกธนาคาร</span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-secondary-500 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isBankDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsBankDropdownOpen(false)}
                                        />
                                        <div className="absolute z-50 w-full mt-2 bg-white border border-secondary-200 rounded-xl shadow-lg max-h-[300px] overflow-y-auto py-2">
                                            {THAI_BANKS.map((bank) => (
                                                <button
                                                    key={bank.code}
                                                    type="button"
                                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary-50 transition-colors"
                                                    onClick={() => {
                                                        setFormData({ ...formData, bank_name: bank.code === 'OTHER' ? customBankName : bank.name })
                                                        setIsBankDropdownOpen(false)
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {renderBankLogo(bank.logo, 'w-10 h-10')}
                                                        <span className="text-secondary-900 font-medium">{bank.name}</span>
                                                    </div>
                                                    {selectedBank?.code === bank.code && <Check className="w-5 h-5 text-primary-600" />}
                                                </button>
                                            ))}

                                            {/* Custom Input when OTHER is selected or a custom name already exists */}
                                            {(selectedBank?.code === 'OTHER' || selectedBank?.code === 'CUSTOM') && (
                                                <div className="px-4 pb-2 pt-3 border-t border-secondary-100 mt-2">
                                                    <label className="block text-xs font-medium text-secondary-500 mb-2">ระบุชื่อธนาคาร / ช่องทางอื่นๆ</label>
                                                    <input
                                                        type="text"
                                                        value={selectedBank.code === 'CUSTOM' ? formData.bank_name : customBankName}
                                                        onChange={e => {
                                                            setCustomBankName(e.target.value)
                                                            setFormData({ ...formData, bank_name: e.target.value })
                                                        }}
                                                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                        placeholder="เช่น PayPal, บัญชีต่างประเทศ"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
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
