'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SiteConfig {
    contact_phone: string | null;
    contact_email: string | null;
    contact_address: string | null;
}

export function PrivacyPolicy() {
    const lastUpdated = '19 กุมภาพันธ์ 2569'
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)

    useEffect(() => {
        async function fetchSiteConfig() {
            try {
                const { data, error } = await supabase
                    .from('site_config')
                    .select('contact_phone, contact_email, contact_address')
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
                                <Shield className="w-7 h-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">
                                    นโยบายความเป็นส่วนตัว
                                </h1>
                                <p className="text-secondary-500">Privacy Policy</p>
                            </div>
                        </div>
                        <p className="text-secondary-600">
                            อัปเดตล่าสุด: {lastUpdated}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
                        <h2 className="text-2xl font-display font-bold text-secondary-900 mt-0 mb-6">
                            1. บทนำ
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-8 text-justify">
                            VELOZI | Dev (&quot;เรา&quot;, &quot;ของเรา&quot;) เคารพความเป็นส่วนตัวของคุณและมุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของคุณ
                            นโยบายความเป็นส่วนตัวนี้อธิบายว่าเราเก็บรวบรวม ใช้ และเปิดเผยข้อมูลของคุณอย่างไร
                            เมื่อคุณใช้เว็บไซต์ของเราหรือใช้บริการของเรา
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            2. ข้อมูลที่เราเก็บรวบรวม
                        </h2>
                        <p className="text-secondary-600">
                            เราอาจเก็บรวบรวมข้อมูลประเภทต่างๆ รวมถึง:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li><strong>ข้อมูลส่วนบุคคล:</strong> ชื่อ, อีเมล, เบอร์โทรศัพท์, ชื่อบริษัท</li>
                            <li><strong>ข้อมูลการใช้งาน:</strong> หน้าเว็บที่เยี่ยมชม, เวลาในการใช้งาน, อุปกรณ์ที่ใช้</li>
                            <li><strong>ข้อมูลทางเทคนิค:</strong> IP Address, ประเภทเบราว์เซอร์, ระบบปฏิบัติการ</li>
                            <li><strong>คุกกี้:</strong> ข้อมูลที่เก็บไว้ในอุปกรณ์ของคุณ</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            3. วิธีการใช้ข้อมูล
                        </h2>
                        <p className="text-secondary-600">
                            เราใช้ข้อมูลของคุณเพื่อ:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>ให้บริการและดูแลเว็บไซต์ของคุณ</li>
                            <li>ติดต่อสื่อสารกับคุณเกี่ยวกับบริการ</li>
                            <li>ปรับปรุงบริการและประสบการณ์ผู้ใช้</li>
                            <li>วิเคราะห์การใช้งานเว็บไซต์</li>
                            <li>ป้องกันการฉ้อโกงและรักษาความปลอดภัย</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            4. การแบ่งปันข้อมูล
                        </h2>
                        <p className="text-secondary-600">
                            เราจะไม่ขายหรือให้เช่าข้อมูลส่วนบุคคลของคุณแก่บุคคลที่สาม
                            เราอาจแบ่งปันข้อมูลกับ:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>ผู้ให้บริการที่ช่วยเหลือการดำเนินธุรกิจของเรา (เช่น Hosting, Analytics)</li>
                            <li>หน่วยงานราชการเมื่อมีกฎหมายกำหนด</li>
                            <li>คู่ค้าที่ได้รับความยินยอมจากคุณ</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            5. ความปลอดภัยของข้อมูล
                        </h2>
                        <p className="text-secondary-600">
                            เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของคุณ รวมถึง:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>การเข้ารหัส SSL/TLS</li>
                            <li>การจำกัดการเข้าถึงข้อมูล</li>
                            <li>การสำรองข้อมูลอัตโนมัติ</li>
                            <li>การตรวจสอบความปลอดภัยอย่างสม่ำเสมอ</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            6. สิทธิของคุณ
                        </h2>
                        <p className="text-secondary-600">
                            ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) คุณมีสิทธิ:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>ขอเข้าถึงข้อมูลส่วนบุคคลของคุณ</li>
                            <li>ขอแก้ไขข้อมูลที่ไม่ถูกต้อง</li>
                            <li>ขอลบข้อมูลในบางกรณี</li>
                            <li>ขอระงับการใช้ข้อมูล</li>
                            <li>คัดค้านการประมวลผลข้อมูล</li>
                            <li>ขอย้ายข้อมูล</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            7. การเก็บรักษาข้อมูล
                        </h2>
                        <p className="text-secondary-600">
                            เราเก็บรักษาข้อมูลของคุณเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่กำหนด
                            หรือตามที่กฎหมายกำหนด เมื่อไม่จำเป็นต้องใช้ข้อมูลแล้ว
                            เราจะลบหรือทำลายข้อมูลอย่างปลอดภัย
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            8. คุกกี้
                        </h2>
                        <p className="text-secondary-600">
                            เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งาน คุณสามารถจัดการการตั้งค่าคุกกี้ได้ที่
                            {' '}<Link href="/cookies" className="text-primary-600 hover:underline">นโยบายคุกกี้</Link>
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            9. การเปลี่ยนแปลงนโยบาย
                        </h2>
                        <p className="text-secondary-600">
                            เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
                            การเปลี่ยนแปลงจะมีผลเมื่อเราเผยแพร่บนเว็บไซต์
                            แนะนำให้คุณตรวจสอบนโยบายนี้เป็นประจำ
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            10. ติดต่อเรา
                        </h2>
                        <p className="text-secondary-600">
                            หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ หรือต้องการใช้สิทธิของคุณ
                            กรุณาติดต่อเราที่:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>อีเมล: {siteConfig?.contact_email || 'privacy@velozi.dev'}</li>
                            <li>โทร: {siteConfig?.contact_phone || '+66 XX XXX XXXX'}</li>
                            <li>ที่อยู่: {siteConfig?.contact_address || 'กรุงเทพมหานคร, ประเทศไทย'}</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
