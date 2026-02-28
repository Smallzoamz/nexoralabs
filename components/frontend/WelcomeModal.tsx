'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ShieldCheck } from 'lucide-react'

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check local storage to see if we've shown this before
        const hasSeenWelcome = localStorage.getItem('velozi_welcome_seen')
        if (!hasSeenWelcome) {
            // Slight delay to allow page initial render before popping modal
            const timer = setTimeout(() => {
                setIsOpen(true)
            }, 800)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        setIsOpen(false)
        localStorage.setItem('velozi_welcome_seen', 'true')
    }

    if (!mounted) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-secondary-950/70 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-white dark:bg-secondary-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-secondary-200 dark:border-secondary-800"
                    >
                        {/* Decorative Top Banner */}
                        <div className="h-3 w-full bg-gradient-to-r from-primary-500 overflow-hidden via-accent-500 to-primary-600" />

                        <div className="p-8 sm:p-10 text-center">
                            {/* Icon */}
                            <div className="mx-auto w-20 h-20 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 relative">
                                <AlertTriangle className="w-10 h-10 text-amber-500 dark:text-amber-400" />
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-secondary-900 rounded-full p-1 border-2 border-white dark:border-secondary-900">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-4 font-display">
                                ประกาศสำคัญจากทีมงาน<br /> <span className="text-primary-600 dark:text-primary-400">VELOZI | Dev</span>
                            </h2>

                            {/* Content */}
                            <div className="space-y-4 mb-8 text-secondary-600 dark:text-secondary-300 text-sm sm:text-base leading-relaxed">
                                <p>
                                    ทางเราขอสงวนสิทธิ์ <strong className="text-red-500 dark:text-red-400 font-semibold">ไม่รับงานพัฒนาเว็บไซต์ที่เกี่ยวข้องกับการพนัน เว็บไซต์ผิดกฎหมาย</strong> หรือแพลตฟอร์มใดๆ ที่อาจก่อให้เกิดความเสียหายต่อสังคมและภาพลักษณ์ขององค์กร
                                </p>
                                <p>
                                    ขอขอบคุณทุกท่านที่ให้ความไว้วางใจ<br className="hidden sm:block" />ในการใช้บริการของเรา
                                </p>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleAccept}
                                className="w-full py-3.5 px-6 bg-secondary-900 hover:bg-secondary-800 dark:bg-white dark:text-secondary-900 dark:hover:bg-secondary-100 text-white font-medium rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-secondary-900/20 active:translate-y-0"
                            >
                                รับทราบและเข้าสู่เว็บไซต์
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
