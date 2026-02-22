'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, CheckCircle2, AlertCircle, FileImage, Loader2, CreditCard, Building2, Smartphone } from 'lucide-react'
import Image from 'next/image'

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

            // 3. Insert record into payment_submissions
            const { error: dbError } = await supabase
                .from('payment_submissions')
                .insert({
                    invoice_id: invoice.id,
                    amount: totalAmount,
                    slip_url: slipUrl,
                    status: 'pending'
                })

            if (dbError) throw dbError

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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-3">ชำระเงินเรียบร้อยแล้ว</h1>
                    <p className="text-slate-500">ใบแจ้งหนี้ <strong>{invoiceNo}</strong> ได้รับการชำระเงินสำเร็จแล้วครับ</p>
                    <p className="text-sm text-slate-400 mt-4">ขอบคุณที่ไว้วางใจ Nexora Labs 🙏</p>
                </div>
            </div>
        )
    }

    if (uploadState === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-3">ส่งสลิปเรียบร้อยแล้ว! ✅</h1>
                    <p className="text-slate-600 leading-relaxed">ขอบคุณครับ ทีมงานจะตรวจสอบสลิปการโอนของคุณและทำการยืนยัน<br />คุณจะได้รับอีเมลยืนยันใบเสร็จรับเงินเมื่อตรวจสอบเสร็จสิ้นครับ</p>
                    <p className="text-sm text-slate-400 mt-6">ขอบคุณที่ไว้วางใจ Nexora Labs 🙏</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Nexora Labs</h1>
                    <p className="text-indigo-300 mt-1 text-sm">Billing Team | ชำระค่าบริการ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Invoice Details Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/10">
                        <div className="flex items-center gap-2 mb-5">
                            <CreditCard className="w-5 h-5 text-indigo-300" />
                            <h2 className="font-semibold text-white">รายละเอียดใบแจ้งหนี้</h2>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">เลขที่ใบแจ้งหนี้</span>
                                <span className="font-mono text-indigo-300">{invoiceNo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">ชื่อลูกค้า</span>
                                <span className="font-medium">{invoice.client_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">บริการ</span>
                                <span className="text-right max-w-[55%]">{invoice.package_details}</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                                {Number(invoice.setup_fee) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">ค่าบริการแรกเข้า</span>
                                        <span>฿{Number(invoice.setup_fee).toLocaleString('th-TH')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-400">ค่าดูแลรายเดือน</span>
                                    <span>฿{Number(invoice.monthly_fee).toLocaleString('th-TH')}</span>
                                </div>
                                <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                                    <span>ยอดชำระสุทธิ</span>
                                    <span className="text-indigo-300 text-xl">฿{formattedTotal}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs mt-2">
                                <span className="text-slate-400">กำหนดชำระ</span>
                                <span className="text-amber-300 font-medium">📅 {formattedDueDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/10">
                        <h2 className="font-semibold text-white mb-5">ช่องทางการชำระเงิน</h2>
                        <div className="space-y-4">
                            {paymentConfig?.promptpay_number && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Smartphone className="w-4 h-4 text-indigo-300" />
                                        <span className="text-sm font-semibold text-indigo-200">PromptPay</span>
                                    </div>
                                    <p className="text-xs text-slate-400">หมายเลข PromptPay</p>
                                    <p className="font-mono text-lg font-bold mt-1">{paymentConfig.promptpay_number}</p>
                                    <p className="text-sm text-slate-300 mt-1">ชื่อบัญชี: {paymentConfig.promptpay_name}</p>
                                </div>
                            )}
                            {paymentConfig?.bank_account_no && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 className="w-4 h-4 text-indigo-300" />
                                        <span className="text-sm font-semibold text-indigo-200">โอนผ่านธนาคาร</span>
                                    </div>
                                    <p className="text-xs text-slate-400">ธนาคาร: {paymentConfig.bank_name}</p>
                                    <p className="font-mono text-lg font-bold mt-1">{paymentConfig.bank_account_no}</p>
                                    <p className="text-sm text-slate-300 mt-1">ชื่อบัญชี: {paymentConfig.bank_account_name}</p>
                                </div>
                            )}
                            {!paymentConfig?.promptpay_number && !paymentConfig?.bank_account_no && (
                                <p className="text-sm text-slate-400 text-center py-4">กรุณาติดต่อทีมงานเพื่อรับข้อมูลการชำระเงินครับ</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Slip Upload Section */}
                <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-5">
                        <Upload className="w-5 h-5 text-indigo-300" />
                        <h2 className="font-semibold text-white">แนบสลิปการโอนเงิน</h2>
                    </div>

                    {/* File Upload Area */}
                    <label className="relative block border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors group">
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                        {previewUrl ? (
                            <div className="relative inline-block">
                                <Image src={previewUrl} alt="slip preview" width={280} height={280} className="max-h-64 w-auto mx-auto rounded-lg object-contain shadow-lg" />
                                <p className="text-xs text-slate-300 mt-3">คลิกเพื่อเปลี่ยนรูป</p>
                            </div>
                        ) : (
                            <div>
                                <FileImage className="w-14 h-14 text-white/20 mx-auto mb-3 group-hover:text-indigo-300 transition-colors" />
                                <p className="text-white/60 text-sm">คลิกหรือลากวางไฟล์สลิปที่นี่</p>
                                <p className="text-white/30 text-xs mt-1">รองรับ .jpg, .png, .webp ขนาดสูงสุด 5MB</p>
                            </div>
                        )}
                    </label>

                    {errorMsg && (
                        <div className="flex items-center gap-2 mt-3 text-red-300 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedFile || uploadState === 'uploading'}
                        className="mt-5 w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                    >
                        {uploadState === 'uploading' ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> กำลังส่งสลิป...</>
                        ) : (
                            <><Upload className="w-5 h-5" /> ส่งสลิปการโอนเงิน</>
                        )}
                    </button>

                    <p className="text-xs text-slate-400 text-center mt-3">
                        ทีมงานจะตรวจสอบสลิปและส่งใบเสร็จรับเงินผ่านอีเมล {invoice.client_email} ภายใน 1 วันทำการครับ
                    </p>
                </div>

                <p className="text-center text-slate-500 text-xs mt-6">© {new Date().getFullYear()} Nexora Labs. All rights reserved.</p>
            </div>
        </div>
    )
}
