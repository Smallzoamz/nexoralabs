'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Loader2, Eye, Link as LinkIcon, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'
import { z } from 'zod'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

const articleSchema = z.object({
    title: z.string().min(1, 'กรุณากรอกหัวข้อบทความ').max(200, 'หัวข้อยาวเกินไป'),
    slug: z.string().min(1, 'กรุณากรอก URL (Slug)').max(200, 'URL ยาวเกินไป')
        .regex(/^[a-z0-9-]+$/, 'URL อนุญาตเฉพาะภาษาอังกฤษตัวเล็ก ตัวเลข และขีดกลาง (-) เท่านั้น'),
    excerpt: z.string().max(500, 'คำโปรยยาวเกินไป').optional(),
    content: z.string().min(1, 'กรุณากรอกเนื้อหาบทความ'),
    category: z.string().max(100, 'หมวดหมู่ยาวเกินไป').optional(),
    author: z.string().max(100, 'ชื่อผู้เขียนยาวเกินไป').optional(),
    is_published: z.boolean(),
})

interface ArticleItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    category: string | null;
    author: string | null;
    is_published: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
}

export function ArticleManager() {
    const { showAlert, showConfirm } = useModal()
    const [articles, setArticles] = useState<ArticleItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Form state
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        cover_image: '',
        category: '',
        author: 'Admin',
        is_published: false
    })

    const fetchArticles = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setArticles(data || [])
        } catch (err) {
            console.error('Error fetching articles:', err)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลบทความได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }, [showAlert])

    useEffect(() => {
        fetchArticles()
    }, [fetchArticles])

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            cover_image: '',
            category: '',
            author: 'Admin',
            is_published: false
        })
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEdit = (item: ArticleItem) => {
        setFormData({
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt || '',
            content: item.content,
            cover_image: item.cover_image || '',
            category: item.category || '',
            author: item.author || 'Admin',
            is_published: item.is_published
        })
        setEditingId(item.id)
        setIsEditing(true)
    }

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setFormData(prev => ({
            ...prev,
            title,
            // Only auto-generate if we are creating a new article, not editing an existing one
            // or if the user hasn't heavily modified the slug themselves
            slug: editingId ? prev.slug : title
                .toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with -
                .replace(/^-+|-+$/g, '') // Remove trailing -
        }))
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            if (!file.type.startsWith('image/')) {
                showAlert('ข้อมูลไม่ถูกต้อง', 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น', 'error')
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                showAlert('ไฟล์ขนาดใหญ่เกินไป', 'กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 5MB', 'error')
                return
            }

            setIsUploading(true)
            const fileExt = file.name.split('.').pop()
            const randomString = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
            const fileName = `${randomString}.${fileExt}`
            const filePath = `covers/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('articles')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('articles')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, cover_image: publicUrl }))
        } catch (err: unknown) {
            console.error('Upload error:', err)
            showAlert('อัปโหลดล้มเหลว', 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพปก', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)

            // Validate form
            portfolioSchema.parse({
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt,
                content: formData.content,
                category: formData.category,
                author: formData.author,
                is_published: formData.is_published
            })

            // Check slug uniqueness
            const { data: existingSlug } = await supabase
                .from('articles')
                .select('id')
                .eq('slug', formData.slug)
                .neq('id', editingId || '00000000-0000-0000-0000-000000000000') // Ignore self when updating
                .single()

            if (existingSlug) {
                showAlert('ข้อมูลซ้ำ', 'URL (Slug) นี้มีอยู่ในระบบแล้ว กรุณาเปลี่ยนใหม่', 'error')
                setIsSaving(false)
                return
            }

            // Tiptap outputs clean HTML directly — no conversion needed
            const formattedContent = formData.content

            const payload = {
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt || null,
                content: formattedContent,
                category: formData.category || null,
                author: formData.author || 'Admin',
                cover_image: formData.cover_image || null,
                is_published: formData.is_published,
                updated_at: new Date().toISOString()
            }

            if (isEditing && editingId) {
                const { error } = await supabase
                    .from('articles')
                    .update(payload)
                    .eq('id', editingId)

                if (error) throw error

                setArticles(articles.map(a => a.id === editingId ? { ...a, ...payload } : a))
                showAlert('สำเร็จ', 'อัปเดตบทความเรียบร้อยแล้ว', 'success')
            } else {
                const { data, error } = await supabase
                    .from('articles')
                    .insert([{ ...payload }])
                    .select()
                    .single()

                if (error) throw error

                setArticles([data, ...articles])
                showAlert('สำเร็จ', 'เพิ่มบทความใหม่เรียบร้อยแล้ว', 'success')
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

    const handleDelete = async (id: string, coverImage: string | null) => {
        if (!(await showConfirm('ยืนยันลบข้อมูล', 'คุณต้องการลบบทความนี้ หรือข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้?'))) return

        try {
            const { error: dbError } = await supabase
                .from('articles')
                .delete()
                .eq('id', id)

            if (dbError) throw dbError

            if (coverImage) {
                try {
                    const fileName = coverImage.split('/').pop()
                    if (fileName) {
                        await supabase.storage.from('articles').remove([`covers/${fileName}`])
                    }
                } catch (storageErr) {
                    console.error('Storage cleanup skipped:', storageErr)
                }
            }

            setArticles(articles.filter(a => a.id !== id))
            showAlert('ลบสำเร็จ', 'ลบบทความเรียบร้อยแล้ว', 'success')
        } catch (err: unknown) {
            console.error('Delete error:', err)
            showAlert('ข้อผิดพลาด', 'ลบข้อมูลไม่สำเร็จ', 'error')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }


    // Avoid using portfolioSchema from copy-paste. Re-wrap into local zod parsing
    const portfolioSchema = articleSchema

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
                    <h2 className="text-xl font-display font-bold text-secondary-900">บทความ (Blog & News)</h2>
                    <p className="text-sm text-secondary-500 mt-1">จัดการบทความ ข่าวสาร เพื่ออัปเดตความรู้และทำ SEO</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        เขียนบทความใหม่
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
                            {editingId ? 'แก้ไขบทความ' : 'เขียนบทความใหม่'}
                        </h3>
                        <button onClick={resetForm} className="text-secondary-400 hover:text-secondary-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Col: Main Content (Takes up 2/3 width) */}
                        <div className="lg:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">หัวข้อบทความ (Title) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-lg font-medium"
                                    placeholder="เช่น ทำไมธุรกิจยุคนี้จึงขาดเว็บไซต์ไม่ได้..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">เนื้อหาบทความ (Content) <span className="text-red-500">*</span></label>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                                />
                            </div>
                        </div>

                        {/* Right Col: Metadata (Takes up 1/3 width) */}
                        <div className="space-y-6 bg-secondary-50/50 p-5 rounded-xl border border-secondary-100">

                            {/* Publishing Status */}
                            <div>
                                <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-xl cursor-pointer hover:bg-white transition-colors bg-white">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="w-5 h-5 text-green-600 rounded border-secondary-300 focus:ring-green-500"
                                    />
                                    <div>
                                        <div className="font-medium text-secondary-900">เผยแพร่สู่สาธารณะ</div>
                                        <div className="text-xs text-secondary-500">หากติ๊กออก จะถูกเก็บเป็นฉบับร่าง (Draft)</div>
                                    </div>
                                </label>
                            </div>

                            {/* Cover Image */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-secondary-700">รูปภาพปก (Cover Image)</label>
                                <div className="aspect-video relative rounded-xl border-2 border-dashed border-secondary-300 bg-white flex items-center justify-center overflow-hidden">
                                    {formData.cover_image ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={formData.cover_image} alt="Cover Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <label className="cursor-pointer btn-secondary text-sm px-3 py-1.5 min-h-0">
                                                    เปลี่ยนรูปปก
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-secondary-400 hover:text-primary-500 transition-colors p-4 text-center">
                                            {isUploading ? (
                                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-6 h-6 mb-2" />
                                                    <span className="text-xs font-medium">อัปโหลดรูปปกบทความ</span>
                                                    <span className="text-[10px] text-secondary-400 mt-1">ขนาดแนะนำ 1200x630px</span>
                                                </>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* SEO Slug */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">
                                    URL Link (Slug) <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <span className="text-xs text-secondary-400 bg-white border border-r-0 border-secondary-200 px-2 py-2 rounded-l-lg select-none">
                                        /articles/
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                        className="w-full px-3 py-2 border border-secondary-200 rounded-r-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-mono"
                                        placeholder="your-article-url"
                                    />
                                </div>
                                <p className="text-[10px] text-secondary-500 mt-1">ใช้ตัวอักษรภาษาอังกฤษ ตัวเลข และขีดกลางเท่านั้น</p>
                            </div>

                            {/* Properties */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">หมวดหมู่</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
                                        placeholder="เช่น อัปเดตข่าว, ความรู้ SEO"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">ผู้เขียน</label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
                                        placeholder="เช่น Admin, Editor..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">คำโปรย (Excerpt)</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none text-sm"
                                    rows={3}
                                    placeholder="สรุปเนื้อหาสั้นๆ 1-2 บรรทัด สำหรับแสดงหน้าแรก..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-secondary-100 flex justify-end gap-3 bg-secondary-50">
                        <button onClick={resetForm} className="btn-outline">ยกเลิก</button>
                        <button onClick={handleSave} disabled={isSaving || isUploading} className="btn-primary">
                            {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                            บันทึกบทความ
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Articles List */}
            {!isEditing && (
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                    {articles.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-secondary-50 border-b border-secondary-200">
                                        <th className="px-6 py-4 font-semibold text-secondary-900 text-sm">บทความ</th>
                                        <th className="px-6 py-4 font-semibold text-secondary-900 text-sm">สถานะ</th>
                                        <th className="px-6 py-4 font-semibold text-secondary-900 text-sm">ผู้เขียน / วันที่</th>
                                        <th className="px-6 py-4 font-semibold text-secondary-900 text-sm text-right">สถิติคนเข้าชม</th>
                                        <th className="px-6 py-4 font-semibold text-secondary-900 text-sm text-center">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-100">
                                    {articles.map((item) => (
                                        <tr key={item.id} className="hover:bg-secondary-50/50 transition-colors">
                                            <td className="px-6 py-4 max-w-[300px]">
                                                <div className="flex items-center gap-4">
                                                    {item.cover_image ? (
                                                        <div className="w-16 h-12 rounded bg-secondary-100 overflow-hidden shrink-0 border border-secondary-200">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-12 rounded bg-secondary-100 flex items-center justify-center shrink-0 border border-secondary-200">
                                                            <ImageIcon className="w-5 h-5 text-secondary-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-secondary-900 line-clamp-1">{item.title}</div>
                                                        <div className="text-xs text-secondary-500 flex items-center gap-1 mt-1 truncate">
                                                            <LinkIcon className="w-3 h-3" /> /articles/{item.slug}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.is_published
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.is_published ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                                    {item.is_published ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-secondary-900">{item.author || 'Admin'}</div>
                                                <div className="text-xs text-secondary-500 flex items-center gap-1 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(item.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-1 text-sm text-secondary-600 bg-secondary-100 px-2 py-1 rounded-lg">
                                                    <Eye className="w-4 h-4 text-secondary-400" />
                                                    {item.view_count.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <a
                                                        href={`/articles/${item.slug}`}
                                                        target="_blank"
                                                        className="p-2 text-secondary-400 hover:text-primary-600 transition-colors bg-white border border-secondary-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 shadow-sm"
                                                        title="ดูหน้าบทความ"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 text-secondary-400 hover:text-amber-600 transition-colors bg-white border border-secondary-200 rounded-lg hover:border-amber-200 hover:bg-amber-50 shadow-sm"
                                                        title="แก้ไขบทความ"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id, item.cover_image)}
                                                        className="p-2 text-secondary-400 hover:text-red-600 transition-colors bg-white border border-secondary-200 rounded-lg hover:border-red-200 hover:bg-red-50 shadow-sm"
                                                        title="ลบบทความ"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-secondary-400" />
                            </div>
                            <h3 className="text-lg font-medium text-secondary-900 mb-2">ยังไม่มีบทความ</h3>
                            <p className="text-secondary-500 mb-6">คลิกปุ่มด้านบนเพื่อเริ่มเขียนบทความหรือข่าวสารชิ้นแรก</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
// Adding missing icons
import { FileText, ExternalLink as ExternalLinkLucide } from 'lucide-react'
const ExternalLink = ExternalLinkLucide
