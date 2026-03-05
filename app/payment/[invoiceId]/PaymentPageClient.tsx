'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, CheckCircle2, AlertCircle, FileImage, Loader2, CreditCard, Building2, Smartphone } from 'lucide-react'
import Image from 'next/image'
import { getBankInfo } from '@/lib/banks'

interface Invoice {
    id: string
    client_name: string
    client_email: string
    package_details: string
    setup_fee: number
    monthly_fee: number
    due_date: string
    status: string
}

interface PaymentConfig {
    promptpay_number?: string
    promptpay_name?: string
    bank_name?: string
    bank_account_no?: string
    bank_account_name?: string
}

interface Props {
    invoice: Invoice
    paymentConfig: PaymentConfig | null
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export default function PaymentPageClient({ invoice, paymentConfig }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [uploadState, setUploadState] = useState<UploadState>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    // Helper to render bank logo
    const renderBankLogo = (logo: string, size: string = 'w-6 h-6') => {
        if (!logo) return null;
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Bank Logo" className={`${size} rounded-lg object-contain shrink-0`} />
        );
    };

    const totalAmount = Number(invoice.setup_fee) + Number(invoice.monthly_fee)
    const formattedTotal = totalAmount.toLocaleString('th-TH')
    const formattedDueDate = new Date(invoice.due_date).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
    const invoiceNo = `INV-${new Date(invoice.due_date).getFullYear()}${String(new Date(invoice.due_date).getMonth() + 1).padStart(2, '0')}-${invoice.id.substring(0, 4).toUpperCase()}`

