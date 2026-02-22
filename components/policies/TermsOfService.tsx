'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SiteConfig {
    contact_phone: string | null;
    contact_email: string | null;
}

export function TermsOfService() {
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
                                <FileText className="w-7 h-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">
                                    ข้อกำหนดการใช้งาน
                                </h1>
                                <p className="text-secondary-500">Terms of Service</p>
                            </div>
                        </div>
                        <p className="text-secondary-600">
                            อัปเดตล่าสุด: {lastUpdated}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
                        <h2 className="text-2xl font-display font-bold text-secondary-900 mt-0 mb-6">
                            1. การยอมรับข้อกำหนด
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-8 text-justify">
                            การใช้งานเว็บไซต์และบริการของ Nexora Labs ถือว่าคุณได้อ่าน เข้าใจ และยอมรับ
                            ข้อกำหนดและเงื่อนไขการใช้งานทั้งหมด หากคุณไม่เห็นด้วยกับข้อกำหนดใดๆ
                            กรุณางดใช้งานเว็บไซต์และบริการของเรา
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            2. คำจำกัดความ
                        </h2>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li><strong>&quot;บริการ&quot;</strong> หมายถึง บริการออกแบบ พัฒนา และดูแลเว็บไซต์ทั้งหมดที่เราให้บริการ</li>
                            <li><strong>&quot;ลูกค้า&quot;</strong> หมายถึง บุคคลหรือนิติบุคคลที่ใช้บริการของเรา</li>
                            <li><strong>&quot;เว็บไซต์&quot;</strong> หมายถึง เว็บไซต์ที่เราพัฒนาและดูแลให้ลูกค้า</li>
                            <li><strong>&quot;เนื้อหา&quot;</strong> หมายถึง ข้อความ รูปภาพ วิดีโอ และสื่ออื่นๆ บนเว็บไซต์</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            3. บริการที่ให้
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            เราให้บริการดังต่อไปนี้:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>ออกแบบและพัฒนาเว็บไซต์</li>
                            <li>จัดหาและดูแล Hosting</li>
                            <li>ระบบ Admin Panel สำหรับจัดการเนื้อหา</li>
                            <li>บริการสำรองข้อมูล (Backup)</li>
                            <li>บริการซัพพอร์ตและดูแลระบบ</li>
                            <li>บริการอื่นๆ ตามแพ็กเกจที่เลือก</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            4. ความรับผิดชอบของลูกค้า
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            ลูกค้ามีความรับผิดชอบในการ:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>ให้ข้อมูลที่ถูกต้องและครบถ้วน</li>
                            <li>ชำระค่าบริการตามกำหนด</li>
                            <li>รักษาความปลอดภัยของรหัสผ่านและข้อมูลเข้าสู่ระบบ</li>
                            <li>ไม่ใช้งานเว็บไซต์ในทางที่ผิดกฎหมาย</li>
                            <li>ไมนำเนื้อหาที่ละเมิดลิขสิทธิ์หรือผิดกฎหมายขึ้นบนเว็บไซต์</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            5. การชำระเงิน
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            5.1 ค่า Setup Fee จะชำระก่อนเริ่มโปรเจค
                        </p>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            5.2 ค่าบริการรายเดือนจะชำระล่วงหน้าภายในวันที่ 5 ของแต่ละเดือน
                        </p>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            5.3 หากชำระเงินล่าช้าเกิน 15 วัน เราอาจระงับการให้บริการชั่วคราว
                        </p>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            5.4 ราคาอาจเปลี่ยนแปลงได้โดยจะแจ้งให้ทราบล่วงหน้า 30 วัน
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            6. การรับประกัน
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            เรารับประกันว่า:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>บริการจะดำเนินการโดยบุคลากรที่มีความเชี่ยวชาญ</li>
                            <li>ระบบจะมี Uptime ไม่ต่ำกว่า 99.9%</li>
                            <li>ข้อมูลจะถูกสำรองตามกำหนดการ</li>
                            <li>ตอบกลับการสอบถามภายในเวลาทำการ</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            7. การจำกัดความรับผิดชอบ
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            เราไม่รับผิดชอบต่อ:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>ความเสียหายจากการใช้งานของลูกค้า</li>
                            <li>การหยุดชะงักของบริการจากเหตุสุดวิสัย</li>
                            <li>ความเสียหายจากการโจมตีทางไซเบอร์ที่อยู่นอกเหนือการควบคุม</li>
                            <li>การสูญหายของข้อมูลที่เกิดจากความผิดพลาดของลูกค้า</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            8. การยกเลิกบริการ
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            8.1 ลูกค้าสามารถยกเลิกบริการได้โดยแจ้งล่วงหน้า 30 วัน
                        </p>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            8.2 เราสามารถยกเลิกบริการได้หากลูกค้า:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>ไม่ชำระค่าบริการตามกำหนด</li>
                            <li>ใช้งานเว็บไซต์ในทางที่ผิดกฎหมาย</li>
                            <li>ละเมิดข้อกำหนดการใช้งาน</li>
                        </ul>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            9. ทรัพย์สินทางปัญญา
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            9.1 หลังจากชำระเงินครบถ้วน ลูกค้าเป็นเจ้าของเนื้อหาที่ลูกค้าจัดเตรียม
                        </p>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            9.2 เราเป็นเจ้าของโค้ด กรอบงาน และเครื่องมือที่ใช้พัฒนา
                        </p>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            9.3 ลูกค้าได้รับสิทธิ์การใช้งานซอฟต์แวร์ตลอดอายุการใช้งานเว็บไซต์
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            10. กฎหมายที่ใช้บังคับ
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            ข้อกำหนดนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใดๆ จะถูกพิจารณาโดยศาลไทย
                        </p>

                        <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6 mt-12">
                            11. ติดต่อเรา
                        </h2>
                        <p className="text-secondary-600 leading-relaxed indent-8 mb-6 text-justify">
                            หากมีคำถามเกี่ยวกับข้อกำหนดนี้ กรุณาติดต่อ:
                        </p>
                        <ul className="text-secondary-600 space-y-3 mb-8 ml-6 list-disc marker:text-primary-500">
                            <li>อีเมล: {siteConfig?.contact_email || 'legal@nexoralabs.com'}</li>
                            <li>โทร: {siteConfig?.contact_phone || '+66 XX XXX XXXX'}</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
