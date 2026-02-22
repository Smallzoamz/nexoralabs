'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'
import { ProjectTrackerModal } from '@/components/frontend/ProjectTrackerModal'

interface SiteConfig {
    site_name: string
    logo_url: string | null
}

const navigation = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'บริการ', href: '/#services' },
    { name: 'แพ็กเกจ', href: '/#packages' },
    { name: 'ผลงาน', href: '/portfolio' },
    { name: 'บทความ', href: '/articles' },
]

const policyLinks = [
    { name: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
    { name: 'ข้อกำหนดการใช้งาน', href: '/terms' },
    { name: 'นโยบายคุกกี้', href: '/cookies' },
]

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isPolicyOpen, setIsPolicyOpen] = useState(false)
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
    const { openProjectTracker, isProjectTrackerOpen, closeProjectTracker } = useModal()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        async function fetchSiteConfig() {
            try {
                const { data, error } = await supabase
                    .from('site_config')
                    .select('site_name, logo_url')
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
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-secondary-900/5'
                    : 'bg-transparent'
            )}
        >
            <nav className="container-custom">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center"
                        >
                            {siteConfig?.logo_url ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={siteConfig.logo_url}
                                    alt={siteConfig.site_name || "Logo"}
                                    className="h-14 md:h-18 w-auto object-contain"
                                />
                            ) : (
                                <Image
                                    src="/logos/navbar-logo.png"
                                    alt={siteConfig?.site_name || "Nexora Labs Logo"}
                                    width={200}
                                    height={60}
                                    className="h-14 md:h-18 w-auto object-contain"
                                    priority
                                />
                            )}
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 text-secondary-600 hover:text-primary-600 font-medium transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-3/4" />
                            </Link>
                        ))}

                        {/* Track Order Button */}
                        <button
                            onClick={openProjectTracker}
                            className="px-4 py-2 text-secondary-600 hover:text-primary-600 font-medium transition-colors relative group"
                        >
                            ติดตามงาน
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-3/4" />
                        </button>

                        {/* Policy Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsPolicyOpen(!isPolicyOpen)}
                                className="px-4 py-2 text-secondary-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
                            >
                                นโยบาย
                                <ChevronDown className={cn(
                                    'w-4 h-4 transition-transform',
                                    isPolicyOpen && 'rotate-180'
                                )} />
                            </button>

                            <AnimatePresence>
                                {isPolicyOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-secondary-100 overflow-hidden"
                                    >
                                        {policyLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                                onClick={() => setIsPolicyOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/admin" className="btn-outline text-sm py-2">
                            Admin
                        </Link>
                        <Link href="#contact" className="btn-primary text-sm py-2">
                            ปรึกษาฟรี
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-2 border-t border-secondary-100">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {/* Track Order Button (Mobile) */}
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false)
                                        openProjectTracker()
                                    }}
                                    className="block w-full text-left px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                >
                                    ติดตามงาน
                                </button>
                                <div className="pt-2 border-t border-secondary-100">
                                    <p className="px-4 py-2 text-xs text-secondary-400 uppercase tracking-wider">
                                        นโยบาย
                                    </p>
                                    {policyLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="block px-4 py-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="pt-4 px-4 space-y-2">
                                    <Link href="/admin" className="btn-outline w-full justify-center">
                                        Admin
                                    </Link>
                                    <Link href="#contact" className="btn-primary w-full justify-center">
                                        ปรึกษาฟรี
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Project Tracker Modal */}
            <ProjectTrackerModal isOpen={isProjectTrackerOpen} onClose={closeProjectTracker} />
        </header>
    )
}
