'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, Facebook, X, MessageSquareHeart } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ContactLinks {
    social_line: string | null;
    social_facebook: string | null;
    contact_phone: string | null;
}

export function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false)
    const [links, setLinks] = useState<ContactLinks | null>(null)

    useEffect(() => {
        async function fetchLinks() {
            try {
                const { data } = await supabase
                    .from('site_config')
                    .select('social_line, social_facebook, contact_phone')
                    .limit(1)
                    .single()

                if (data) {
                    setLinks(data)
                }
            } catch (err) {
                console.error("Failed to fetch contact links for Widget:", err)
            }
        }
        fetchLinks()
    }, [])

    const toggleOpen = () => setIsOpen(!isOpen)

    // Helper to format LINE link properly. Simple string replace if they typed `@something`
    const getLineLink = (line: string | null) => {
        if (!line) return '#'
        if (line.startsWith('http')) return line
        if (line.startsWith('@')) return `https://line.me/R/ti/p/${line}`
        // Default assumption if they just put an ID
        return `https://line.me/R/ti/p/~${line}`
    }

    const getFbLink = (fb: string | null) => {
        if (!fb) return '#'
        // If it's a full URL, attempt to convert to messenger URL if needed or just return it
        // A common messenger link is m.me/pagename
        return fb
    }

    const getPhoneLink = (phone: string | null) => {
        if (!phone) return '#'
        // Strip non-numeric characters except +
        const cleaned = phone.replace(/[^\d+]/g, '')
        return `tel:${cleaned}`
    }

    // Animation Variants
    const menuVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 25,
                staggerChildren: 0.05,
                delayChildren: 0.05
            }
        },
        exit: { opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.8 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
    }

    // If no links are available at all, optionally don't render (or maybe still render empty for admin to see it works)
    if (!links) return null

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col gap-3 mb-4 items-end"
                    >
                        {/* LINE */}
                        {links.social_line && (
                            <motion.a
                                variants={itemVariants}
                                href={getLineLink(links.social_line)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3"
                            >
                                <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    คุยผ่าน LINE
                                </span>
                                <div className="w-12 h-12 rounded-full bg-[#00B900] text-white flex items-center justify-center shadow-lg hover:bg-[#009b00] transition-colors hover:scale-110 active:scale-95">
                                    <MessageSquareHeart className="w-6 h-6" />
                                </div>
                            </motion.a>
                        )}

                        {/* Messenger */}
                        {links.social_facebook && (
                            <motion.a
                                variants={itemVariants}
                                href={getFbLink(links.social_facebook)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3"
                            >
                                <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    ส่งข้อความ
                                </span>
                                <div className="w-12 h-12 rounded-full bg-[#0084FF] text-white flex items-center justify-center shadow-lg hover:bg-[#0073e6] transition-colors hover:scale-110 active:scale-95">
                                    <Facebook className="w-6 h-6" />
                                </div>
                            </motion.a>
                        )}

                        {/* Phone */}
                        {links.contact_phone && (
                            <motion.a
                                variants={itemVariants}
                                href={getPhoneLink(links.contact_phone)}
                                className="group flex items-center gap-3"
                            >
                                <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    โทรหาเรา
                                </span>
                                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors hover:scale-110 active:scale-95">
                                    <Phone className="w-5 h-5 fill-current" />
                                </div>
                            </motion.a>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                onClick={toggleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full text-white shadow-xl shadow-primary-500/30 flex items-center justify-center relative border border-white/20 z-10"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Bouncing notification dot */}
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping" />
                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
                            <MessageCircle className="w-6 h-6 fill-current" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}
