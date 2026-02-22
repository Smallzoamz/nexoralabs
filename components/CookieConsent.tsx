'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Cookie, Settings, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface CookiePreferences {
    necessary: boolean
    analytics: boolean
    marketing: boolean
    preferences: boolean
}

const cookieTypes = [
    {
        id: 'necessary',
        name: 'คุกกี้ที่จำเป็น',
        description: 'จำเป็นต่อการทำงานของเว็บไซต์ ไม่สามารถปิดได้',
        required: true,
    },
    {
        id: 'analytics',
        name: 'คุกกี้วิเคราะห์',
        description: 'ช่วยให้เราเข้าใจว่าผู้เยี่ยมชมใช้งานเว็บไซต์อย่างไร',
        required: false,
    },
    {
        id: 'preferences',
        name: 'คุกกี้การตั้งค่า',
        description: 'จดจำการตั้งค่าและการเลือกของคุณ',
        required: false,
    },
    {
        id: 'marketing',
        name: 'คุกกี้การตลาด',
        description: 'ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับคุณ',
        required: false,
    },
]

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
    })

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent')
        let timer: NodeJS.Timeout

        if (!consent) {
            // Show banner after a short delay
            timer = setTimeout(() => setIsVisible(true), 1000)
        }

        const handleReopen = () => {
            setIsVisible(true)
            setShowDetails(true)
        }

        window.addEventListener('open-cookie-settings', handleReopen)

        return () => {
            if (timer) clearTimeout(timer)
            window.removeEventListener('open-cookie-settings', handleReopen)
        }
    }, [])

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
        }
        savePreferences(allAccepted)
    }

    const handleRejectAll = () => {
        const onlyNecessary = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
        }
        savePreferences(onlyNecessary)
    }

    const handleSavePreferences = () => {
        savePreferences(preferences)
    }

    const savePreferences = async (prefs: CookiePreferences) => {
        try {
            // Generate or retrieve a simple session ID
            let sessionId = localStorage.getItem('session_id')
            if (!sessionId) {
                sessionId = crypto.randomUUID()
                localStorage.setItem('session_id', sessionId)
            }

            // Save to LocalStorage for fast client-side checks
            localStorage.setItem('cookie-consent', JSON.stringify(prefs))
            localStorage.setItem('cookie-consent-date', new Date().toISOString())

            // Save to Supabase Database
            const { error } = await supabase
                .from('cookie_preferences')
                .insert([
                    {
                        session_id: sessionId,
                        necessary: prefs.necessary,
                        analytics: prefs.analytics,
                        marketing: prefs.marketing,
                        preferences: prefs.preferences,
                        user_agent: navigator.userAgent
                    }
                ])

            if (error) {
                console.error('Failed to save cookie preferences to DB:', error)
            }

            setIsVisible(false)

            // Here you would typically initialize your analytics/marketing tools
            // based on the user's preferences
            if (prefs.analytics) {
                // Initialize analytics
            }
            if (prefs.marketing) {
                // Initialize marketing pixels
            }
        } catch (err) {
            console.error('Error saving preferences:', err)
            // Still hide banner even if DB save fails to not block user
            setIsVisible(false)
        }
    }

    const togglePreference = (id: string) => {
        if (id === 'necessary') return // Can't toggle necessary cookies
        setPreferences((prev) => ({
            ...prev,
            [id]: !prev[id as keyof CookiePreferences],
        }))
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="container-custom">
                        <div className="bg-white rounded-2xl shadow-2xl border border-secondary-100 overflow-hidden max-w-4xl mx-auto">
                            {!showDetails ? (
                                // Simple Banner
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                                                <Cookie className="w-6 h-6 text-primary-600" />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-display font-semibold text-lg text-secondary-900 mb-2">
                                                เราใช้คุกกี้บนเว็บไซต์นี้
                                            </h3>
                                            <p className="text-secondary-600 text-sm leading-relaxed mb-4">
                                                เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ วิเคราะห์การเข้าชมเว็บไซต์
                                                และแสดงเนื้อหาที่เกี่ยวข้องกับคุณ คุณสามารถเลือกประเภทคุกกี้ที่ต้องการยอมรับได้
                                                {' '}
                                                <Link href="/cookies" className="text-primary-600 hover:underline">
                                                    อ่านนโยบายคุกกี้
                                                </Link>
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 md:flex-shrink-0">
                                            <button
                                                onClick={() => setShowDetails(true)}
                                                className="btn-outline text-sm py-2 px-4"
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                ตั้งค่า
                                            </button>
                                            <button
                                                onClick={handleRejectAll}
                                                className="btn-secondary text-sm py-2 px-4"
                                            >
                                                ปฏิเสธทั้งหมด
                                            </button>
                                            <button
                                                onClick={handleAcceptAll}
                                                className="btn-primary text-sm py-2 px-4"
                                            >
                                                ยอมรับทั้งหมด
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Detailed Settings
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-display font-semibold text-lg text-secondary-900">
                                            การตั้งค่าความเป็นส่วนตัว
                                        </h3>
                                        <button
                                            onClick={() => setShowDetails(false)}
                                            className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        {cookieTypes.map((type) => (
                                            <div
                                                key={type.id}
                                                className={cn(
                                                    'flex items-start gap-4 p-4 rounded-xl transition-colors',
                                                    type.required ? 'bg-secondary-50' : 'bg-white border border-secondary-100 hover:border-primary-200'
                                                )}
                                            >
                                                <button
                                                    onClick={() => togglePreference(type.id)}
                                                    disabled={type.required}
                                                    className={cn(
                                                        'flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
                                                        preferences[type.id as keyof CookiePreferences]
                                                            ? 'bg-primary-500 border-primary-500 text-white'
                                                            : 'border-secondary-300 text-transparent',
                                                        type.required && 'cursor-not-allowed opacity-60'
                                                    )}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-secondary-900">{type.name}</h4>
                                                        {type.required && (
                                                            <span className="text-xs px-2 py-0.5 bg-secondary-200 text-secondary-600 rounded-full">
                                                                จำเป็น
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-secondary-500 mt-1">{type.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                        <button
                                            onClick={() => setShowDetails(false)}
                                            className="btn-outline text-sm py-2 px-4"
                                        >
                                            ย้อนกลับ
                                        </button>
                                        <button
                                            onClick={handleRejectAll}
                                            className="btn-secondary text-sm py-2 px-4"
                                        >
                                            ปฏิเสธทั้งหมด
                                        </button>
                                        <button
                                            onClick={handleSavePreferences}
                                            className="btn-primary text-sm py-2 px-4"
                                        >
                                            บันทึกการตั้งค่า
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
