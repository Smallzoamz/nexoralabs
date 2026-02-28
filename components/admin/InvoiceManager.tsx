'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Mail, FileDown, Receipt, CheckCheck, XCircle, ExternalLink, Loader2, Download, FileArchive } from 'lucide-react'
import { z } from 'zod'
import { useModal } from '@/lib/modal-context'
import { useAuth } from '@/lib/auth-context'
import { logAdminAction } from '@/lib/admin-logger'

// We cannot use next/dynamic here because we need the static function, not a Component
// So we will just import and use it dynamically inside the click handler to avoid SSR issues.

const invoiceSchema = z.object({
    client_name: z.string().min(2, 'กรุณากรอกชื่อลูกค้า'),
    client_email: z.string().email('อีเมลไม่ถูกต้อง'),
    package_details: z.string().min(2, 'กรุณากรอกรายละเอียดแพ็กเกจ'),
    setup_fee: z.number().min(0, 'ค่าบริการแรกเข้าต้องไม่ติดลบ'),
    monthly_fee: z.number().min(0, 'ค่าบริการรายเดือนต้องไม่ติดลบ'),
    due_date: z.string().min(1, 'กรุณาเลือกวันครบกำหนดชำระ'),
    status: z.enum(['pending', 'paid', 'cancelled']),
    project_status: z.enum(['pending', 'planning', 'designing', 'developing', 'testing', 'completed']).optional()
})

interface InvoiceRecord {
    id: string;
    client_name: string;
    client_email: string;
    package_details: string;
    setup_fee: number;
    monthly_fee: number;
    due_date: string;
    status: 'pending' | 'paid' | 'cancelled';
    project_status?: 'pending' | 'planning' | 'designing' | 'developing' | 'testing' | 'completed';
    tracking_code?: string;
    created_at?: string;
    updated_at?: string;
}

interface PaymentSubmission {
    id: string;
    invoice_id: string;
    amount: number;
    slip_url: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at: string;
    invoice: {
        client_name: string;
        client_email: string;
        package_details: string;
        monthly_fee: number;
        setup_fee: number;
        due_date: string;
    };
}

