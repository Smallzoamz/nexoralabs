'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Loader2, GripVertical } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'
import { z } from 'zod'

const portfolioSchema = z.object({
    title: z.string().min(1, 'กรุณากรอกชื่อโปรเจกต์').max(200, 'ชื่อยาวเกินไป'),
    description: z.string().max(500, 'คำอธิบายยาวเกินไป').optional(),
    client_name: z.string().max(100, 'ชื่อลูกค้ายาวเกินไป').optional(),
    category: z.string().max(100, 'หมวดหมู่ยาวเกินไป').optional(),
    website_url: z.string().url('รูปแบบลิงก์ไม่ถูกต้อง').or(z.literal('')).optional(),
    is_active: z.boolean(),
})

interface PortfolioItem {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
    client_name: string | null;
    category: string | null;
    website_url: string | null;
    is_active: boolean;
    order: number;
}

export function PortfolioManager() {
    const { showAlert, showConfirm } = useModal()
    const [portfolios, setPortfolios] = useState<PortfolioItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Form state
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        client_name: '',
        category: '',
        website_url: '',
        image_url: '',
        is_active: true
    })

    const fetchPortfolios = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('portfolios')
                .select('*')
                .order('order', { ascending: true })

            if (error) throw error
            setPortfolios(data || [])
        } catch (err) {
            console.error('Error fetching portfolios:', err)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผลงานได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }, [showAlert])

    useEffect(() => {
        fetchPortfolios()
    }, [fetchPortfolios])

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            client_name: '',
            category: '',
            website_url: '',
            image_url: '',
            is_active: true
        })
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEdit = (item: PortfolioItem) => {
        setFormData({
            title: item.title,
            description: item.description || '',
            client_name: item.client_name || '',
            category: item.category || '',
            website_url: item.website_url || '',
            image_url: item.image_url,
            is_active: item.is_active
        })
        setEditingId(item.id)
        setIsEditing(true)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            // Validate file type
            if (!file.type.startsWith('image/')) {
                showAlert('ข้อมูลไม่ถูกต้อง', 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น', 'error')
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showAlert('ไฟล์ขนาดใหญ่เกินไป', 'กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 5MB', 'error')
                return
            }

            setIsUploading(true)
            const fileExt = file.name.split('.').pop()
            const randomString = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
            const fileName = `${randomString}.${fileExt}`
            const filePath = `${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('portfolios')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolios')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, image_url: publicUrl }))
        } catch (err: unknown) {
            console.error('Upload error:', err)
            showAlert('อัปโหลดล้มเหลว', 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    const handleSave = async () => {
        try {
            if (!formData.image_url) {
                showAlert('ข้อมูลไม่ครบ', 'กรุณาอัปโหลดรูปภาพผลงาน', 'error')
                return
            }

            setIsSaving(true)

            // Validate text fields
            portfolioSchema.parse({
                title: formData.title,
                description: formData.description,
                client_name: formData.client_name,
                category: formData.category,
                website_url: formData.website_url,
                is_active: formData.is_active
            })

            const payload = {
                title: formData.title,
                description: formData.description || null,
                client_name: formData.client_name || null,
                category: formData.category || null,
                website_url: formData.website_url || null,
                image_url: formData.image_url,
                is_active: formData.is_active,
                updated_at: new Date().toISOString()
            }

            if (isEditing && editingId) {
                const { error } = await supabase
                    .from('portfolios')
                    .update(payload)
                    .eq('id', editingId)

                if (error) throw error

                setPortfolios(portfolios.map(p => p.id === editingId ? { ...p, ...payload } : p))
                showAlert('สำเร็จ', 'อัปเดตข้อมูลผลงานเรียบร้อยแล้ว', 'success')
            } else {
                const { data, error } = await supabase
                    .from('portfolios')
                    .insert([{
                        ...payload,
                        order: portfolios.length
                    }])
                    .select()
                    .single()

                if (error) throw error

                setPortfolios([...portfolios, data])
                showAlert('สำเร็จ', 'เพิ่มผลงานใหม่เรียบร้อยแล้ว', 'success')
            }

            resetForm()
        } catch (err: unknown) {
            console.error('Save error:', err)
            if (err instanceof z.ZodError) {
                showAlert('ข้อมูลไม่ถูกต้อง', err.errors[0].message, 'error')
            } else {
                showAlert('บันทึกไม่สำเร็จ', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!(await showConfirm('ยืนยันลบข้อมูล', 'คุณต้องการลบผลงานชิ้นนี้ออกจากระบบใช่หรือไม่?'))) return

        try {
            // Delete from database
            const { error: dbError } = await supabase
                .from('portfolios')
                .delete()
                .eq('id', id)

            if (dbError) throw dbError

            // Try to delete image from storage (fail silently if it doesn't work)
            try {
                const fileName = imageUrl.split('/').pop()
                if (fileName) {
                    await supabase.storage.from('portfolios').remove([fileName])
                }
            } catch (storageErr) {
                console.error('Storage cleanup skipped:', storageErr)
            }

            // Update local state and re-sequence order
            const remaining = portfolios.filter(p => p.id !== id).map((p, idx) => ({ ...p, order: idx }))
            setPortfolios(remaining)

            // Background update order
            if (remaining.length > 0) {
                supabase.from('portfolios').upsert(remaining.map(p => ({ id: p.id, order: p.order }))).then()
            }

            showAlert('ลบสำเร็จ', 'ลบผลงานเรียบร้อยแล้ว', 'success')
        } catch (err: unknown) {
            console.error('Delete error:', err)
            showAlert('ข้อผิดพลาด', 'ลบข้อมูลไม่สำเร็จ', 'error')
        }
    }

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === portfolios.length - 1)
        ) return

        const newPortfolios = [...portfolios]
        const swapIndex = direction === 'up' ? index - 1 : index + 1

        // Swap array positions
        const temp = newPortfolios[index]
        newPortfolios[index] = newPortfolios[swapIndex]
        newPortfolios[swapIndex] = temp

        // Update order property based on new index
        const updatedPortfolios = newPortfolios.map((p, idx) => ({ ...p, order: idx }))
        setPortfolios(updatedPortfolios)

        try {
            // Update in DB
            const updates = [
                { id: updatedPortfolios[index].id, order: updatedPortfolios[index].order },
                { id: updatedPortfolios[swapIndex].id, order: updatedPortfolios[swapIndex].order }
            ]
            const { error } = await supabase.from('portfolios').upsert(updates)
            if (error) throw error
        } catch (err) {
            console.error('Error updating order:', err)
            showAlert('ข้อผิดพลาด', 'จัดลำดับไม่สำเร็จ', 'error')
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header & Add Button */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
                <div>
                    <h2 className="text-xl font-display font-bold text-secondary-900">ผลงานของเรา (Portfolio)</h2>
                    <p className="text-sm text-secondary-500 mt-1">จัดการผลงานและโปรเจกต์ที่ผ่านมาเพื่อแสดงบนหน้าเว็บไซต์</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        เพิ่มผลงานใหม่
                    </button>
                )}
            </div>

            {/* Edit / Add Form */}
            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden"
                >
                    <div className="p-6 border-b border-secondary-100 flex justify-between items-center bg-secondary-50">
                        <h3 className="font-semibold text-secondary-900">
                            {editingId ? 'แก้ไขข้อมูลผลงาน' : 'เพิ่มผลงานใหม่'}
                        </h3>
                        <button onClick={resetForm} className="text-secondary-400 hover:text-secondary-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Col: Image Upload */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-secondary-700">รูปภาพหน้าเว็บ (Screenshot)</label>
                            <div className="aspect-video relative rounded-xl border-2 border-dashed border-secondary-300 bg-secondary-50 flex items-center justify-center overflow-hidden">
                                {formData.image_url ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <label className="cursor-pointer btn-secondary">
                                                <Edit className="w-4 h-4 mr-2" /> เปลี่ยนรูปภาพ
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-secondary-400 hover:text-primary-500 hover:bg-primary-50/50 transition-colors">
                                        {isUploading ? (
                                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8 mb-2" />
                                                <span className="text-sm font-medium">คลิกเพื่ออัปโหลดรูปภาพ</span>
                                                <span className="text-xs text-secondary-400 mt-1">แนะนำ 1920x1080px (ไม่เกิน 5MB)</span>
                                            </>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Right Col: Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">ชื่อโปรเจกต์ <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                    placeholder="เช่น ระบบจองตั๋วออนไลน์ ABC"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">หมวดหมู่</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                        placeholder="เช่น E-Commerce"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">ชื่อลูกค้า</label>
                                    <input
                                        type="text"
                                        value={formData.client_name}
                                        onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                        placeholder="เช่น บริษัท ABC จำกัด"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">ลิงก์เว็บไซต์จริง (ถ้ามี)</label>
                                <input
                                    type="url"
                                    value={formData.website_url}
                                    onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                    placeholder="https://www.example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">รายละเอียดแบบย่อ</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                                    rows={3}
                                    placeholder="อธิบายจุดเด่นของผลงานนี้..."
                                />
                            </div>

                            <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-xl cursor-pointer hover:bg-secondary-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                                />
                                <div>
                                    <div className="font-medium text-secondary-900">แสดงผลงานนี้บนเว็บไซต์</div>
                                    <div className="text-sm text-secondary-500">หากปิดการแสดงผล ผลงานจะไม่ปรากฏให้ลูกค้าเห็น</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="p-6 border-t border-secondary-100 flex justify-end gap-4 bg-secondary-50">
                        <button onClick={resetForm} className="btn-outline">ยกเลิก</button>
                        <button onClick={handleSave} disabled={isSaving || isUploading} className="btn-primary">
                            {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                            บันทึกข้อมูล
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Portfolios List */}
            {portfolios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden group"
                        >
                            <div className="aspect-video relative border-b border-secondary-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                {!item.is_active && (
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-secondary-900/80 text-white text-xs font-medium rounded-md backdrop-blur-sm">
                                        ซ่อนจากหน้าเว็บ
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-secondary-900 line-clamp-1">{item.title}</h3>
                                        <p className="text-xs text-secondary-500 mt-1">{item.category || 'ไม่มีหมวดหมู่'} • {item.client_name || 'ไม่ระบุลูกค้า'}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-secondary-600 line-clamp-2 mt-2 min-h-[40px]">
                                    {item.description || '-'}
                                </p>

                                <div className="flex items-center justify-between mt-5 pt-4 border-t border-secondary-100">
                                    <div className="flex bg-secondary-100 rounded-lg p-1">
                                        <button
                                            onClick={() => handleMove(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 rounded text-secondary-500 hover:text-secondary-900 hover:bg-white disabled:opacity-30 transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <div className="flex items-center px-1 text-secondary-400">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                        <button
                                            onClick={() => handleMove(index, 'down')}
                                            disabled={index === portfolios.length - 1}
                                            className="p-1 rounded text-secondary-500 hover:text-secondary-900 hover:bg-white disabled:opacity-30 transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-secondary-400 hover:text-primary-600 transition-colors bg-secondary-50 rounded-lg hover:bg-primary-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id, item.image_url)}
                                            className="p-2 text-secondary-400 hover:text-red-600 transition-colors bg-secondary-50 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                !isEditing && (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-secondary-300">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8 text-secondary-400" />
                        </div>
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">ยังไม่มีผลงานในระบบ</h3>
                        <p className="text-secondary-500 mb-6">คลิกปุ่มด้านล่างเพื่อเพิ่มผลงานชิ้นแรกของคุณ</p>
                        <button onClick={() => setIsEditing(true)} className="btn-primary">
                            <Plus className="w-5 h-5 mr-2" />
                            เพิ่มผลงานใหม่
                        </button>
                    </div>
                )
            )}
        </div>
    )
}
