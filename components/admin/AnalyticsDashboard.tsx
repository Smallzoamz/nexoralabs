'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BarChart3, TrendingUp, Users, Activity,
    Download, FileText, X, Calculator, RefreshCw, Package, BookOpen, ArrowDownRight, Clock
} from 'lucide-react'
import { bahttext } from 'bahttext'
import { useModal } from '@/lib/modal-context'
import { supabase } from '@/lib/supabase'

interface AnalyticsData {
    popularPackages: { name: string, count: number }[]
    commonIssues: { category: string, count: number }[]
    businessTypes: { type: string, count: number }[]
    monthlyRenewals: { month: string, count: number }[]
    totalActiveClients: number
    siteTraffic: { total: number, thisMonth: number, today: number, recent: { date: string, visits: number }[] }
    revenue: { total: number, thisMonth: number, thisYear: number, monthlyData: { month: string, amount: number }[] }
}

export function AnalyticsDashboard() {
    const { showAlert } = useModal()
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false)
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
    const [isAccModalOpen, setIsAccModalOpen] = useState(false)
    const [accLoading, setAccLoading] = useState(false)
    const [accData, setAccData] = useState<{
        paidInvoices: { id: string; client_name: string; client_email: string; package_details: string; setup_fee: number; monthly_fee: number; created_at: string; due_date: string }[]
        pendingInvoices: { id: string; client_name: string; client_email: string; package_details: string; setup_fee: number; monthly_fee: number; due_date: string }[]
        accYear: number
    } | null>(null)
    const [accYear, setAccYear] = useState(new Date().getFullYear())

    // Tax Form State
    const [taxData, setTaxData] = useState({
        type: 'company' as 'company' | 'personal', // Payer Type
        payerName: '',
        payerAddress: '',
        payerTaxId: '',
        receiverName: 'Nexora Labs (เน็กโซร่า แล็บส์)',
        receiverAddress: '234/56 อาคารซีเนียร์ พารากอน ชั้น 9 เขตบางรัก กรุงเทพมหานคร 10500',
        receiverTaxId: '01055xxxxxxxx',
        description: 'ค่าบริการออกแบบและพัฒนาระบบเว็บไซต์',
        amount: 25000,
        taxRate: 3, // Default 3% for services
    })

    const fetchAnalytics = async () => {
        setIsLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const res = await fetch('/api/system/analytics', {
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            })

            if (!res.ok) throw new Error('Failed to fetch analytics data')

            const result = await res.json()
            setData(result)
        } catch (error) {
            console.error(error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูล Data Audit ได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleGenerateTaxForm = async (e: React.FormEvent) => {
        e.preventDefault()

        if (taxData.type === 'company' && !taxData.payerTaxId) {
            showAlert('ข้อมูลไม่ครบ', 'กรุณากรอกเลขประจำตัวผู้เสียภาษีของผู้จ่ายเงิน', 'error')
            return
        }

        setIsGeneratingPdf(true)

        try {
            const html2pdfModule = (await import('html2pdf.js')).default

            const element = document.getElementById('tax-form-pdf')
            if (!element) throw new Error('แบบฟอร์มไม่พร้อมทำงาน')

            element.style.display = 'block'

            const filename = `WithholdingTax_${taxData.payerName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`

            const opt = {
                margin: 0,
                filename: filename,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 793, width: 793 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            }

            await html2pdfModule().set(opt).from(element).save()

            element.style.display = 'none'
            setIsTaxModalOpen(false)
            showAlert('สำเร็จ', 'ดาวน์โหลดหนังสือรับรองการหักภาษี ณ ที่จ่าย สำเร็จเรียบร้อยแล้ว', 'success')

        } catch (error) {
            console.error('PDF generation error:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถสร้างไฟล์เอกสารได้', 'error')
        } finally {
            setIsGeneratingPdf(false)
        }
    }

    const openAccountingModal = async () => {
        setIsAccModalOpen(true)
        setAccLoading(true)
        try {
            const { data: paid } = await supabase
                .from('invoices')
                .select('id, client_name, client_email, package_details, setup_fee, monthly_fee, created_at, due_date')
                .eq('status', 'paid')
                .order('created_at', { ascending: false })
            const { data: pending } = await supabase
                .from('invoices')
                .select('id, client_name, client_email, package_details, setup_fee, monthly_fee, due_date')
                .eq('status', 'pending')
                .order('due_date', { ascending: true })
            setAccData({
                paidInvoices: paid ?? [],
                pendingInvoices: pending ?? [],
                accYear,
            })
        } catch (err) {
            console.error(err)
        } finally {
            setAccLoading(false)
        }
    }

    const handleDownloadAccPdf = async () => {
        const el = document.getElementById('accounting-report-pdf')
        if (!el) return
        setIsGeneratingPdf(true)
        try {
            const html2pdfModule = (await import('html2pdf.js')).default
            el.style.display = 'block'
            await html2pdfModule().set({
                margin: 8,
                filename: `AccountingReport_Nexora_${accYear}.pdf`,
                image: { type: 'jpeg', quality: 0.97 },
                html2canvas: { scale: 2, useCORS: true, windowWidth: 794, width: 794 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).from(el).save()
            el.style.display = 'none'
        } catch (e) { console.error(e) } finally { setIsGeneratingPdf(false) }
    }

    if (isLoading || !data) {
        return (
            <div className="flex flex-col items-center justify-center p-24 text-secondary-500">
                <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-medium animate-pulse">กำลังประมวลผล Data Audit...</p>
            </div>
        )
    }

    // Calculations for Progress Bars — use ?? [] to guard against null arrays from API
    const popularPackages = data.popularPackages ?? []
    const businessTypes = data.businessTypes ?? []
    const maxPackage = Math.max(...(popularPackages.length ? popularPackages.map(p => p.count) : [1])) || 1
    const maxBusiness = Math.max(...(businessTypes.length ? businessTypes.map(b => b.count) : [1])) || 1

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-secondary-900 border-b-2 border-primary-500 pb-1 inline-block">
                        Data Audit & Analytics
                    </h2>
                    <p className="text-sm text-secondary-600 mt-2">
                        วิเคราะห์ภาพรวมธุรกิจ รายได้ และพฤติกรรมลูกค้า
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAnalytics}
                        className="p-2 text-secondary-500 hover:bg-secondary-100 rounded-lg transition-colors"
                        title="รีเฟรชข้อมูล"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={openAccountingModal}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-sm"
                    >
                        <BookOpen className="w-4 h-4" />
                        ทำบัญชี
                    </button>
                    <button
                        onClick={() => setIsTaxModalOpen(true)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-sm"
                    >
                        <FileText className="w-4 h-4" />
                        หนังสือหัก ณ ที่จ่าย (50 ทวิ)
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200"
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-secondary-500 font-medium mb-1">รายได้เดือนนี้</p>
                    <h3 className="text-2xl font-bold text-secondary-900">
                        ฿{data.revenue.thisMonth.toLocaleString()}
                    </h3>
                    <p className="text-xs text-secondary-400 mt-2">รวมทั้งหมด ฿{data.revenue.total.toLocaleString()}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200"
                >
                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-secondary-500 font-medium mb-1">ลูกค้าที่ดูแลอยู่</p>
                    <h3 className="text-2xl font-bold text-secondary-900">
                        {data.totalActiveClients} ราย
                    </h3>
                    <p className="text-xs text-secondary-400 mt-2">Active package subscriptions</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200"
                >
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                        <Activity className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-secondary-500 font-medium mb-1">คนเข้าเว็บวันนี้</p>
                    <h3 className="text-2xl font-bold text-secondary-900">
                        {data.siteTraffic.today.toLocaleString()} ครั้ง
                    </h3>
                    <p className="text-xs text-secondary-400 mt-2">เดือนนี้: {data.siteTraffic.thisMonth.toLocaleString()}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200"
                >
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-secondary-500 font-medium mb-1">สรุปการต่ออายุ</p>
                    <h3 className="text-2xl font-bold text-secondary-900">
                        {data.monthlyRenewals.length > 0 ? data.monthlyRenewals[data.monthlyRenewals.length - 1].count : 0} เว็บ
                    </h3>
                    <p className="text-xs text-secondary-400 mt-2">ยอดอัปเดตเดือนรอบปัจจุบัน</p>
                </motion.div>
            </div>

            {/* Analysis Detail Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Popular Packages */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                    <h3 className="font-bold text-secondary-900 mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary-500" />
                        แพ็กเกจที่ได้รับความสนใจสูงสุด
                    </h3>
                    <div className="space-y-5">
                        {popularPackages.sort((a, b) => b.count - a.count).map((pkg, idx) => {
                            const percent = Math.round((pkg.count / maxPackage) * 100)
                            return (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-secondary-700 capitalize">{pkg.name}</span>
                                        <span className="text-secondary-500">{pkg.count} รายการ</span>
                                    </div>
                                    <div className="w-full bg-secondary-100 rounded-full h-2.5">
                                        <div className="bg-primary-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                            )
                        })}
                        {popularPackages.length === 0 && <p className="text-sm text-secondary-500 text-center py-4">ยังไม่มีข้อมูลเพียงพอ</p>}
                    </div>
                </div>

                {/* Business Types */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                    <h3 className="font-bold text-secondary-900 mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        ประเภทธุรกิจของลูกค้า
                    </h3>
                    <div className="space-y-4">
                        {businessTypes.filter(b => b.count > 0).map((biz, idx) => {
                            const percent = Math.round((biz.count / maxBusiness) * 100)
                            return (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-1/3 text-sm text-secondary-700 truncate" title={biz.type}>{biz.type}</div>
                                    <div className="w-1/2">
                                        <div className="w-full bg-secondary-100 rounded-full h-2">
                                            <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="w-1/6 text-right text-sm text-secondary-500">{biz.count}</div>
                                </div>
                            )
                        })}
                        {data.businessTypes.filter(b => b.count > 0).length === 0 && <p className="text-sm text-secondary-500 text-center py-4">ระบบไม่พบ Keyword ที่จัดกลุ่มได้</p>}
                    </div>
                </div>

                {/* Common Issues */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200 lg:col-span-2">
                    <h3 className="font-bold text-secondary-900 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-rose-500" />
                        ปัญหา/ความต้องการที่เจอบ่อย (Pain points extraction)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {data.commonIssues.filter(i => i.count > 0).map((issue, idx) => {
                            const colors = ['bg-rose-50 border-rose-200 text-rose-700', 'bg-orange-50 border-orange-200 text-orange-700', 'bg-amber-50 border-amber-200 text-amber-700', 'bg-blue-50 border-blue-200 text-blue-700']
                            const colorClass = colors[idx % colors.length]
                            return (
                                <div key={idx} className={`p-4 rounded-xl border ${colorClass} flex flex-col justify-between`}>
                                    <span className="font-bold">{issue.category}</span>
                                    <div className="flex justify-between items-end mt-4">
                                        <span className="text-xs opacity-75">ความถี่ที่ค้นพบ</span>
                                        <span className="text-2xl font-black">{issue.count}</span>
                                    </div>
                                </div>
                            )
                        })}
                        {data.commonIssues.filter(i => i.count > 0).length === 0 && <div className="col-span-full text-center text-sm text-secondary-500 py-8">ไม่มีข้อมูลการวิเคราะห์ข้อความจาก Contact Form</div>}
                    </div>
                </div>

            </div>

            {/* Tax Form Generator Modal */}
            <AnimatePresence>
                {isTaxModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-secondary-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-secondary-200 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                                        <Calculator className="w-5 h-5 text-primary-600" />
                                        สร้างหนังสือรับรองการหักภาษี ณ ที่จ่าย (50 ทวิ)
                                    </h2>
                                    <p className="text-sm text-secondary-500 mt-1">เอกสารสำหรับใช้ประกอบการยื่นภาษีเงินได้ประจำปี</p>
                                </div>
                                <button
                                    onClick={() => setIsTaxModalOpen(false)}
                                    className="p-2 text-secondary-400 hover:bg-secondary-200 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleGenerateTaxForm} className="p-6 overflow-y-auto">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">ประเภทรูปแบบ</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${taxData.type === 'company' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-secondary-200 hover:bg-secondary-50'}`}>
                                                <input type="radio" checked={taxData.type === 'company'} onChange={() => setTaxData({ ...taxData, type: 'company' })} className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-secondary-300" />
                                                <span className="font-medium text-sm">นิติบุคคล หัก นิติบุคคล</span>
                                            </label>
                                            <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${taxData.type === 'personal' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-secondary-200 hover:bg-secondary-50'}`}>
                                                <input type="radio" checked={taxData.type === 'personal'} onChange={() => setTaxData({ ...taxData, type: 'personal' })} className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-secondary-300" />
                                                <span className="font-medium text-sm">นิติบุคคล หัก บุคคลธรรมดา</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">ชื่อผู้จ่ายเงิน (ลูกค้า/ผู้ว่าจ้าง)</label>
                                        <input type="text" value={taxData.payerName} onChange={e => setTaxData({ ...taxData, payerName: e.target.value })} className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="เช่น บริษัท เอบีซี จำกัด" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">เลขประจำตัวผู้เสียภาษี (ผู้จ่ายเงิน)</label>
                                        <input type="text" maxLength={13} value={taxData.payerTaxId} onChange={e => setTaxData({ ...taxData, payerTaxId: e.target.value.replace(/\D/g, '') })} className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="0123456789012" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">ที่อยู่ (ผู้จ่ายเงิน)</label>
                                        <textarea rows={2} value={taxData.payerAddress} onChange={e => setTaxData({ ...taxData, payerAddress: e.target.value })} className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="ที่อยู่องค์กรหรือที่อยู่ตามบัตรประชาชน..." required></textarea>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">ประเภทเงินได้</label>
                                            <input type="text" value={taxData.description} onChange={e => setTaxData({ ...taxData, description: e.target.value })} className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">จำนวนเงินที่จ่าย</label>
                                            <input type="number" min="0" value={taxData.amount} onChange={e => setTaxData({ ...taxData, amount: Number(e.target.value) })} className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">อัตราภาษีที่หัก (%)</label>
                                        <select value={taxData.taxRate} onChange={e => setTaxData({ ...taxData, taxRate: Number(e.target.value) })} className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                                            <option value={1}>1% (ค่าขนส่ง)</option>
                                            <option value={2}>2% (ค่าโฆษณา)</option>
                                            <option value={3}>3% (ค่าบริการ / ค่าจ้างทำของ)</option>
                                            <option value={5}>5% (ค่าเช่า / นักแสดงสาธารณะ)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-secondary-200 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsTaxModalOpen(false)} className="px-5 py-2 text-secondary-600 font-medium hover:bg-secondary-100 rounded-xl transition-colors">
                                        ยกเลิก
                                    </button>
                                    <button type="submit" disabled={isGeneratingPdf} className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm">
                                        {isGeneratingPdf ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                                        สร้างและดาวน์โหลด PDF
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hidden PDF Canvas for Withholding Tax Certificate */}
            <div className="hidden">
                <div id={`tax-form-pdf`} className="bg-white p-12 font-sans text-black box-border mx-auto relative overflow-hidden text-sm" style={{ display: 'none', width: '210mm', height: '297mm' }}>
                    {/* Header */}
                    <div className="text-center mb-6 relative">
                        <h1 className="text-xl font-bold">หนังสือรับรองการหักภาษี ณ ที่จ่าย</h1>
                        <p className="text-sm mt-1">ตามมาตรา 50 ทวิ แห่งประมวลรัษฎากร</p>
                        <div className="absolute top-0 right-0 border border-black p-2 text-xs font-bold w-32 text-center">
                            {taxData.type === 'company' ? 'ภ.ง.ด. 53' : 'ภ.ง.ด. 3'}
                        </div>
                    </div>

                    {/* Section 1: Payer */}
                    <div className="border border-black p-4 mb-4">
                        <h2 className="font-bold mb-2">ผู้มีหน้าที่หักภาษี ณ ที่จ่าย:</h2>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-semibold">ชื่อ/ชื่อนิติบุคคล:</span>
                            <span>{taxData.payerName}</span>
                            <span className="font-semibold">เลขประจำตัวผู้เสียภาษี:</span>
                            <span>{taxData.payerTaxId || '-'}</span>
                            <span className="font-semibold">ที่อยู่:</span>
                            <span>{taxData.payerAddress}</span>
                        </div>
                    </div>

                    {/* Section 2: Receiver */}
                    <div className="border border-black p-4 mb-6">
                        <h2 className="font-bold mb-2">ผู้ถูกหักภาษี ณ ที่จ่าย:</h2>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-semibold">ชื่อ/ชื่อนิติบุคคล:</span>
                            <span>{taxData.receiverName}</span>
                            <span className="font-semibold">เลขประจำตัวผู้เสียภาษี:</span>
                            <span>{taxData.receiverTaxId}</span>
                            <span className="font-semibold">ที่อยู่:</span>
                            <span>{taxData.receiverAddress}</span>
                        </div>
                    </div>

                    {/* Income Details Table */}
                    <table className="w-full text-left border-collapse border border-black mt-4">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="p-2 font-bold border border-black w-12 text-center">ลำดับ</th>
                                <th className="p-2 font-bold border border-black">ประเภทเงินได้พึงประเมินที่จ่าย</th>
                                <th className="p-2 font-bold border border-black text-center w-32">วัน เดือน ปี ที่จ่าย</th>
                                <th className="p-2 font-bold border border-black text-right w-32">จำนวนเงินที่จ่าย</th>
                                <th className="p-2 font-bold border border-black text-right w-32">ภาษีที่หักและนำส่งไว้</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-3 text-center border border-black border-b-0">1</td>
                                <td className="p-3 border border-black border-b-0">{taxData.description} (อัตรา {taxData.taxRate}%)</td>
                                <td className="p-3 text-center border border-black border-b-0">{new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                <td className="p-3 text-right border border-black border-b-0">{taxData.amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="p-3 text-right border border-black border-b-0">{(taxData.amount * (taxData.taxRate / 100)).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr className="h-48">
                                <td className="border border-black border-t-0 border-b-0"></td>
                                <td className="border border-black border-t-0 border-b-0"></td>
                                <td className="border border-black border-t-0 border-b-0"></td>
                                <td className="border border-black border-t-0 border-b-0"></td>
                                <td className="border border-black border-t-0 border-b-0"></td>
                            </tr>
                            <tr className="bg-slate-50 font-bold">
                                <td colSpan={3} className="p-3 text-right border border-black">รวมเงินที่จ่ายและภาษีที่หักนำส่ง</td>
                                <td className="p-3 text-right border border-black">{taxData.amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="p-3 text-right border border-black">{(taxData.amount * (taxData.taxRate / 100)).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Footer Text */}
                    <div className="mt-4 mb-16">
                        <p><strong>ตัวอักษร:</strong> ({bahttext(taxData.amount * (taxData.taxRate / 100))})</p>
                    </div>

                    {/* Signature */}
                    <div className="absolute bottom-16 right-12 text-center w-64">
                        <p className="mb-12 text-left">ขอรับรองว่าข้อความและตัวเลขดังกล่าวข้างต้นถูกต้องตรงกับความจริงทุกประการ</p>
                        <div className="border-b border-black mb-2"></div>
                        <p className="font-bold">ผู้มีหน้าที่หักภาษี ณ ที่จ่าย</p>
                        <p className="mt-2 text-slate-600">( วันที่ ..... / ..... / ..... )</p>
                    </div>
                </div>
            </div>

            {/* ===== ACCOUNTING MODAL ===== */}
            <AnimatePresence>
                {isAccModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsAccModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-5 h-5" />
                                    <div>
                                        <h2 className="font-bold text-lg leading-tight">รายงานทางบัญชี (Accounting Report)</h2>
                                        <p className="text-emerald-200 text-xs">Nexora Labs — สำหรับตรวจสอบบัญชีประจำปี</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={accYear}
                                        onChange={e => setAccYear(Number(e.target.value))}
                                        className="text-sm bg-white/20 border border-white/30 text-white rounded-lg px-3 py-1.5 focus:outline-none"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {[2024, 2025, 2026, 2027].map(y => (
                                            <option key={y} value={y} className="text-slate-900">{y}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleDownloadAccPdf}
                                        disabled={isGeneratingPdf || accLoading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {isGeneratingPdf ? <Calculator className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                        ดาวน์โหลด PDF
                                    </button>
                                    <button onClick={() => setIsAccModalOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="overflow-y-auto flex-1 p-6 space-y-6">
                                {accLoading ? (
                                    <div className="flex items-center justify-center py-20 text-slate-400">
                                        <Calculator className="w-8 h-8 animate-spin mr-3" />
                                        <span>กำลังโหลดข้อมูลบัญชี...</span>
                                    </div>
                                ) : accData ? (() => {
                                    const yearPaid = accData.paidInvoices.filter(inv => new Date(inv.created_at).getFullYear() === accYear)
                                    const yearPending = accData.pendingInvoices.filter(inv => new Date(inv.due_date).getFullYear() === accYear)
                                    const totalRevenue = yearPaid.reduce((s, inv) => s + Number(inv.setup_fee) + Number(inv.monthly_fee), 0)
                                    const totalSetup = yearPaid.reduce((s, inv) => s + Number(inv.setup_fee), 0)
                                    const totalMonthly = yearPaid.reduce((s, inv) => s + Number(inv.monthly_fee), 0)
                                    const totalAR = yearPending.reduce((s, inv) => s + Number(inv.setup_fee) + Number(inv.monthly_fee), 0)

                                    return (
                                        <div id="accounting-report-pdf" className="space-y-6" style={{ display: 'block' }}>
                                            {/* Header for PDF */}
                                            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                                                <p className="text-xs text-slate-500 uppercase tracking-widest">NEXORA LABS CO., LTD.</p>
                                                <h1 className="text-xl font-bold text-slate-900 mt-1">รายงานทางบัญชี (Accounting Report)</h1>
                                                <p className="text-sm text-slate-600">สำหรับปีสิ้นสุดวันที่ 31 ธันวาคม พ.ศ. {accYear}</p>
                                            </div>

                                            {/* ── SECTION 1: Income Statement ── */}
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <span className="w-1 h-4 bg-emerald-600 rounded-full inline-block"></span>
                                                    งบกำไรขาดทุน (Income Statement) — ปี {accYear}
                                                </h3>
                                                <table className="w-full text-sm border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-800 text-white">
                                                            <th className="px-4 py-2.5 text-left font-medium">รหัสบัญชี</th>
                                                            <th className="px-4 py-2.5 text-left font-medium">รายการ</th>
                                                            <th className="px-4 py-2.5 text-right font-medium">เดบิต (฿)</th>
                                                            <th className="px-4 py-2.5 text-right font-medium">เครดิต (฿)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        <tr className="bg-emerald-50">
                                                            <td className="px-4 py-2 text-slate-500 font-mono text-xs">4100</td>
                                                            <td className="px-4 py-2 font-semibold text-emerald-800">รายได้จากบริการ (Service Revenue)</td>
                                                            <td className="px-4 py-2 text-right">—</td>
                                                            <td className="px-4 py-2 text-right font-bold text-emerald-700">{totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 text-slate-400 font-mono text-xs pl-8">4101</td>
                                                            <td className="px-4 py-2 text-slate-600 pl-8">↳ ค่าติดตั้ง / พัฒนาระบบ (Setup Fee)</td>
                                                            <td className="px-4 py-2 text-right text-slate-600">—</td>
                                                            <td className="px-4 py-2 text-right text-slate-600">{totalSetup.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 text-slate-400 font-mono text-xs pl-8">4102</td>
                                                            <td className="px-4 py-2 text-slate-600 pl-8">↳ ค่าบริการรายเดือน (Monthly Service)</td>
                                                            <td className="px-4 py-2 text-right text-slate-600">—</td>
                                                            <td className="px-4 py-2 text-right text-slate-600">{totalMonthly.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                        </tr>
                                                        <tr className="bg-amber-50">
                                                            <td className="px-4 py-2 text-slate-500 font-mono text-xs">1200</td>
                                                            <td className="px-4 py-2 font-semibold text-amber-800">ลูกหนี้การค้า (Accounts Receivable)</td>
                                                            <td className="px-4 py-2 text-right font-bold text-amber-700">{totalAR.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                            <td className="px-4 py-2 text-right">—</td>
                                                        </tr>
                                                        <tr className="bg-slate-100 font-bold">
                                                            <td colSpan={2} className="px-4 py-3 text-slate-800">รายได้รับจริง (Cash Collected)</td>
                                                            <td className="px-4 py-3 text-right text-blue-700">{totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                            <td className="px-4 py-3 text-right text-blue-700">{totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* ── SECTION 2: Revenue Ledger ── */}
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <span className="w-1 h-4 bg-blue-600 rounded-full inline-block"></span>
                                                    สมุดรายวัน — รายการรับชำระ (General Ledger — Paid)
                                                </h3>
                                                <table className="w-full text-xs border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-700 text-white">
                                                            <th className="px-3 py-2 text-left font-medium">วันที่</th>
                                                            <th className="px-3 py-2 text-left font-medium">รายการ / ลูกค้า</th>
                                                            <th className="px-3 py-2 text-right font-medium">เดบิต (฿)</th>
                                                            <th className="px-3 py-2 text-right font-medium">เครดิต (฿)</th>
                                                            <th className="px-3 py-2 text-right font-medium">คงเหลือ (฿)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {yearPaid.length === 0 ? (
                                                            <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">ไม่มีรายการชำระเงินในปี {accYear}</td></tr>
                                                        ) : (() => {
                                                            let running = 0
                                                            return yearPaid.map((inv, idx) => {
                                                                const amt = Number(inv.setup_fee) + Number(inv.monthly_fee)
                                                                running += amt
                                                                return (
                                                                    <tr key={inv.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{new Date(inv.created_at).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                                                                        <td className="px-3 py-2">
                                                                            <p className="font-medium text-slate-800">{inv.client_name}</p>
                                                                            <p className="text-slate-400">{inv.package_details}</p>
                                                                        </td>
                                                                        <td className="px-3 py-2 text-right text-slate-700">{amt.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                                        <td className="px-3 py-2 text-right text-slate-400">—</td>
                                                                        <td className="px-3 py-2 text-right font-semibold text-emerald-700">{running.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        })()}
                                                        <tr className="bg-slate-800 text-white font-bold">
                                                            <td colSpan={2} className="px-3 py-2.5">รวมรายได้ทั้งสิ้น</td>
                                                            <td className="px-3 py-2.5 text-right">{totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                            <td className="px-3 py-2.5 text-right">—</td>
                                                            <td className="px-3 py-2.5 text-right text-emerald-300">{totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* ── SECTION 3: Accounts Receivable ── */}
                                            {yearPending.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                        <span className="w-1 h-4 bg-amber-500 rounded-full inline-block"></span>
                                                        ลูกหนี้การค้า (Accounts Receivable — Outstanding)
                                                    </h3>
                                                    <table className="w-full text-xs border-collapse">
                                                        <thead>
                                                            <tr className="bg-amber-700 text-white">
                                                                <th className="px-3 py-2 text-left font-medium">ลูกหนี้</th>
                                                                <th className="px-3 py-2 text-left font-medium">รายการ</th>
                                                                <th className="px-3 py-2 text-left font-medium">ครบกำหนด</th>
                                                                <th className="px-3 py-2 text-right font-medium">ยอดค้างชำระ (฿)</th>
                                                                <th className="px-3 py-2 text-center font-medium">สถานะ</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-amber-50">
                                                            {yearPending.map((inv, idx) => {
                                                                const amt = Number(inv.setup_fee) + Number(inv.monthly_fee)
                                                                const overdue = new Date(inv.due_date) < new Date()
                                                                return (
                                                                    <tr key={inv.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/40'}>
                                                                        <td className="px-3 py-2">
                                                                            <p className="font-medium text-slate-800">{inv.client_name}</p>
                                                                            <p className="text-slate-400">{inv.client_email}</p>
                                                                        </td>
                                                                        <td className="px-3 py-2 text-slate-600">{inv.package_details}</td>
                                                                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{new Date(inv.due_date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                                                                        <td className="px-3 py-2 text-right font-semibold text-amber-700">{amt.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                                        <td className="px-3 py-2 text-center">
                                                                            {overdue
                                                                                ? <span className="inline-flex items-center gap-1 text-red-600 font-semibold"><ArrowDownRight className="w-3 h-3" />เกินกำหนด</span>
                                                                                : <span className="inline-flex items-center gap-1 text-amber-600"><Clock className="w-3 h-3" />รอชำระ</span>
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                            <tr className="bg-amber-700 text-white font-bold">
                                                                <td colSpan={3} className="px-3 py-2.5">รวมลูกหนี้คงค้าง</td>
                                                                <td className="px-3 py-2.5 text-right">{totalAR.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                                <td></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {/* Summary box */}
                                            <div className="grid grid-cols-3 gap-4 mt-4">
                                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                                                    <p className="text-xs text-emerald-600 font-medium">รายได้รวม (Revenue)</p>
                                                    <p className="text-xl font-bold text-emerald-800 mt-1">฿{totalRevenue.toLocaleString('th-TH')}</p>
                                                    <p className="text-xs text-emerald-500 mt-1">{yearPaid.length} รายการ</p>
                                                </div>
                                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                                                    <p className="text-xs text-amber-600 font-medium">ลูกหนี้คงค้าง (A/R)</p>
                                                    <p className="text-xl font-bold text-amber-800 mt-1">฿{totalAR.toLocaleString('th-TH')}</p>
                                                    <p className="text-xs text-amber-500 mt-1">{yearPending.length} รายการ</p>
                                                </div>
                                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                                                    <p className="text-xs text-blue-600 font-medium">ยอดรวมทั้งหมด</p>
                                                    <p className="text-xl font-bold text-blue-800 mt-1">฿{(totalRevenue + totalAR).toLocaleString('th-TH')}</p>
                                                    <p className="text-xs text-blue-500 mt-1">{yearPaid.length + yearPending.length} รายการ</p>
                                                </div>
                                            </div>

                                            <p className="text-center text-xs text-slate-400 pb-2">
                                                จัดทำโดย Nexora Labs System — {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    )
                                })() : null}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
