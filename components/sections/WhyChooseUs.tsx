'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Shield, Headphones, Zap, Code, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const reasons = [
    {
        icon: Clock,
        title: 'ตอบกลับรวดเร็ว',
        description: 'ตอบกลับภายในเวลาทำการ กรณีระบบล่มทั้งระบบ ตอบกลับภายใน 2 ชม.',
    },
    {
        icon: Shield,
        title: 'ปลอดภัย 100%',
        description: 'ระบบรักษาความปลอดภัยระดับองค์กร พร้อม Backup อัตโนมัติ',
    },
    {
        icon: Headphones,
        title: 'ซัพพอร์ตตลอดการใช้งาน',
        description: 'ทีมงานพร้อมให้ความช่วยเหลือตลอดการใช้งาน ไม่มีค่าใช้จ่ายเพิ่ม',
    },
    {
        icon: Zap,
        title: 'เว็บไซต์รวดเร็ว',
        description: 'ใช้เทคโนโลยีล่าสุด Next.js ทำให้เว็บไซต์โหลดเร็ว ทันสมัย',
    },
    {
        icon: Code,
        title: 'Admin Panel ครบครัน',
        description: 'จัดการเนื้อหาเว็บไซต์เองได้ง่าย ไม่ต้องพึ่งโปรแกรมเมอร์',
    },
    {
        icon: TrendingUp,
        title: 'SEO Ready',
        description: 'เว็บไซต์พร้อม SEO ระดับองค์กร ช่วยให้ลูกค้าเจอคุณง่ายขึ้น',
    },
]

export function WhyChooseUs() {
    const [trustCount, setTrustCount] = useState<number | null>(null)

    useEffect(() => {
        async function fetchTrustCount() {
            try {
                const { count, error } = await supabase
                    .from('trust_badges')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true)

                if (error) throw error
                setTrustCount(count)
            } catch (error) {
                console.error('Error fetching trust badge count:', error)
            }
        }
        fetchTrustCount()
    }, [])

    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
                            เราใส่ใจ
                            <br />
                            <span className="gradient-text">ทุกรายละเอียด</span>
                        </h2>
                        <p className="text-lg text-secondary-600 leading-loose mt-4 mb-8">
                            ด้วยประสบการณ์และความเชี่ยวชาญ เราพร้อมมอบบริการที่ดีที่สุดให้กับธุรกิจของคุณ
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {reasons.map((reason, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                                        <reason.icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-secondary-900 mb-1">
                                            {reason.title}
                                        </h3>
                                        <p className="text-sm text-secondary-600 leading-loose mt-2">
                                            {reason.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="relative">
                            {/* Main Card */}
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
                                <div className="text-center mb-8">
                                    <div className="text-6xl font-display font-bold mb-2">
                                        {trustCount !== null ? trustCount : '-'}
                                    </div>
                                    <p className="text-primary-100">ธุรกิจไว้วางใจ</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold">99.9%</div>
                                        <p className="text-sm text-primary-100">Uptime</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold">2 ชม.</div>
                                        <p className="text-sm text-primary-100">Response</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold">24/7</div>
                                        <p className="text-sm text-primary-100">Monitoring</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold">100%</div>
                                        <p className="text-sm text-primary-100">Satisfaction</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium text-secondary-900">SSL Secured</span>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-primary-600" />
                                    </div>
                                    <span className="text-sm font-medium text-secondary-900">Fast Loading</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
