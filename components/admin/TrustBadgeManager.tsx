'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, GripVertical, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react'
import { useModal } from '@/lib/modal-context'

interface TrustBadge {
    id: string
    name: string
    image_url: string
    display_order: number
    is_active: boolean
    created_at: string
    website_url?: string
}

export default function TrustBadgeManager() {
    const [badges, setBadges] = useState<TrustBadge[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const { showAlert, showConfirm } = useModal()

    useEffect(() => {
        fetchBadges()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchBadges = async () => {
        try {
            const { data, error } = await supabase
                .from('trust_badges')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            setBadges(data || [])
        } catch (error) {
            console.error('Error fetching badges:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลโลโก้ได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Basic validation
        if (!file.type.startsWith('image/')) {
            return showAlert('ข้อผิดพลาด', 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น', 'error')
        }
        if (file.size > 2 * 1024 * 1024) {
            return showAlert('ข้อผิดพลาด', 'ขนาดไฟล์ใหญ่เกินไป (สูงสุด 2MB)', 'error')
        }

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const filePath = `logos/${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('trust_badges')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('trust_badges')
                .getPublicUrl(filePath)

            // Calculate next order
            const nextOrder = badges.length > 0
                ? Math.max(...badges.map(b => b.display_order)) + 1
                : 1

            // Insert to Database
            const { data: newBadge, error: dbError } = await supabase
                .from('trust_badges')
                .insert({
                    name: file.name.split('.')[0] || 'Unknown',
                    image_url: publicUrl,
                    display_order: nextOrder,
                    is_active: true
                })
                .select()
                .single()

            if (dbError) throw dbError

            setBadges([...badges, newBadge])
            showAlert('สำเร็จ', 'เพิ่มโลโก้ลูกค้าเรียบร้อยแล้ว', 'success')

        } catch (error) {
            console.error('Upload error:', error)
            const err = error as Error
            showAlert('ข้อผิดพลาด', `อัปโหลดไม่สำเร็จ: ${err.message || 'Unknown error'}`, 'error')
        } finally {
            setIsUploading(false)
            // Clear input
            e.target.value = ''
        }
    }

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('trust_badges')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error

            setBadges(badges.map(b =>
                b.id === id ? { ...b, is_active: !currentStatus } : b
            ))
        } catch {
            showAlert('ข้อผิดพลาด', 'อัปเดตสถานะไม่สำเร็จ', 'error')
        }
    }

    const updateOrder = async (id: string, newOrder: number) => {
        try {
            const { error } = await supabase
                .from('trust_badges')
                .update({ display_order: newOrder })
                .eq('id', id)

            if (error) throw error

            const updatedBadges = badges.map(b =>
                b.id === id ? { ...b, display_order: newOrder } : b
            ).sort((a, b) => a.display_order - b.display_order)

            setBadges(updatedBadges)
        } catch {
            showAlert('ข้อผิดพลาด', 'อัปเดตลำดับไม่สำเร็จ', 'error')
        }
    }

    const updateName = async (id: string, newName: string) => {
        try {
            const { error } = await supabase
                .from('trust_badges')
                .update({ name: newName })
                .eq('id', id)

            if (error) throw error

            setBadges(badges.map(b =>
                b.id === id ? { ...b, name: newName } : b
            ))
        } catch {
            showAlert('ข้อผิดพลาด', 'อัปเดตชื่อไม่สำเร็จ', 'error')
        }
    }


    const updateUrl = async (id: string, newUrl: string) => {
        try {
            const { error } = await supabase
                .from('trust_badges')
                .update({ website_url: newUrl })
                .eq('id', id)

            if (error) throw error

            setBadges(badges.map(b =>
                b.id === id ? { ...b, website_url: newUrl } : b
            ))
        } catch {
            showAlert('ข้อผิดพลาด', 'อัปเดตลิงก์ไม่สำเร็จ', 'error')
        }
    }

    const deleteBadge = async (badge: TrustBadge) => {
        if (!(await showConfirm('ยืนยันการลบ', `คุณต้องการลบโลโก้ ${badge.name} ใช่หรือไม่?`))) return

        try {
            // Extract filename from URL to delete from storage as well
            // publicUrl format: .../storage/v1/object/public/trust_badges/logos/filename.ext
            const urlParts = badge.image_url.split('/trust_badges/')
            if (urlParts.length === 2) {
                const filePath = urlParts[1]
                await supabase.storage.from('trust_badges').remove([filePath])
            }

            // Remove from DB
            const { error } = await supabase
                .from('trust_badges')
                .delete()
                .eq('id', badge.id)

            if (error) throw error

            setBadges(badges.filter(b => b.id !== badge.id))
            showAlert('สำเร็จ', 'ลบโลโก้เรียบร้อยแล้ว', 'success')
        } catch (error) {
            console.error('Delete error:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้', 'error')
        }
    }

    if (isLoading) return <div className="p-8 text-center text-secondary-500">กำลังโหลดข้อมูลโลโก้...</div>

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-secondary-200">
            {/* Header & Upload */}
            <div className="p-6 border-b border-secondary-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-secondary-900">จัดการโลโก้ลูกค้า</h2>
                    <p className="text-sm text-secondary-500 mt-1">อัปโหลดภาพโลโก้เพื่อแสดงในหน้าแรกของเว็บไซต์ (แนะนำขนาด 200x80px เป็นไฟล์ PNG พื้นหลังใส)</p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <button
                        className={`flex items-center px-4 py-2 ${isUploading ? 'bg-secondary-100 text-secondary-500' : 'bg-primary-600 hover:bg-primary-700 text-white'} rounded-xl transition-colors font-medium`}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <span className="flex items-center"><div className="w-5 h-5 border-2 border-secondary-400 border-t-transparent rounded-full animate-spin mr-2" /> กำลังอัปโหลด...</span>
                        ) : (
                            <><Plus className="w-5 h-5 mr-2" /> เพิ่มโลโก้</>
                        )}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="p-6">
                {badges.length === 0 ? (
                    <div className="text-center py-12 bg-secondary-50 rounded-xl border border-dashed border-secondary-200">
                        <ImageIcon className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">ยังไม่มีรูปโลโก้</h3>
                        <p className="text-secondary-500 mb-6 max-w-sm mx-auto">อัปโหลดโลโก้แบรนด์ลูกค้าของคุณ เพื่อสร้างความน่าเชื่อถือให้กับเว็บไซต์</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {badges.map((badge, index) => (
                            <div key={badge.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white border border-secondary-200 rounded-xl shadow-sm hover:border-primary-300 transition-colors">
                                <div className="text-secondary-400 cursor-move hidden sm:block">
                                    <GripVertical className="w-5 h-5" />
                                </div>

                                {/* Image Preview */}
                                <div className="w-full sm:w-40 h-20 bg-secondary-50 rounded-lg border border-secondary-200 flex items-center justify-center p-2 relative overflow-hidden shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={badge.image_url}
                                        alt={badge.name}
                                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                                    <div>
                                        <label className="block text-xs font-medium text-secondary-500 mb-1">ชื่อแบรนด์/บริษัท</label>
                                        <input
                                            type="text"
                                            value={badge.name}
                                            onChange={(e) => {
                                                const newBadges = [...badges]
                                                newBadges[index].name = e.target.value
                                                setBadges(newBadges)
                                            }}
                                            onBlur={(e) => updateName(badge.id, e.target.value)}
                                            className="w-full px-3 py-1.5 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="ชื่อบริษัท"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-secondary-500 mb-1">ลิงก์เว็บไซต์ (ถ้ามี)</label>
                                        <input
                                            type="text"
                                            value={badge.website_url || ''}
                                            onChange={(e) => {
                                                const newBadges = [...badges]
                                                newBadges[index].website_url = e.target.value
                                                setBadges(newBadges)
                                            }}
                                            onBlur={(e) => updateUrl(badge.id, e.target.value)}
                                            className="w-full px-3 py-1.5 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-secondary-500 mb-1">ลำดับ</label>
                                        <input
                                            type="number"
                                            value={badge.display_order}
                                            onChange={(e) => {
                                                const newBadges = [...badges]
                                                newBadges[index].display_order = parseInt(e.target.value) || 0
                                                setBadges(newBadges)
                                            }}
                                            onBlur={(e) => updateOrder(badge.id, parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-1.5 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-secondary-100">
                                    <button
                                        onClick={() => toggleStatus(badge.id, badge.is_active)}
                                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${badge.is_active
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                            : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                                            }`}
                                    >
                                        {badge.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        {badge.is_active ? 'เปิดแสดง' : 'ปิดซ่อน'}
                                    </button>
                                    <button
                                        onClick={() => deleteBadge(badge)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                        title="ลบข้อมูล"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
