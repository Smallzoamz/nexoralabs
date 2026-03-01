'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language-context'
import { t, tr } from '@/lib/translations'

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
    const { lang } = useLanguage()

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

    const fb = t.hero.fallback
    const highlights = t.hero.highlights[lang]

    // Use DB data for TH, fallback translations for EN
    const title = heroData && lang === 'th' ? heroData.title : tr(fb.title, lang)
    const description = heroData && lang === 'th' ? heroData.description : tr(fb.description, lang)
    const primaryCta = heroData && lang === 'th' ? heroData.primary_cta_text : tr(fb.primaryCta, lang)
    const secondaryCta = heroData && lang === 'th' ? heroData.secondary_cta_text : tr(fb.secondaryCta, lang)
    const primaryLink = heroData?.primary_cta_link || '#contact'
    const secondaryLink = heroData?.secondary_cta_link || '#packages'

    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
            <div className="absolute inset-0 hero-gradient" />
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0,80 C360,120 1080,40 1440,80 L1440,120 L0,120 Z" fill="white" />
            </svg>
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="container-custom relative z-10 py-20 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-display font-bold text-white leading-tight mb-6"
                        >
                            {title.split('\n').map((line, index, arr) => (
                                <span key={index}>{line}{index < arr.length - 1 && <br />}</span>
                            ))}
                        </motion.h1>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="text-base sm:text-lg text-primary-100 leading-relaxed mb-8 max-w-lg">
                            {description}
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 mb-10">
                            <Link href={primaryLink}
                                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-primary-700 bg-white rounded-full hover:bg-primary-50 transition-all shadow-lg group">
                                {primaryCta}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href={secondaryLink}
                                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white border-2 border-white/40 rounded-full hover:bg-white/10 transition-all">
                                {secondaryCta}
                            </Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-x-6 gap-y-3">
                            {highlights.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-primary-100">
                                    <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
                        className="relative hidden lg:block">
                        <div className="relative">
                            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-white/20">
                                <div className="bg-secondary-100 px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-secondary-400 text-center ml-2">yourwebsite.com</div>
                                </div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" alt="Web Development" className="w-full h-auto object-cover aspect-[16/10]" />
                            </div>
                            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg border border-secondary-100 p-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-secondary-900">{tr(t.hero.readyBadge, lang)}</p>
                                        <p className="text-[11px] text-secondary-500">{tr(t.hero.responseBadge, lang)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {badges.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-white z-20">
                    <div className="container-custom py-6">
                        <div className="flex items-center justify-center gap-8 flex-wrap opacity-50">
                            {badges.map((badge) => {
                                const content = (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={badge.image_url} alt={badge.name} className="h-full w-auto object-contain" />
                                )
                                if (badge.website_url) {
                                    return (
                                        <a key={badge.id} href={badge.website_url.startsWith('http') ? badge.website_url : `https://${badge.website_url}`}
                                            target="_blank" rel="noopener noreferrer" className="h-7 max-w-[100px] grayscale hover:grayscale-0 transition-all duration-300">
                                            {content}
                                        </a>
                                    )
                                }
                                return (<div key={badge.id} className="h-7 max-w-[100px] grayscale hover:grayscale-0 transition-all duration-300">{content}</div>)
                            })}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
