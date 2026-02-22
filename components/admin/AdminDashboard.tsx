import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Users,
    MessageSquare,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'new':
            return { label: 'ใหม่', class: 'bg-blue-100 text-blue-700', icon: AlertCircle }
        case 'contacted':
            return { label: 'ติดต่อแล้ว', class: 'bg-amber-100 text-amber-700', icon: Clock }
        case 'closed':
            return { label: 'ปิดงาน', class: 'bg-green-100 text-green-700', icon: CheckCircle2 }
        default:
            return { label: status, class: 'bg-secondary-100 text-secondary-700', icon: AlertCircle }
    }
}

interface Contact {
    id: string
    name: string
    email: string
    status: string
    package_interest?: string
    created_at: string
}

interface AdminDashboardProps {
    onNavigate?: (menuId: string) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
    const { showAlert } = useModal()
    const [stats, setStats] = useState([
        { label: 'ผู้เยี่ยมชมวันนี้', value: '0', change: '+0%', trend: 'up', icon: Eye, color: 'primary' },
        { label: 'การติดต่อใหม่', value: '0', change: '+0', trend: 'up', icon: MessageSquare, color: 'green' },
        { label: 'ลูกค้าทั้งหมด', value: '0', change: '+0', trend: 'up', icon: Users, color: 'blue' },
        { label: 'อัตราการแปลง', value: '0%', change: '-0%', trend: 'down', icon: TrendingUp, color: 'amber' },
    ])
    const [recentContacts, setRecentContacts] = useState<Contact[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isBackingUp, setIsBackingUp] = useState(false)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setIsLoading(true)
        try {
            // Fetch contacts for stats and recent list
            const { data: contacts, error } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (contacts) {
                // Calculate simple stats
                const newContactsCount = contacts.filter(c => c.status === 'new').length
                const totalContactsCount = contacts.length

                // Fetch real today's public visitor count from site_analytics
                const todayStart = new Date()
                todayStart.setHours(0, 0, 0, 0)
                const { count: todayVisitors } = await supabase
                    .from('site_analytics')
                    .select('id', { count: 'exact', head: true })
                    .gte('visited_at', todayStart.toISOString())
                    .not('path', 'like', '/admin%')
                    .not('path', 'like', '/api%')
                    .not('path', 'like', '/_next%')
                    .not('path', 'like', '/payment%')

                setStats([
                    { label: 'ผู้เยี่ยมชมวันนี้', value: (todayVisitors ?? 0).toLocaleString(), change: 'วันนี้', trend: 'up', icon: Eye, color: 'primary' },
                    { label: 'การติดต่อใหม่', value: newContactsCount.toString(), change: 'วันนี้', trend: 'up', icon: MessageSquare, color: 'green' },
                    { label: 'ลูกค้าทั้งหมด', value: totalContactsCount.toString(), change: 'รวม', trend: 'up', icon: Users, color: 'blue' },
                    { label: 'อัตราการแปลง', value: totalContactsCount > 0 ? `${((newContactsCount / totalContactsCount) * 100).toFixed(1)}%` : '0%', change: 'รวม', trend: 'up', icon: TrendingUp, color: 'amber' },
                ])

                setRecentContacts(contacts.slice(0, 5))
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSystemBackup = async () => {
        try {
            setIsBackingUp(true)
            showAlert('เตรียมดาวน์โหลด', 'เริ่มดึงข้อมูลระบบ เตรียมบันทึกไฟล์ JSON...', 'info')

            // Get session token for authentication
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const res = await fetch('/api/system/backup', {
                method: 'GET',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.error || 'Failed to download system backup')
            }

            // Create a blob from the JSON response
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)

            // Extract filename from headers or generate one
            const contentDisposition = res.headers.get('Content-Disposition')
            let filename = `nexora_system_backup_${new Date().toISOString().split('T')[0]}.json`
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1]
                }
            }

            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download = filename

            document.body.appendChild(a)
            a.click()

            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            showAlert('ดาวน์โหลดสำเร็จ', `บันทึกข้อมูลระบบลงในไฟล์ ${filename} เรียบร้อยแล้ว`, 'success')

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error('System backup error:', error)
            showAlert('เกิดข้อผิดพลาด', `ไม่สามารถสำรองข้อมูลระบบได้: ${errorMessage}`, 'error')
        } finally {
            setIsBackingUp(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4" />
                                )}
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-secondary-900 mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-secondary-500">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Contacts */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
                <div className="p-6 border-b border-secondary-100">
                    <h2 className="text-lg font-semibold text-secondary-900">
                        การติดต่อล่าสุด
                    </h2>
                </div>
                <div className="divide-y divide-secondary-100">
                    {recentContacts.length === 0 ? (
                        <div className="p-6 text-center text-secondary-500">ยังไม่มีการติดต่อใหม่</div>
                    ) : recentContacts.map((contact) => {
                        const status = getStatusBadge(contact.status)
                        return (
                            <div key={contact.id} className="p-6 hover:bg-secondary-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                            <span className="font-bold text-primary-600">
                                                {contact.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-secondary-900">{contact.name}</h3>
                                            <p className="text-sm text-secondary-500">{contact.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-secondary-500">{contact.package_interest || '-'}</span>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                            <status.icon className="w-3 h-3" />
                                            {status.label}
                                        </span>
                                        <span className="text-xs text-secondary-400">
                                            {new Date(contact.created_at).toLocaleDateString('th-TH', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="p-4 border-t border-secondary-100">
                    <button
                        onClick={() => onNavigate?.('contacts')}
                        className="w-full text-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                        ดูทั้งหมด →
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white"
                >
                    <h3 className="font-semibold mb-2">เพิ่มเนื้อหาใหม่</h3>
                    <p className="text-sm text-primary-100 mb-4">
                        เพิ่มบทความ โปรโมชั่น หรือเนื้อหาใหม่บนเว็บไซต์
                    </p>
                    <button
                        onClick={() => onNavigate?.('content')}
                        className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
                    >
                        เพิ่มเนื้อหา
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
                >
                    <h3 className="font-semibold mb-2">สำรองข้อมูลระบบ</h3>
                    <p className="text-sm text-green-100 mb-4">
                        ดาวน์โหลดข้อมูลรายชื่อลูกค้าและฟอร์มทั้งหมดเป็นไฟล์ JSON
                    </p>
                    <button
                        onClick={handleSystemBackup}
                        disabled={isBackingUp}
                        className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors flex items-center justify-center min-w-[120px]"
                    >
                        {isBackingUp ? (
                            <><div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" /> กำลังดาวน์โหลด...</>
                        ) : 'สำรองตอนนี้'}
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white"
                >
                    <h3 className="font-semibold mb-2">ดูรายงาน</h3>
                    <p className="text-sm text-amber-100 mb-4">
                        ดูรายงานการใช้งานและสถิติทั้งหมด
                    </p>
                    <button
                        onClick={() => showAlert(
                            'อยู่ระหว่างการพัฒนา',
                            'ระบบการวิเคราะห์และออกรายงานสถิติขั้นสูงสำหรับธุรกิจ (เช่น ยอดขาย, ลูกค้า) กำลังปรับปรุง',
                            'info'
                        )}
                        className="bg-white text-amber-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors"
                    >
                        ดูรายงาน
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
