'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BarChart3, TrendingUp, Users, Activity,
    Download, FileText, X, Calculator, RefreshCw, Package
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

    if (isLoading || !data) {
        return (
            <div className="flex flex-col items-center justify-center p-24 text-secondary-500">
                <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-medium animate-pulse">กำลังประมวลผล Data Audit...</p>
            </div>
        )
    }

    // Calculations for Progress Bars
    const maxPackage = Math.max(...(data.popularPackages.map(p => p.count) || [1])) || 1
    const maxBusiness = Math.max(...(data.businessTypes.map(b => b.count) || [1])) || 1

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
                        {data.popularPackages.sort((a, b) => b.count - a.count).map((pkg, idx) => {
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
                        {data.popularPackages.length === 0 && <p className="text-sm text-secondary-500 text-center py-4">ยังไม่มีข้อมูลเพียงพอ</p>}
                    </div>
                </div>

                {/* Business Types */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                    <h3 className="font-bold text-secondary-900 mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        ประเภทธุรกิจของลูกค้า
                    </h3>
                    <div className="space-y-4">
                        {data.businessTypes.filter(b => b.count > 0).map((biz, idx) => {
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

        </div>
    )
}
