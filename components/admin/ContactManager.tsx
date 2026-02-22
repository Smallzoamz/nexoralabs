import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Search,
    Download,
    Eye,
    Trash2,
    Mail,
    Phone,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'

interface ContactSubmission {
    id: string
    name: string
    email: string
    phone: string
    company: string | null
    package_interest: string | null
    message: string
    status: string
    created_at: string
}

const statusOptions = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'new', label: 'ใหม่' },
    { value: 'contacted', label: 'ติดต่อแล้ว' },
    { value: 'closed', label: 'ปิดงาน' },
]

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'new':
            return {
                label: 'ใหม่',
                class: 'bg-blue-100 text-blue-700 border-blue-200',
                icon: AlertCircle
            }
        case 'contacted':
            return {
                label: 'ติดต่อแล้ว',
                class: 'bg-amber-100 text-amber-700 border-amber-200',
                icon: Clock
            }
        case 'closed':
            return {
                label: 'ปิดงาน',
                class: 'bg-green-100 text-green-700 border-green-200',
                icon: CheckCircle2
            }
        default:
            return {
                label: status,
                class: 'bg-secondary-100 text-secondary-700 border-secondary-200',
                icon: AlertCircle
            }
    }
}

export function ContactManager() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
    const [modalStatus, setModalStatus] = useState<string>('')
    const [isSavingStatus, setIsSavingStatus] = useState(false)

    // Supabase State
    const { showAlert, showConfirm } = useModal()
    const [contacts, setContacts] = useState<ContactSubmission[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setContacts(data || [])
        } catch (err: unknown) {
            console.error('Error fetching contacts:', err)
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!(await showConfirm('ยืนยันลบ', 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลสติดต่อนี้?'))) return

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .delete()
                .eq('id', id)

            if (error) throw error
            setContacts(contacts.filter(c => c.id !== id))
        } catch (err: unknown) {
            console.error('Error deleting contact:', err)
            showAlert('ข้อผิดพลาด', 'ลบข้อมูลไม่สำเร็จ', 'error')
        }
    }

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('contact_submissions')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error

            // Update local state
            setContacts(contacts.map(c =>
                c.id === id ? { ...c, status: newStatus } : c
            ))

            // Update selected contact if it's the one being modified
            if (selectedContact?.id === id) {
                setSelectedContact({ ...selectedContact, status: newStatus })
            }
        } catch (err: unknown) {
            console.error('Error updating status:', err)
            showAlert('ข้อผิดพลาด', 'อัปเดตสถานะไม่สำเร็จ', 'error')
        }
    }

    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleExport = () => {
        if (filteredContacts.length === 0) return

        const headers = ['ชื่อ', 'บริษัท', 'อีเมล', 'โทรศัพท์', 'แพ็กเกจที่สนใจ', 'ข้อความ', 'สถานะ', 'วันที่']
        const csvContent = [
            headers.join(','),
            ...filteredContacts.map(c => [
                `"${c.name}"`,
                `"${c.company || ''}"`,
                `"${c.email}"`,
                `"${c.phone}"`,
                `"${c.package_interest || ''}"`,
                `"${c.message.replace(/"/g, '""')}"`,
                `"${getStatusConfig(c.status).label}"`,
                `"${new Date(c.created_at).toLocaleString('th-TH')}"`
            ].join(','))
        ].join('\n')

        // Add BOM for Excel UTF-8 support
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
        const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ, อีเมล, บริษัท..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-white"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleExport} className="btn-secondary py-2.5">
                            <Download className="w-5 h-5 mr-2" />
                            ส่งออก
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statusOptions.slice(1).map((status) => {
                    const count = contacts.filter((c) => c.status === status.value).length
                    const config = getStatusConfig(status.value)
                    return (
                        <div key={status.value} className="bg-white rounded-xl shadow-sm border border-secondary-100 p-4">
                            <div className="flex items-center gap-3">
                                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.class)}>
                                    <config.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-secondary-900">{count}</p>
                                    <p className="text-sm text-secondary-500">{status.label}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Contact List */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-50 border-b border-secondary-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-600">ชื่อ / บริษัท</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-600">ติดต่อ</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-600">แพ็กเกจ</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-600">สถานะ</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-600">วันที่</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-secondary-600">การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {filteredContacts.map((contact) => {
                                const statusConfig = getStatusConfig(contact.status)
                                return (
                                    <motion.tr
                                        key={contact.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-secondary-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-secondary-900">{contact.name}</p>
                                                <p className="text-sm text-secondary-500">{contact.company}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-secondary-600">
                                                    <Mail className="w-4 h-4" />
                                                    {contact.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-secondary-600">
                                                    <Phone className="w-4 h-4" />
                                                    {contact.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-secondary-600">{contact.package_interest || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
                                                statusConfig.class
                                            )}>
                                                <statusConfig.icon className="w-3.5 h-3.5" />
                                                {statusConfig.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-secondary-500">
                                                {new Date(contact.created_at).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedContact(contact);
                                                        setModalStatus(contact.status);
                                                    }}
                                                    className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contact.id)}
                                                    className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredContacts.length === 0 && (
                    <div className="text-center py-12 text-secondary-500">
                        ไม่พบข้อมูลที่ค้นหา
                    </div>
                )}
            </div>

            {/* Contact Detail Modal */}
            {selectedContact && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-secondary-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-secondary-900">รายละเอียดการติดต่อ</h2>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-secondary-500">ชื่อ</p>
                                <p className="font-medium text-secondary-900">{selectedContact.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">บริษัท</p>
                                <p className="font-medium text-secondary-900">{selectedContact.company || '-'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-secondary-500">อีเมล</p>
                                    <p className="font-medium text-secondary-900">{selectedContact.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500">โทรศัพท์</p>
                                    <p className="font-medium text-secondary-900">{selectedContact.phone}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">แพ็กเกจที่สนใจ</p>
                                <p className="font-medium text-secondary-900">{selectedContact.package_interest || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">ข้อความ</p>
                                <p className="text-secondary-700 bg-secondary-50 rounded-lg p-4">
                                    {selectedContact.message}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-secondary-100 flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-secondary-700">สถานะ:</span>
                                <select
                                    value={modalStatus}
                                    onChange={(e) => setModalStatus(e.target.value)}
                                    className="px-3 py-1.5 border border-secondary-200 rounded-lg text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                >
                                    {statusOptions.slice(1).map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 justify-end">
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="btn-outline flex-1 sm:flex-none"
                                >
                                    ปิด
                                </button>
                                <button
                                    onClick={async () => {
                                        setIsSavingStatus(true);
                                        await handleUpdateStatus(selectedContact.id, modalStatus);
                                        setIsSavingStatus(false);
                                        setSelectedContact(null);
                                    }}
                                    disabled={isSavingStatus}
                                    className="btn-primary flex-1 sm:flex-none min-w-[120px] justify-center"
                                >
                                    {isSavingStatus ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                    อัปเดตสถานะ
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
