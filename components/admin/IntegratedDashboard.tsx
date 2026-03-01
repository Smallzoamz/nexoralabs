'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MoreHorizontal,
    CheckCircle2,
    Activity,
    TrendingUp,
    Users,
    MessageSquare,
    Eye,
    ArrowDownRight,
    Clock,
    ChevronRight,
    Download,
    FileText,
    Calculator,
    RefreshCw,
    BookOpen,
    Plus,
    Trash2,
    X,
    Receipt,
    FileDown
} from 'lucide-react'
import { bahttext } from 'bahttext'
import { useModal } from '@/lib/modal-context'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { supabase } from '@/lib/supabase'

interface IntegratedDashboardProps {
    onNavigate?: (menuId: string) => void
}

interface Submission {
    name: string
    package_interest?: string
    created_at: string
    status: string
}

interface Invoice {
    id: string
    client_name: string
    client_email: string
    package_details: string
    setup_fee: number
    monthly_fee: number
    status: string
    created_at: string
    due_date: string
}

interface PaymentConfig {
    promptpay_number?: string
    promptpay_name?: string
    bank_name?: string
    bank_account_no?: string
    bank_account_name?: string
}

export default function IntegratedDashboard({ onNavigate }: IntegratedDashboardProps) {
    const { showAlert, showConfirm } = useModal()
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState([
        { label: 'Revenue', value: `฿0`, trend: `+0%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Clients', value: '0', trend: 'Monthly growth', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Traffic', value: '0', trend: '+0%', icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Leads', value: '0', trend: 'New entries', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' }
    ])

    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])
    const [growthData, setGrowthData] = useState<{ name: string; value: number }[]>([])
    const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([])
    const [contentStats, setContentStats] = useState({
        articles: 0,
        portfolios: 0,
        services: 0,
        total: 0
    })

    // Financial Tools State
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false)
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
    const [isAccModalOpen, setIsAccModalOpen] = useState(false)
    const [accLoading, setAccLoading] = useState(false)
    const [accData, setAccData] = useState<{
        paidInvoices: { id: string; client_name: string; client_email: string; package_details: string; setup_fee: number; monthly_fee: number; created_at: string; due_date: string }[]
        pendingInvoices: { id: string; client_name: string; client_email: string; package_details: string; setup_fee: number; monthly_fee: number; due_date: string }[]
        expenses: { id: string; category: string; description: string; amount: number; expense_date: string; created_at: string }[]
        accYear: number
    } | null>(null)
    const [accYear, setAccYear] = useState(new Date().getFullYear())
    const [expenseForm, setExpenseForm] = useState({ category: 'ค่าเซิร์ฟเวอร์/โฮสติ้ง', description: '', amount: 0, expense_date: new Date().toISOString().split('T')[0] })
    const [isAddingExpense, setIsAddingExpense] = useState(false)
    const [siteInfo, setSiteInfo] = useState({
        name: 'Nexora Labs',
        address: 'กรุงเทพมหานคร, ประเทศไทย',
        website: (process.env.NEXT_PUBLIC_SITE_URL || 'www.nexoralabs.com').replace(/^https?:\/\//, ''),
        description: 'Professional Web Design & Maintenance Service',
        email: 'hello@nexoralabs.com'
    })

    // Tax Form State
    const [taxData, setTaxData] = useState({
        type: 'company' as 'company' | 'personal',
        payerName: '',
        payerAddress: '',
        payerTaxId: '',
        receiverName: 'Nexora Labs (เน็กโซร่า แล็บส์)',
        receiverAddress: 'กรุงเทพมหานคร, ประเทศไทย',
        receiverTaxId: '-',
        description: 'ค่าบริการออกแบบและพัฒนาระบบเว็บไซต์',
        amount: 25000,
        taxRate: 3,
    })

    const [allInvoices, setAllInvoices] = useState<Invoice[]>([])
    const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null)
    const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null)
    const [downloadingReceiptId, setDownloadingReceiptId] = useState<string | null>(null)
    const [chartRange, setChartRange] = useState<number>(6)

    const isFirstMount = useRef(true)

    useEffect(() => {
        if (isFirstMount.current) {
            fetchData(false)
            isFirstMount.current = false
        } else {
            fetchData(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartRange])

    useEffect(() => {
        fetchSiteConfig()
    }, [])

    const fetchSiteConfig = async () => {
        const [{ data: siteConf }, { data: payConf }] = await Promise.all([
            supabase.from('site_config').select('*').limit(1).maybeSingle(),
            supabase.from('payment_settings').select('*').limit(1).maybeSingle()
        ])
        if (siteConf) {
            const fetchedName = siteConf.site_name || 'Nexora Labs'
            const fetchedAddress = siteConf.contact_address || 'กรุงเทพมหานคร, ประเทศไทย'
            setSiteInfo(prev => ({
                ...prev,
                name: fetchedName,
                address: fetchedAddress,
                description: siteConf.site_description || 'Professional Web Design & Maintenance Service',
                email: siteConf.contact_email || 'hello@nexoralabs.com'
            }))
            setTaxData(prev => ({ ...prev, receiverName: fetchedName, receiverAddress: fetchedAddress }))
        }
        if (payConf) {
            setPaymentConfig(payConf)
        }
    }

    const fetchData = async (silent = false) => {
        if (!silent) setIsLoading(true)
        try {
            const now = new Date()
            const todayStart = new Date()
            todayStart.setHours(0, 0, 0, 0)

            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

            const [
                { data: contacts },
                { count: todayVisitors },
                { data: invoices },
                { count: articleCount },
                { count: portfolioCount },
                { count: serviceCount },
                { data: allAnalytics },
                { count: activeClients }
            ] = await Promise.all([
                supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
                supabase.from('site_analytics').select('id', { count: 'exact', head: true }).gte('visited_at', todayStart.toISOString()),
                supabase.from('invoices').select('id, client_name, client_email, package_details, setup_fee, monthly_fee, status, created_at, due_date').eq('status', 'paid').order('created_at', { ascending: false }),
                supabase.from('articles').select('id', { count: 'exact', head: true }),
                supabase.from('portfolios').select('id', { count: 'exact', head: true }),
                supabase.from('services').select('id', { count: 'exact', head: true }),
                supabase.from('site_analytics').select('visited_at').gte('visited_at', monthStart.toISOString()),
                supabase.from('clients').select('id', { count: 'exact', head: true }).eq('is_active', true)
            ])

            // 1. Recent Leads
            if (contacts) {
                setRecentSubmissions(contacts.map(c => ({
                    name: c.name,
                    package_interest: c.package_interest,
                    created_at: c.created_at,
                    status: c.status
                })))
            }
            setAllInvoices(invoices || [])

            // 2. Revenue & Chart Data
            const revenueMap: Record<string, number> = {}

            // Initialize last X months
            for (let i = chartRange - 1; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
                const monthName = d.toLocaleString('en-US', { month: 'short' })
                revenueMap[monthName] = 0
            }

            invoices?.forEach(inv => {
                const amount = (Number(inv.setup_fee) || 0) + (Number(inv.monthly_fee) || 0)
                const date = new Date(inv.due_date || inv.created_at)
                const monthName = date.toLocaleString('en-US', { month: 'short' })
                if (revenueMap[monthName] !== undefined) {
                    revenueMap[monthName] += amount
                }
            })

            const formattedChartData = Object.entries(revenueMap).map(([name, value]) => ({ name, value: value as number }))
            setChartData(formattedChartData)

            // 3. User Growth (Based on conversions/contacts vs visitors)
            const visitorsCount = todayVisitors || 0
            const newContactsCount = contacts?.filter(c => new Date(c.created_at) >= todayStart).length || 0

            const thisMonthRevenue = formattedChartData[formattedChartData.length - 1]?.value || 0;
            const totalRevenueOverall = invoices?.reduce((sum, inv) => sum + (Number(inv.setup_fee) || 0) + (Number(inv.monthly_fee) || 0), 0) || 0;
            const revenueChangePercentage = totalRevenueOverall > 0 ? ((thisMonthRevenue / totalRevenueOverall) * 100).toFixed(1) : '0';

            const monthVisits = allAnalytics?.length || 0;

            setStats([
                { label: 'Revenue', value: `฿${thisMonthRevenue.toLocaleString()}`, trend: `+${revenueChangePercentage}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Active Clients', value: activeClients?.toString() || '0', trend: 'Monthly growth', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Traffic', value: monthVisits.toLocaleString(), trend: '+12.5%', icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Leads', value: contacts?.length?.toString() || '0', trend: 'New entries', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' }
            ])

            setGrowthData([
                { name: 'Conversions', value: newContactsCount },
                { name: 'Remaining Visitors', value: Math.max(0, visitorsCount - newContactsCount) },
            ])

            // 4. Content Stats
            const arts = articleCount || 0
            const ports = portfolioCount || 0
            const servs = serviceCount || 0
            setContentStats({
                articles: arts,
                portfolios: ports,
                services: servs,
                total: arts + ports + servs
            })

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            if (!silent) setIsLoading(false)
        }
    }

    const openAccountingModal = () => {
        setIsAccModalOpen(true)
        fetchAccountingData()
    }

    const fetchAccountingData = async () => {
        setAccLoading(true)
        try {
            const [{ data: paid }, { data: pending }, { data: expenseData }] = await Promise.all([
                supabase.from('invoices')
                    .select('id, client_name, client_email, package_details, setup_fee, monthly_fee, created_at, due_date')
                    .eq('status', 'paid')
                    .order('created_at', { ascending: false }),
                supabase.from('invoices')
                    .select('id, client_name, client_email, package_details, setup_fee, monthly_fee, due_date')
                    .eq('status', 'pending')
                    .order('due_date', { ascending: true }),
                supabase.from('expenses')
                    .select('id, category, description, amount, expense_date, created_at')
                    .order('expense_date', { ascending: false })
            ])
            setAccData({
                paidInvoices: paid ?? [],
                pendingInvoices: pending ?? [],
                expenses: expenseData ?? [],
                accYear,
            })
        } catch (err) {
            console.error(err)
        } finally {
            setAccLoading(false)
        }
    }

    const handleAddExpense = async () => {
        if (!expenseForm.description || expenseForm.amount <= 0) {
            showAlert('ข้อมูลไม่ครบ', 'กรุณากรอกรายละเอียดและจำนวนเงิน', 'error')
            return
        }
        setIsAddingExpense(true)
        try {
            const { error } = await supabase.from('expenses').insert([expenseForm])
            if (error) throw error
            showAlert('สำเร็จ', 'บันทึกรายจ่ายเรียบร้อยแล้ว', 'success')
            setExpenseForm({ category: 'ค่าเซิร์ฟเวอร์/โฮสติ้ง', description: '', amount: 0, expense_date: new Date().toISOString().split('T')[0] })
            fetchAccountingData()
        } catch (err) {
            console.error(err)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถบันทึกรายจ่ายได้', 'error')
        } finally {
            setIsAddingExpense(false)
        }
    }

    const handleDeleteExpense = async (id: string) => {
        if (!(await showConfirm('ยืนยัน', 'คุณต้องการลบรายจ่ายนี้ใช่หรือไม่?'))) return
        try {
            const { error } = await supabase.from('expenses').delete().eq('id', id)
            if (error) throw error
            fetchAccountingData()
            showAlert('สำเร็จ', 'ลบรายจ่ายเรียบร้อย', 'success')
        } catch (err) {
            console.error(err)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถลบรายจ่ายได้', 'error')
        }
    }

    const handleDownloadAccPdf = async () => {
        const sourceEl = document.getElementById('accounting-report-pdf')
        if (!sourceEl) return
        setIsGeneratingPdf(true)
        sourceEl.style.display = 'block'
        try {
            const html2pdfModule = (await import('html2pdf.js')).default
            await html2pdfModule().set({
                margin: [10, 10, 10, 10],
                filename: `AccountingReport_Nexora_${accYear}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, windowWidth: 750, width: 750, scrollY: 0 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).from(sourceEl).save()
        } catch (e) {
            console.error(e)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถสร้างไฟล์ PDF ได้', 'error')
        } finally {
            sourceEl.style.display = 'none'
            setIsGeneratingPdf(false)
        }
    }

    const handleGenerateTaxForm = async (e: React.FormEvent) => {
        e.preventDefault()
        const sourceEl = document.getElementById('tax-form-pdf')
        if (!sourceEl) return
        setIsGeneratingPdf(true)
        sourceEl.style.display = 'block'
        try {
            const html2pdfModule = (await import('html2pdf.js')).default
            await html2pdfModule().set({
                margin: [0, 0, 0, 0],
                filename: `50Bis_Tax_Nexora_${taxData.payerName.replace(/\s+/g, '_')}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, windowWidth: 793, width: 793, scrollY: 0 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).from(sourceEl).save()
            showAlert('สำเร็จ', 'สร้างหนังสือรับรองการหัก ณ ที่จ่ายเรียบร้อยแล้ว', 'success')
        } catch (e) {
            console.error(e)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถสร้าง PDF ได้', 'error')
        } finally {
            sourceEl.style.display = 'none'
            setIsGeneratingPdf(false)
        }
    }

    const handleDownloadPdf = async (invoice: Invoice) => {
        const sourceEl = document.getElementById(`invoice-pdf-${invoice.id}`)
        if (!sourceEl) {
            showAlert('ไม่พบเทมเพลต', 'กรุณาลองใหม่อีกครั้ง', 'error')
            return
        }
        setDownloadingPdfId(invoice.id)
        sourceEl.style.display = 'block'
        try {
            const html2pdfModule = (await import('html2pdf.js')).default
            await html2pdfModule().set({
                margin: [0, 0, 0, 0],
                filename: `Invoice_${invoice.client_name.replace(/\s+/g, '_')}_${invoice.id.substring(0, 8)}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, windowWidth: 793, width: 793, scrollY: 0 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).from(sourceEl).save()
        } catch (e) {
            console.error(e)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถดาวน์โหลดไฟล์ได้', 'error')
        } finally {
            sourceEl.style.display = 'none'
            setDownloadingPdfId(null)
        }
    }

    const handleDownloadReceipt = async (invoice: Invoice) => {
        const sourceEl = document.getElementById(`receipt-pdf-${invoice.id}`)
        if (!sourceEl) {
            showAlert('ไม่พบเทมเพลต', 'กรุณาลองใหม่อีกครั้ง', 'error')
            return
        }
        setDownloadingReceiptId(invoice.id)
        sourceEl.style.display = 'block'
        try {
            const html2pdfModule = (await import('html2pdf.js')).default
            await html2pdfModule().set({
                margin: [0, 0, 0, 0],
                filename: `Receipt_${invoice.client_name.replace(/\s+/g, '_')}_${invoice.id.substring(0, 8)}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, windowWidth: 793, width: 793, scrollY: 0 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).from(sourceEl).save()
        } catch (e) {
            console.error(e)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถดาวน์โหลดไฟล์ได้', 'error')
        } finally {
            sourceEl.style.display = 'none'
            setDownloadingReceiptId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                    <p className="text-sm font-bold text-slate-400 animate-pulse">UPDATING DASHBOARD...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Dashboard Premium
                    </h1>
                    <p className="text-slate-500 mt-1">ยินดีต้อนรับกลับมา Boss ระบบพร้อมทำงานแล้วครับ</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={openAccountingModal}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-200"
                    >
                        <BookOpen className="w-5 h-5" />
                        ทำบัญชี
                    </button>
                    <button
                        onClick={() => setIsTaxModalOpen(true)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                    >
                        <FileText className="w-5 h-5" />
                        ใบทวิ 50
                    </button>
                    <button
                        onClick={() => onNavigate?.('invoices')}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        <Calculator className="w-5 h-5" />
                        ใบแจ้งหนี้/ภาษี
                    </button>
                </div>
            </header>

            {/* Real Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Row: Sales & Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Performance Chart (Left 2/3) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Revenue Performance</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-slate-900">฿{stats[0].value.replace('฿', '')}</h3>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{stats[0].trend}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={chartRange}
                                onChange={(e) => setChartRange(Number(e.target.value))}
                                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 italic transition-all outline-none cursor-pointer appearance-none pr-8 relative"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
                            >
                                <option value={3}>Last 3 Months</option>
                                <option value={6}>Last 6 Months</option>
                                <option value={12}>Last 12 Months</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Growth Donut (Right 1/3) */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center relative">
                    <h3 className="text-sm font-bold text-slate-800 self-start mb-2">Today Growth</h3>

                    <div className="relative w-full h-[240px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={growthData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={95}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#f1f5f9" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-slate-800">{(growthData[0]?.value / (growthData[0]?.value + growthData[1]?.value || 1) * 100).toFixed(1)}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conv. Rate</span>
                        </div>
                    </div>

                    <div className="w-full space-y-3 mt-4">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary-500" />
                                <span className="font-semibold text-slate-600">Leads Today</span>
                            </div>
                            <span className="font-bold text-slate-900">{growthData[0]?.value || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-900" />
                                <span className="font-semibold text-slate-600">Total Visitors</span>
                            </div>
                            <span className="font-bold text-slate-900">{(growthData[0]?.value + growthData[1]?.value) || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Leads & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Leads (Left 2/3) */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 flex items-center justify-between border-b border-slate-50">
                        <h3 className="text-sm font-bold text-slate-800">Recent Leads</h3>
                        <button
                            onClick={() => onNavigate?.('contacts')}
                            className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Package</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentSubmissions.map((sub, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs text-uppercase">
                                                    {sub.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700">{sub.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-wider">{sub.package_interest || 'ทั่วไป'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-400">
                                            {new Date(sub.created_at).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}
                                        </td>
                                        <td className="px-6 py-4 flex justify-center">
                                            {sub.status === 'closed' ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {recentSubmissions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400 font-medium">No recent leads found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Content Statistics (Right 1/3) */}
                <div className="space-y-6">
                    {/* Recent Invoices Table - THE TAX INVOICE GENERATOR ACTION */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Receipt className="w-5 h-5 text-emerald-500" />
                                    บิลที่ชำระแล้วล่าสุด
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Quick Tax Invoice / Receipt</p>
                            </div>
                            <button onClick={() => onNavigate?.('invoices')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            {allInvoices.slice(0, 4).length === 0 ? (
                                <p className="text-center py-8 text-slate-400 text-sm italic">ยังไม่มีข้อมูลบิล</p>
                            ) : allInvoices.slice(0, 4).map((invoice) => (
                                <div key={invoice.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-900 text-sm truncate">{invoice.client_name}</span>
                                            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">PAID</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 truncate">{invoice.package_details}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-mono">฿{(Number(invoice.setup_fee) + Number(invoice.monthly_fee)).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDownloadPdf(invoice)}
                                            disabled={!!downloadingPdfId}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            title="ดาวน์โหลดใบแจ้งหนี้"
                                        >
                                            {downloadingPdfId === invoice.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleDownloadReceipt(invoice)}
                                            disabled={!!downloadingReceiptId}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                            title="ดาวน์โหลดใบเสร็จ (ใบกำกับภาษี)"
                                        >
                                            {downloadingReceiptId === invoice.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Growth Stats */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-slate-800">Content Overview</h3>
                        </div>
                        <div className="mb-6">
                            <span className="text-3xl font-black text-slate-900">{contentStats.total.toLocaleString()}</span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Items Managed</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-slate-500">Service Items</span>
                                    <span className="text-slate-900">{contentStats.services}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(contentStats.services / (contentStats.total || 1)) * 100}%` }}
                                        className="bg-emerald-400 h-full rounded-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-slate-500">Portfolio Items</span>
                                    <span className="text-slate-900">{contentStats.portfolios}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(contentStats.portfolios / (contentStats.total || 1)) * 100}%` }}
                                        className="bg-primary-500 h-full rounded-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-slate-500">Articles (Blog)</span>
                                    <span className="text-slate-900">{contentStats.articles}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(contentStats.articles / (contentStats.total || 1)) * 100}%` }}
                                        className="bg-indigo-500 h-full rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-bold text-slate-600">Site Status: Active</span>
                            </div>
                            <button
                                onClick={() => onNavigate?.('content')}
                                className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                Manage →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & PDF Templates */}
            <AnimatePresence>
                {/* 50 Bis Tax Modal */}
                {isTaxModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <Calculator className="w-5 h-5 text-indigo-600" />
                                        สร้างหนังสือรับรองการหักภาษี ณ ที่จ่าย (50 ทวิ)
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">กรอกข้อมูลผู้จ่ายเงินเพื่อสร้างไฟล์ PDF</p>
                                </div>
                                <button onClick={() => setIsTaxModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleGenerateTaxForm} className="p-8 overflow-y-auto space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">ประเภทรูปแบบ</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${taxData.type === 'company' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                <input type="radio" checked={taxData.type === 'company'} onChange={() => setTaxData({ ...taxData, type: 'company' })} className="w-4 h-4 text-indigo-600" />
                                                <span className="font-medium text-sm text-slate-900">นิติบุคคล หัก นิติบุคคล</span>
                                            </label>
                                            <label className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${taxData.type === 'personal' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                <input type="radio" checked={taxData.type === 'personal'} onChange={() => setTaxData({ ...taxData, type: 'personal' })} className="w-4 h-4 text-indigo-600" />
                                                <span className="font-medium text-sm text-slate-900">นิติบุคคล หัก บุคคลธรรมดา</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อผู้จ่ายเงิน (ลูกค้า/ผู้ว่าจ้าง)</label>
                                        <input type="text" value={taxData.payerName} onChange={e => setTaxData({ ...taxData, payerName: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="เช่น บริษัท เอบีซี จำกัด" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">เลขประจำตัวผู้เสียภาษี</label>
                                        <input type="text" maxLength={13} value={taxData.payerTaxId} onChange={e => setTaxData({ ...taxData, payerTaxId: e.target.value.replace(/\D/g, '') })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0123456789012" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">ที่อยู่ผู้จ่ายเงิน</label>
                                        <input type="text" value={taxData.payerAddress} onChange={e => setTaxData({ ...taxData, payerAddress: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="กรอกที่อยู่..." required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">จำนวนเงินพึงประเมิน (฿)</label>
                                        <input type="number" value={taxData.amount} onChange={e => setTaxData({ ...taxData, amount: Number(e.target.value) })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">อัตราภาษีที่หัก (%)</label>
                                        <select value={taxData.taxRate} onChange={e => setTaxData({ ...taxData, taxRate: Number(e.target.value) })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                            <option value={1}>1% (ค่าขนส่ง)</option>
                                            <option value={2}>2% (ค่าโฆษณา)</option>
                                            <option value={3}>3% (ค่าบริการ / จ้างทำของ)</option>
                                            <option value={5}>5% (ค่าเช่า / นักแสดงสาธารณะ)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsTaxModalOpen(false)} className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-all">ยกเลิก</button>
                                    <button type="submit" disabled={isGeneratingPdf} className="px-8 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50">
                                        {isGeneratingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                        สร้างและดาวน์โหลด PDF
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Accounting Modal */}
                {isAccModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAccModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-100"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-2xl leading-tight text-white">รายงานทางบัญชี (Accounting)</h2>
                                        <p className="text-emerald-100/80 text-sm">Nexora Labs — ตรวจสอบงบกำไรขาดทุนรายปี</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={accYear}
                                        onChange={e => setAccYear(Number(e.target.value))}
                                        className="text-sm bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none backdrop-blur-md"
                                    >
                                        {[2024, 2025, 2026, 2027].map(y => (
                                            <option key={y} value={y} className="text-slate-900">{y}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleDownloadAccPdf}
                                        disabled={isGeneratingPdf || accLoading}
                                        className="flex items-center gap-2 px-5 py-2 bg-white text-emerald-700 font-bold rounded-xl transition-all hover:bg-emerald-50 disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                                    >
                                        {isGeneratingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                        ดาวน์โหลด PDF
                                    </button>
                                    <button onClick={() => setIsAccModalOpen(false)} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="overflow-y-auto flex-1 p-8 space-y-8 bg-slate-50/30">
                                {accLoading ? (
                                    <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                                        <Calculator className="w-12 h-12 animate-spin mb-4 text-emerald-500" />
                                        <span className="font-semibold text-lg animate-pulse text-slate-500">กำลังคำนวณงบการเงิน...</span>
                                    </div>
                                ) : accData ? (() => {
                                    const yearPaid = accData.paidInvoices.filter(inv => new Date(inv.created_at).getFullYear() === accYear)
                                    const yearPending = accData.pendingInvoices.filter(inv => new Date(inv.due_date).getFullYear() === accYear)
                                    const yearExpenses = accData.expenses.filter(exp => new Date(exp.expense_date).getFullYear() === accYear)
                                    const totalRevenue = yearPaid.reduce((s, inv) => s + Number(inv.setup_fee) + Number(inv.monthly_fee), 0)
                                    const totalExpenses = yearExpenses.reduce((s, exp) => s + Number(exp.amount), 0)
                                    const totalAR = yearPending.reduce((s, inv) => s + Number(inv.setup_fee) + Number(inv.monthly_fee), 0)
                                    const netProfit = totalRevenue - totalExpenses

                                    return (
                                        <div className="space-y-10">
                                            {/* Summary Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                                        <TrendingUp className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-500 mb-1">รายได้รวม (ปี {accYear})</p>
                                                        <p className="text-2xl font-bold text-slate-900 font-mono">฿{totalRevenue.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
                                                        <ArrowDownRight className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-500 mb-1">รายจ่ายรวม</p>
                                                        <p className="text-2xl font-bold text-slate-900 font-mono">฿{totalExpenses.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-500 mb-1">ลูกหนี้คงค้าง</p>
                                                        <p className="text-2xl font-bold text-slate-900 font-mono">฿{totalAR.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between ${netProfit >= 0 ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-rose-600 border-rose-700 text-white'}`}>
                                                    <div className={`w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4`}>
                                                        <Calculator className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold opacity-80 mb-1">กำไรสุทธิ</p>
                                                        <p className="text-2xl font-bold font-mono">฿{netProfit.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expense Form Section */}
                                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                    <Plus className="w-5 h-5 text-indigo-500" />
                                                    บันทึกรายจ่ายใหม่
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">หมวดหมู่</label>
                                                        <select
                                                            value={expenseForm.category}
                                                            onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        >
                                                            <option>ค่าเซิร์ฟเวอร์/โฮสติ้ง</option>
                                                            <option>ค่าโดเมน</option>
                                                            <option>ค่าเครื่องมือ/ซอฟต์แวร์</option>
                                                            <option>ค่าจ้างบุคลากร</option>
                                                            <option>ค่าการตลาด</option>
                                                            <option>อื่นๆ</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">รายละเอียด</label>
                                                        <input
                                                            type="text"
                                                            placeholder="เช่น จ่ายค่าโฮส AWS"
                                                            value={expenseForm.description}
                                                            onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-slate-500 ml-1">จำนวนเงิน (฿)</label>
                                                        <input
                                                            type="number"
                                                            value={expenseForm.amount || ''}
                                                            onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex items-end gap-2">
                                                        <div className="flex-1 space-y-1.5">
                                                            <label className="text-xs font-bold text-slate-500 ml-1">วันที่</label>
                                                            <input
                                                                type="date"
                                                                value={expenseForm.expense_date}
                                                                onChange={e => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={handleAddExpense}
                                                            disabled={isAddingExpense}
                                                            className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                                                        >
                                                            {isAddingExpense ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
                                                            เพิ่ม
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Data Lists */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Paid Invoices */}
                                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                                        <h4 className="font-bold text-slate-900">รายการรายรับ (Paid)</h4>
                                                        <span className="text-xs font-bold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full">฿{totalRevenue.toLocaleString()}</span>
                                                    </div>
                                                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                                        {yearPaid.length === 0 ? (
                                                            <p className="p-8 text-center text-slate-400 text-sm italic">ยังไม่มีข้อมูลรายรับในปีนี้</p>
                                                        ) : yearPaid.map(inv => (
                                                            <div key={inv.id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-all">
                                                                <div>
                                                                    <p className="font-bold text-slate-800 text-sm">{inv.client_name}</p>
                                                                    <p className="text-[10px] text-slate-400 mt-0.5">{inv.package_details}</p>
                                                                    <p className="text-[10px] text-slate-300">{new Date(inv.created_at).toLocaleDateString('th-TH')}</p>
                                                                </div>
                                                                <p className="font-bold text-emerald-600 font-mono text-sm">฿{(inv.setup_fee + inv.monthly_fee).toLocaleString()}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Expenses List */}
                                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                                        <h4 className="font-bold text-slate-900">รายการรายจ่าย (Expenses)</h4>
                                                        <span className="text-xs font-bold text-rose-600 px-3 py-1 bg-rose-50 rounded-full">฿{totalExpenses.toLocaleString()}</span>
                                                    </div>
                                                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                                        {yearExpenses.length === 0 ? (
                                                            <p className="p-8 text-center text-slate-400 text-sm italic">ยังไม่พบรายการรายจ่าย</p>
                                                        ) : yearExpenses.map(exp => (
                                                            <div key={exp.id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-all group">
                                                                <div>
                                                                    <p className="font-bold text-slate-800 text-sm">{exp.description}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{exp.category}</span>
                                                                        <span className="text-[10px] text-slate-400">{new Date(exp.expense_date).toLocaleDateString('th-TH')}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <p className="font-bold text-rose-600 font-mono text-sm">฿{exp.amount.toLocaleString()}</p>
                                                                    <button onClick={() => handleDeleteExpense(exp.id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })() : null}
                            </div>
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

                {/* HIDDEN PRINT VIEW (FORMAL ACCOUNTING A4 PDF) */}
                <div id="accounting-report-pdf" className="hidden bg-white text-black w-[750px] min-h-[1050px] p-8 font-sans mx-auto" style={{ fontSize: '12px' }}>
                    <div className="text-center border-b-2 border-black pb-4 mb-8">
                        <h1 className="text-xl font-bold uppercase tracking-widest">{siteInfo.name}</h1>
                        <p className="mt-1">{siteInfo.website}</p>
                        <h2 className="text-lg font-bold mt-4">รายงานสรุปข้อมูลทางบัญชี (Accounting Report)</h2>
                        <p>สำหรับรอบระยะเวลาบัญชี สิ้นสุดวันที่ 31 ธันวาคม {accYear}</p>
                    </div>

                    {accData && (() => {
                        const yearPaid = accData.paidInvoices.filter(inv => new Date(inv.created_at).getFullYear() === accYear)
                        const totalRevenue = yearPaid.reduce((s, inv) => s + Number(inv.setup_fee) + Number(inv.monthly_fee), 0)
                        const totalExpenses = accData.expenses.filter(exp => new Date(exp.expense_date).getFullYear() === accYear).reduce((s, exp) => s + Number(exp.amount), 0)
                        const netProfit = totalRevenue - totalExpenses
                        const totalAR = accData.pendingInvoices.filter(inv => new Date(inv.due_date).getFullYear() === accYear).reduce((s, inv) => s + Number(inv.setup_fee) + Number(inv.monthly_fee), 0)

                        return (
                            <>
                                <div className="mb-8">
                                    <h3 className="font-bold underline mb-2">1. งบกำไรขาดทุน (Income Statement)</h3>
                                    <table className="w-full border-collapse border border-black text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border border-black px-2 py-1.5 text-left w-16">รหัสบัญชี</th>
                                                <th className="border border-black px-2 py-1.5 text-left">รายการ</th>
                                                <th className="border border-black px-2 py-1.5 text-right w-32">เดบิต (บาท)</th>
                                                <th className="border border-black px-2 py-1.5 text-right w-32">เครดิต (บาท)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-black px-2 py-1.5">4100</td>
                                                <td className="border border-black px-2 py-1.5 font-bold">รายได้จากการให้บริการ</td>
                                                <td className="border border-black px-2 py-1.5 text-right">-</td>
                                                <td className="border border-black px-2 py-1.5 text-right font-bold">{totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black px-2 py-1.5">1200</td>
                                                <td className="border border-black px-2 py-1.5 font-bold">ลูกหนี้การค้า</td>
                                                <td className="border border-black px-2 py-1.5 text-right font-bold">{totalAR.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                <td className="border border-black px-2 py-1.5 text-right">-</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black px-2 py-1.5">5100</td>
                                                <td className="border border-black px-2 py-1.5 font-bold">ค่าใช้จ่ายในการดำเนินงาน</td>
                                                <td className="border border-black px-2 py-1.5 text-right font-bold">{totalExpenses.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                                <td className="border border-black px-2 py-1.5 text-right">-</td>
                                            </tr>
                                            <tr className="bg-gray-100 font-bold border-b-4 border-black border-double">
                                                <td colSpan={2} className="px-2 py-2 border border-black">กำไร (ขาดทุน) สุทธิ</td>
                                                <td colSpan={2} className="px-2 py-2 border border-black text-right">THB {netProfit.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )
                    })()}
                </div>

                {/* HIDDEN TEMPLATES FOR INVOICES & RECEIPTS (Copied from InvoiceManager) */}
                {allInvoices.map((invoice) => {
                    const totalAmount = Number(invoice.setup_fee) + Number(invoice.monthly_fee)
                    const formattedTotal = totalAmount.toLocaleString('th-TH')
                    const formattedDate = new Date(invoice.due_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
                    const issuedDate = new Date(invoice.created_at || Date.now()).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
                    const invoiceNo = `INV-${new Date(invoice.created_at || Date.now()).getFullYear()}${String(new Date(invoice.created_at || Date.now()).getMonth() + 1).padStart(2, '0')}-${invoice.id.substring(0, 4).toUpperCase()}`

                    return (
                        <div key={`pdf-group-${invoice.id}`}>
                            {/* Invoice PDF Template */}
                            <div id={`invoice-pdf-${invoice.id}`} className="bg-white p-10 font-sans text-slate-800 box-border mx-auto relative overflow-hidden" style={{ display: 'none', width: '210mm', height: '297mm' }}>
                                <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-6">
                                    <div>
                                        <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-wide">{siteInfo.name}</h1>
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
                                <div className="mb-8 border border-black p-5 rounded-none">
                                    <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-2 border-b border-black pb-1">Billed To:</h2>
                                    <p className="text-lg font-bold text-black">{invoice.client_name}</p>
                                    <p className="text-sm text-slate-800">{invoice.client_email}</p>
                                </div>
                                <table className="w-full border-collapse border border-black mb-8">
                                    <thead className="bg-slate-200">
                                        <tr className="text-sm border-b-2 border-black">
                                            <th className="p-3 border-r border-black">Description</th>
                                            <th className="p-3 text-right">Amount (THB)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr>
                                            <td className="p-4 border-r border-black font-bold">
                                                Package: {invoice.package_details}
                                                <p className="text-xs font-normal mt-1 text-slate-600">ค่าบริการออกแบบและพัฒนาระบบ พร้อมดูแลรักษา</p>
                                            </td>
                                            <td className="p-4 text-right font-bold">{formattedTotal}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="flex justify-between items-end">
                                    <div className="w-1/2 border border-black p-4 text-xs">
                                        <h4 className="font-bold mb-2 underline">ช่องทางการชำระเงิน</h4>
                                        <p>PromptPay: {paymentConfig?.promptpay_number} ({paymentConfig?.promptpay_name})</p>
                                        <p>Bank: {paymentConfig?.bank_name} - {paymentConfig?.bank_account_no}</p>
                                        <p>Name: {paymentConfig?.bank_account_name}</p>
                                    </div>
                                    <div className="w-1/3">
                                        <table className="w-full border-collapse border border-black text-sm">
                                            <tr className="bg-slate-200">
                                                <td className="p-3 font-bold border-r border-black">TOTAL</td>
                                                <td className="p-3 text-right font-bold">฿{formattedTotal}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="absolute bottom-10 left-0 right-0 text-center text-[10px] text-slate-400">Nexora Labs Auto-Generated Document</div>
                            </div>

                            {/* Receipt PDF Template */}
                            <div id={`receipt-pdf-${invoice.id}`} className="bg-white p-10 font-sans text-slate-800 box-border mx-auto relative overflow-hidden" style={{ display: 'none', width: '210mm', height: '297mm' }}>
                                <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-6">
                                    <div>
                                        <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-wide">{siteInfo.name}</h1>
                                        <p className="text-sm text-slate-800">{siteInfo.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-3xl font-bold text-black tracking-widest mb-2">RECEIPT</h2>
                                        <p className="text-sm text-black font-semibold">ใบเสร็จรับเงิน / ใบกำกับภาษี</p>
                                        <div className="mt-4 text-sm text-black text-left border border-black p-3 inline-block min-w-[220px]">
                                            <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
                                                <span className="font-bold mr-4">เลขที่ (No.):</span>
                                                <span>REP-{invoiceNo.replace('INV-', '')}</span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="font-bold mr-4">วันที่รับเงิน:</span>
                                                <span>{issuedDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-8 border border-black p-5 rounded-none">
                                    <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-2 border-b border-black pb-1">Received From:</h2>
                                    <p className="text-lg font-bold text-black">{invoice.client_name}</p>
                                    <p className="text-sm text-slate-800">{invoice.client_email}</p>
                                </div>
                                <table className="w-full border-collapse border border-black mb-8 h-64">
                                    <thead className="bg-slate-200">
                                        <tr className="text-sm border-b-2 border-black">
                                            <th className="p-3 border-r border-black">Description</th>
                                            <th className="p-3 text-right">Amount (THB)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="align-top">
                                            <td className="p-4 border-r border-black font-bold">
                                                ชำระค่าบริการตามใบแจ้งหนี้ {invoiceNo}
                                                <p className="text-xs font-normal mt-1 text-slate-600">{invoice.package_details}</p>
                                            </td>
                                            <td className="p-4 text-right font-bold">{formattedTotal}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="flex justify-end">
                                    <div className="w-1/3">
                                        <table className="w-full border-collapse border border-black text-sm">
                                            <tr className="bg-slate-200">
                                                <td className="p-3 font-bold border-r border-black">TOTAL PAID</td>
                                                <td className="p-3 text-right font-bold">฿{formattedTotal}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="mt-32 text-center text-sm">
                                    <div className="inline-block border-b border-black w-64 mb-2"></div>
                                    <p className="font-bold">Authorized Signature</p>
                                    <p className="text-xs text-slate-500 mt-1">{siteInfo.name}</p>
                                </div>
                                <div className="absolute bottom-10 left-0 right-0 text-center text-[10px] text-slate-400">Nexora Labs Auto-Generated Document</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </main>
    )
}
