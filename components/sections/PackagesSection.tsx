'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Star, Zap, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface PackageFeature {
    text: string
    included: boolean
}

interface PackageData {
    id?: number
    name: string
    tier: string
    badge: string
    badgeColor?: string
    setupPrice: { min: number; max: number }
    monthlyPrice: { min: number; max: number }
    highlight: boolean
    features: PackageFeature[]
    suitable?: string
}

const defaultPackages: PackageData[] = [
    {
        name: 'Standard',
        tier: 'standard',
        badge: 'ธุรกิจเล็ก',
        badgeColor: 'bg-green-100 text-green-700',
        setupPrice: { min: 10000, max: 15000 },
        monthlyPrice: { min: 1800, max: 2500 },
        highlight: false,
        features: [
            { text: 'เว็บไซต์ + ระบบเก็บข้อมูล', included: true },
            { text: 'ฟอร์มลูกค้า', included: true },
            { text: 'Hosting + Supabase ดูแลให้', included: true },
            { text: 'Backup รายเดือน', included: true },
            { text: 'แก้ไขเล็กน้อย 2 ครั้ง/เดือน', included: true },
            { text: 'ตอบกลับภายในเวลาทำการ', included: true },
            { text: 'ระบบสมาชิก', included: false },
            { text: 'ระบบ Admin Panel', included: false },
            { text: 'Dashboard ดูข้อมูล', included: false },
            { text: 'Backup รายสัปดาห์', included: false },
            { text: 'Support เคสด่วน (ระบบล่ม)', included: false },
        ],
        suitable: 'เหมาะกับร้านทั่วไป',
    },
    {
        name: 'Pro',
        tier: 'pro',
        badge: 'ธุรกิจปานกลาง',
        badgeColor: 'bg-amber-100 text-amber-700',
        setupPrice: { min: 22000, max: 30000 },
        monthlyPrice: { min: 3000, max: 4000 },
        highlight: true,
        features: [
            { text: 'เว็บไซต์ + ระบบเก็บข้อมูล', included: true },
            { text: 'ฟอร์มลูกค้า', included: true },
            { text: 'Hosting + Supabase ดูแลให้', included: true },
            { text: 'Backup รายเดือน', included: true },
            { text: 'แก้ไขเล็กน้อย 2 ครั้ง/เดือน', included: true },
            { text: 'ตอบกลับภายในเวลาทำการ', included: true },
            { text: 'ระบบสมาชิก', included: true },
            { text: 'ระบบ Admin Panel', included: true },
            { text: 'Dashboard ดูข้อมูล', included: true },
            { text: 'Backup รายสัปดาห์', included: true },
            { text: 'Support เคสด่วน (ระบบล่ม)', included: true },
        ],
        suitable: 'เหมาะกับธุรกิจที่เริ่มจริงจัง',
    },
]

const formatPrice = (min: number, max: number) => {
    if (min === max) return `฿${min.toLocaleString()}`
    return `฿${min.toLocaleString()} – ฿${max.toLocaleString()}`
}

