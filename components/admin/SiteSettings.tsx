'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Globe, Mail, Phone, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const initialSettings = {
    siteName: 'Nexora Labs',
    siteDescription: 'บริการออกแบบและดูแลเว็บไซต์สำหรับธุรกิจ SME',
    contactEmail: 'contact@nexoralabs.com',
    contactPhone: '+66 XX XXX XXXX',
    contactAddress: 'กรุงเทพมหานคร, ประเทศไทย',
    workingHours: '09:00 - 18:00',
    socialFacebook: 'https://facebook.com/nexoralabs',
    socialLine: '@nexoralabs',
    socialInstagram: '@nexoralabs',
    logoUrl: '',
}

export function SiteSettings() {
    const [settings, setSettings] = useState(initialSettings)
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [configId, setConfigId] = useState<string | null>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('site_config')
                .select('*')
                .limit(1)
                .single()

            if (error) {
                if (error.code !== 'PGRST116') { // Ignore "No rows found" error
                    throw error
                }
            } else if (data) {
                setConfigId(data.id)
                setSettings({
                    siteName: data.site_name || '',
                    siteDescription: data.site_description || '',
                    contactEmail: data.contact_email || '',
                    contactPhone: data.contact_phone || '',
                    contactAddress: data.contact_address || '',
                    workingHours: data.working_hours || '',
                    socialFacebook: data.social_facebook || '',
                    socialLine: data.social_line || '',
                    socialInstagram: data.social_instagram || '',
                    logoUrl: data.logo_url || '',
                })
            }
        } catch (err: unknown) {
            console.error('Error fetching site settings:', err)
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล โหลดข้อมูลเริ่มต้นแทน')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setSettings((prev) => ({ ...prev, [field]: value }))
        setSaved(false)
    }

    const handleSave = async () => {
        setIsSaving(true)
        setError(null)
        setSaved(false)

        try {
            const configData = {
                site_name: settings.siteName,
                site_description: settings.siteDescription,
                contact_email: settings.contactEmail,
                contact_phone: settings.contactPhone,
                contact_address: settings.contactAddress,
                working_hours: settings.workingHours,
                social_facebook: settings.socialFacebook,
                social_line: settings.socialLine,
                social_instagram: settings.socialInstagram,
                logo_url: settings.logoUrl,
                updated_at: new Date().toISOString()
            }

            if (configId) {
                // Update existing
                const { error } = await supabase
                    .from('site_config')
                    .update(configData)
                    .eq('id', configId)

                if (error) throw error
            } else {
                // Insert new and grab ID
                const { data, error } = await supabase
                    .from('site_config')
                    .insert([configData])
                    .select()
                    .single()

                if (error) throw error
                if (data) setConfigId(data.id)
            }

            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (err: unknown) {
            console.error('Error saving site config:', err)
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            {/* Site Info */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
                <div className="p-6 border-b border-secondary-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-secondary-900">ข้อมูลเว็บไซต์</h2>
                            <p className="text-sm text-secondary-500">ตั้งค่าข้อมูลพื้นฐานของเว็บไซต์</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                ชื่อเว็บไซต์
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleChange('siteName', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                คำอธิบายเว็บไซต์
                            </label>
                            <input
                                type="text"
                                value={settings.siteDescription}
                                onChange={(e) => handleChange('siteDescription', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            โลโก้เว็บไซต์ (Image URL)
                        </label>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="w-20 h-20 rounded-xl bg-secondary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {settings.logoUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-3xl font-bold text-primary-500">N</span>
                                )}
                            </div>
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    value={settings.logoUrl}
                                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                />
                                <p className="text-sm text-secondary-500 mt-2">ใส่ลิงก์รูปภาพโลโก้ที่ต้องการแสดงผล</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
                <div className="p-6 border-b border-secondary-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-secondary-900">ข้อมูลติดต่อ</h2>
                            <p className="text-sm text-secondary-500">ตั้งค่าช่องทางการติดต่อ</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                อีเมล
                            </label>
                            <input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => handleChange('contactEmail', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                เบอร์โทรศัพท์
                            </label>
                            <input
                                type="tel"
                                value={settings.contactPhone}
                                onChange={(e) => handleChange('contactPhone', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                ที่อยู่
                            </label>
                            <input
                                type="text"
                                value={settings.contactAddress}
                                onChange={(e) => handleChange('contactAddress', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                <Clock className="w-4 h-4 inline mr-2" />
                                เวลาทำการ
                            </label>
                            <input
                                type="text"
                                value={settings.workingHours}
                                onChange={(e) => handleChange('workingHours', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
                <div className="p-6 border-b border-secondary-100">
                    <h2 className="text-lg font-semibold text-secondary-900">โซเชียลมีเดีย</h2>
                    <p className="text-sm text-secondary-500">ลิงก์ไปยังโซเชียลมีเดียของคุณ</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={settings.socialFacebook}
                                onChange={(e) => handleChange('socialFacebook', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Line Official
                            </label>
                            <input
                                type="text"
                                value={settings.socialLine}
                                onChange={(e) => handleChange('socialLine', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                placeholder="@yourline"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Instagram
                            </label>
                            <input
                                type="text"
                                value={settings.socialInstagram}
                                onChange={(e) => handleChange('socialInstagram', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                placeholder="@yourinstagram"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-4">
                {saved && (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-green-600 text-sm"
                    >
                        ✓ บันทึกสำเร็จ
                    </motion.span>
                )}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary"
                >
                    {isSaving ? (
                        <>
                            <span className="animate-spin mr-2">⏳</span>
                            กำลังบันทึก...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" />
                            บันทึกการตั้งค่า
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
