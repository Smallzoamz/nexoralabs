'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Sparkles, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const highlights = [
    'ออกแบบเว็บไซต์ทันสมัย',
    'ระบบ Admin จัดการเอง',
    'ดูแลโดยทีมมืออาชีพ',
]

interface HeroData {
    title: string
    subtitle: string
    description: string
    primary_cta_text: string
    primary_cta_link: string
    secondary_cta_text: string
    secondary_cta_link: string
}

interface TrustBadge {
    id: string
    name: string
    image_url: string
    website_url?: string
}

export function HeroSection() {
    const [heroData, setHeroData] = useState<HeroData | null>(null)
    const [badges, setBadges] = useState<TrustBadge[]>([])

    useEffect(() => {
        async function fetchHeroData() {
            try {
                const { data, error } = await supabase
                    .from('hero_section')
                    .select('*')
                    .limit(1)
                    .single()

                const { data: badgeData } = await supabase
                    .from('trust_badges')
                    .select('id, name, image_url, website_url')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true })

                if (error) throw error
                if (data) setHeroData(data)
                if (badgeData) setBadges(badgeData)
            } catch (error) {
                console.error('Error fetching hero data:', error)
            }
        }
        fetchHeroData()
    }, [])

    const displayData = heroData || {
        subtitle: 'บริการครบวงจรสำหรับ SME',
        title: 'ออกแบบและดูแล\nเว็บไซต์มืออาชีพ\nสำหรับธุรกิจคุณ',
        description: 'เริ่มต้นเว็บไซต์สำหรับธุรกิจของคุณ พร้อมระบบ Admin Panel จัดการเนื้อหาเองได้ง่าย ดูแลโดยทีมงานมืออาชีพ ราคาเริ่มต้นเพียง 10,000 บาท',
        primary_cta_text: 'ปรึกษาฟรี',
        primary_cta_link: '#contact',
        secondary_cta_text: 'ดูแพ็กเกจ',
        secondary_cta_link: '#packages'
    }

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 gradient-bg" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary-300/20 to-accent-300/20 rounded-full blur-3xl"
                />
            </div>

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>{displayData.subtitle}</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 leading-tight mb-6"
                        >
                            {displayData.title.split('\n').map((line, index, array) => (
                                <span key={index}>
                                    {index === 1 ? <span className="gradient-text">{line}</span> : line}
                                    {index < array.length - 1 && <br />}
                                </span>
                            ))}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg md:text-xl text-secondary-600 leading-relaxed mb-8 max-w-xl"
                        >
                            {displayData.description}
                        </motion.p>

                        {/* Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-4 mb-8"
                        >
                            {highlights.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-secondary-700">
                                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href={displayData.primary_cta_link || '#contact'} className="btn-primary group">
                                {displayData.primary_cta_text || 'ปรึกษาฟรี'}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href={displayData.secondary_cta_link || '#packages'} className="btn-secondary group">
                                <Play className="w-5 h-5 mr-2" />
                                {displayData.secondary_cta_text || 'ดูแพ็กเกจ'}
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        {badges.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="mt-12 pt-8 border-t border-secondary-200"
                            >
                                <p className="text-sm text-secondary-500 mb-4">
                                    ไว้วางใจโดยธุรกิจกว่า {badges.length} ราย
                                </p>
                                <div className="flex items-center gap-6 sm:gap-8 flex-wrap opacity-60">
                                    {badges.map((badge) => {
                                        const content = (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={badge.image_url}
                                                alt={badge.name}
                                                className="h-full w-auto object-contain"
                                            />
                                        )

                                        if (badge.website_url) {
                                            return (
                                                <a
                                                    key={badge.id}
                                                    href={badge.website_url.startsWith('http') ? badge.website_url : `https://${badge.website_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-8 max-w-[120px] relative grayscale hover:grayscale-0 transition-all duration-300"
                                                >
                                                    {content}
                                                </a>
                                            )
                                        }

                                        return (
                                            <div key={badge.id} className="h-8 max-w-[120px] relative grayscale hover:grayscale-0 transition-all duration-300">
                                                {content}
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative">
                            {/* Main Card */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative z-10 bg-white rounded-2xl shadow-2xl border border-secondary-100 overflow-hidden"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                                    alt="Web Development"
                                    className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                                />
                            </motion.div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-secondary-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-secondary-900">ระบบพร้อมใช้งาน</p>
                                        <p className="text-xs text-secondary-500">ตอบกลับภายใน 2 ชม.</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-secondary-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-secondary-900">Admin Panel</p>
                                        <p className="text-xs text-secondary-500">จัดการเองง่าย</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-secondary-300 flex items-start justify-center p-2"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-400" />
                </motion.div>
            </motion.div>
        </section>
    )
}
