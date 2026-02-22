'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Cookie } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SiteConfig {
    contact_phone: string | null;
    contact_email: string | null;
}

export function CookiePolicy() {
    const lastUpdated = '19 กุมภาพันธ์ 2569'
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)

    useEffect(() => {
        async function fetchSiteConfig() {
            try {
                const { data, error } = await supabase
                    .from('site_config')
                    .select('contact_phone, contact_email')
                    .single()

                if (error) throw error
                if (data) setSiteConfig(data)
            } catch (error) {
                console.error('Error fetching site config:', error)
            }
        }
        fetchSiteConfig()
    }, [])

    return (
        <div className="min-h-screen pt-24 pb-16 gradient-bg">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        กลับหน้าหลัก
                    </Link>

                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
                                <Cookie className="w-7 h-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">
                                    นโยบายคุกกี้
                                </h1>
                                <p className="text-secondary-500">Cookie Policy</p>
                            </div>
                        </div>
                        <p className="text-secondary-600">
                            อัปเดตล่าสุด: {lastUpdated}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
                        <h2 className="text-2xl font-display font-bold text-secondary-900 mt-0 mb-6">
                            1. คุกกี้คืออะไร?
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-8 text-justify">
                            คุกกี้เป็นไฟล์ข้อความขนาดเล็กที่เก็บไว้ในอุปกรณ์ของคุณเมื่อคุณเยี่ยมชมเว็บไซต์
                            คุกกี้ช่วยให้เว็บไซต์จดจำการตั้งค่าของคุณและปรับปรุงประสบการณ์การใช้งาน
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            2. ประเภทคุกกี้ที่เราใช้
                        </h2>

                        <h3 className="text-xl font-semibold text-secondary-900 mb-4 mt-8">
                            2.1 คุกกี้ที่จำเป็น (Necessary Cookies)
                        </h3>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            คุกกี้เหล่านี้จำเป็นต่อการทำงานของเว็บไซต์ ไม่สามารถปิดได้ ได้แก่:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li><strong>Session Cookies</strong> - เก็บข้อมูลเซสชันการใช้งาน</li>
                            <li><strong>Security Cookies</strong> - ช่วยในการรักษาความปลอดภัย</li>
                            <li><strong>Cookie Consent</strong> - จดจำการยินยอมใช้คุกกี้ของคุณ</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-secondary-900 mb-4 mt-8">
                            2.2 คุกกี้วิเคราะห์ (Analytics Cookies)
                        </h3>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            คุกกี้เหล่านี้ช่วยให้เราเข้าใจว่าผู้เยี่ยมชมใช้งานเว็บไซต์อย่างไร:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li><strong>Google Analytics</strong> - วิเคราะห์การเข้าชมเว็บไซต์</li>
                            <li><strong>Page Views</strong> - ติดตามหน้าที่เยี่ยมชม</li>
                            <li><strong>User Behavior</strong> - ศึกษาพฤติกรรมผู้ใช้</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-secondary-900 mb-4 mt-8">
                            2.3 คุกกี้การตั้งค่า (Preference Cookies)
                        </h3>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            คุกกี้เหล่านี้จดจำการตั้งค่าของคุณ:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li><strong>Language</strong> - ภาษาที่เลือก</li>
                            <li><strong>Theme</strong> - ธีมที่เลือก (Light/Dark)</li>
                            <li><strong>Region</strong> - ภูมิภาคที่เลือก</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-secondary-900 mb-4 mt-8">
                            2.4 คุกกี้การตลาด (Marketing Cookies)
                        </h3>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            คุกกี้เหล่านี้ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้อง:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li><strong>Facebook Pixel</strong> - ติดตามการโฆษณา</li>
                            <li><strong>Google Ads</strong> - วัดผลการโฆษณา</li>
                            <li><strong>Retargeting</strong> - แสดงโฆษณาตามความสนใจ</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            3. การจัดการคุกกี้
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            คุณสามารถจัดการการใช้คุกกี้ได้หลายวิธี:
                        </p>

                        <h3 className="text-xl font-semibold text-secondary-900 mb-4 mt-8">
                            3.1 ผ่านเว็บไซต์ของเรา
                        </h3>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            เมื่อคุณเยี่ยมชมเว็บไซต์ครั้งแรก จะมีแบนเนอร์ขอความยินยอมใช้คุกกี้
                            คุณสามารถเลือกยอมรับ ปฏิเสธ หรือปรับแต่งการตั้งค่าได้
                        </p>

                        <h3 className="text-xl font-semibold text-secondary-900 mb-4 mt-8">
                            3.2 ผ่านเบราว์เซอร์
                        </h3>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            คุณสามารถบล็อกหรือลบคุกกี้ผ่านการตั้งค่าเบราว์เซอร์:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                            <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                            <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            4. ผลกระทบจากการปิดคุกกี้
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            หากคุณปิดคุกกี้บางประเภท:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>เว็บไซต์อาจทำงานได้ไม่เต็มประสิทธิภาพ</li>
                            <li>การตั้งค่าของคุณจะไม่ถูกบันทึก</li>
                            <li>เราจะไม่สามารถวิเคราะห์และปรับปรุงเว็บไซต์ได้</li>
                            <li>โฆษณาที่แสดงอาจไม่เกี่ยวข้องกับคุณ</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            5. คุกกี้จากบุคคลที่สาม
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            เว็บไซต์ของเราอาจมีคุกกี้จากบุคคลที่สาม:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li><strong>Google Analytics</strong> - สำหรับวิเคราะห์การใช้งาน</li>
                            <li><strong>Google Fonts</strong> - สำหรับแสดงฟอนต์</li>
                            <li><strong>YouTube/Vimeo</strong> - สำหรับแสดงวิดีโอ</li>
                        </ul>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            บุคคลที่สามเหล่านี้อาจใช้คุกกี้ตามนโยบายความเป็นส่วนตัวของตนเอง
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            6. ระยะเวลาเก็บคุกกี้
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            คุกกี้มีอายุการใช้งานแตกต่างกัน:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li><strong>Session Cookies</strong> - หมดอายุเมื่อปิดเบราว์เซอร์</li>
                            <li><strong>Persistent Cookies</strong> - เก็บไว้ตามระยะเวลาที่กำหนด (1 วัน - 2 ปี)</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            7. การเปลี่ยนแปลงนโยบาย
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            เราอาจปรับปรุงนโยบายคุกกี้นี้เป็นครั้งคราว
                            การเปลี่ยนแปลงจะมีผลเมื่อเราเผยแพร่บนเว็บไซต์
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            8. ติดต่อเรา
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            หากมีคำถามเกี่ยวกับนโยบายคุกกี้ กรุณาติดต่อ:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>อีเมล: {siteConfig?.contact_email || 'privacy@nexoralabs.com'}</li>
                            <li>โทร: {siteConfig?.contact_phone || '+66 XX XXX XXXX'}</li>
                        </ul>

                        <div className="mt-12 p-6 bg-primary-50 rounded-xl border border-primary-100">
                            <p className="text-secondary-700 m-0 leading-relaxed indent-8 text-justify">
                                <strong>หมายเหตุ:</strong> คุณสามารถเปลี่ยนการตั้งค่าคุกกี้ได้ทุกเมื่อ
                                โดยคลิกที่ปุ่ม &quot;จัดการคุกกี้&quot; ที่ด้านล่างของหน้าเว็บ
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
