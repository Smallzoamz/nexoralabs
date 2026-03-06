'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SiteSettings } from '@/components/admin/SiteSettings'
import { SEOSettings } from '@/components/admin/SEOSettings'
import { EmailTemplateManager } from '@/components/admin/EmailTemplateManager'
import UserManager from '@/components/admin/UserManager'
import { PaymentSettings } from '@/components/admin/PaymentSettings'
import { ActivityLogManager } from '@/components/admin/ActivityLogManager'
import { Settings, LineChart, Mail, Users, Landmark, Activity } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const tabs = [
    { id: 'site', label: 'เว็บไซต์หลัก', icon: Settings, roles: ['superadmin', 'admin', 'demo'] },
    { id: 'seo', label: 'SEO & Meta', icon: LineChart, roles: ['superadmin', 'admin', 'demo'] },
    { id: 'payment', label: 'การชำระเงิน', icon: Landmark, roles: ['superadmin', 'admin', 'demo'] },
    { id: 'templates', label: 'อีเมลอัตโนมัติ', icon: Mail, roles: ['superadmin', 'admin', 'demo'] },
    { id: 'users', label: 'ผู้ดูแลระบบ', icon: Users, roles: ['superadmin', 'admin', 'demo'] },
    { id: 'activity-log', label: 'ประวัติระบบ', icon: Activity, roles: ['superadmin', 'admin', 'demo'] },
]

export function SystemSettingsHub() {
    const { userRole } = useAuth()

    // Filter tabs based on role
    const allowedTabs = tabs.filter(tab => tab.roles.includes((userRole as string) || 'admin'))
    const [activeTab, setActiveTab] = useState(allowedTabs[0]?.id || 'site')

    const renderContent = () => {
        switch (activeTab) {
            case 'site': return <SiteSettings />
            case 'seo': return <SEOSettings />
            case 'payment': return <PaymentSettings />
            case 'templates': return <EmailTemplateManager />
            case 'users': return <UserManager />
            case 'activity-log': return <ActivityLogManager />
            default: return <SiteSettings />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4">การตั้งค่าระบบ (System Settings)</h1>

                {/* Custom Tab Navigation */}
                <div className="flex overflow-x-auto pb-2 -mb-2 no-scrollbar border-b border-slate-200">
                    <div className="flex gap-2">
                        {allowedTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all relative
                                    ${activeTab === tab.id
                                        ? 'text-primary-600 bg-white border-x border-t border-slate-200 shadow-[0_4px_0_0_white]'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'}
                                    font-medium text-sm whitespace-nowrap
                                `}
                                style={{ marginBottom: activeTab === tab.id ? '-1px' : '0', zIndex: activeTab === tab.id ? 10 : 1 }}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary-500' : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-slate-200 shadow-sm p-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