export function InvoiceManager() {
    const { showAlert, showConfirm } = useModal()
    const { user } = useAuth()
    const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
    const [availablePackages, setAvailablePackages] = useState<{ name: string, setup_price_min: number, monthly_price_min: number }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [sendingEmailId, setSendingEmailId] = useState<string | null>(null)
    const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null)
    const [downloadingReceiptId, setDownloadingReceiptId] = useState<string | null>(null)
    const [downloadingContractId, setDownloadingContractId] = useState<string | null>(null)
    const [pendingSubmissions, setPendingSubmissions] = useState<PaymentSubmission[]>([])
    const [approvedSubmissions, setApprovedSubmissions] = useState<PaymentSubmission[]>([])
    const [viewingSlip, setViewingSlip] = useState<PaymentSubmission | null>(null)
    const [processingSlipId, setProcessingSlipId] = useState<string | null>(null)
    const [signedSlipUrl, setSignedSlipUrl] = useState<string | null>(null)
    const [slipYearFilter, setSlipYearFilter] = useState(new Date().getFullYear())
    const [paymentConfig, setPaymentConfig] = useState<{
        promptpay_number: string;
        promptpay_name: string;
        bank_name: string;
        bank_account_no: string;
        bank_account_name: string;
    } | null>(null)
    const [siteInfo, setSiteInfo] = useState({
        name: 'VELOZI | Dev',
        description: 'บริการออกแบบและพัฒนาระบบเว็บไซต์ครบวงจร',
        email: 'contact@velozi.dev',
        website: (process.env.NEXT_PUBLIC_SITE_URL || 'www.nexoralabs.com').replace(/^https?:\/\//, ''),
        address: '',
        ownerSignature: ''
    })

    // Form state
    const [paymentType, setPaymentType] = useState<'full' | 'installment'>('full')
    const [installments, setInstallments] = useState<{ amount: number, dueDate: string }[]>([
        { amount: 0, dueDate: new Date().toISOString().split('T')[0] }
    ])
    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        package_details: '',
        setup_fee: 0,
        monthly_fee: 0,
        due_date: new Date().toISOString().split('T')[0],
        status: 'pending' as 'pending' | 'paid' | 'cancelled',
        project_status: 'pending' as 'pending' | 'planning' | 'designing' | 'developing' | 'testing' | 'completed'
    })

    const fetchData = useCallback(async () => {
        try {
            const [invoicesRes, packagesRes, paymentRes, submissionsRes, approvedRes, siteConfRes] = await Promise.all([
                supabase.from('invoices').select('*').order('created_at', { ascending: false }),
                supabase.from('packages').select('name, setup_price_min, monthly_price_min').eq('is_active', true).order('order', { ascending: true }),
                supabase.from('payment_settings').select('*').limit(1).maybeSingle(),
                supabase.from('payment_submissions')
                    .select('*, invoice:invoice_id(client_name, client_email, package_details, monthly_fee, setup_fee, due_date)')
                    .eq('status', 'pending')
                    .order('submitted_at', { ascending: false }),
                supabase.from('payment_submissions')
                    .select('*, invoice:invoice_id(client_name, client_email, package_details, monthly_fee, setup_fee, due_date)')
                    .eq('status', 'approved')
                    .order('submitted_at', { ascending: false }),
                supabase.from('site_config').select('site_name, site_description, contact_email, contact_address, owner_signature').limit(1).maybeSingle()
            ])

            if (invoicesRes.error) throw invoicesRes.error
            setInvoices(invoicesRes.data || [])

            if (packagesRes.data) setAvailablePackages(packagesRes.data)
            if (paymentRes.data) setPaymentConfig(paymentRes.data)
            if (!submissionsRes.error && submissionsRes.data) {
                setPendingSubmissions(submissionsRes.data as unknown as PaymentSubmission[])
            }
            if (!approvedRes.error && approvedRes.data) {
                setApprovedSubmissions(approvedRes.data as unknown as PaymentSubmission[])
            }

            if (siteConfRes?.data) {
                setSiteInfo(prev => ({
                    ...prev,
                    name: siteConfRes.data?.site_name || 'VELOZI | Dev',
                    description: siteConfRes.data?.site_description || 'บริการออกแบบและพัฒนาระบบเว็บไซต์ครบวงจร',
                    email: siteConfRes.data?.contact_email || 'contact@velozi.dev',
                    address: siteConfRes.data?.contact_address || '',
                    ownerSignature: siteConfRes.data?.owner_signature || ''
                }))
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleEdit = (invoice: InvoiceRecord) => {
        setFormData({
            client_name: invoice.client_name,
            client_email: invoice.client_email,
            package_details: invoice.package_details,
            setup_fee: invoice.setup_fee,
            monthly_fee: invoice.monthly_fee,
            due_date: invoice.due_date || new Date().toISOString().split('T')[0],
            status: invoice.status,
            project_status: invoice.project_status || 'pending'
        })
        setEditingId(invoice.id)
        setPaymentType('full') // Always edit individually
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!(await showConfirm('ยืนยัน', 'คุณต้องการลบใบแจ้งหนี้นี้ใช่หรือไม่?'))) return

        try {
            const { error } = await supabase.from('invoices').delete().eq('id', id)
            if (error) throw error
            setInvoices(invoices.filter(inv => inv.id !== id))
            logAdminAction(user?.email || 'System', 'DELETE_INVOICE', `ลบใบแจ้งหนี้ ID: ${id}`)
        } catch (error) {
            console.error('Error deleting invoice:', error)
            showAlert('ข้อผิดพลาด', 'ลบไม่สำเร็จ', 'error')
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Validate
            invoiceSchema.parse(formData)

            const payload = {
                ...formData,
                updated_at: new Date().toISOString()
            }

            if (editingId && editingId !== 'new') {
                if (paymentType === 'installment') throw new Error('ไม่สามารถแก้ไขใบแจ้งหนี้เดิมให้เป็นแบบแบ่งงวดชำระได้ กรุณายกเลิกบิลเก่าและสร้างใหม่')
                const { error, data } = await supabase
                    .from('invoices')
                    .update(payload)
                    .eq('id', editingId)
                    .select()
                    .single()

                if (error) throw error
                setInvoices(invoices.map(inv => inv.id === editingId ? data : inv))
            } else {
                // Reuse tracking code if same client/project already has one
                const { data: existingInvoice } = await supabase
                    .from('invoices')
                    .select('tracking_code')
                    .eq('client_name', payload.client_name)
                    .not('tracking_code', 'is', null)
                    .limit(1)
                    .single()

                const insertPayload = existingInvoice?.tracking_code
                    ? { ...payload, tracking_code: existingInvoice.tracking_code }
                    : payload

                if (paymentType === 'installment') {
                    const totalInst = installments.reduce((sum, inst) => sum + (+inst.amount), 0)
                    if (totalInst !== formData.setup_fee) throw new Error(`ยอดรวมแบ่งชำระ (${totalInst.toLocaleString()} ฿) ไม่ตรงกับ Setup Fee (${formData.setup_fee.toLocaleString()} ฿)`)

                    const payloads = installments.map((inst, idx) => ({
                        ...insertPayload,
                        package_details: `${insertPayload.package_details} (งวดที่ ${idx + 1}/${installments.length})`,
                        setup_fee: +inst.amount,
                        monthly_fee: idx === 0 ? insertPayload.monthly_fee : 0, // Charge monthly fee on the first installment
                        due_date: inst.dueDate
                    }))

                    const { error, data } = await supabase
                        .from('invoices')
                        .insert(payloads)
                        .select()

                    if (error) throw error
                    setInvoices([...data, ...invoices])
                    logAdminAction(user?.email || 'System', 'CREATE_INVOICE', `สร้างใบแจ้งหนี้แบ่งชำระ ${installments.length} งวด สำหรับ ${payload.client_name}`)
                } else {
                    const { error, data } = await supabase
                        .from('invoices')
                        .insert([insertPayload])
                        .select()
                        .single()

                    if (error) throw error
                    setInvoices([data, ...invoices])
                    logAdminAction(user?.email || 'System', 'CREATE_INVOICE', `สร้างใบแจ้งหนี้ใหม่สำหรับ ${payload.client_name}`)
                }
            }

            if (editingId && editingId !== 'new') {
                logAdminAction(user?.email || 'System', 'UPDATE_INVOICE', `แก้ไขใบแจ้งหนี้ของ ${payload.client_name}`)
            }

            setIsEditing(false)
            setEditingId(null)

        } catch (err: unknown) {
            console.error('Save error:', err)
            if (err instanceof z.ZodError) {
                showAlert('ข้อมูลไม่ถูกต้อง', `เกิดข้อผิดพลาด: ${err.errors[0].message}`, 'error')
            } else {
                showAlert('ข้อผิดพลาด', 'บันทึกไม่สำเร็จ', 'error')
            }
        }
    }

    const handleSendEmail = async (invoice: InvoiceRecord) => {
        if (!(await showConfirm('ยืนยันส่งอีเมล', `ยืนยันการส่ง E-Invoice ไปยัง ${invoice.client_email} ใช่หรือไม่?`))) return

        setSendingEmailId(invoice.id)

        try {
            // 1. Generate Invoice PDF as Base64 String
            const html2pdfModule = (await import('html2pdf.js')).default

            const invoiceElement = document.getElementById(`invoice-pdf-${invoice.id}`)
            if (!invoiceElement) throw new Error('ไม่พบแบบฟอร์มใบแจ้งหนี้เพื่อสร้าง PDF แนบอีเมล')

            invoiceElement.style.display = 'block'

            const invoiceOpt = {
                margin: 0,
                filename: `Invoice_${invoice.id}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 793, width: 793 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            }

            const pdfBase64DataUri = await html2pdfModule().set(invoiceOpt).from(invoiceElement).outputPdf('datauristring')
            invoiceElement.style.display = 'none'

            // 2. Check if this is first invoice of project to add Service Contract
            const isFirstOfProject = !invoices.some(
                inv => inv.client_name === invoice.client_name &&
                    inv.id !== invoice.id &&
                    new Date(inv.created_at || 0) < new Date(invoice.created_at || 0)
            )

            let serviceContractBase64 = null
            let installmentScheduleBase64 = null

            // 3. Generate Service Contract PDF for first invoice of project
            if (isFirstOfProject) {
                const contractElement = document.getElementById(`service-contract-pdf-${invoice.id}`)
                if (contractElement) {
                    contractElement.style.display = 'block'
                    const contractOpt = {
                        margin: 0,
                        filename: `สัญญาจ้าง_${invoice.client_name.replace(/\s+/g, '_')}.pdf`,
                        image: { type: 'jpeg' as const, quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 793, width: 793 },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
                    }
                    serviceContractBase64 = await html2pdfModule().set(contractOpt).from(contractElement).outputPdf('datauristring')
                    contractElement.style.display = 'none'
                }
            }

            // 4. Generate Installment Schedule PDF for installment payments
            if (invoice.package_details.includes('(งวดที่ 1/') && isFirstOfProject) {
                const instElement = document.getElementById(`contract-pdf-${invoice.id}`)
                if (instElement) {
                    instElement.style.display = 'block'
                    const instOpt = {
                        margin: 0,
                        filename: `ตารางการแบ่งชำระ_${invoice.client_name.replace(/\s+/g, '_')}.pdf`,
                        image: { type: 'jpeg' as const, quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 793, width: 793 },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
                    }
                    installmentScheduleBase64 = await html2pdfModule().set(instOpt).from(instElement).outputPdf('datauristring')
                    instElement.style.display = 'none'
                }
            }

            // 5. Send to API
            const response = await fetch('/api/send-invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    invoice,
                    pdfBase64: pdfBase64DataUri,
                    serviceContractBase64,
                    installmentScheduleBase64
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'ส่งอีเมลไม่สำเร็จ')
            }

            showAlert('สำเร็จ', 'ส่งอีเมลพร้อมเอกสารแนบสำเร็จเรียบร้อยแล้ว!', 'success')

        } catch (error: unknown) {
            console.error('Error sending email:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            showAlert('ข้อผิดพลาด', `ข้อผิดพลาด: ${errorMessage}`, 'error')
            // Ensure elements are hidden even if error occurs
            const invoiceElement = document.getElementById(`invoice-pdf-${invoice.id}`)
            if (invoiceElement) invoiceElement.style.display = 'none'
            const contractElement = document.getElementById(`service-contract-pdf-${invoice.id}`)
            if (contractElement) contractElement.style.display = 'none'
            const instElement = document.getElementById(`contract-pdf-${invoice.id}`)
            if (instElement) instElement.style.display = 'none'
        } finally {
            setSendingEmailId(null)
        }
    }

    const handleDownloadPdf = async (invoice: InvoiceRecord) => {
        setDownloadingPdfId(invoice.id)
        try {
            // Import dynamically just in case
            const html2pdfModule = (await import('html2pdf.js')).default

            const element = document.getElementById(`invoice-pdf-${invoice.id}`)
            if (!element) throw new Error('ไม่พบแบบฟอร์มใบแจ้งหนี้')

            // Make element visible for html2pdf to process
            element.style.display = 'block'

            const opt = {
                margin: 0,
                filename: `Invoice_${invoice.client_name.replace(/\s+/g, '_')}_${new Date(invoice.created_at || Date.now()).getTime()}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 793, width: 793 }, // A4 width at 96dpi approx
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            }

            // Generate PDF
            await html2pdfModule().set(opt).from(element).save()

            // Hide element again
            element.style.display = 'none'

        } catch (error: unknown) {
            console.error('Error generating PDF:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            showAlert('ข้อผิดพลาด', `ข้อผิดพลาดในการสร้าง PDF: ${errorMessage}`, 'error')
        } finally {
            setDownloadingPdfId(null)
        }
    }

    const handleDownloadReceipt = async (invoice: InvoiceRecord) => {
        setDownloadingReceiptId(invoice.id)
        try {
            const html2pdfModule = (await import('html2pdf.js')).default

            const element = document.getElementById(`receipt-pdf-${invoice.id}`)
            if (!element) throw new Error('ไม่พบแบบฟอร์มใบเสร็จรับเงิน')

            element.style.display = 'block'

            const opt = {
                margin: 0,
                filename: `Receipt_${invoice.client_name.replace(/\s+/g, '_')}_${new Date(invoice.created_at || Date.now()).getTime()}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 793, width: 793 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            }

            await html2pdfModule().set(opt).from(element).save()

            element.style.display = 'none'

        } catch (error: unknown) {
            console.error('Error generating PDF:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            showAlert('ข้อผิดพลาด', `ข้อผิดพลาดในการสร้างใบเสร็จ: ${errorMessage}`, 'error')
        } finally {
            setDownloadingReceiptId(null)
        }
    }

    const handleDownloadContract = async (invoice: InvoiceRecord) => {
        setDownloadingContractId(invoice.id)
        try {
            const html2pdfModule = (await import('html2pdf.js')).default

            const element = document.getElementById(`contract-pdf-${invoice.id}`)
            if (!element) throw new Error('ไม่พบแบบฟอร์มเอกสารสัญญา')

            element.style.display = 'block'

            const opt = {
                margin: 0,
                filename: `Contract_${invoice.client_name.replace(/\s+/g, '_')}_${new Date(invoice.created_at || Date.now()).getTime()}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 793, width: 793 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            }

            await html2pdfModule().set(opt).from(element).save()

            element.style.display = 'none'

        } catch (error: unknown) {
            console.error('Error generating Contract PDF:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            showAlert('ข้อผิดพลาด', `ข้อผิดพลาดในการสร้างสัญญา: ${errorMessage}`, 'error')
        } finally {
            setDownloadingContractId(null)
        }
    }

    const handleDownloadServiceContract = async (invoice: InvoiceRecord) => {
        setDownloadingContractId(invoice.id)
        try {
            const html2pdfModule = (await import('html2pdf.js')).default

            const element = document.getElementById(`service-contract-pdf-${invoice.id}`)
            if (!element) throw new Error('ไมพบแบบฟอร์มสัญญาจ้าง')

            element.style.display = 'block'

            const opt = {
                margin: 0,
                filename: `สัญญาจ้าง_${invoice.client_name.replace(/\s+/g, '_')}_${new Date(invoice.created_at || Date.now()).getTime()}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 793, width: 793 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            }

            await html2pdfModule().set(opt).from(element).save()

            element.style.display = 'none'

        } catch (error: unknown) {
            console.error('Error generating Service Contract PDF:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            showAlert('ข้อผิดพลาด', `ข้อผิดพลาดในการสร้างสัญญาจ้าง: ${errorMessage}`, 'error')
        } finally {
            setDownloadingContractId(null)
        }
    }

    const handleApproveSlip = async (submission: PaymentSubmission) => {
        if (!(await showConfirm('ยืนยันการอนุมัติสลิป', `ยืนยันการชำระเงินของ "${submission.invoice?.client_name}" ใช่หรือไม่? ระบบจะส่งใบเสร็จ PDF อัตโนมัติ`))) return
        setProcessingSlipId(submission.id)
        try {
            // 1. Mark submission as approved
            await supabase.from('payment_submissions').update({ status: 'approved', verified_at: new Date().toISOString() }).eq('id', submission.id)

            // 2. Mark invoice as paid
            await supabase.from('invoices').update({ status: 'paid' }).eq('id', submission.invoice_id)

            // 3. Auto-generate next month's invoice (monthly fee only, setup_fee = 0)
            const inv = submission.invoice
            const nextDueDate = new Date(inv.due_date)
            nextDueDate.setMonth(nextDueDate.getMonth() + 1)

            // Reuse tracking code from same client/project
            const { data: existingCode } = await supabase
                .from('invoices')
                .select('tracking_code')
                .eq('client_name', inv.client_name)
                .not('tracking_code', 'is', null)
                .limit(1)
                .single()

            await supabase.from('invoices').insert({
                client_name: inv.client_name,
                client_email: inv.client_email,
                package_details: inv.package_details,
                setup_fee: 0,
                monthly_fee: inv.monthly_fee,
                due_date: nextDueDate.toISOString().split('T')[0],
                status: 'pending',
                ...(existingCode?.tracking_code ? { tracking_code: existingCode.tracking_code } : {})
            })

            logAdminAction(user?.email || 'System', 'APPROVE_SLIP', `อนุมัติสลิปและรอบบิลถัดไปให้ ${inv.client_name}`)

            // 4. Generate Receipt PDF as base64 to attach to email
            let pdfBase64: string | null = null
            try {
                const html2pdfModule = (await import('html2pdf.js')).default
                const element = document.getElementById(`receipt-pdf-${submission.invoice_id}`)
                if (element) {
                    element.style.display = 'block'
                    const opt = {
                        margin: 0,
                        filename: `Receipt_${inv.client_name}.pdf`,
                        image: { type: 'jpeg' as const, quality: 0.95 },
                        html2canvas: { scale: 2, useCORS: true, windowWidth: 793, width: 793 },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
                    }
                    pdfBase64 = await html2pdfModule().set(opt).from(element).outputPdf('datauristring')
                    element.style.display = 'none'
                }
            } catch (pdfErr) {
                console.warn('PDF generation failed, will send email without attachment:', pdfErr)
            }

            // 5. Send receipt email (+ PDF attachment if available)
            const res = await fetch('/api/send-receipt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceId: submission.invoice_id, amount: submission.amount, invoice: inv, pdfBase64 })
            })
            const result = await res.json()
            if (!res.ok) throw new Error(result.error || 'ส่งอีเมลใบเสร็จไม่สำเร็จ')

            closeSlipViewer()
            showAlert('สำเร็จ! ✅', 'อนุมัติสลิปแล้ว ส่งใบเสร็จ PDF แจ้งลูกค้าเรียบร้อย และสร้างบิลเดือนถัดไปให้อัตโนมัติแล้วครับ', 'success')
            fetchData()
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด'
            showAlert('ข้อผิดพลาด', msg, 'error')
        } finally {
            setProcessingSlipId(null)
        }
    }

    const handleRejectSlip = async (submission: PaymentSubmission) => {
        if (!(await showConfirm('ปฏิเสธสลิป', `ปฏิเสธสลิปของ "${submission.invoice?.client_name}" ใช่หรือไม่?`))) return
        setProcessingSlipId(submission.id)
        try {
            await supabase.from('payment_submissions').update({ status: 'rejected', verified_at: new Date().toISOString() }).eq('id', submission.id)
            setViewingSlip(null)
            showAlert('ปฏิเสธสลิปแล้ว', 'สลิปถูกปฏิเสธเรียบร้อยแล้วครับ', 'info')
            fetchData()
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด'
            showAlert('ข้อผิดพลาด', msg, 'error')
        } finally {
            setProcessingSlipId(null)
        }
    }

    const openSlipViewer = async (submission: PaymentSubmission) => {
        setViewingSlip(submission)
        setSignedSlipUrl(null) // reset while loading
        try {
            // Extract just the filename/path from the stored public URL
            const urlPath = submission.slip_url.split('/payment-slips/')[1]
            if (!urlPath) throw new Error('Invalid slip URL')
            const { data, error } = await supabase.storage
                .from('payment-slips')
                .createSignedUrl(urlPath, 3600) // Valid for 1 hour
            if (error) throw error
            setSignedSlipUrl(data.signedUrl)
        } catch {
            // Fallback: try to use the original URL (works if bucket is public)
            setSignedSlipUrl(submission.slip_url)
        }
    }

    const closeSlipViewer = () => {
        setViewingSlip(null)
        setSignedSlipUrl(null)
    }

    const handleDownloadSlip = async (submission: PaymentSubmission) => {
        try {
            const urlPath = submission.slip_url.split('/payment-slips/')[1]
            if (!urlPath) throw new Error('Invalid slip URL')
            const { data, error } = await supabase.storage
                .from('payment-slips')
                .createSignedUrl(urlPath, 60)
            if (error) throw error

            // Fetch as Blob → create object URL → force download (bypasses cross-origin restriction on `download` attr)
            const res = await fetch(data.signedUrl)
            const blob = await res.blob()
            const objectUrl = URL.createObjectURL(blob)

            const ext = urlPath.split('.').pop() ?? 'jpg'
            const date = new Date(submission.submitted_at).toISOString().split('T')[0]
            const a = document.createElement('a')
            a.href = objectUrl
            a.download = `Slip_${submission.invoice?.client_name?.replace(/\s+/g, '_')}_${date}.${ext}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(objectUrl)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'ดาวน์โหลดไม่สำเร็จ'
            showAlert('ข้อผิดพลาด', msg, 'error')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700'
            case 'pending': return 'bg-orange-100 text-orange-700'
            case 'cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-secondary-100 text-secondary-700'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'paid': return 'ชำระแล้ว'
            case 'pending': return 'รอชำระเงิน'
            case 'cancelled': return 'ยกเลิก'
            default: return status
        }
    }

    if (isLoading) return <div className="p-8 text-center text-secondary-500">กำลังโหลดข้อมูล...</div>

    if (isEditing) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200">
                <div className="p-6 border-b border-secondary-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-secondary-900">
                        {editingId === 'new' ? 'สร้าง E-Invoice ใหม่' : 'แก้ไข E-Invoice'}
                    </h2>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-secondary-500 hover:text-secondary-700"
                    >
                        ยกเลิก
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">ชื่อลูกค้า / บริษัท</label>
                                <input
                                    type="text"
                                    value={formData.client_name}
                                    onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">อีเมลลูกค้า</label>
                                <input
                                    type="email"
                                    value={formData.client_email}
                                    onChange={e => setFormData({ ...formData, client_email: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-secondary-700 mb-2">รายละเอียดแพ็กเกจ (แสดงในบิล)</label>
                                <select
                                    value={availablePackages.some(p => p.name === formData.package_details) ? formData.package_details : ''}
                                    onChange={e => {
                                        const selectedName = e.target.value;
                                        const pkg = availablePackages.find(p => p.name === selectedName);
                                        if (pkg) {
                                            setFormData({
                                                ...formData,
                                                package_details: selectedName,
                                                setup_fee: pkg.setup_price_min,
                                                monthly_fee: pkg.monthly_price_min
                                            });
                                        } else {
                                            setFormData({ ...formData, package_details: selectedName });
                                        }
                                    }}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                                    required
                                >
                                    <option value="" disabled>-- เลือกแพ็กเกจบริการ --</option>
                                    {availablePackages.map((pkg, idx) => (
                                        <option key={idx} value={pkg.name}>
                                            {pkg.name} (Setup เริ่มต้น ฿{pkg.setup_price_min.toLocaleString()} / รายเดือน ฿{pkg.monthly_price_min.toLocaleString()})
                                        </option>
                                    ))}
                                </select>
                                { /* เผื่อมีแพ็กเกจอื่นๆ นอกเหนือจาก dropdown ให้กรอกเองได้ถ้าเค้าเปลี่ยนชื่อ แต่เอาเบื้องต้นแบบนี้ไปก่อน */}
                                {formData.package_details && !availablePackages.some(p => p.name === formData.package_details) && (
                                    <input
                                        type="text"
                                        value={formData.package_details}
                                        onChange={e => setFormData({ ...formData, package_details: e.target.value })}
                                        placeholder="ระบุชื่อแพ็กเกจกำหนดเอง..."
                                        className="w-full px-4 py-2 border border-secondary-200 rounded-xl mt-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">ค่าบริการแรกเข้า (฿)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.setup_fee}
                                    onChange={e => setFormData({ ...formData, setup_fee: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">ค่าบริการดูแลรายเดือน (฿)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.monthly_fee}
                                    onChange={e => setFormData({ ...formData, monthly_fee: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">สถานะบิล (รพ.ชำระเงิน/จ่ายแล้ว)</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as 'pending' | 'paid' | 'cancelled' })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                                >
                                    <option value="pending">รอชำระเงิน</option>
                                    <option value="paid">ชำระแล้ว</option>
                                    <option value="cancelled">ยกเลิก</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">สถานะงาน (Project Tracker)</label>
                                <select
                                    value={formData.project_status}
                                    onChange={e => setFormData({ ...formData, project_status: e.target.value as 'pending' | 'planning' | 'designing' | 'developing' | 'testing' | 'completed' })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                                >
                                    <option value="pending">รอดำเนินการ (Pending)</option>
                                    <option value="planning">กำลังวางแผน (Planning)</option>
                                    <option value="designing">กำลังออกแบบ (Designing)</option>
                                    <option value="developing">กำลังพัฒนา (Developing)</option>
                                    <option value="testing">กำลังทดสอบ (Testing)</option>
                                    <option value="completed">ส่งมอบงานแล้ว (Completed)</option>
                                </select>
                            </div>

                            {/* Payment Type Selection */}
                            {editingId === 'new' && (
                                <div className="md:col-span-2 mt-2 space-y-4">
                                    <label className="block text-sm font-medium text-secondary-700">รูปแบบการชำระเงิน</label>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} className="text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer" />
                                            <span>จ่ายเต็มจำนวน</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={paymentType === 'installment'} onChange={() => setPaymentType('installment')} className="text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer" />
                                            <span>แบ่งชำระเป็นงวด</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Installment configuration */}
                            {paymentType === 'installment' && editingId === 'new' && (
                                <div className="md:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                                    <div className="flex justify-between items-center mb-2 pb-3 border-b border-slate-200">
                                        <h4 className="font-semibold text-slate-800">ตั้งค่างวดชำระ (แบ่งเฉพาะยอด Setup Fee)</h4>
                                        <div className="text-sm">
                                            ยอดรวมที่ต้องแบ่ง: <span className="font-bold text-primary-600">฿{formData.setup_fee.toLocaleString()}</span> |
                                            คงเหลือ: <span className={`ml-1 font-bold ${formData.setup_fee - installments.reduce((sum, inst) => sum + (+inst.amount), 0) === 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                ฿{(formData.setup_fee - installments.reduce((sum, inst) => sum + (+inst.amount), 0)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {installments.map((inst, idx) => (
                                            <div key={idx} className="flex gap-4 items-end bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">
                                                        งวดที่ {idx + 1} (฿)
                                                        {idx === 0 && <span className="text-primary-600 font-bold ml-1">+ ค่าดูแลรายเดือน {formData.monthly_fee.toLocaleString()}</span>}
                                                    </label>
                                                    <input
                                                        type="number" min="0"
                                                        value={inst.amount === 0 ? '' : inst.amount}
                                                        onChange={(e) => {
                                                            const newArr = [...installments];
                                                            newArr[idx].amount = Number(e.target.value);
                                                            setInstallments(newArr)
                                                        }}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 outline-none" required
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">วันครบกำหนด</label>
                                                    <input
                                                        type="date"
                                                        value={inst.dueDate}
                                                        onChange={(e) => {
                                                            const newArr = [...installments];
                                                            newArr[idx].dueDate = e.target.value;
                                                            setInstallments(newArr)
                                                        }}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 outline-none" required
                                                    />
                                                </div>
                                                {installments.length > 1 && (
                                                    <button type="button" onClick={() => setInstallments(installments.filter((_, i) => i !== idx))} className="pb-2 px-2 text-red-500 hover:text-red-700 text-sm font-medium">ลบ</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const remaining = Math.max(0, formData.setup_fee - installments.reduce((sum, inst) => sum + (+inst.amount), 0));
                                            setInstallments([...installments, { amount: remaining, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }])
                                        }}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 mt-4 px-2"
                                    >
                                        <Plus className="w-4 h-4" /> เพิ่มงวดชำระ
                                    </button>
                                </div>
                            )}

                            {paymentType === 'full' && (
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">วันครบกำหนดชำระ</label>
                                    <input
                                        type="date"
                                        value={formData.due_date}
                                        onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        required={paymentType === 'full'}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-4 pt-4 border-t border-secondary-200">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 text-secondary-600 hover:text-secondary-900 font-medium transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-primary-200"
                            >
                                บันทึกข้อมูล
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-secondary-900">E-Invoice & Billing</h2>
                    <p className="text-secondary-600 mt-1">จัดการใบแจ้งหนี้และการส่งอีเมลถึงลูกค้า</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({
                            client_name: '',
                            client_email: '',
                            package_details: '',
                            setup_fee: 0,
                            monthly_fee: 0,
                            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 7 days from now
                            status: 'pending',
                            project_status: 'pending'
                        })
                        setPaymentType('full')
                        setInstallments([{ amount: 0, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }])
                        setEditingId('new')
                        setIsEditing(true)
                    }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-primary-200"
                >
                    <Plus className="w-5 h-5" />
                    สร้าง E-Invoice
                </button>
            </div>

            {/* Slip Viewer Modal */}
            {viewingSlip && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeSlipViewer}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-secondary-200 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-secondary-900 text-lg">ตรวจสอบสลิปการชำระเงิน</h3>
                                <p className="text-sm text-secondary-500 mt-0.5">{viewingSlip.invoice?.client_name} — {viewingSlip.invoice?.package_details}</p>
                            </div>
                            <button onClick={closeSlipViewer} className="text-secondary-400 hover:text-secondary-700 text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-5">
                            <div className="bg-secondary-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center min-h-[250px]">
                                {signedSlipUrl
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    ? <img src={signedSlipUrl} alt="Payment Slip" className="max-h-[50vh] w-auto object-contain rounded" />
                                    : <div className="flex flex-col items-center gap-2 text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /><span className="text-sm">กำลังโหลดรูปสลิป...</span></div>
                                }
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div className="bg-secondary-50 rounded-lg p-3">
                                    <p className="text-secondary-500 text-xs">ยอดที่แจ้ง</p>
                                    <p className="font-bold text-secondary-900 text-lg">฿{Number(viewingSlip.amount).toLocaleString('th-TH')}</p>
                                </div>
                                <div className="bg-secondary-50 rounded-lg p-3">
                                    <p className="text-secondary-500 text-xs">ส่งมาเมื่อ</p>
                                    <p className="font-medium text-secondary-900">{new Date(viewingSlip.submitted_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <a href={signedSlipUrl ?? '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-500 hover:underline mb-4">
                                <ExternalLink className="w-3.5 h-3.5" /> เปิดภาพต้นฉบับ
                            </a>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleRejectSlip(viewingSlip)}
                                    disabled={processingSlipId === viewingSlip.id}
                                    className="flex-1 py-3 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processingSlipId === viewingSlip.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    ปฏิเสธสลิป
                                </button>
                                <button
                                    onClick={() => handleApproveSlip(viewingSlip)}
                                    disabled={processingSlipId === viewingSlip.id}
                                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processingSlipId === viewingSlip.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                                    อนุมัติ &amp; ส่งใบเสร็จ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pending Slip Verifications Panel */}
            {pendingSubmissions.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                        <h3 className="font-bold text-amber-900">สลิปรอการตรวจสอบ ({pendingSubmissions.length})</h3>
                    </div>
                    <div className="space-y-3">
                        {pendingSubmissions.map(sub => (
                            <div key={sub.id} className="bg-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm border border-amber-100">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-secondary-900 truncate">{sub.invoice?.client_name}</p>
                                    <p className="text-xs text-secondary-500 truncate">{sub.invoice?.package_details}</p>
                                    <p className="text-sm font-bold text-green-600 mt-1">฿{Number(sub.amount).toLocaleString('th-TH')}</p>
                                </div>
                                <p className="text-xs text-secondary-400 shrink-0">{new Date(sub.submitted_at).toLocaleDateString('th-TH')}</p>
                                <button
                                    onClick={() => openSlipViewer(sub)}
                                    className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                    ตรวจสอบสลิป
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payment History Section - for tax filing */}
            {approvedSubmissions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                    <div className="p-5 border-b border-secondary-200 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h3 className="font-bold text-secondary-900 flex items-center gap-2">
                                <FileArchive className="w-5 h-5 text-indigo-500" />
                                ประวัติการชำระเงิน
                            </h3>
                            <p className="text-xs text-secondary-500 mt-0.5">สลิปที่ยืนยันแล้ว — สำหรับรวบรวมยื่นภาษีเงินได้</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={slipYearFilter}
                                onChange={e => setSlipYearFilter(Number(e.target.value))}
                                className="text-sm border border-secondary-200 rounded-lg px-3 py-1.5 bg-white text-secondary-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            >
                                {Array.from(new Set(approvedSubmissions.map(s => new Date(s.submitted_at).getFullYear())))
                                    .sort((a, b) => b - a)
                                    .map(yr => <option key={yr} value={yr}>{yr}</option>)
                                }
                            </select>
                        </div>
                    </div>

                    {/* Year Summary */}
                    {(() => {
                        const filtered = approvedSubmissions.filter(s => new Date(s.submitted_at).getFullYear() === slipYearFilter)
                        const totalYear = filtered.reduce((sum, s) => sum + Number(s.amount), 0)
                        return (
                            <>
                                <div className="px-5 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center gap-4 text-sm">
                                    <span className="text-indigo-700">ปี {slipYearFilter} | รายการ <strong>{filtered.length}</strong> บิล | รายรับรวม <strong className="text-indigo-900">฿{totalYear.toLocaleString('th-TH')}</strong></span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-secondary-50 border-b border-secondary-200 text-secondary-500 text-xs">
                                                <th className="px-5 py-3 font-medium">ลูกค้า</th>
                                                <th className="px-5 py-3 font-medium">บริการ</th>
                                                <th className="px-5 py-3 font-medium">วันที่ชำระ</th>
                                                <th className="px-5 py-3 font-medium text-right">ยอด (฿)</th>
                                                <th className="px-5 py-3 font-medium text-center">สลิป</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-secondary-100">
                                            {filtered.length === 0 ? (
                                                <tr><td colSpan={5} className="px-5 py-6 text-center text-secondary-400">ไม่มีข้อมูลในปี {slipYearFilter}</td></tr>
                                            ) : filtered.map(sub => (
                                                <tr key={sub.id} className="hover:bg-secondary-50/60 transition-colors">
                                                    <td className="px-5 py-3">
                                                        <p className="font-medium text-secondary-900">{sub.invoice?.client_name}</p>
                                                        <p className="text-xs text-secondary-400">{sub.invoice?.client_email}</p>
                                                    </td>
                                                    <td className="px-5 py-3 text-secondary-700">{sub.invoice?.package_details}</td>
                                                    <td className="px-5 py-3 text-secondary-700">{new Date(sub.submitted_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                    <td className="px-5 py-3 text-right font-semibold text-secondary-900">฿{Number(sub.amount).toLocaleString('th-TH')}</td>
                                                    <td className="px-5 py-3 text-center">
                                                        <button
                                                            onClick={() => handleDownloadSlip(sub)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors"
                                                            title="ดาวน์โหลดสลิป"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            ดาวน์โหลด
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )
                    })()}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary-50 border-b border-secondary-200 text-secondary-600 text-sm">
                                <th className="p-4 font-medium">ลูกค้า</th>
                                <th className="p-4 font-medium">รายละเอียด</th>
                                <th className="p-4 font-medium">ยอดรวม (฿)</th>
                                <th className="p-4 font-medium">บิล</th>
                                <th className="p-4 font-medium">สถานะงาน</th>
                                <th className="p-4 font-medium">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-secondary-500">
                                        ยังไม่มีข้อมูลใบแจ้งหนี้
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => {
                                    const isFirstOfProject = !invoices.some(
                                        inv => inv.client_name === invoice.client_name &&
                                            inv.id !== invoice.id &&
                                            new Date(inv.created_at || 0) < new Date(invoice.created_at || 0)
                                    )
                                    const isInstallmentContract = invoice.package_details.includes('(งวดที่ 1/') && isFirstOfProject;

                                    return (
                                        <tr key={invoice.id} className="hover:bg-secondary-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-secondary-900">{invoice.client_name}</div>
                                                <div className="text-sm text-secondary-500">{invoice.client_email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-secondary-900">{invoice.package_details}</div>
                                                <div className="text-xs text-secondary-500 mt-1">
                                                    Due: {new Date(invoice.due_date).toLocaleDateString('th-TH')}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm font-medium text-secondary-900">
                                                {(Number(invoice.setup_fee) + Number(invoice.monthly_fee)).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                    {getStatusText(invoice.status)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {(() => {
                                                    // Show tracking code only for the first invoice of each project (oldest by created_at)
                                                    if (invoice.tracking_code && isFirstOfProject) {
                                                        return (
                                                            <div className="flex flex-col items-start gap-1">
                                                                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{invoice.tracking_code}</span>
                                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${invoice.project_status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                                    invoice.project_status === 'testing' ? 'bg-purple-100 text-purple-700' :
                                                                        invoice.project_status === 'developing' ? 'bg-blue-100 text-blue-700' :
                                                                            invoice.project_status === 'designing' ? 'bg-pink-100 text-pink-700' :
                                                                                invoice.project_status === 'planning' ? 'bg-amber-100 text-amber-700' :
                                                                                    'bg-slate-100 text-slate-700'
                                                                    }`}>
                                                                    {invoice.project_status?.toUpperCase() || 'PENDING'}
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                    return <span className="text-[10px] text-secondary-400">รายเดือน</span>
                                                })()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleDownloadPdf(invoice)}
                                                        disabled={downloadingPdfId === invoice.id || downloadingReceiptId === invoice.id}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                                        title="ดาวน์โหลดใบแจ้งหนี้ (Invoice)"
                                                    >
                                                        {downloadingPdfId === invoice.id ? (
                                                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <FileDown className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadReceipt(invoice)}
                                                        disabled={downloadingReceiptId === invoice.id || downloadingPdfId === invoice.id}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                                        title="ดาวน์โหลดใบเสร็จรับเงิน (Receipt)"
                                                    >
                                                        {downloadingReceiptId === invoice.id ? (
                                                            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Receipt className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleSendEmail(invoice)}
                                                        disabled={sendingEmailId === invoice.id || invoice.status === 'paid' || downloadingPdfId === invoice.id}
                                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                                        title="ส่ง E-Invoice ผ่านอีเมล"
                                                    >
                                                        {sendingEmailId === invoice.id ? (
                                                            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Mail className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    {isInstallmentContract && (
                                                        <button
                                                            onClick={() => handleDownloadContract(invoice)}
                                                            disabled={downloadingContractId === invoice.id || downloadingPdfId === invoice.id}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                                            title="ดาวน์โหลดเอกสารแบ่งชำระ (Installment Schedule)"
                                                        >
                                                            {downloadingContractId === invoice.id ? (
                                                                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}
                                                    {isFirstOfProject && (
                                                        <button
                                                            onClick={() => handleDownloadServiceContract(invoice)}
                                                            disabled={downloadingContractId === invoice.id || downloadingPdfId === invoice.id}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                                            title="ดาวน์โหลดสัญญาจ้าง (Service Contract)"
                                                        >
                                                            {downloadingContractId === invoice.id ? (
                                                                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEdit(invoice)}
                                                        disabled={downloadingPdfId === invoice.id}
                                                        className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="แก้ไข"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(invoice.id)}
                                                        disabled={downloadingPdfId === invoice.id}
                                                        className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="ลบ"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Hidden PDF Templates for each invoice */}
            <div className="hidden">
                {invoices.map((invoice) => {
                    const totalAmount = Number(invoice.setup_fee) + Number(invoice.monthly_fee)
                    const formattedTotal = totalAmount.toLocaleString('th-TH')
                    const formattedDate = new Date(invoice.due_date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                    const issuedDate = new Date(invoice.created_at || Date.now()).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                    const invoiceNo = `INV-${new Date(invoice.created_at || Date.now()).getFullYear()}${String(new Date(invoice.created_at || Date.now()).getMonth() + 1).padStart(2, '0')}-${invoice.id.substring(0, 4).toUpperCase()}`

                    // Check if this is the first invoice of the project
                    const isFirstOfProject = !invoices.some(
                        inv => inv.client_name === invoice.client_name &&
                            inv.id !== invoice.id &&
                            new Date(inv.created_at || 0) < new Date(invoice.created_at || 0)
                    )

                    return (
                        <>
                            <div key={`pdf-${invoice.id}`} id={`invoice-pdf-${invoice.id}`} className="bg-white p-10 font-sans text-slate-800 box-border mx-auto relative overflow-hidden" style={{ display: 'none', width: '210mm', height: '297mm' }}>
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-6">
                                    <div>
                                        <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-wide">{siteInfo.name}</h1>
                                        {invoice.package_details.includes('(งวดที่ 1/') && (
                                            <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl mt-4">
                                                <div>
                                                    <p className="text-secondary-600 font-medium">รวม Setup Fee และ Monthly Fee</p>
                                                    <p className="text-xs text-secondary-500 mt-1">* ค่าบริการรายเดือน (Monthly Fee) จะถูกรวมในงวดแรก</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-primary-600">{(Number(invoice.setup_fee) + Number(invoice.monthly_fee)).toLocaleString()} ฿</p>
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-sm text-slate-800">{siteInfo.description}</p>
                                        <p className="text-sm text-slate-800 mt-2">Email: {siteInfo.email}</p>
                                        <p className="text-sm text-slate-800">Website: {siteInfo.website}</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-3xl font-bold text-black tracking-widest mb-2">INVOICE</h2>
                                        <p className="text-sm text-black font-semibold">ใบแจ้งหนี้ / ใบเรียกเก็บเงิน</p>
                                        <div className="mt-4 text-sm text-black text-left border border-black p-3 inline-block min-w-[220px]">
                                            <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
                                                <span className="font-bold mr-4">เลขที่ (No.):</span>
                                                <span>{invoiceNo}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
                                                <span className="font-bold mr-4">วันที่ออกตั้ง (Date):</span>
                                                <span>{issuedDate}</span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="font-bold mr-4">ครบกำหนด (Due Date):</span>
                                                <span>{formattedDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Client Info */}
                                <div className="mb-8 border border-black p-5 rounded-none">
                                    <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3 border-b border-black pb-2">รับเงินจาก / Billed To:</h3>
                                    <p className="text-lg font-bold text-black mb-1">{invoice.client_name}</p>
                                    <p className="text-sm text-slate-800">{invoice.client_email}</p>
                                </div>

                                {/* Items Table */}
                                <div className="mb-8">
                                    <table className="w-full text-left border-collapse border border-black">
                                        <thead>
                                            <tr className="bg-slate-200 text-black text-sm border-b-2 border-black">
                                                <th className="p-3 font-bold border-r border-black w-16 text-center">ลำดับ<br /><span className="text-xs font-normal">Item</span></th>
                                                <th className="p-3 font-bold border-r border-black">รายละเอียด<br /><span className="text-xs font-normal">Description</span></th>
                                                <th className="p-3 font-bold text-right w-40">จำนวนเงิน (THB)<br /><span className="text-xs font-normal">Amount</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black text-black">
                                            <tr>
                                                <td className="p-4 text-center border-r border-black font-medium">1</td>
                                                <td className="p-4 border-r border-black">
                                                    <p className="font-bold">ค่าบริการจัดทำและติดตั้ง (Setup Fee)</p>
                                                    <p className="text-sm text-slate-800 mt-1">อ้างอิง: แพ็กเกจ {invoice.package_details}</p>
                                                </td>
                                                <td className="p-4 text-right font-bold">{Number(invoice.setup_fee).toLocaleString('th-TH')}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 text-center border-r border-black font-medium">2</td>
                                                <td className="p-4 border-r border-black">
                                                    <p className="font-bold">ค่าบริการดูแลรักษาระบบรายเดือน (Monthly Fee)</p>
                                                    <p className="text-sm text-slate-800 mt-1">บริการดูแล บำรุงรักษา อัปเดต และโฮสติ้ง</p>
                                                </td>
                                                <td className="p-4 text-right font-bold">{Number(invoice.monthly_fee).toLocaleString('th-TH')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary & Notes */}
                                <div className="flex justify-between items-start">
                                    <div className="w-1/2 pr-8">
                                        <div className="border border-black p-4 text-sm text-black">
                                            <h4 className="font-bold mb-2 underline">ช่องทางการชำระเงิน (Payment Methods)</h4>
                                            <p className="mb-1">• <strong>พร้อมเพย์ (PromptPay):</strong> {paymentConfig ? `${paymentConfig.promptpay_number} (ชื่อบัญชี: ${paymentConfig.promptpay_name})` : '[ใส่เบอร์พร้อมเปย์บอส]'}</p>
                                            <p>• <strong>บัญชีธนาคาร (Bank Transfer):</strong></p>
                                            <p className="ml-4">{paymentConfig ? `${paymentConfig.bank_name} เลขบัญชี ${paymentConfig.bank_account_no}` : 'ธนาคารกสิกรไทย เลขบัญชี xxx-x-xxxxx-x'}</p>
                                            {paymentConfig && <p className="ml-4">ชื่อบัญชี: {paymentConfig.bank_account_name}</p>}
                                            <p className="ml-4 mt-2 italic text-xs">* กรุณาส่งสลิปหลักฐานการโอนเงินเพื่อยืนยันการชำระ</p>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <table className="w-full text-right text-sm border-collapse border border-black text-black">
                                            <tbody>
                                                <tr className="border-b border-black">
                                                    <td className="p-3 font-bold border-r border-black w-2/3">รวมเป็นเงิน (Subtotal)</td>
                                                    <td className="p-3 font-bold w-1/3">{formattedTotal}</td>
                                                </tr>
                                                <tr className="text-lg bg-slate-200">
                                                    <td className="p-3 font-bold border-r border-black uppercase">ยอดชำระสุทธิ (Total)</td>
                                                    <td className="p-3 font-bold">
                                                        ฿ {formattedTotal}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Signatures */}
                                <div className="flex justify-between mt-24 text-center text-black">
                                    <div className="w-64">
                                        <div className="border-b border-black mb-2 mt-8"></div>
                                        <p className="text-sm font-bold">ผู้รับเงิน / Authorized Signature</p>
                                        <p className="text-xs mt-1">วันที่ (Date): ____/____/____</p>
                                    </div>
                                    <div className="w-64">
                                        <div className="border-b border-black mb-2 mt-8"></div>
                                        <p className="text-sm font-bold">ผู้ชำระเงิน / Customer Signature</p>
                                        <p className="text-xs mt-1">วันที่ (Date): ____/____/____</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-10 left-0 right-0 text-center text-xs text-black border-t border-dashed border-slate-300 pt-4 mx-10">
                                    <p>เอกสารฉบับนี้พิมพ์จากระบบอิเล็กทรอนิกส์</p>
                                    <p className="mt-1 font-bold">© {new Date().getFullYear()} {siteInfo.name}.</p>
                                </div>
                            </div>

                            {/* RECEIPT PDF HTML TEMPLATE */}
                            <div key={`receipt-pdf-${invoice.id}`} id={`receipt-pdf-${invoice.id}`} className="bg-white p-10 font-sans text-slate-800 box-border mx-auto relative overflow-hidden mt-8" style={{ display: 'none', width: '210mm', height: '297mm' }}>
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-6">
                                    <div>
                                        <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-wide">{siteInfo.name}</h1>
                                        <p className="text-sm text-slate-800">{siteInfo.description}</p>
                                        <p className="text-sm text-slate-800 mt-2">Email: {siteInfo.email}</p>
                                        <p className="text-sm text-slate-800">Website: {siteInfo.website}</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-3xl font-bold text-black tracking-widest mb-2">RECEIPT</h2>
                                        <p className="text-sm text-black font-semibold">ใบเสร็จรับเงิน</p>
                                        <div className="mt-4 text-sm text-black text-left border border-black p-3 inline-block min-w-[220px]">
                                            <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
                                                <span className="font-bold mr-4">เลขที่ (No.):</span>
                                                <span>REP-{invoiceNo.replace('INV-', '')}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
                                                <span className="font-bold mr-4">วันที่รับเงิน (Date):</span>
                                                <span>{new Date(invoice.due_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="font-bold mr-4">อ้างอิงใบแจ้งหนี้ (Ref):</span>
                                                <span>{invoiceNo}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Client Info */}
                                <div className="mb-8 border border-black p-5 rounded-none">
                                    <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3 border-b border-black pb-2">รับเงินจาก / Received From:</h3>
                                    <p className="text-lg font-bold text-black mb-1">{invoice.client_name}</p>
                                    <p className="text-sm text-slate-800">{invoice.client_email}</p>
                                </div>

                                {/* Items Table */}
                                <div className="mb-8">
                                    <table className="w-full text-left border-collapse border border-black">
                                        <thead>
                                            <tr className="bg-slate-200 text-black text-sm border-b-2 border-black">
                                                <th className="p-3 font-bold border-r border-black w-16 text-center">ลำดับ<br /><span className="text-xs font-normal">Item</span></th>
                                                <th className="p-3 font-bold border-r border-black">รายละเอียด<br /><span className="text-xs font-normal">Description</span></th>
                                                <th className="p-3 font-bold text-right w-40">จำนวนเงิน (THB)<br /><span className="text-xs font-normal">Amount</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black text-black">
                                            <tr>
                                                <td className="p-4 text-center border-r border-black font-medium">1</td>
                                                <td className="p-4 border-r border-black">
                                                    <p className="font-bold">ชำระค่าบริการตามใบแจ้งหนี้ {invoiceNo}</p>
                                                    <p className="text-sm text-slate-800 mt-1">อ้างอิง: แพ็กเกจ {invoice.package_details}</p>
                                                </td>
                                                <td className="p-4 text-right font-bold">{formattedTotal}</td>
                                            </tr>
                                            <tr className="h-40">
                                                <td className="border-r border-black"></td>
                                                <td className="border-r border-black"></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary & Signatures */}
                                <div className="flex justify-between items-end">
                                    <div className="w-1/2 pr-8">
                                        <div className="border border-black p-4 text-sm text-black bg-slate-50 italic">
                                            <p>ได้รับเงินตามจำนวนที่แจ้งด้านขวาครบถ้วนแล้ว ขอขอบคุณที่ใช้บริการ</p>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <table className="w-full text-right text-sm border-collapse border border-black text-black">
                                            <tbody>
                                                <tr className="text-lg bg-slate-200">
                                                    <td className="p-3 font-bold border-r border-black uppercase">ยอดชำระสุทธิ (Total)</td>
                                                    <td className="p-3 font-bold">
                                                        ฿ {formattedTotal}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-24 text-center text-black">
                                    <div className="w-64">
                                        <div className="border-b border-black mb-2 mt-8"></div>
                                        <p className="text-sm font-bold">ผู้รับเงิน / Authorized Signature</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-10 left-0 right-0 text-center text-xs text-black border-t border-dashed border-slate-300 pt-4 mx-10">
                                    <p>เอกสารฉบับนี้พิมพ์จากระบบอิเล็กทรอนิกส์</p>
                                    <p className="mt-1 font-bold">© {new Date().getFullYear()} {siteInfo.name}.</p>
                                </div>
                            </div>

                            {/* CONTRACT PDF HTML TEMPLATE (Only renders for first installment) */}
                            {invoice.package_details.includes('(งวดที่ 1/') && (() => {
                                const basePackageDetails = invoice.package_details.replace(/ \(งวดที่ \d+\/.*?\)/, '').trim()
                                const contractInvoices = invoices
                                    .filter(i => i.client_name === invoice.client_name && i.package_details.startsWith(basePackageDetails))
                                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

                                const totalContractValue = contractInvoices.reduce((sum, inv) => sum + Number(inv.setup_fee), 0)
                                const contractMonthlyFee = contractInvoices[0]?.monthly_fee || 0;

                                return (
                                    <div key={`contract-pdf-${invoice.id}`} id={`contract-pdf-${invoice.id}`} className="bg-white p-10 font-sans text-slate-800 box-border mx-auto relative overflow-hidden mt-8" style={{ display: 'none', width: '210mm', minHeight: '297mm' }}>
                                        {/* Document Header - Formal Style */}
                                        <div className="text-center mb-8 pb-4 border-b-2 border-slate-800">
                                            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wider mb-2">ตารางการแบ่งชำระค่าบริการ</h1>
                                            <h2 className="text-base font-medium text-slate-600">INSTALLMENT PAYMENT SCHEDULE</h2>
                                        </div>

                                        {/* Document Meta */}
                                        <div className="flex justify-between mb-6 text-sm">
                                            <div className="text-left">
                                                <p className="font-bold text-slate-800">เลขที่เอกสาร: IPS-{invoice.id.substring(0, 8).toUpperCase()}</p>
                                                <p className="text-slate-600">วันที่ออกเอกสาร: {issuedDate}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-800">{siteInfo.name}</p>
                                                <p className="text-slate-600">{siteInfo.email}</p>
                                                <p className="text-slate-600">{siteInfo.website}</p>
                                            </div>
                                        </div>

                                        {/* Parties Info */}
                                        <div className="mb-6">
                                            <table className="w-full text-sm border-collapse border border-slate-300">
                                                <thead>
                                                    <tr className="bg-slate-100">
                                                        <th className="p-3 text-left font-bold border border-slate-300 w-1/2">ผู้ให้บริการ (Service Provider)</th>
                                                        <th className="p-3 text-left font-bold border border-slate-300 w-1/2">ผู้รับบริการ (Customer)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="p-3 border border-slate-300">
                                                            <p className="font-bold">{siteInfo.name}</p>
                                                            {siteInfo.address && <p className="text-slate-600">ที่อยู่: {siteInfo.address}</p>}
                                                            <p className="text-slate-600">อีเมล: {siteInfo.email}</p>
                                                        </td>
                                                        <td className="p-3 border border-slate-300">
                                                            <p className="font-bold">{invoice.client_name}</p>
                                                            <p className="text-slate-600">อีเมล: {invoice.client_email}</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Package Details */}
                                        <div className="mb-6">
                                            <h3 className="text-base font-bold text-slate-800 mb-2 pb-1 border-b border-slate-300">1. รายละเอียดแพ็กเกจบริการ</h3>
                                            <table className="w-full text-sm border-collapse border border-slate-300">
                                                <tbody>
                                                    <tr className="bg-slate-50">
                                                        <td className="p-2 border border-slate-300 font-bold w-1/3">แพ็กเกจ</td>
                                                        <td className="p-2 border border-slate-300">{basePackageDetails.replace(/[A-Za-z0-9]+ package:/i, '').trim()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2 border border-slate-300 font-bold">ค่าบริการรายเดือน</td>
                                                        <td className="p-2 border border-slate-300">฿{Number(contractMonthlyFee).toLocaleString('th-TH')}/เดือน</td>
                                                    </tr>
                                                    <tr className="bg-slate-50">
                                                        <td className="p-2 border border-slate-300 font-bold">จำนวนงวดการชำระ</td>
                                                        <td className="p-2 border border-slate-300">{contractInvoices.length} งวด</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2 border border-slate-300 font-bold">มูลค่ารวมทั้งสิ้น</td>
                                                        <td className="p-2 border border-slate-300 font-bold text-lg">฿{totalContractValue.toLocaleString('th-TH')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Payment Schedule Table */}
                                        <div className="mb-6">
                                            <h3 className="text-base font-bold text-slate-800 mb-2 pb-1 border-b border-slate-300">2. ตารางการชำระเงิน (Payment Schedule)</h3>
                                            <table className="w-full text-left border-collapse border border-slate-300 text-sm">
                                                <thead>
                                                    <tr className="bg-slate-800 text-white">
                                                        <th className="p-3 font-bold border border-slate-600 w-16 text-center">งวด</th>
                                                        <th className="p-3 font-bold border border-slate-600">รายละเอียด</th>
                                                        <th className="p-3 font-bold border border-slate-600 w-28 text-center">วันครบกำหนด</th>
                                                        <th className="p-3 font-bold border border-slate-600 w-28 text-right">จำนวนเงิน</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200">
                                                    {contractInvoices.map((inv, idx) => {
                                                        const isFirst = idx === 0;
                                                        const feeText = isFirst && contractMonthlyFee > 0
                                                            ? `+ ค่าบริการรายเดือน ฿${Number(contractMonthlyFee).toLocaleString('th-TH')}`
                                                            : '';
                                                        const totalForInst = Number(inv.setup_fee) + (isFirst ? Number(contractMonthlyFee) : 0);

                                                        return (
                                                            <tr key={`contract-item-${inv.id}`} className="hover:bg-slate-50">
                                                                <td className="p-3 text-center border border-slate-200 font-bold">{idx + 1}</td>
                                                                <td className="p-3 border border-slate-200">
                                                                    <span className="text-slate-800">{inv.package_details.replace(/\(งวดที่ \d+\/\d+\)/, '').trim()}</span>
                                                                    {feeText && <div className="text-slate-500 text-xs mt-1">{feeText}</div>}
                                                                </td>
                                                                <td className="p-3 border border-slate-200 text-center text-slate-600">
                                                                    {new Date(inv.due_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </td>
                                                                <td className="p-3 text-right border border-slate-200 font-bold text-slate-800">{totalForInst.toLocaleString('th-TH')}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-slate-100 font-bold">
                                                        <td colSpan={3} className="p-3 text-right border border-slate-300">รวมทั้งสิ้น (Total)</td>
                                                        <td className="p-3 text-right border border-slate-300 text-lg">
                                                            {contractInvoices.reduce((sum, inv, idx) => {
                                                                const isFirst = idx === 0;
                                                                return sum + Number(inv.setup_fee) + (isFirst ? Number(contractMonthlyFee) : 0);
                                                            }, 0).toLocaleString('th-TH')}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        {/* Cancellation & Refund Policy - Fixed */}
                                        <div className="mb-6 mt-8 pt-4 border-t-2 border-slate-400">
                                            <h3 className="text-base font-bold text-slate-800 mb-3 pb-1 border-b border-slate-300">3. เงื่อนไขการยกเลิกและการคืนเงิน</h3>
                                            <div className="text-sm text-slate-700 leading-relaxed text-justify space-y-3">
                                                <div className="p-3 border border-slate-300">
                                                    <p className="font-bold text-slate-800 mb-2">3.1 เงื่อนไขการยกเลิก</p>
                                                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                                                        <li>การยกเลิกต้องแจ้งล่วงหน้าเป็นลายลักษณ์อักษรไม่น้อยกว่า 7 วันทำการ</li>
                                                        <li>หากผู้ว่าจ้างผิดนัดชำระเงินเกินกว่า 7 วัน ผู้รับจ้างขอสงวนสิทธิ์ในการระงับและยกเลิกบริการทันที โดยไม่ต้องแจ้งล่วงหน้า</li>
                                                        <li>เมื่อเกิดการยกเลิก ไม่ว่ากรณีใดก็ตาม ผู้ว่าจ้างจะไม่สามารถใช้งานระบบหรือเรียกร้องใดๆ จากผู้รับจ้างได้อีก</li>
                                                    </ul>
                                                </div>
                                                <div className="p-3 border border-slate-300">
                                                    <p className="font-bold text-slate-800 mb-2">3.2 เงื่อนไขการคืนเงิน</p>
                                                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                                                        <li><strong>เงินค่าบริการที่ชำระแล้ว ถือเป็นที่สิ้นสุด ไม่สามารถขอคืนได้ในทุกกรณี</strong> รวมถึงแต่ไม่จำกัดเพียงกรณียกเลิกบริการ, การหยุดใช้งาน, หรือความไม่พอใจใดๆ</li>
                                                        <li>กรณียกเลิกก่อนเริ่มดำเนินการ: หักค่าใช้จ่ายที่เกิดขึ้นจริง และคืนส่วนที่เหลือ</li>
                                                        <li>กรณียกเลิกหลังเริ่มดำเนินการแล้ว: ไม่สามารถขอคืนเงินได้ เนื่องจากงานได้เริ่มดำเนินการแล้ว</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Monthly Service Fee Note */}
                                        <div className="mb-6 p-3 bg-slate-50 border border-slate-300">
                                            <p className="text-sm text-slate-700 font-bold mb-1">หมายเหตุ: ค่าบริการรายเดือน</p>
                                            <p className="text-sm text-slate-600">
                                                ค่าบริการรายเดือน (฿{Number(contractMonthlyFee).toLocaleString('th-TH')}/เดือน) จะเริ่มนับพ้นจากวันส่งมอบงานเสร็จสิ้นในงวดสุดท้าย และจะต่ออายุโดยอัตโนมัติทุกเดือนจนกว่าจะมีการยกเลิก
                                            </p>
                                        </div>

                                        {/* Agreement Statement */}
                                        <div className="text-sm text-slate-700 leading-relaxed text-justify mb-8 p-4 border border-slate-300">
                                            <p className="indent-4">
                                                คู่สัญญาทั้งสองฝ่ายได้อ่านและเข้าใจเงื่อนไขการชำระเงิน เงื่อนไขการยกเลิก และเงื่อนไขการคืนเงินโดยตลอดแล้ว เห็นว่าถูกต้องตรงตามความประสงค์ จึงได้ตกลงยอมรับและปฏิบัติตามเอกสารฉบับนี้
                                            </p>
                                        </div>

                                        {/* Signatures */}
                                        <div className="flex justify-between px-8 text-center text-slate-800 mb-8">
                                            <div className="w-56">
                                                <div className="border-b-2 border-slate-800 mb-1"></div>
                                                <p className="text-sm font-bold">ลงชื่อ ผู้ว่าจ้าง</p>
                                                <p className="text-xs mt-2">({invoice.client_name})</p>
                                                <p className="text-xs mt-2 text-slate-500">วันที่: ______________</p>
                                            </div>
                                            <div className="w-56">
                                                <div className="border-b-2 border-slate-800 mb-1"></div>
                                                <p className="text-sm font-bold">ลงชื่อ ผู้รับจ้าง</p>
                                                <p className="text-xs mt-2">({siteInfo.ownerSignature || siteInfo.name})</p>
                                                <p className="text-xs mt-2 text-slate-500">วันที่: ______________</p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-slate-400 border-t border-dashed border-slate-300 pt-4 mx-10">
                                            <p>เอกสารฉบับนี้พิมพ์จากระบบอิเล็กทรอนิกส์ • Document Generated via {siteInfo.name} System</p>
                                            <p className="mt-1">© {new Date().getFullYear()} {siteInfo.name} • REF: IPS-{invoice.id.substring(0, 12).toUpperCase()}</p>
                                        </div>
                                    </div>
                                )
                            })()}

                            {/* SERVICE CONTRACT PDF - For ALL invoices (Full Payment & Installment) */}
                            {isFirstOfProject && (() => {
                                const basePackageDetails = invoice.package_details.replace(/ \(งวดที่ \d+\/.*?\)/, '').trim()
                                const contractInvoices = invoices
                                    .filter(i => i.client_name === invoice.client_name && (i.package_details.startsWith(basePackageDetails) || i.package_details.replace(/ \(งวดที่ \d+\/.*?\)/, '').trim() === basePackageDetails))
                                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

                                const totalContractValue = contractInvoices.reduce((sum, inv) => sum + Number(inv.setup_fee), 0)
                                const contractMonthlyFee = contractInvoices[0]?.monthly_fee || 0;
                                const isInstallment = contractInvoices.length > 1;

                                return (
                                    <div key={`service-contract-pdf-${invoice.id}`} id={`service-contract-pdf-${invoice.id}`} className="bg-white p-10 font-sans text-slate-800 box-border mx-auto relative overflow-hidden mt-8" style={{ display: 'none', width: '210mm', minHeight: '297mm' }}>
                                        {/* Contract Header */}
                                        <div className="text-center mb-6 pb-4 border-b-2 border-slate-800">
                                            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wider mb-2">สัญญาจ้าง</h1>
                                            <h2 className="text-lg font-medium text-slate-600">SERVICE CONTRACT</h2>
                                        </div>

                                        {/* Document Meta */}
                                        <div className="flex justify-between mb-6 text-sm">
                                            <div className="text-left">
                                                <p className="font-bold text-slate-800">เลขที่สัญญา: CTR-{invoice.id.substring(0, 8).toUpperCase()}</p>
                                                <p className="text-slate-600">วันที่ทำสัญญา: {issuedDate}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-800">{siteInfo.name}</p>
                                                <p className="text-slate-600">{siteInfo.email}</p>
                                            </div>
                                        </div>

                                        {/* Parties */}
                                        <div className="mb-6 text-sm text-slate-700 leading-relaxed text-justify">
                                            <p className="indent-4 mb-2">
                                                <strong>สัญญาจ้าง</strong>ฉบับนี้ทำขึ้น ณ วันที่ {issuedDate}
                                                ระหว่าง <strong>{siteInfo.name}</strong>
                                                {siteInfo.address ? ` ตั้งอยู่เลขที่ ${siteInfo.address}` : ''}
                                                ผู้ให้บริการ ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>&quot;ผู้รับจ้าง&quot;</strong> ฝ่ายหนึ่ง
                                            </p>
                                            <p className="indent-4 mb-2">
                                                กับ <strong>{invoice.client_name}</strong> ผู้รับบริการ ซึ่งต่อไปในสัญญานี้จะเรียกว่า <strong>&quot;ผู้ว่าจ้าง&quot;</strong> อีกฝ่ายหนึ่ง
                                            </p>
                                            <p className="indent-4">
                                                คู่สัญญาทั้งสองฝ่ายตกลงทำสัญญากันโดยมีข้อตกลงและเงื่อนไขดังต่อไปนี้:
                                            </p>
                                        </div>

                                        {/* Clause 1: Scope of Work */}
                                        <div className="mb-4 text-sm text-slate-700 leading-relaxed text-justify">
                                            <p className="font-bold text-slate-800 mb-1">ข้อ 1. ขอบเขตงาน</p>
                                            <p className="indent-4 mb-2">
                                                ผู้ว่าจ้างตกลงว่าจ้างและผู้รับจ้างตกลงรับจ้างพัฒนาระบบและจัดทำเว็บไซต์ใน <strong>แพ็กเกจ {basePackageDetails.replace(/[A-Za-z0-9]+ package:/i, '').trim()}</strong>
                                            </p>
                                            <p className="indent-4">
                                                โดยมีขอบเขตการทำงาน ฟังก์ชันการใช้งาน และระยะเวลาดำเนินการ ตามที่ระบุในเอกสารเสนอราคาหรือตกลงกันไว้เป็นลายลักษณ์อักษร
                                            </p>
                                        </div>

                                        {/* Clause 2: Payment */}
                                        <div className="mb-4 text-sm text-slate-700 leading-relaxed text-justify">
                                            <p className="font-bold text-slate-800 mb-1">ข้อ 2. ค่าจ้างและการชำระเงิน</p>
                                            <p className="indent-4 mb-2">
                                                คู่สัญญาตกลงค่าจ้างเหมาเพื่อการพัฒนาระบบและติดตั้งระบบ (Setup Fee) ทั้งสิ้นเป็นจำนวนเงิน <strong>฿{totalContractValue.toLocaleString('th-TH')}</strong> (รวมภาษีมูลค่าเพิ่มแล้ว)
                                            </p>
                                            {isInstallment ? (
                                                <p className="indent-4 mb-2">
                                                    โดยผู้ว่าจ้างตกลงจะแบ่งชำระเงินค่าจ้างให้แก่ผู้รับจ้างเป็นรายงวด จำนวน {contractInvoices.length} งวด ดังรายละเอียดต่อไปนี้:
                                                </p>
                                            ) : (
                                                <p className="indent-4">
                                                    โดยผู้ว่าจ้างตกลงชำระเงินค่าจ้างเต็มจำนวนในครั้งเดียว
                                                </p>
                                            )}
                                        </div>

                                        {/* Payment Schedule for Installment */}
                                        {isInstallment && (
                                            <div className="mb-4 px-2">
                                                <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                                                    <thead>
                                                        <tr className="bg-slate-800 text-white">
                                                            <th className="p-2 font-bold border border-slate-600 w-12 text-center">งวด</th>
                                                            <th className="p-2 font-bold border border-slate-600">รายละเอียด</th>
                                                            <th className="p-2 font-bold border border-slate-600 w-24 text-center">กำหนดชำระ</th>
                                                            <th className="p-2 font-bold border border-slate-600 text-right w-20">จำนวน</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-200">
                                                        {contractInvoices.map((inv, idx) => {
                                                            const isFirst = idx === 0;
                                                            const feeText = isFirst && contractMonthlyFee > 0
                                                                ? `+ ค่าบริการรายเดือน ฿${Number(contractMonthlyFee).toLocaleString('th-TH')}`
                                                                : '';
                                                            const totalForInst = Number(inv.setup_fee) + (isFirst ? Number(contractMonthlyFee) : 0);
                                                            return (
                                                                <tr key={`sc-item-${inv.id}`}>
                                                                    <td className="p-2 text-center border border-slate-200">{idx + 1}</td>
                                                                    <td className="p-2 border border-slate-200">
                                                                        {inv.package_details.replace(/\(งวดที่ \d+\/\d+\)/, '').trim()}
                                                                        {feeText && <div className="text-slate-500 text-xs">{feeText}</div>}
                                                                    </td>
                                                                    <td className="p-2 text-center border border-slate-200">
                                                                        {new Date(inv.due_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                    </td>
                                                                    <td className="p-2 text-right border border-slate-200 font-bold">{totalForInst.toLocaleString('th-TH')}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Clause 3: Maintenance */}
                                        <div className="mb-4 text-sm text-slate-700 leading-relaxed text-justify">
                                            <p className="font-bold text-slate-800 mb-1">ข้อ 3. ค่าบริการดูแลรักษาระบบ</p>
                                            <p className="indent-4">
                                                ค่าบริการรายเดือนสำหรับดูแลระบบ โฮสติ้ง และการอำนวยความสะดวกอื่นๆ รายเดือนละ <strong>฿{Number(contractMonthlyFee).toLocaleString('th-TH')}</strong>
                                                ซึ่งจะเริ่มนับตั้งแต่วันส่งมอบงานเสร็จสิ้น และจะต่ออายุโดยอัตโนมัติทุกเดือนจนกว่าจะมีการยกเลิก
                                            </p>
                                        </div>

                                        {/* Clause 4: Acceptance */}
                                        <div className="mb-4 text-sm text-slate-700 leading-relaxed text-justify">
                                            <p className="font-bold text-slate-800 mb-1">ข้อ 4. การตรวจรับงานและส่งมอบ</p>
                                            <p className="indent-4">
                                                ผู้รับจ้างจะนำส่งผลงานให้ผู้ว่าจ้างตรวจสอบในแต่ละงวด ผู้ว่าจ้างมีหน้าที่ตรวจสอบและแจ้งเบาะแสการแก้ไขปรับปรุงภายใน 7 วันทำการ
                                                หากพ้นกำหนดดังกล่าวโดยไม่มีการทักท้วง ให้ถือว่าผู้ว่าจ้างยอมรับผลงานในงวดนั้นๆ อย่างสมบูรณ์
                                            </p>
                                        </div>

                                        {/* Clause 5: Cancellation & Default */}
                                        <div className="mb-4 text-sm text-slate-700 leading-relaxed text-justify">
                                            <p className="font-bold text-slate-800 mb-1">ข้อ 5. การผิดสัญญาและการยกเลิก</p>
                                            <p className="indent-4 mb-2">
                                                หากผู้ว่าจ้างผิดนัดชำระเงินเกินกว่า 7 วัน ผู้รับจ้างมีสิทธิ์ระงับการให้บริการและยกเลิกสัญญาได้ทันที โดยไม่ต้องแจ้งล่วงหน้า
                                            </p>
                                            <p className="indent-4 mb-2">
                                                หากคู่สัญญาฝ่ายใดฝ่ายหนึ่งประสงค์จะพ้นสภาพข้อตกลงนี้ จะต้องแจ้งล่วงหน้าเป็นลายลักษณ์อักษรไม่น้อยกว่า 15 วัน
                                            </p>
                                            <p className="indent-4">
                                                <strong>เงินค่าจ้างทั้งหมดที่ผู้ว่าจ้างได้ชำระมาแล้ว ถือเป็นการชำระที่สมบูรณ์ ไม่สามารถเรียกร้องเพื่อขอคืนได้ในทุกกรณี</strong>
                                            </p>
                                        </div>

                                        {/* Clause 6: IP & Confidentiality */}
                                        <div className="mb-4 text-sm text-slate-700 leading-relaxed text-justify">
                                            <p className="font-bold text-slate-800 mb-1">ข้อ 6. ทรัพย์สินทางปัญญาและความลับ</p>
                                            <p className="indent-4 mb-2">
                                                ซอร์สโค้ดและข้อมูลที่พัฒนาขึ้นจะตกเป็นกรรมสิทธิ์ของผู้ว่าจ้างหลังจากชำระเงินค่าจ้างครบถ้วนทั้งหมดแล้ว
                                            </p>
                                            <p className="indent-4">
                                                ผู้ว่าจ้างรับรองว่าเนื้อหาและข้อมูลต่างๆ ที่นำมาใส่ในเว็บไซต์ไม่ละเมิดลิขสิทธิ์หรือสิทธิ์ของบุคคลอื่นใด
                                            </p>
                                        </div>

                                        {/* Clause 7: Amendment */}
                                        <div className="mb-4 text-sm text-slate-700 leading-relaxed text-justify">
                                            <p className="font-bold text-slate-800 mb-1">ข้อ 7. การแก้ไขสัญญา</p>
                                            <p className="indent-4">
                                                การเปลี่ยนแปลงเงื่อนไขหรือข้อความในสัญญานี้ ต้องทำเป็นลายลักษณ์อักษรและได้รับการยินยอมจากคู่สัญญาทั้งสองฝ่าย
                                            </p>
                                        </div>

                                        {/* Clause 8: Force Majeure */}
                                        <div className="mb-4 text-sm text-slate-700 leading-relaxed text-justify">
                                            <p className="font-bold text-slate-800 mb-1">ข้อ 8. การลงนามและผลของสัญญา</p>
                                            <p className="indent-4">
                                                สัญญานี้ทำขึ้นเป็นรูปแบบอิเล็กทรอนิกส์ คู่สัญญาทั้งสองฝ่ายได้อ่านและเข้าใจข้อความโดยตลอดแล้ว
                                                เห็นว่าถูกต้องตรงตามเจตนา จึงได้ทำความตกลงร่วมกันไว้เป็นหลักฐานสำคัญ และตกลงปฏิบัติตามข้อตกลงในสัญญานี้โดยสุจริต
                                            </p>
                                        </div>

                                        {/* Signatures */}
                                        <div className="flex justify-between px-8 text-center text-slate-800 mb-8 mt-12">
                                            <div className="w-56">
                                                <div className="border-b-2 border-slate-800 mb-1"></div>
                                                <p className="text-sm font-bold">ลงชื่อ ผู้ว่าจ้าง</p>
                                                <p className="text-xs mt-2">({invoice.client_name})</p>
                                                <p className="text-xs mt-2 text-slate-500">วันที่: ______________</p>
                                            </div>
                                            <div className="w-56">
                                                <div className="border-b-2 border-slate-800 mb-1"></div>
                                                <p className="text-sm font-bold">ลงชื่อ ผู้รับจ้าง</p>
                                                <p className="text-xs mt-2">({siteInfo.ownerSignature || siteInfo.name})</p>
                                                <p className="text-xs mt-2 text-slate-500">วันที่: ______________</p>
                                            </div>
                                        </div>

                                        {/* Witnesses */}
                                        <div className="flex justify-between px-8 text-center text-slate-800">
                                            <div className="w-56">
                                                <div className="border-b border-slate-400 mb-1"></div>
                                                <p className="text-xs">พยาน (ฝ่ายผู้ว่าจ้าง)</p>
                                            </div>
                                            <div className="w-56">
                                                <div className="border-b border-slate-400 mb-1"></div>
                                                <p className="text-xs">พยาน (ฝ่ายผู้รับจ้าง)</p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-slate-400 border-t border-dashed border-slate-300 pt-4 mx-10">
                                            <p>สัญญาจ้างฉบับนี้พิมพ์จากระบบอิเล็กทรอนิกส์ • Contract Generated via {siteInfo.name} System</p>
                                            <p className="mt-1">© {new Date().getFullYear()} {siteInfo.name} • REF: CTR-{invoice.id.substring(0, 12).toUpperCase()}</p>
                                        </div>
                                    </div>
                                )
                            })()}
                        </>
                    )
                })}
            </div>
        </div >
    )
}
