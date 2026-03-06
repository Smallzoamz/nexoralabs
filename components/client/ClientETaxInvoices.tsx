'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { FileText, Eye, XCircle, CheckCircle, Clock, Search, RefreshCw } from 'lucide-react'

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
    status: 'draft' | 'issued' | 'cancelled' | 'void'
    notes?: string
    created_at?: string
}

export function ClientETaxInvoices() {
    const { user, isLoading: authLoading } = useAuth()
    const [invoices, setInvoices] = useState<ETaxInvoice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedInvoice, setSelectedInvoice] = useState<ETaxInvoice | null>(null)

    // Also allow viewing by email input
    const [emailFilter, setEmailFilter] = useState('')
    const [showEmailInput, setShowEmailInput] = useState(false)

    const fetchInvoices = async () => {
        setIsLoading(true)
        try {
            let query = supabase
                .from('etax_invoices')
                .select('*')
                .order('invoice_date', { ascending: false })

            // Filter by logged in user email OR entered email
            if (user?.email) {
                query = query.or(`buyer_email.eq.${user.email.toLowerCase()},buyer_email.eq.${user.email}`)
            }

            const { data, error } = await query

            if (error) throw error
            setInvoices(data || [])
        } catch (error) {
            console.error('Error fetching invoices:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const searchByEmail = async () => {
        if (!emailFilter.trim()) return

        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('etax_invoices')
                .select('*')
                .ilike('buyer_email', `%${emailFilter.trim()}%`)
                .order('invoice_date', { ascending: false })

            if (error) throw error
            setInvoices(data || [])
        } catch (error) {
            console.error('Error searching invoices:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            fetchInvoices()
        }
    }, [authLoading, user])

    const filteredInvoices = invoices.filter(inv =>
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'issued':
                return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /> ออกแล้ว</span>
            case 'draft':
                return <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium"><Clock className="w-3 h-3" /> ฉบับร่าง</span>
            case 'cancelled':
                return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /> ยกเลิก</span>
            default:
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">ไม่ใช้งาน</span>
        }
    }

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    ใบกำกับภาษี (E-Tax Invoice)
                </h2>
                <button
                    onClick={() => setShowEmailInput(!showEmailInput)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    {showEmailInput ? '✕ ปิด' : '🔍 ค้นหาด้วยอีเมล'}
                </button>
            </div>

            {/* Email Search */}
            {showEmailInput && (
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={emailFilter}
                            onChange={(e) => setEmailFilter(e.target.value)}
                            placeholder="กรอกอีเมลที่ใช้ในการซื้อ"
                            className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e) => e.key === 'Enter' && searchByEmail()}
                        />
                        <button
                            onClick={searchByEmail}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            ค้นหา
                        </button>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">กรอกอีเมลที่ใช้ในการสั่งซื้อเพื่อค้นหาใบกำกับภาษี</p>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาเลขที่ใบกำกับภาษี, ชื่อผู้ซื้อ, รายละเอียด"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Invoice List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">ไม่พบใบกำกับภาษี</p>
                    <p className="text-sm text-gray-400 mt-1">ลองค้นหาด้วยอีเมลที่ใช้ในการสั่งซื้อ</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">เลขที่</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">วันที่</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">รายละเอียด</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">จำนวนเงิน</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">สถานะ</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">ดู</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium">{invoice.invoice_number}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(invoice.invoice_date).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                                        {invoice.description}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-medium">
                                        {invoice.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {getStatusBadge(invoice.status)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setSelectedInvoice(invoice)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                            title="ดูรายละเอียด"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                ใบกำกับภาษี {selectedInvoice.invoice_number}
                            </h2>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">สถานะ:</span>
                                {getStatusBadge(selectedInvoice.status)}
                            </div>

                            {/* Invoice Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">เลขที่:</p>
                                <p className="font-semibold">{selectedInvoice.invoice_number}</p>
                                <p className="text-sm text-gray-600 mt-2">วันที่:</p>
                                <p className="font-semibold">{new Date(selectedInvoice.invoice_date).toLocaleDateString('th-TH')}</p>
                            </div>

                            {/* Seller Info */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">ผู้ขาย (Seller)</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
                                    <p><span className="text-gray-600">ชื่อ:</span> <span className="font-medium">{selectedInvoice.seller_name}</span></p>
                                    {selectedInvoice.seller_tax_id && <p><span className="text-gray-600">เลขประจำตัวผู้เสียภาษี:</span> <span className="font-medium">{selectedInvoice.seller_tax_id}</span></p>}
                                </div>
                            </div>

                            {/* Buyer Info */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">ผู้ซื้อ (Buyer)</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
                                    <p><span className="text-gray-600">ชื่อ:</span> <span className="font-medium">{selectedInvoice.buyer_name}</span></p>
                                    {selectedInvoice.buyer_tax_id && <p><span className="text-gray-600">เลขประจำตัวผู้เสียภาษี:</span> <span className="font-medium">{selectedInvoice.buyer_tax_id}</span></p>}
                                    {selectedInvoice.buyer_email && <p><span className="text-gray-600">อีเมล:</span> <span className="font-medium">{selectedInvoice.buyer_email}</span></p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="text-gray-600 text-sm">รายละเอียด:</p>
                                <p className="font-medium mt-1">{selectedInvoice.description}</p>
                            </div>

                            {/* Amount */}
                            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">จำนวนเงิน (ไม่รวม VAT):</span>
                                    <span className="font-medium">{selectedInvoice.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">VAT {selectedInvoice.vat_rate}%:</span>
                                    <span className="font-medium">{selectedInvoice.vat_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold border-t border-blue-200 pt-2">
                                    <span>รวมทั้งสิ้น:</span>
                                    <span className="text-blue-600">{selectedInvoice.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedInvoice.notes && (
                                <div>
                                    <p className="text-gray-600 text-sm">หมายเหตุ:</p>
                                    <p className="font-medium mt-1">{selectedInvoice.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setSelectedInvoice(null)}
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
