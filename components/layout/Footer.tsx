'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    MessageCircle,
    Instagram,
    Clock,
    ArrowUpRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'
import { ProjectTrackerModal } from '@/components/frontend/ProjectTrackerModal'

interface SiteConfig {
    site_name: string
    site_description: string
    logo_url: string | null
    contact_email: string | null
    contact_phone: string | null
    contact_address: string | null
    working_hours: string | null
    social_facebook: string | null
    social_line: string | null
    social_instagram: string | null
}

const footerLinks = {
    services: [
        { name: 'ออกแบบเว็บไซต์', href: '/#services' },
        { name: 'ดูแลเว็บไซต์', href: '/#services' },
        { name: 'ระบบ Admin Panel', href: '/#services' },
        { name: 'SEO Optimization', href: '/#services' },
    ],
    packages: [
        { name: 'Standard Package', href: '/#packages' },
        { name: 'Pro Package', href: '/#packages' },
        { name: 'เปรียบเทียบแพ็กเกจ', href: '/#packages' },
    ],
    policies: [
        { name: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
        { name: 'ข้อกำหนดการใช้งาน', href: '/terms' },
        { name: 'นโยบายคุกกี้', href: '/cookies' },
    ],
}

export function Footer() {
    const currentYear = new Date().getFullYear()
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
    const { openProjectTracker, isProjectTrackerOpen, closeProjectTracker } = useModal()

    useEffect(() => {
        async function fetchSiteConfig() {
            try {
                const { data, error } = await supabase
                    .from('site_config')
                    .select('*')
                    .single()

                if (error) throw error
                if (data) setSiteConfig(data)
            } catch (error) {
                console.error('Error fetching site config:', error)
            }
        }
        fetchSiteConfig()
    }, [])

    const activeSocialLinks = [
        { name: 'Facebook', icon: Facebook, href: siteConfig?.social_facebook || 'https://facebook.com' },
        { name: 'Line', icon: MessageCircle, href: siteConfig?.social_line || 'https://line.me' },
        { name: 'Instagram', icon: Instagram, href: siteConfig?.social_instagram || 'https://instagram.com' },
    ].filter(link => link.href && link.href !== '#' && link.href !== '')

    return (
        <footer className="bg-secondary-900 text-white">
            {/* Main Footer */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand & Contact */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-flex items-center mb-6">
                            {siteConfig?.logo_url ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={siteConfig.logo_url}
                                    alt={siteConfig.site_name || "Footer Logo"}
                                    className="w-16 h-16 object-contain"
                                />
                            ) : (
                                <Image
                                    src="/logos/footer-logo.png"
                                    alt={siteConfig?.site_name || "Nexora Labs Icon"}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 object-contain"
                                />
                            )}
                        </Link>

                        <p className="text-secondary-300 mb-6 leading-relaxed">
                            {siteConfig?.site_description || 'บริการออกแบบและดูแลเว็บไซต์มืออาชีพสำหรับธุรกิจขนาดเล็ก-กลาง พร้อมระบบ Admin Panel จัดการเองง่าย'}
                        </p>

                        <div className="space-y-3">
                            <a
                                href={`tel:${siteConfig?.contact_phone?.replace(/\s/g, '') || '+66XXXXXXXX'}`}
                                className="flex items-center gap-3 text-secondary-300 hover:text-primary-400 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                <span>{siteConfig?.contact_phone || '+66 XX XXX XXXX'}</span>
                            </a>
                            <a
                                href={`mailto:${siteConfig?.contact_email || 'contact@nexoralabs.com'}`}
                                className="flex items-center gap-3 text-secondary-300 hover:text-primary-400 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                <span>{siteConfig?.contact_email || 'contact@nexoralabs.com'}</span>
                            </a>
                            <div className="flex items-start gap-3 text-secondary-300">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>{siteConfig?.contact_address || 'กรุงเทพมหานคร, ประเทศไทย'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-secondary-300">
                                <Clock className="w-5 h-5" />
                                <span>{siteConfig?.working_hours || 'เวลาทำการ: 09:00 - 18:00 น.'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-display font-semibold text-lg mb-6">บริการของเรา</h3>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-secondary-300 hover:text-primary-400 transition-colors flex items-center gap-1 group"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={openProjectTracker}
                                    className="text-secondary-300 hover:text-primary-400 transition-colors flex items-center gap-1 group"
                                >
                                    ติดตามงาน
                                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Packages */}
                    <div>
                        <h3 className="font-display font-semibold text-lg mb-6">แพ็กเกจ</h3>
                        <ul className="space-y-3">
                            {footerLinks.packages.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-secondary-300 hover:text-primary-400 transition-colors flex items-center gap-1 group"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policies & Social */}
                    <div>
                        <h3 className="font-display font-semibold text-lg mb-6">นโยบาย</h3>
                        <ul className="space-y-3 mb-8">
                            {footerLinks.policies.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-secondary-300 hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        window.dispatchEvent(new Event('open-cookie-settings'))
                                    }}
                                    className="text-secondary-300 hover:text-primary-400 transition-colors text-left"
                                >
                                    ตั้งค่าคุกกี้
                                </button>
                            </li>
                        </ul>

                        <h3 className="font-display font-semibold text-lg mb-4">ติดตามเรา</h3>
                        <div className="flex gap-3">
                            {activeSocialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-lg bg-secondary-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
                                    title={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-secondary-800">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-secondary-400 text-sm text-center md:text-left">
                            © {currentYear} {siteConfig?.site_name || 'Nexora Labs'}. สงวนลิทธิ์ทุกประการ.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-secondary-400">
                            <span>กรณีระบบล่มทั้งระบบ ตอบกลับภายใน 2 ชม.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Tracker Modal */}
            <ProjectTrackerModal isOpen={isProjectTrackerOpen} onClose={closeProjectTracker} />
        </footer>
    )
}
