'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Edit2, ShieldAlert, User as UserIcon, ShieldHalf } from 'lucide-react'
import { useModal } from '@/lib/modal-context'
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, AdminUser } from '@/app/actions/admin-users'
import { UserRole } from '@/lib/auth-context'

export default function UserManager() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
    const { showAlert, showConfirm } = useModal()

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'moderator' as UserRole
    })

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true)
            const result = await getAdminUsers()
            if (!result.success) throw new Error(result.error)
            setUsers(result.data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลบุคลากรได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }, [showAlert])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleOpenModal = (user?: AdminUser) => {
        if (user) {
            setEditingUser(user)
            setFormData({
                name: user.name,
                email: user.email,
                password: '', // Leave blank when editing unless they want to change it
                role: user.role
            })
        } else {
            setEditingUser(null)
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'moderator'
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setIsSaving(true)

            if (!formData.name || !formData.role) {
                showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกชื่อและเลือกบทบาท', 'error')
                return
            }

            if (editingUser) {
                // UPDATE user
                const result = await updateAdminUser(editingUser.id, formData.name, formData.role, formData.password)
                if (!result.success) throw new Error(result.error)
                showAlert('สำเร็จ', 'อัปเดตข้อมูลบุคลากรเรียบร้อยแล้ว', 'success')
            } else {
                // CREATE new user
                if (!formData.email || !formData.password) {
                    showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณาระบุอีเมลและรหัสผ่าน', 'error')
                    return
                }
                if (formData.password.length < 6) {
                    showAlert('ข้อมูลไม่ถูกต้อง', 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร', 'error')
                    return
                }

                const result = await createAdminUser(formData.email, formData.password, formData.name, formData.role)
                if (!result.success) throw new Error(result.error)
                showAlert('สำเร็จ', 'เพิ่มบัญชีบุคลากรใหม่เรียบร้อยแล้ว', 'success')
            }

            setIsModalOpen(false)
            fetchUsers()
        } catch (error: unknown) {
            console.error('Save error:', error)
            showAlert('ข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถบันทึกข้อมูลได้', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (user: AdminUser) => {
        if (!(await showConfirm('ยืนยันการลบ', `คุณต้องการลบบัญชีของ ${user.name} ใช่หรือไม่?\nบัญชีนี้จะไม่สามารถล็อกอินเข้าระบบได้อีกต่อไป`))) return

        try {
            const result = await deleteAdminUser(user.id)
            if (!result.success) throw new Error(result.error)

            setUsers(users.filter(u => u.id !== user.id))
            showAlert('สำเร็จ', 'ลบบัญชีบุคลากรเรียบร้อยแล้ว', 'success')
        } catch (error: unknown) {
            console.error('Delete error:', error)
            showAlert('ข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถลบบัญชีได้', 'error')
        }
    }

    if (isLoading) return <div className="p-8 text-center text-secondary-500">กำลังโหลดรายชื่อบุคลากร...</div>

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                <div>
                    <h1 className="text-xl font-bold text-secondary-900">จัดการบุคลากร (Staff / Admins)</h1>
                    <p className="text-sm text-secondary-500 mt-1">
                        จัดการบัญชีผู้ดูแลระบบ กำหนดสิทธิ์การเข้าถึงเมนูต่างๆ
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    เพิ่มบุคลากรใหม่
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-secondary-300">
                        <ShieldAlert className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">ยังไม่มีบุคลากรในระบบ</h3>
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-200 relative group overflow-hidden">
                            {/* Role indicator */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${user.role === 'superadmin' ? 'bg-red-500' : user.role === 'admin' ? 'bg-amber-500' : 'bg-primary-500'}`} />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-secondary-900">{user.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${user.role === 'superadmin' ? 'bg-red-100 text-red-700' :
                                            user.role === 'admin' ? 'bg-amber-100 text-amber-700' :
                                                'bg-primary-100 text-primary-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenModal(user)} className="p-1.5 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(user)} className="p-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-secondary-600">
                                    <UserIcon className="w-4 h-4 shrink-0 text-secondary-400" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-secondary-600">
                                    <ShieldHalf className="w-4 h-4 shrink-0 text-secondary-400" />
                                    <span className="truncate text-xs">Login ล่าสุด: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' }) : 'ไม่เคย'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-secondary-200">
                            <h2 className="text-xl font-bold text-secondary-900">
                                {editingUser ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่'}
                            </h2>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="user-form" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder="เช่น สมชาย ใจดี"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">อีเมล {editingUser ? '(แก้ไขไม่ได้)' : '<span className="text-red-500">*</span>'}</label>
                                    <input
                                        type="email"
                                        required={!editingUser}
                                        disabled={!!editingUser}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-secondary-100 disabled:text-secondary-500"
                                        placeholder="admin@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">รหัสผ่าน {editingUser && '(ปล่อยว่างถ้าไม่ต้องการเปลี่ยน)'}</label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        placeholder={editingUser ? "•••••••• (ปล่อยเว้นว่างไว้หากไม่เปลี่ยน)" : "รหัสผ่านชั่วคราว (เริ่มต้น)"}
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">ระดับสิทธิ์ (Role) <span className="text-red-500">*</span></label>
                                    <div className="flex flex-col gap-3">
                                        <label className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${formData.role === 'moderator' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-200'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="moderator"
                                                    checked={formData.role === 'moderator'}
                                                    onChange={() => setFormData({ ...formData, role: 'moderator' })}
                                                    className="text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="font-bold text-secondary-900">Moderator</span>
                                            </div>
                                            <p className="text-[11px] text-secondary-500 ml-5 leading-tight">ดูแลเนื้อหา บทความ ตอบลูกค้า อัปเดตสถานะงาน (ไม่เห็นเมนูการเงินและตั้งค่าระบบ)</p>
                                        </label>
                                        <label className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${formData.role === 'superadmin' ? 'border-red-500 bg-red-50' : 'border-secondary-200 hover:border-red-200'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="superadmin"
                                                    checked={formData.role === 'superadmin'}
                                                    onChange={() => setFormData({ ...formData, role: 'superadmin' })}
                                                    className="text-red-600 focus:ring-red-500"
                                                />
                                                <span className="font-bold text-red-900">Super Admin</span>
                                            </div>
                                            <p className="text-[11px] text-red-600 ml-5 leading-tight">สิทธิ์สูงสุด จัดการการเงิน สัญญา การตั้งค่าเชิงลึก (สงวนไว้สำหรับผู้บริหาร)</p>
                                        </label>
                                    </div>
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
                                form="user-form"
                                disabled={isSaving}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center"
                            >
                                {isSaving ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> กำลังบันทึก...</>
                                ) : 'บันทึกข้อมูล'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
