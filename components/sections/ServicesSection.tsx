'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type IconName = keyof typeof LucideIcons

interface ServiceData {
    id: number
    icon: string
    title: string
    description: string
    features: string[]
    is_active: boolean
    order: number
}

const defaultServices: ServiceData[] = [
    {
        id: 1,
        icon: 'Palette',
        title: 'ออกแบบเว็บไซต์',
        description: 'ออกแบบเว็บไซต์ทันสมัย สวยงาม ตอบโจทย์ธุรกิจ รองรับทุกอุปกรณ์',
        features: ['Responsive Design', 'Modern UI/UX', 'Brand Identity'],
        is_active: true,
        order: 1
    },
    {
        id: 2,
        icon: 'Code',
        title: 'พัฒนาระบบ',
        description: 'พัฒนาเว็บไซต์ด้วยเทคโนโลยีล่าสุด Next.js, React รวดเร็วและปลอดภัย',
        features: ['Next.js', 'TypeScript', 'SEO Ready'],
        is_active: true,
        order: 2
    },
    {
        id: 3,
        icon: 'Server',
        title: 'Hosting & Database',
        description: 'ดูแล Hosting และ Database ด้วย Supabase พร้อม Backup อัตโนมัติ',
        features: ['Supabase', 'Auto Backup', 'SSL Certificate'],
        is_active: true,
        order: 3
    },
    {
        id: 4,
        icon: 'Shield',
        title: 'ความปลอดภัย',
        description: 'รักษาความปลอดภัยข้อมูล ป้องกันการโจมตี อัปเดตระบบอย่างสม่ำเสมอ',
        features: ['SSL/HTTPS', 'Security Update', 'Data Protection'],
        is_active: true,
        order: 4
    },
    {
        id: 5,
        icon: 'BarChart',
        title: 'SEO Optimization',
        description: 'เพิ่มโอกาสปรากฏบน Google ด้วย SEO ระดับมืออาชีพ',
        features: ['On-Page SEO', 'Technical SEO', 'Analytics'],
        is_active: true,
        order: 5
    },
    {
        id: 6,
        icon: 'Headphones',
        title: 'ซัพพอร์ตตลอดการใช้งาน',
        description: 'ทีมงานพร้อมให้ความช่วยเหลือ ตอบกลับภายในเวลาทำการ',
        features: ['Quick Response', 'Technical Support', 'Consultation'],
        is_active: true,
        order: 6
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
}

export function ServicesSection() {
    const [services, setServices] = useState<ServiceData[]>([])

    useEffect(() => {
        async function fetchServices() {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .eq('is_active', true)
                    .order('order', { ascending: true })

                if (error) throw error
                setServices(data || [])
            } catch (error) {
                console.error('Error fetching services:', error)
            }
        }
        fetchServices()
    }, [])

    const displayServices = services.length > 0 ? services : defaultServices

    return (
        <section id="services" className="section-padding bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                        บริการของเรา
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
                        บริการครบวงจร
                        <br />
                        <span className="gradient-text">สำหรับเว็บไซต์ธุรกิจคุณ</span>
                    </h2>
                    <p className="text-lg text-secondary-600 leading-loose mt-4">
                        เราให้บริการออกแบบ พัฒนา และดูแลเว็บไซต์ครบวงจร
                        ตั้งแต่เริ่มต้นจนถึงการดูแลระยะยาว
                    </p>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {displayServices.map((service) => {
                        const IconComponent = (LucideIcons[service.icon as IconName] || LucideIcons.HelpCircle) as React.ElementType

                        return (
                            <motion.div
                                key={service.id}
                                variants={itemVariants}
                                className="group card card-hover p-6 lg:p-8"
                            >
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-display font-semibold text-secondary-900 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-secondary-600 mb-6 leading-loose">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-2">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-secondary-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Hover Arrow */}
                                <div className="mt-6 pt-6 border-t border-secondary-100">
                                    <span className="inline-flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                                        เรียนรู้เพิ่มเติม
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className="text-secondary-600 mb-4">
                        ต้องการบริการเฉพาะด้าน? คุยกับเราได้เลย
                    </p>
                    <a href="#contact" className="btn-primary">
                        ปรึกษาฟรี
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
