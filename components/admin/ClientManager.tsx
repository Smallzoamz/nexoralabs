'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Edit2, Link as LinkIcon, ShieldAlert, KeyRound, Clock, Download } from 'lucide-react'
import { useModal } from '@/lib/modal-context'
import { z } from 'zod'

interface ClientProfile {
    id: string
    name: string
    package_type: 'standard' | 'pro'
    supabase_url: string
    supabase_key: string
    is_active: boolean
    created_at: string
    backup_logs?: { status: string; created_at: string }[]
}

const clientSchema = z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อลูกค้า'),
    package_type: z.enum(['standard', 'pro']),
    supabase_url: z.string().url('URL ไม่ถูกต้อง').min(1, 'กรุณากรอก Supabase URL'),
    supabase_key: z.string().min(10, 'Service Key สั้นเกินไป กรุณาตรวจสอบให้แน่ใจว่าเป็น `service_role key`')
})

export default function ClientManager() {
    const [clients, setClients] = useState<ClientProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isBackingUp, setIsBackingUp] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<ClientProfile | null>(null)
    const { showAlert, showConfirm } = useModal()

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        package_type: 'standard' as 'standard' | 'pro',
        supabase_url: '',
        supabase_key: '',
        is_active: true
    })

    useEffect(() => {
        fetchClients()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*, backup_logs(status, created_at)')
                .order('created_at', { ascending: false })

            if (error) throw error
            setClients(data || [])
        } catch (error) {
            console.error('Error fetching clients:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลลูกค้าได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleManualBackup = async (client: ClientProfile) => {
        if (!(await showConfirm('สั่งรัน Backup พิเศษ', `ต้องการสั่งระบบเริ่มแพ็กข้อมูลของโปรเจกต์ ${client.name} นอกรอบเวลาปกติใช่หรือไม่?\n\n(ขั้นตอนนี้อาจใช้เวลาหลายวินาทีหรือเป็นนาที สำหรับแพ็กเกจ Pro)`))) return

        try {
            setIsBackingUp(client.id)

            // Get current session token to pass RLS on the server
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const res = await fetch('/api/backup/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ clientId: client.id })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Unknown error occurred')

            showAlert('สำรองข้อมูลสำเร็จ!', `ระบบนำไฟล์ ${client.name} ไปเก็บบนคลาวด์เว็บแม่เรียบร้อยแล้ว`, 'success')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error('Manual backup error:', error)
            showAlert('ข้อผิดพลาด', `การสั่งแบ็คอัปฉุกเฉินล้มเหลว: ${errorMessage}`, 'error')
        } finally {
            setIsBackingUp(null)
        }
    }

    const handleOpenModal = (client?: ClientProfile) => {
        if (client) {
            setEditingClient(client)
            setFormData({
                name: client.name,
                package_type: client.package_type,
                supabase_url: client.supabase_url,
                supabase_key: client.supabase_key,
                is_active: client.is_active
            })
        } else {
            setEditingClient(null)
            setFormData({
                name: '',
                package_type: 'standard',
                supabase_url: '',
                supabase_key: '',
                is_active: true
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setIsSaving(true)
            const validated = clientSchema.parse(formData)

            if (editingClient) {
                const { error } = await supabase
                    .from('clients')
                    .update({ ...validated, is_active: formData.is_active })
                    .eq('id', editingClient.id)
                if (error) throw error
                showAlert('สำเร็จ', 'อัปเดตข้อมูลลูกค้าเรียบร้อยแล้ว', 'success')
            } else {
                const { error } = await supabase
                    .from('clients')
                    .insert([{ ...validated, is_active: formData.is_active }])
                if (error) throw error
                showAlert('สำเร็จ', 'เพิ่มลูกค้าใหม่เรียบร้อยแล้ว', 'success')
            }

            setIsModalOpen(false)
            fetchClients()
        } catch (error) {
            if (error instanceof z.ZodError) {
                showAlert('ข้อมูลไม่ถูกต้อง', error.errors[0].message, 'error')
            } else {
                console.error('Save error:', error)
                showAlert('ข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (client: ClientProfile) => {
        if (!(await showConfirm('ยืนยันการลบ', `คุณต้องการลบข้อมูลของ ${client.name} ใช่หรือไม่?\nประวัติการแบ็คอัปจะถูกลบไปด้วย แต่ไฟล์สำรองจะไม่ถูกลบ`))) return

        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', client.id)

            if (error) throw error

            setClients(clients.filter(c => c.id !== client.id))
            showAlert('สำเร็จ', 'ลบข้อมูลลูกค้าเรียบร้อยแล้ว', 'success')
        } catch (error) {
            console.error('Delete error:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถลบข้อมูลลูกค้าได้', 'error')
        }
    }

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('clients')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error

            setClients(clients.map(c =>
                c.id === id ? { ...c, is_active: !currentStatus } : c
            ))
        } catch (error) {
            console.error('Toggle status error:', error)
            showAlert('ข้อผิดพลาด', 'อัปเดตสถานะไม่สำเร็จ', 'error')
        }
    }

    if (isLoading) return <div className="p-8 text-center text-secondary-500">กำลังโหลดรายชื่อลูกค้า...</div>

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                <div>
                    <h1 className="text-xl font-bold text-secondary-900">จัดการเว็บลูกค้า (Client Profiles)</h1>
                    <p className="text-sm text-secondary-500 mt-1">
                        จัดการข้อมูลการเชื่อมต่อของโปรเจกต์ลูกค้า เพื่อใช้สำหรับระบบ Automated Backup
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    เพิ่มลูกค้าใหม่
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-secondary-300">
                        <ShieldAlert className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">ยังไม่มีเว็บลูกค้า</h3>
                        <p className="text-secondary-500">เริ่มต้นเพิ่มข้อมูลโปรเจกต์ของลูกค้าเพื่อเปิดใช้งานระบบ Backup</p>
                    </div>
                ) : (
                    clients.map((client) => (
                        <div key={client.id} className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-200 relative group overflow-hidden">
                            {/* Active indicator */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${client.is_active ? (client.package_type === 'pro' ? 'bg-amber-500' : 'bg-green-500') : 'bg-secondary-300'}`} />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-secondary-900">{client.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${client.package_type === 'pro'
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {client.package_type}
                                        </span>
                                        <span className={`text-xs flex items-center gap-1 ${client.is_active ? 'text-primary-600' : 'text-secondary-400'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${client.is_active ? 'bg-primary-500 animate-pulse' : 'bg-secondary-400'}`} />
                                            {client.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleManualBackup(client)} disabled={isBackingUp === client.id} className="p-1.5 text-secondary-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50">
                                        {isBackingUp === client.id ? (
                                            <div className="w-4 h-4 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button onClick={() => handleOpenModal(client)} className="p-1.5 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(client)} className="p-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2 text-sm text-secondary-600">
                                    <LinkIcon className="w-4 h-4 mt-0.5 shrink-0 text-secondary-400" />
                                    <a href={client.supabase_url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-primary-600 hover:underline">
                                        {client.supabase_url}
                                    </a>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-secondary-600">
                                    <KeyRound className="w-4 h-4 mt-0.5 shrink-0 text-secondary-400" />
                                    <span className="font-mono bg-secondary-50 px-1 py-0.5 rounded text-xs truncate">
                                        {client.supabase_key.substring(0, 8)}...{client.supabase_key.substring(client.supabase_key.length - 8)}
                                    </span>
                                </div>

                                <div className="mt-4 p-3 bg-secondary-50 rounded-xl">
                                    <p className="text-xs font-medium text-secondary-700 mb-1">สถิติแบ็คอัป</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-secondary-500">สำเร็จ: {client.backup_logs?.filter(l => l.status === 'success').length || 0} ครั้ง</span>
                                        <span className="text-secondary-500">ล่าสุด: {
                                            client.backup_logs?.length
                                                ? new Date([...client.backup_logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at).toLocaleDateString('th-TH')
                                                : 'ยังไม่มี'
                                        }</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-secondary-100 flex items-center justify-between text-xs text-secondary-500 font-medium">
                                <div className="flex items-center gap-1.5 text-secondary-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    {client.package_type === 'pro' ? 'แบ็คอัปทุกวันที่ 1, 15' : 'แบ็คอัปทุกวันที่ 1'}
                                </div>
                                <label className="flex items-center cursor-pointer relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={client.is_active}
                                        onChange={() => toggleStatus(client.id, client.is_active)}
                                    />
                                    <div className={`w-8 h-4 rounded-full transition-colors ${client.is_active ? 'bg-primary-500' : 'bg-secondary-200'}`}></div>
                                    <div className={`absolute w-3 h-3 bg-white rounded-full top-0.5 transition-transform ${client.is_active ? 'translate-x-4.5 left-[1px]' : 'translate-x-0.5'}`}></div>
                                </label>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-secondary-200">
                            <h2 className="text-xl font-bold text-secondary-900">
                                {editingClient ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มเว็บลูกค้าใหม่'}
                            </h2>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="client-form" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">ชื่อเว็บไซต์ / ลูกค้า <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="เช่น Nexora Demo Shop"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">ประเภทแพ็กเกจ (บังคับรอบแบ็คอัป)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.package_type === 'standard' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-200'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <input
                                                    type="radio"
                                                    name="package_type"
                                                    value="standard"
                                                    checked={formData.package_type === 'standard'}
                                                    onChange={() => setFormData({ ...formData, package_type: 'standard' })}
                                                    className="text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="font-bold text-secondary-900">Standard</span>
                                            </div>
                                            <p className="text-xs text-secondary-500 ml-5">แบ็คอัปทุกเดือน (JSON)</p>
                                        </label>
                                        <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.package_type === 'pro' ? 'border-amber-500 bg-amber-50' : 'border-secondary-200 hover:border-amber-200'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <input
                                                    type="radio"
                                                    name="package_type"
                                                    value="pro"
                                                    checked={formData.package_type === 'pro'}
                                                    onChange={() => setFormData({ ...formData, package_type: 'pro' })}
                                                    className="text-amber-600 focus:ring-amber-500"
                                                />
                                                <span className="font-bold text-amber-900">Pro</span>
                                            </div>
                                            <p className="text-xs text-amber-600 ml-5">แบ็คอัปวันที่ 1, 15 (Zip Storage)</p>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Supabase Project URL <span className="text-red-500">*</span></label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.supabase_url}
                                        onChange={(e) => setFormData({ ...formData, supabase_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
                                        placeholder="https://xxxxxxxxx.supabase.co"
                                    />
                                </div>

                                <div className="pb-2">
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                                        Supabase Service Role Key <span className="text-red-500">*</span>
                                        <span className="text-xs font-normal text-amber-600 block mt-0.5">⚠️ จำเป็นต้องใช้ Service Role Key (ไม่ใช่ Anon Key) เพื่อข้ามการล๊อก RLS ขณะแบ็คอัป</span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.supabase_key}
                                        onChange={(e) => setFormData({ ...formData, supabase_key: e.target.value })}
                                        className="w-full px-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
                                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-secondary-700 select-none">
                                        เปิดใช้งาน (จะถูกรวมในรอบ Automated Backup)
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-secondary-200 bg-secondary-50 flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-secondary-600 hover:bg-secondary-200 font-medium rounded-xl transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                form="client-form"
                                disabled={isSaving}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center"
                            >
                                {isSaving ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> บันทึก...</>
                                ) : 'บันทึกข้อมูล'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
