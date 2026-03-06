'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
    Plus, Edit2, Trash2, FileText, Send,
    XCircle, RefreshCw, Search, Eye, Calculator, Download
} from 'lucide-react'
import { useModal } from '@/lib/modal-context'
import { useAuth } from '@/lib/auth-context'
import { logAdminAction } from '@/lib/admin-logger'

interface ETaxInvoice {
    id: string
    invoice_number: string
    invoice_date: string
    seller_name: string
    seller_tax_id?: string
    seller_address?: string
    seller_branch_code?: string
    buyer_name: string
    buyer_tax_id?: string
    buyer_address?: string
    buyer_email?: string
    buyer_branch_code?: string
    description: string
    amount: number
    vat_rate: number
    vat_amount: number
    total_amount: number
    linked_invoice_id?: string
    status: 'draft' | 'issued' | 'cancelled' | 'void'
    notes?: string
    created_by?: string
    issued_at?: string
    created_at?: string
    updated_at?: string
}

interface SellerInfo {
    seller_name: string
    seller_tax_id: string
    seller_address: string
}

export function ETaxInvoiceManager() {
    const { showAlert, showConfirm } = useModal()
    const { user, userRole, isReadOnly } = useAuth()
    const [invoices, setInvoices] = useState<ETaxInvoice[]>([])
    const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isViewing, setIsViewing] = useState(false)
    const [viewingInvoice, setViewingInvoice] = useState<ETaxInvoice | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear())

    // Form state
    const [formData, setFormData] = useState({
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        seller_name: '',
        seller_tax_id: '',
        seller_address: '',
        seller_branch_code: '00000',
        buyer_name: '',
        buyer_tax_id: '',
        buyer_address: '',
        buyer_email: '',
        buyer_branch_code: '00000',
        description: '',
        amount: 0,
        vat_rate: 7,
        status: 'draft' as 'draft' | 'issued' | 'cancelled' | 'void',
        notes: ''
    })

    const fetchData = useCallback(async () => {
        try {
            const [invoicesRes, sellerRes] = await Promise.all([
                supabase.from('etax_invoices').select('*').order('invoice_date', { ascending: false }),
                supabase.from('site_config').select('site_name, contact_tax_id, contact_address').limit(1).maybeSingle()
            ])

            if (invoicesRes.error) throw invoicesRes.error
            setInvoices(invoicesRes.data || [])

            if (sellerRes.data) {
                setSellerInfo({
                    seller_name: sellerRes.data.site_name || '',
                    seller_tax_id: sellerRes.data.contact_tax_id || '',
                    seller_address: sellerRes.data.contact_address || ''
                })
            }
        } catch (error) {
            console.error('Error fetching etax invoices:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Generate new invoice number
    const generateInvoiceNumber = () => {
        const year = new Date().getFullYear().toString().slice(-2)
        const count = invoices.filter(i =>
            i.invoice_number.startsWith(`T${year}`)
        ).length + 1
        return `T${year}${count.toString().padStart(5, '0')}`
    }

    const handleAdd = () => {
        setIsEditing(true)
        setEditingId('new')

        // Auto-fill seller info from site config
        const defaultSeller = sellerInfo || { seller_name: 'VELOZI | Dev', seller_tax_id: '', seller_address: '' }

        setFormData({
            invoice_number: generateInvoiceNumber(),
            invoice_date: new Date().toISOString().split('T')[0],
            seller_name: defaultSeller.seller_name,
            seller_tax_id: defaultSeller.seller_tax_id || '',
            seller_address: defaultSeller.seller_address || '',
            seller_branch_code: '00000',
            buyer_name: '',
            buyer_tax_id: '',
            buyer_address: '',
            buyer_email: '',
            buyer_branch_code: '00000',
            description: '',
            amount: 0,
            vat_rate: 7,
            status: 'draft',
            notes: ''
        })
    }

    const handleEdit = (invoice: ETaxInvoice) => {
        setIsEditing(true)
        setEditingId(invoice.id)
        setFormData({
            invoice_number: invoice.invoice_number,
            invoice_date: invoice.invoice_date,
            seller_name: invoice.seller_name,
            seller_tax_id: invoice.seller_tax_id || '',
            seller_address: invoice.seller_address || '',
            seller_branch_code: invoice.seller_branch_code || '00000',
            buyer_name: invoice.buyer_name,
            buyer_tax_id: invoice.buyer_tax_id || '',
            buyer_address: invoice.buyer_address || '',
            buyer_email: invoice.buyer_email || '',
            buyer_branch_code: invoice.buyer_branch_code || '00000',
            description: invoice.description,
            amount: invoice.amount,
            vat_rate: invoice.vat_rate,
            status: invoice.status,
            notes: invoice.notes || ''
        })
    }

    const handleView = (invoice: ETaxInvoice) => {
        setIsViewing(true)
        setViewingInvoice(invoice)
    }

    const closeViewModal = () => {
        setIsViewing(false)
        setViewingInvoice(null)
    }

    const handleSave = async () => {
        console.log('Current userRole:', userRole)
        if (isReadOnly) {
            showAlert('Demo Mode', 'คุณอยู่ในโหมดทดลองใช้ ไม่สามารถแก้ไขข้อมูลได้', 'warning')
            return
        }

        if (userRole !== 'superadmin' && userRole !== 'admin') {
            showAlert('ไม่มีสิทธิ์', 'เฉพาะ Super Admin หรือ Admin เท่านั้นที่สามารถจัดการใบกำกับภาษีได้', 'error')
            return
        }

        // Validate required fields
        if (!formData.invoice_number?.trim()) {
            showAlert('ข้อผิดพลาด', 'กรุณากรอกเลขที่ใบกำกับภาษี', 'error')
            return
        }
        if (!formData.seller_name?.trim()) {
            showAlert('ข้อผิดพลาด', 'กรุณากรอกชื่อผู้ขาย', 'error')
            return
        }
        if (!formData.buyer_name?.trim()) {
            showAlert('ข้อผิดพลาด', 'กรุณากรอกชื่อผู้ซื้อ', 'error')
            return
        }
        if (!formData.description?.trim()) {
            showAlert('ข้อผิดพลาด', 'กรุณากรอกรายละเอียด', 'error')
            return
        }
        if (!formData.amount || formData.amount <= 0) {
            showAlert('ข้อผิดพลาด', 'กรุณากรอกจำนวนเงิน', 'error')
            return
        }

        setIsSaving(true)
        try {
            const payload = {
                invoice_number: formData.invoice_number,
                invoice_date: formData.invoice_date,
                seller_name: formData.seller_name,
                seller_tax_id: formData.seller_tax_id || null,
                seller_address: formData.seller_address || null,
                seller_branch_code: formData.seller_branch_code,
                buyer_name: formData.buyer_name,
                buyer_tax_id: formData.buyer_tax_id || null,
                buyer_address: formData.buyer_address || null,
                buyer_email: formData.buyer_email || null,
                buyer_branch_code: formData.buyer_branch_code,
                description: formData.description,
                amount: formData.amount,
                vat_rate: formData.vat_rate,
                status: formData.status,
                notes: formData.notes || null,
                created_by: user?.email || null,
                issued_at: formData.status === 'issued' ? new Date().toISOString() : null
            }

            let error
            console.log('Saving etax invoice with payload:', payload)
            if (editingId === 'new') {
                const result = await supabase.from('etax_invoices').insert(payload)
                error = result.error
                console.log('Insert result:', result)
                if (!error) {
                    await logAdminAction('CREATE_ETAX_INVOICE', `Created e-Tax Invoice ${formData.invoice_number}`)
                }
            } else {
                const result = await supabase.from('etax_invoices').update(payload).eq('id', editingId)
                error = result.error
                console.log('Update result:', result)
                if (!error) {
                    await logAdminAction('UPDATE_ETAX_INVOICE', `Updated e-Tax Invoice ${formData.invoice_number}`)
                }
            }

            if (error) {
                console.error('Supabase error details:', JSON.stringify(error, null, 2))
                throw error
            }

            showAlert('สำเร็จ', 'บันทึกข้อมูลใบกำกับภาษีสำเร็จ', 'success')
            setIsEditing(false)
            setEditingId(null)
            fetchData()
        } catch (error: any) {
            console.error('Error saving etax invoice:', error)
            // Show more detailed error
            let errorMessage = 'ไม่สามารถบันทึกข้อมูลได้'
            if (error && typeof error === 'object') {
                errorMessage = JSON.stringify(error)
            } else if (typeof error === 'string') {
                errorMessage = error
            }
            showAlert('เกิดข้อผิดพลาด', errorMessage, 'error')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (invoice: ETaxInvoice) => {
        if (isReadOnly) {
            showAlert('Demo Mode', 'คุณอยู่ในโหมดทดลองใช้ ไม่สามารถแก้ไขข้อมูลได้', 'warning')
            return
        }

        if (userRole !== 'superadmin') {
            showAlert('ไม่มีสิทธิ์', 'เฉพาะ Super Admin เท่านั้นที่สามารถลบได้', 'error')
            return
        }

        const confirmed = await showConfirm(
            'ยืนยันการลบ',
            `คุณต้องการลบใบกำกับภาษี ${invoice.invoice_number} ใช่หรือไม่?`
        )

        if (confirmed) {
            try {
                const { error } = await supabase.from('etax_invoices').delete().eq('id', invoice.id)
                if (error) throw error

                await logAdminAction('DELETE_ETAX_INVOICE', `Deleted e-Tax Invoice ${invoice.invoice_number}`)
                showAlert('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'success')
                fetchData()
            } catch (error: any) {
                showAlert('เกิดข้อผิดพลาด', error.message, 'error')
            }
        }
    }

    const handleIssue = async (invoice: ETaxInvoice) => {
        if (userRole !== 'superadmin') {
            showAlert('ไม่มีสิทธิ์', 'เฉพาะ Super Admin เท่านั้น', 'error')
            return
        }

        const confirmed = await showConfirm(
            'ออกใบกำกับภาษี',
            `คุณต้องการออกใบกำกับภาษี ${invoice.invoice_number} ใช่หรือไม่?`
        )

        if (confirmed) {
            try {
                const { error } = await supabase
                    .from('etax_invoices')
                    .update({ status: 'issued', issued_at: new Date().toISOString() })
                    .eq('id', invoice.id)

                if (error) throw error

                await logAdminAction('ISSUE_ETAX_INVOICE', `Issued e-Tax Invoice ${invoice.invoice_number}`)
                showAlert('สำเร็จ', 'ออกใบกำกับภาษีสำเร็จ', 'success')
                fetchData()
            } catch (error: any) {
                showAlert('เกิดข้อผิดพลาด', error.message, 'error')
            }
        }
    }

    const handleCancel = async (invoice: ETaxInvoice) => {
        if (userRole !== 'superadmin') {
            showAlert('ไม่มีสิทธิ์', 'เฉพาะ Super Admin เท่านั้น', 'error')
            return
        }

        const confirmed = await showConfirm(
            'ยกเลิกใบกำกับภาษี',
            `คุณต้องการยกเลิกใบกำกับภาษี ${invoice.invoice_number} ใช่หรือไม่?`
        )

        if (confirmed) {
            try {
                const { error } = await supabase
                    .from('etax_invoices')
                    .update({ status: 'cancelled' })
                    .eq('id', invoice.id)

                if (error) throw error

                await logAdminAction('CANCEL_ETAX_INVOICE', `Cancelled e-Tax Invoice ${invoice.invoice_number}`)
                showAlert('สำเร็จ', 'ยกเลิกใบกำกับภาษีสำเร็จ', 'success')
                fetchData()
            } catch (error: any) {
                showAlert('เกิดข้อผิดพลาด', error.message, 'error')
            }
        }
    }

    // Calculate VAT
    const calculateVat = (amount: number, rate: number) => {
        return Math.round(amount * (rate / 100) * 100) / 100
    }

    const calculateTotal = (amount: number, rate: number) => {
        return amount + calculateVat(amount, rate)
    }

    // Filter invoices
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter

        const invYear = new Date(inv.invoice_date).getFullYear()
        const matchesYear = invYear === yearFilter

        return matchesSearch && matchesStatus && matchesYear
    })

    // Stats
    const stats = {
        total: invoices.length,
        issued: invoices.filter(i => i.status === 'issued').length,
        draft: invoices.filter(i => i.status === 'draft').length,
        cancelled: invoices.filter(i => i.status === 'cancelled').length,
        totalAmount: invoices.filter(i => i.status === 'issued').reduce((sum, i) => sum + i.total_amount, 0)
    }

    // Check permission
    const canManage = userRole === 'superadmin' && !isReadOnly

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">ใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax)</h2>
                    <p className="text-gray-600">จัดการใบกำกับภาษี หรือ E-Tax Invoice</p>
                </div>

                {canManage && (
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        สร้างใบกำกับภาษี
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">ทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">ฉบับร่าง</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">ออกแล้ว</p>
                    <p className="text-2xl font-bold text-green-600">{stats.issued}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">ยกเลิก</p>
                    <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500">รวม (ออกแล้ว)</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาเลขที่ใบกำกับภาษี, ชื่อลูกค้า..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">ทุกสถานะ</option>
                    <option value="draft">ฉบับร่าง</option>
                    <option value="issued">ออกแล้ว</option>
                    <option value="cancelled">ยกเลิก</option>
                    <option value="void">ไม่ใช้งาน</option>
                </select>
                <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    {[2024, 2025, 2026, 2027, 2028].map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">เลขที่</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">วันที่</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ผู้ซื้อ</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">รายละเอียด</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">จำนวนเงิน</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">VAT 7%</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">รวม</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">สถานะ</th>
                                {canManage && <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">จัดการ</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={canManage ? 9 : 8} className="px-4 py-8 text-center text-gray-500">
                                        ไม่พบข้อมูลใบกำกับภาษี
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-sm font-medium">{invoice.invoice_number}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {new Date(invoice.invoice_date).toLocaleDateString('th-TH')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{invoice.buyer_name}</p>
                                                {invoice.buyer_tax_id && (
                                                    <p className="text-xs text-gray-500">Tax ID: {invoice.buyer_tax_id}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm max-w-xs truncate">
                                            {invoice.description}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            {invoice.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            {invoice.vat_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold">
                                            {invoice.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${invoice.status === 'issued' ? 'bg-green-100 text-green-800' :
                                                    invoice.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                        invoice.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {invoice.status === 'issued' ? 'ออกแล้ว' :
                                                    invoice.status === 'draft' ? 'ฉบับร่าง' :
                                                        invoice.status === 'cancelled' ? 'ยกเลิก' : 'ไม่ใช้งาน'}
                                            </span>
                                        </td>
                                        {canManage && (
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    {invoice.status === 'draft' && (
                                                        <button
                                                            onClick={() => handleIssue(invoice)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                            title="ออกใบกำกับภาษี"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {invoice.status === 'issued' && (
                                                        <button
                                                            onClick={() => handleCancel(invoice)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                            title="ยกเลิกใบกำกับภาษี"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleView(invoice)}
                                                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                                                        title="ดูรายละเอียด"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(invoice)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="แก้ไข"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(invoice)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                        title="ลบ"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">
                                {editingId === 'new' ? 'สร้างใบกำกับภาษีใหม่' : 'แก้ไขใบกำกับภาษี'}
                            </h3>
                            <button
                                onClick={() => { setIsEditing(false); setEditingId(null) }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Invoice Number & Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        เลขที่ใบกำกับภาษี <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.invoice_number}
                                        onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        วันที่ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.invoice_date}
                                        onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Seller Info */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> ข้อมูลผู้ขาย (Seller)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ขาย</label>
                                        <input
                                            type="text"
                                            value={formData.seller_name}
                                            onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                                        <input
                                            type="text"
                                            value={formData.seller_tax_id}
                                            onChange={(e) => setFormData({ ...formData, seller_tax_id: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                                        <textarea
                                            value={formData.seller_address}
                                            onChange={(e) => setFormData({ ...formData, seller_address: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Buyer Info */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> ข้อมูลผู้ซื้อ (Buyer)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ชื่อผู้ซื้อ <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.buyer_name}
                                            onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                                        <input
                                            type="text"
                                            value={formData.buyer_tax_id}
                                            onChange={(e) => setFormData({ ...formData, buyer_tax_id: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                                        <input
                                            type="email"
                                            value={formData.buyer_email}
                                            onChange={(e) => setFormData({ ...formData, buyer_email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสสาขา</label>
                                        <input
                                            type="text"
                                            value={formData.buyer_branch_code}
                                            onChange={(e) => setFormData({ ...formData, buyer_branch_code: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                                        <textarea
                                            value={formData.buyer_address}
                                            onChange={(e) => setFormData({ ...formData, buyer_address: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Amount Info */}
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calculator className="w-5 h-5" /> รายละเอียดค่าใช้จ่าย
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            รายละเอียด <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="เช่น ค่าบริการออกแบบเว็บไซต์"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            จำนวนเงิน (ไม่รวม VAT) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                            min={0}
                                            step={0.01}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">อัตราภาษี (%)</label>
                                        <input
                                            type="number"
                                            value={formData.vat_rate}
                                            onChange={(e) => setFormData({ ...formData, vat_rate: parseFloat(e.target.value) || 0 })}
                                            min={0}
                                            max={100}
                                            step={0.01}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Calculate Preview */}
                                <div className="mt-4 bg-white p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">จำนวนเงิน (ไม่รวม VAT):</span>
                                        <span className="font-medium">{formData.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">VAT {formData.vat_rate}%:</span>
                                        <span className="font-medium">{calculateVat(formData.amount, formData.vat_rate).toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <span className="font-semibold">รวมทั้งสิ้น:</span>
                                        <span className="text-xl font-bold text-blue-600">{calculateTotal(formData.amount, formData.vat_rate).toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status & Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'issued' | 'cancelled' | 'void' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="draft">ฉบับร่าง</option>
                                        <option value="issued">ออกแล้ว</option>
                                        <option value="cancelled">ยกเลิก</option>
                                        <option value="void">ไม่ใช้งาน</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                                    <input
                                        type="text"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => { setIsEditing(false); setEditingId(null) }}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal - Professional Invoice Format */}
            {isViewing && viewingInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                        {/* Header - Hidden when printing */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 print:hidden">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                ใบกำกับภาษี {viewingInvoice.invoice_number}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    ดาวน์โหลด PDF
                                </button>
                                <button
                                    onClick={closeViewModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Invoice Content - Print Friendly */}
                        <div id="printable-invoice" className="p-8 bg-white print:p-0">
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">ใบกำกับภาษี</h1>
                                    <p className="text-lg text-gray-500 mt-1">TAX INVOICE</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">{viewingInvoice.seller_name}</p>
                                    {viewingInvoice.seller_address && <p className="text-sm text-gray-600 whitespace-pre-line">{viewingInvoice.seller_address}</p>}
                                    {viewingInvoice.seller_tax_id && <p className="text-sm mt-2"><span className="text-gray-500">เลขประจำตัวผู้เสียภาษี:</span> <span className="font-medium">{viewingInvoice.seller_tax_id}</span></p>}
                                    {viewingInvoice.seller_branch_code && viewingInvoice.seller_branch_code !== '00000' && <p className="text-sm"><span className="text-gray-500">สาขา:</span> <span className="font-medium">{viewingInvoice.seller_branch_code}</span></p>}
                                </div>
                            </div>

                            {/* Invoice Meta */}
                            <div className="flex justify-between mb-8 p-4 bg-gray-50 rounded-lg print:bg-white print:border print:border-gray-300">
                                <div>
                                    <p className="text-sm text-gray-500">เลขที่เอกสาร</p>
                                    <p className="text-xl font-bold text-gray-900">{viewingInvoice.invoice_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">วันที่ออกเอกสาร</p>
                                    <p className="text-lg font-medium text-gray-900">{new Date(viewingInvoice.invoice_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Buyer Info */}
                            <div className="mb-8">
                                <p className="text-sm text-gray-500 mb-2">ผู้ซื้อ / Buyer</p>
                                <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 print:bg-white">
                                    <p className="text-lg font-bold text-gray-900">{viewingInvoice.buyer_name}</p>
                                    {viewingInvoice.buyer_address && <p className="text-sm text-gray-600 whitespace-pre-line">{viewingInvoice.buyer_address}</p>}
                                    <div className="mt-2 flex flex-wrap gap-4">
                                        {viewingInvoice.buyer_tax_id && (
                                            <p className="text-sm"><span className="text-gray-500">เลขประจำตัวผู้เสียภาษี:</span> <span className="font-medium">{viewingInvoice.buyer_tax_id}</span></p>
                                        )}
                                        {viewingInvoice.buyer_branch_code && viewingInvoice.buyer_branch_code !== '00000' && (
                                            <p className="text-sm"><span className="text-gray-500">สาขา:</span> <span className="font-medium">{viewingInvoice.buyer_branch_code}</span></p>
                                        )}
                                        {viewingInvoice.buyer_email && (
                                            <p className="text-sm"><span className="text-gray-500">อีเมล:</span> <span className="font-medium">{viewingInvoice.buyer_email}</span></p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="mb-8">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-800 text-white">
                                            <th className="text-left p-3">รายการ</th>
                                            <th className="text-center p-3">จำนวน</th>
                                            <th className="text-right p-3">ราคาต่อหน่วย</th>
                                            <th className="text-right p-3">จำนวนเงิน</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-200">
                                            <td className="p-4">
                                                <p className="font-medium">{viewingInvoice.description}</p>
                                            </td>
                                            <td className="text-center p-4">1</td>
                                            <td className="text-right p-4">{viewingInvoice.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                            <td className="text-right p-4 font-medium">{viewingInvoice.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end mb-8">
                                <div className="w-80">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">รวมเป็นเงิน</span>
                                        <span className="font-medium">{viewingInvoice.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">ภาษีมูลค่าเพิ่ม (VAT {viewingInvoice.vat_rate}%)</span>
                                        <span className="font-medium">{viewingInvoice.vat_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
                                    </div>
                                    <div className="flex justify-between py-3 text-xl font-bold">
                                        <span>รวมทั้งสิ้น</span>
                                        <span className="text-blue-600">{viewingInvoice.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-start">
                                <div className="w-1/2">
                                    {viewingInvoice.notes && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">หมายเหตุ</p>
                                            <p className="text-sm text-gray-700">{viewingInvoice.notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">สถานะ</p>
                                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium mt-1 ${viewingInvoice.status === 'issued' ? 'bg-green-100 text-green-800' :
                                        viewingInvoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                            'bg-red-100 text-red-800'}`}>
                                        {viewingInvoice.status === 'issued' ? 'ออกแล้ว / Issued' :
                                            viewingInvoice.status === 'draft' ? 'ฉบับร่าง / Draft' : 'ยกเลิก / Cancelled'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions - Hidden when printing */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end print:hidden">
                            <button
                                onClick={closeViewModal}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
