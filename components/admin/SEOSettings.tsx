'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, Image as ImageIcon, Globe, Search, Tag, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'
import { z } from 'zod'

// SEO Config Validation Schema
const seoSchema = z.object({
    seo_title: z.string().min(1, 'กรุณากรอก Global SEO Title').max(60, 'Title ควรมีความยาวไม่เกิน 60 ตัวอักษร'),
    seo_description: z.string().min(1, 'กรุณากรอก Meta Description').max(160, 'Description ควรมีความยาวไม่เกิน 160 ตัวอักษร'),
    seo_keywords: z.string().max(255, 'Keywords ยาวเกินไป').optional(),
})

interface SiteConfig {
    id: string;
    site_name: string;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    og_image_url: string | null;
}

export function SEOSettings() {
    const { showAlert } = useModal()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [config, setConfig] = useState<SiteConfig>({
        id: '',
        site_name: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        og_image_url: null,
    })

    const fetchConfig = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('site_config')
                .select('*')
                .limit(1)
                .single()

            if (error) {
                // Ignore empty row error, it might not be initialized yet
                if (error.code !== 'PGRST116') {
                    throw error
                }
            }
            if (data) {
                setConfig({
                    id: data.id,
                    site_name: data.site_name || '',
                    seo_title: data.seo_title || '',
                    seo_description: data.seo_description || '',
                    seo_keywords: data.seo_keywords || '',
                    og_image_url: data.og_image_url || null,
                })
            }
        } catch (err) {
            console.error('Error fetching SEO config:', err)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลการตั้งค่า SEO ได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }, [showAlert])

    useEffect(() => {
        fetchConfig()
    }, [fetchConfig])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setConfig(prev => ({ ...prev, [name]: value }))
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
            const fileName = `og_${randomString}.${fileExt}`
            const filePath = `seo/${fileName}`

            // Upload the new image
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get the URL
            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath)

            // Auto-save to Database immediately to prevent desync
            if (config.id) {
                const { error: syncError } = await supabase
                    .from('site_config')
                    .update({ og_image_url: publicUrl })
                    .eq('id', config.id)

                if (syncError) {
                    console.error('Error syncing OG image to DB:', syncError)
                    // We don't throw here to still allow the UI to show the preview
                }
            }

            // Cleanup old images from storage
            if (config.og_image_url && config.og_image_url.includes('supabase.co')) {
                try {
                    // Extract exact filename from URL
                    const urlParts = config.og_image_url.split('/seo/');
                    const oldFileName = urlParts.length > 1 ? urlParts[1].split('?')[0] : null;

                    if (oldFileName && oldFileName !== fileName) {
                        await supabase.storage.from('assets').remove([`seo/${oldFileName}`]);
                    }
                } catch (cleanupErr) {
                    console.error('Error cleaning up old OG image:', cleanupErr);
                }
            }

            setConfig(prev => ({ ...prev, og_image_url: publicUrl }))
            showAlert('อัปโหลดสำเร็จ', 'เปลี่ยนรูปภาพแชร์ (OG Image) และบันทึกข้อมูลเรียบร้อยแล้ว', 'success')
        } catch (err) {
            console.error('Upload error:', err)
            showAlert('อัปโหลดล้มเหลว', 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)

            // Validate limits
            seoSchema.parse({
                seo_title: config.seo_title,
                seo_description: config.seo_description,
                seo_keywords: config.seo_keywords,
            })

            const payload = {
                seo_title: config.seo_title,
                seo_description: config.seo_description,
                seo_keywords: config.seo_keywords,
                og_image_url: config.og_image_url,
                updated_at: new Date().toISOString()
            }

            if (config.id) {
                const { error } = await supabase
                    .from('site_config')
                    .update(payload)
                    .eq('id', config.id)
                if (error) throw error
            } else {
                // If by some chance no row existed, insert a new one
                const { error } = await supabase
                    .from('site_config')
                    .insert([payload])
                if (error) throw error
            }

            showAlert('บันทึกสำเร็จ', 'อัปเดตข้อมูล SEO ทั่วไปของเว็บไซต์เรียบร้อยแล้ว', 'success')
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
                <div className="mb-6 pb-6 border-b border-secondary-100 flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                        <Search className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-secondary-900">SEO (Search Engine Optimization)</h2>
                        <p className="text-secondary-500 mt-1 leading-relaxed">
                            ตั้งค่าหัวข้อ คำอธิบาย และคีย์เวิร์ดของเว็บไซต์ เพื่อเพิ่มโอกาสให้ Google และผู้ค้นหาเจอเว็บไซต์ของคุณได้ง่ายขึ้น ข้อมูลนี้จะถูกแสดงผลบนผลการค้นหา (SERP) และการแชร์ลิงก์โซเชียลมีเดีย
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Google Search Preview Card (Simulation) */}
                    <div className="bg-secondary-50 p-5 rounded-xl border border-secondary-200">
                        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-secondary-600">
                            <Globe className="w-4 h-4 text-blue-500" /> ตัวอย่างการแสดงผลบน Google
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-secondary-500 mb-1 flex items-center gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/logos/footer-logo.png" alt="icon" className="w-4 h-4 rounded-full" />
                                {process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nexoralabs.com'}
                            </div>
                            <div className="text-xl text-[#1a0dab] font-medium leading-tight mb-1 hover:underline cursor-pointer truncate">
                                {config.seo_title || 'ชื่อเว็บไซต์ของคุณ'}
                            </div>
                            <div className="text-sm text-[#4d5156] leading-snug line-clamp-2">
                                {config.seo_description || 'คำอธิบายเว็บไซต์ที่ดึงดูดใจ เพื่อให้ลูกค้ารู้ว่าเว็บไซต์ของคุณนำเสนอบริการหรือสินค้าใด...'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Text Data */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">
                                    หัวข้อเว็บไซต์ (SEO Title) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="seo_title"
                                    value={config.seo_title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
                                    placeholder="เช่น บริษัท รับทำเว็บไซต์คุณภาพสูง..."
                                    maxLength={70}
                                />
                                <div className="flex justify-between mt-1">
                                    <p className="text-xs text-secondary-500">ควรมีคีย์เวิร์ดสำคัญ และดึงดูดความสนใจ</p>
                                    <p className={`text-xs ${config.seo_title.length > 60 ? 'text-amber-500 font-medium' : 'text-secondary-400'}`}>
                                        {config.seo_title.length}/60 แนะนำ
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">
                                    คำอธิบาย (Meta Description) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="seo_description"
                                    value={config.seo_description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none text-sm"
                                    rows={4}
                                    placeholder="สร้างและดูแลเว็บไซต์สำหรับธุรกิจแบบครบวงจร พร้อมรับทำ SEO ให้ติดหน้าแรก Google..."
                                    maxLength={200}
                                />
                                <div className="flex justify-between mt-1">
                                    <p className="text-xs text-secondary-500">พิมพ์เชิญชวนให้คลิกเข้ามาดูข้อมูลต่อ</p>
                                    <p className={`text-xs ${config.seo_description.length > 160 ? 'text-amber-500 font-medium' : 'text-secondary-400'}`}>
                                        {config.seo_description.length}/160 แนะนำ
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1 flex items-center gap-1.5">
                                    คำค้นหา (Keywords) <Tag className="w-3.5 h-3.5 text-secondary-400" />
                                </label>
                                <input
                                    type="text"
                                    name="seo_keywords"
                                    value={config.seo_keywords}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
                                    placeholder="รับทำเว็บไซต์, สร้างเว็บ, ออกแบบเว็บไซต์ (คั่นด้วยลูกน้ำ)"
                                />
                                <p className="text-xs text-secondary-500 mt-1">
                                    แม้ Google จะไม่ใช้ Keywords ประเมินผลแล้ว แต่ยังมีผลกับ Search Engine อื่นบางตัว
                                </p>
                            </div>
                        </div>

                        {/* Right Column: OG Image */}
                        <div className="space-y-4">
                            <div className="bg-primary-50 p-4 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-primary-900 mb-1">รูปภาพเวลาแชร์ (OG Image)</p>
                                    <p className="text-primary-700 leading-relaxed text-xs">
                                        รูปภาพนี้จะไปแสดงตอนมีคนแชร์ลิงก์หน้าแรกของเว็บไซต์ไปที่ <b>Facebook, LINE, หรือ Twitter</b>
                                        ทำให้ดูน่าเชื่อถือและดึงดูดกว่าการแสดงแค่ตัวหนังสือ แนะนำขนาด <b>1200 x 630px</b>
                                    </p>
                                </div>
                            </div>

                            <div className="aspect-[1.91/1] w-full relative rounded-xl border-2 border-dashed border-secondary-300 bg-secondary-50 flex flex-col items-center justify-center overflow-hidden group">
                                {config.og_image_url ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={config.og_image_url}
                                            alt="OG Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                                            <label className="cursor-pointer btn-secondary bg-white text-secondary-900 px-4 py-2 hover:bg-secondary-50 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                                                เปลี่ยนรูปภาพแชร์
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-secondary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-colors p-6 text-center">
                                        {isUploading ? (
                                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary-600" />
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                                                    <ImageIcon className="w-6 h-6 text-secondary-400" />
                                                </div>
                                                <span className="font-medium text-sm">อัปโหลดรูปภาพ 1200x630px</span>
                                                <span className="text-xs text-secondary-400 mt-1">ไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</span>
                                            </>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-secondary-100 flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={isSaving || isUploading}
                            className="btn-primary min-w-[140px]"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5 mr-2" />
                            )}
                            บันทึกการตั้งค่า SEO
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}