    const isAlreadyPaid = invoice.status === 'paid'

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
            setErrorMsg('รองรับเฉพาะไฟล์รูปภาพ (.jpg, .png, .webp) เท่านั้น')
            return
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setErrorMsg('ขนาดไฟล์ต้องไม่เกิน 5MB')
            return
        }

        setErrorMsg('')
        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    async function handleSubmit() {
        if (!selectedFile) return
        setUploadState('uploading')
        setErrorMsg('')

        try {
            // 1. Upload the image to Supabase Storage
            const fileExt = selectedFile.name.split('.').pop()
            const fileName = `${invoice.id}-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('payment-slips')
                .upload(fileName, selectedFile, { contentType: selectedFile.type, upsert: false })

            if (uploadError) throw uploadError

            // 2. Get the public URL for the file
            const { data: urlData } = supabase.storage
                .from('payment-slips')
                .getPublicUrl(fileName)

            const slipUrl = urlData.publicUrl

            // 3. Insert record into payment_submissions via API and Trigger Telegram Push
            const response = await fetch('/api/payment-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoice_id: invoice.id,
                    amount: totalAmount,
                    slip_url: slipUrl,
                    client_name: invoice.client_name,
                    package_details: invoice.package_details
                })
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.error || 'Failed to submit payment')
            }

            setUploadState('success')
        } catch (err: unknown) {
            console.error('Upload error:', err)
            const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
            setErrorMsg(msg)
            setUploadState('error')
        }
    }

    if (isAlreadyPaid) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
                <div className="card p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-secondary-900 mb-3">ชำระเงินเรียบร้อยแล้ว</h1>
                    <p className="text-secondary-600">ใบแจ้งหนี้ <strong className="text-secondary-900">{invoiceNo}</strong> ได้รับการชำระเงินสำเร็จแล้วครับ</p>
                    <p className="text-sm text-secondary-400 mt-4">ขอบคุณที่ไว้วางใจ VELOZI | Dev 🙏</p>
                </div>
            </div>
        )
    }

    if (uploadState === 'success') {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
                <div className="card p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-secondary-900 mb-3">ส่งสลิปเรียบร้อยแล้ว! ✅</h1>
                    <p className="text-secondary-600 leading-relaxed">ขอบคุณครับ ทีมงานจะตรวจสอบสลิปการโอนของคุณและทำการยืนยัน<br />คุณจะได้รับอีเมลยืนยันใบเสร็จรับเงินเมื่อตรวจสอบเสร็จสิ้นครับ</p>
                    <p className="text-sm text-secondary-400 mt-6">ขอบคุณที่ไว้วางใจ VELOZI | Dev 🙏</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen gradient-bg py-10 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-secondary-900 tracking-tight">VELOZI <span className="text-secondary-400 font-light">|</span> Dev</h1>
                    <p className="text-primary-600 mt-2 text-sm font-medium">Billing Team | ชำระค่าบริการ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Invoice Details Card */}
                    <div className="card p-6">
                        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-secondary-100">
                            <CreditCard className="w-5 h-5 text-primary-600" />
                            <h2 className="font-semibold text-secondary-900">รายละเอียดใบแจ้งหนี้</h2>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-secondary-500">เลขที่ใบแจ้งหนี้</span>
                                <span className="font-mono text-secondary-900 bg-secondary-50 px-2 py-1 rounded-md border border-secondary-200">{invoiceNo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-500">ชื่อลูกค้า</span>
                                <span className="font-medium text-secondary-900">{invoice.client_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-500">บริการ</span>
                                <span className="text-right text-secondary-900 max-w-[55%]">{invoice.package_details}</span>
                            </div>
                            <div className="border-t border-secondary-100 pt-3 mt-3 space-y-2">
                                {Number(invoice.setup_fee) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-secondary-500">ค่าบริการแรกเข้า</span>
                                        <span className="text-secondary-900">฿{Number(invoice.setup_fee).toLocaleString('th-TH')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-secondary-500">ค่าดูแลรายเดือน</span>
                                    <span className="text-secondary-900">฿{Number(invoice.monthly_fee).toLocaleString('th-TH')}</span>
                                </div>
                                <div className="flex justify-between font-bold text-base pt-3 mt-1 border-t border-secondary-100">
                                    <span className="text-secondary-900">ยอดชำระสุทธิ</span>
                                    <span className="text-primary-600 text-xl">฿{formattedTotal}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-4 pt-3 border-t border-dashed border-secondary-200">
                                <span className="text-secondary-500">กำหนดชำระ</span>
                                <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 font-medium flex items-center gap-1">
                                    📅 {formattedDueDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods Card */}
                    <div className="card p-6">
                        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-secondary-100">
                            <h2 className="font-semibold text-secondary-900">ช่องทางการชำระเงิน</h2>
                        </div>
                        <div className="space-y-4">
                            {paymentConfig?.promptpay_number && (
                                <div className="bg-slate-50 rounded-xl p-4 border border-secondary-200 relative overflow-hidden group hover:border-primary-300 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Smartphone className="w-5 h-5 text-primary-600" />
                                        <span className="text-sm font-semibold text-secondary-900">PromptPay</span>
                                    </div>
                                    <p className="text-xs text-secondary-500">หมายเลข PromptPay</p>
                                    <p className="font-mono text-lg font-bold text-secondary-900 mt-1">{paymentConfig.promptpay_number}</p>
                                    <p className="text-sm text-secondary-600 mt-1">ชื่อบัญชี: <span className="font-medium text-secondary-900">{paymentConfig.promptpay_name}</span></p>
                                </div>
                            )}
                            {paymentConfig?.bank_account_no && (() => {
                                const bankInfo = getBankInfo(paymentConfig.bank_name || '');
                                return (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-secondary-200 relative overflow-hidden group hover:border-primary-300 transition-colors">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-3">
                                                {bankInfo && bankInfo.code !== 'OTHER' && bankInfo.code !== 'CUSTOM' ? (
                                                    renderBankLogo(bankInfo.logo, 'w-8 h-8')
                                                ) : (
                                                    <Building2 className="w-6 h-6 text-primary-600" />
                                                )}
                                                <span className="text-sm font-semibold text-secondary-900">โอนผ่านธนาคาร</span>
                                            </div>
                                            <p className="text-xs text-secondary-500">ธนาคาร: <span className="text-secondary-900 font-medium">{paymentConfig.bank_name}</span></p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="font-mono text-xl font-bold text-secondary-900 tracking-wider">{paymentConfig.bank_account_no}</p>
                                            </div>
                                            <p className="text-sm text-secondary-600 mt-2">ชื่อบัญชี: <span className="text-secondary-900 font-medium">{paymentConfig.bank_account_name}</span></p>
                                        </div>
                                    </div>
                                )
                            })()}
                            {!paymentConfig?.promptpay_number && !paymentConfig?.bank_account_no && (
                                <p className="text-sm text-secondary-500 text-center py-4 bg-secondary-50 rounded-lg border border-dashed border-secondary-200">
                                    กรุณาติดต่อทีมงานเพื่อรับข้อมูลการชำระเงินครับ
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Slip Upload Section */}
                <div className="mt-6 card p-6">
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-secondary-100">
                        <Upload className="w-5 h-5 text-primary-600" />
                        <h2 className="font-semibold text-secondary-900">แนบสลิปการโอนเงิน</h2>
                    </div>

                    {/* File Upload Area */}
                    <label className="relative block border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all group bg-secondary-50/50">
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                        {previewUrl ? (
                            <div className="relative inline-block">
                                <Image src={previewUrl} alt="slip preview" width={280} height={280} className="max-h-64 w-auto mx-auto rounded-lg object-contain shadow-md border border-secondary-200" />
                                <p className="text-xs text-secondary-500 mt-3 font-medium">คลิกเพื่อเปลี่ยนรูป</p>
                            </div>
                        ) : (
                            <div>
                                <FileImage className="w-14 h-14 text-secondary-300 mx-auto mb-3 group-hover:text-primary-500 transition-colors" />
                                <p className="text-secondary-700 font-medium text-sm">คลิกหรือลากวางไฟล์สลิปที่นี่</p>
                                <p className="text-secondary-400 text-xs mt-1">รองรับ .jpg, .png, .webp ขนาดสูงสุด 5MB</p>
                            </div>
                        )}
                    </label>

                    {errorMsg && (
                        <div className="flex items-center gap-2 mt-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedFile || uploadState === 'uploading'}
                        className="mt-6 w-full btn-primary py-4 text-base"
                    >
                        {uploadState === 'uploading' ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> กำลังส่งสลิป...</>
                        ) : (
                            <><Upload className="w-5 h-5" /> ส่งสลิปการโอนเงิน</>
                        )}
                    </button>

                    <p className="text-xs text-secondary-500 text-center mt-4">
                        ทีมงานจะตรวจสอบสลิปและส่งใบเสร็จรับเงินผ่านอีเมล <span className="font-medium text-secondary-700">{invoice.client_email}</span> ภายใน 1 วันทำการครับ
                    </p>
                </div>

                <p className="text-center text-secondary-400 text-xs mt-8">© {new Date().getFullYear()} VELOZI | Dev. All rights reserved.</p>
            </div>
        </div>
    )
}
