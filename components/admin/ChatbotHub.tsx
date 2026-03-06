'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatbotSettings } from '@/components/admin/ChatbotSettings'
import { ChatbotFAQManager } from '@/components/admin/ChatbotFAQManager'
import { ChatHistoryViewer } from '@/components/admin/ChatHistoryViewer'
import { Bot, BookOpen, History } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const tabs = [
    { id: 'settings', label: 'ตั้งค่าแชทบอท', icon: Bot, roles: ['superadmin', 'admin', 'demo'] },
    { id: 'faqs', label: 'สอนบอทตอบคำถาม', icon: BookOpen, roles: ['superadmin', 'admin', 'moderator', 'demo'] },
    { id: 'history', label: 'ประวัติการสนทนา', icon: History, roles: ['superadmin', 'admin', 'moderator', 'demo'] },
]

export function ChatbotHub() {
    const { userRole } = useAuth()

    // Filter tabs based on role
    const allowedTabs = tabs.filter(tab => tab.roles.includes((userRole as string) || 'admin'))
    const [activeTab, setActiveTab] = useState(allowedTabs[0]?.id || 'settings')

    const renderContent = () => {
        switch (activeTab) {
            case 'settings': return <ChatbotSettings />
            case 'faqs': return <ChatbotFAQManager />
            case 'history': return <ChatHistoryViewer />
            default: return <ChatbotSettings />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent border-b border-indigo-100 pb-4">ระบบแชทบอท AI (Chatbot Settings)</h1>

                {/* Custom Tab Navigation */}
                <div className="flex overflow-x-auto pb-2 -mb-2 no-scrollbar border-b border-indigo-100">
                    <div className="flex gap-2">
                        {allowedTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all relative
                                    ${activeTab === tab.id
                                        ? 'text-indigo-600 bg-white border-x border-t border-indigo-100 shadow-[0_4px_0_0_white]'
                                        : 'text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 border border-transparent'}
                                    font-medium text-sm whitespace-nowrap
                                `}
                                style={{ marginBottom: activeTab === tab.id ? '-1px' : '0', zIndex: activeTab === tab.id ? 10 : 1 }}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-500' : 'text-indigo-300'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-indigo-100 shadow-sm p-1">
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