export function PackagesSection() {
    const [packages, setPackages] = useState<PackageData[]>([])

    useEffect(() => {
        async function fetchPackages() {
            try {
                const { data, error } = await supabase
                    .from('packages')
                    .select('*')
                    .eq('is_active', true)
                    .order('order', { ascending: true })

                if (error) throw error

                if (data && data.length > 0) {
                    const formattedPackages: PackageData[] = data.map((pkg: Record<string, unknown>) => ({
                        id: pkg.id as number,
                        name: pkg.name as string,
                        tier: pkg.tier as string,
                        badge: (pkg.badge as string) || 'แนะนำ',
                        badgeColor: pkg.highlight ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700',
                        setupPrice: { min: pkg.setup_price_min as number, max: pkg.setup_price_max as number },
                        monthlyPrice: { min: pkg.monthly_price_min as number, max: pkg.monthly_price_max as number },
                        highlight: pkg.highlight as boolean,
                        features: (pkg.features as string[] | undefined || []).map((f: string) => ({ text: f, included: true })),
                        suitable: ''
                    }))
                    setPackages(formattedPackages)
                }
            } catch (error) {
                console.error('Error fetching packages:', error)
            }
        }
        fetchPackages()
    }, [])

    const displayPackages = packages.length > 0 ? packages : defaultPackages

    return (
        <section id="packages" className="section-padding gradient-bg">
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
                        แพ็กเกจบริการ
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
                        เลือกแพ็กเกจที่
                        <span className="gradient-text">เหมาะกับคุณ</span>
                    </h2>
                    <p className="text-lg text-secondary-600 leading-loose mt-4">
                        แพ็กเกจที่ครบครัน พร้อมราคาที่เข้าถึงได้
                        เริ่มต้นธุรกิจออนไลน์ของคุณวันนี้
                    </p>
                </motion.div>

                {/* Packages Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {displayPackages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id || pkg.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                'relative rounded-2xl p-8 transition-all duration-300',
                                pkg.highlight
                                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-xl shadow-primary-500/25 scale-105'
                                    : 'bg-white border border-secondary-200 shadow-lg hover:shadow-xl'
                            )}
                        >
                            {/* Popular Badge */}
                            {pkg.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-1 px-4 py-1.5 bg-amber-400 text-amber-900 rounded-full text-sm font-medium">
                                        <Star className="w-4 h-4 fill-current" />
                                        แนะนำ
                                    </div>
                                </div>
                            )}

                            {/* Header */}
                            <div className="text-center mb-8">
                                <span className={cn(
                                    'inline-block px-3 py-1 rounded-full text-sm font-medium mb-3',
                                    pkg.highlight ? 'bg-white/20 text-white' : pkg.badgeColor
                                )}>
                                    {pkg.badge}
                                </span>
                                <h3 className={cn(
                                    'text-2xl font-display font-bold mb-2',
                                    pkg.highlight ? 'text-white' : 'text-secondary-900'
                                )}>
                                    แพ็กเกจ {pkg.name}
                                </h3>
                                <p className={cn(
                                    'text-sm',
                                    pkg.highlight ? 'text-white/80' : 'text-secondary-500'
                                )}>
                                    {pkg.suitable}
                                </p>
                            </div>

                            {/* Pricing */}
                            <div className="text-center mb-8 pb-8 border-b border-dashed border-secondary-200">
                                <div className="mb-4">
                                    <span className={cn(
                                        'text-sm',
                                        pkg.highlight ? 'text-white/70' : 'text-secondary-500'
                                    )}>
                                        Setup Fee
                                    </span>
                                    <div className={cn(
                                        'text-3xl font-display font-bold',
                                        pkg.highlight ? 'text-white' : 'text-secondary-900'
                                    )}>
                                        {formatPrice(pkg.setupPrice.min, pkg.setupPrice.max)}
                                    </div>
                                </div>
                                <div>
                                    <span className={cn(
                                        'text-sm',
                                        pkg.highlight ? 'text-white/70' : 'text-secondary-500'
                                    )}>
                                        รายเดือน
                                    </span>
                                    <div className={cn(
                                        'text-2xl font-display font-bold',
                                        pkg.highlight ? 'text-white' : 'text-secondary-900'
                                    )}>
                                        {formatPrice(pkg.monthlyPrice.min, pkg.monthlyPrice.max)}
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <div className={cn(
                                                'w-5 h-5 rounded-full flex items-center justify-center',
                                                pkg.highlight ? 'bg-white/20' : 'bg-primary-100'
                                            )}>
                                                <Check className={cn(
                                                    'w-3 h-3',
                                                    pkg.highlight ? 'text-white' : 'text-primary-600'
                                                )} />
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                'w-5 h-5 rounded-full flex items-center justify-center',
                                                pkg.highlight ? 'bg-white/10' : 'bg-secondary-100'
                                            )}>
                                                <X className={cn(
                                                    'w-3 h-3',
                                                    pkg.highlight ? 'text-white/50' : 'text-secondary-400'
                                                )} />
                                            </div>
                                        )}
                                        <span className={cn(
                                            'text-sm',
                                            feature.included
                                                ? (pkg.highlight ? 'text-white' : 'text-secondary-700')
                                                : (pkg.highlight ? 'text-white/50' : 'text-secondary-400')
                                        )}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <a
                                href="#contact"
                                className={cn(
                                    'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all',
                                    pkg.highlight
                                        ? 'bg-white text-primary-600 hover:bg-primary-50'
                                        : 'btn-primary'
                                )}
                            >
                                <Zap className="w-5 h-5" />
                                เลือกแพ็กเกจนี้
                            </a>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-6 bg-white rounded-xl shadow-lg border border-secondary-100">
                        <div className="flex items-center gap-2 text-secondary-600">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>เวลาทำการ: 09:00–18:00</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-secondary-200" />
                        <div className="flex items-center gap-2 text-secondary-600">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span>ระบบล่มทั้งระบบ: ตอบกลับภายใน 2 ชม.</span>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-8"
                >
                    <p className="text-secondary-600 mb-4">
                        ไม่แน่ใจว่าแพ็กเกจไหนเหมาะกับคุณ? ปรึกษาเราฟรี!
                    </p>
                    <a href="#contact" className="btn-secondary">
                        ปรึกษาฟรี
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
