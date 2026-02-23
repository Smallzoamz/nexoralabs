'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    FileText,
    Menu,
    X,
    ChevronRight,
    Activity,
    CreditCard,
    Headset
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { ClientDashboardView } from '@/components/client/ClientDashboardView'
import { ClientInvoicesView } from '@/components/client/ClientInvoicesView'
import { ClientBackupsView } from '@/components/client/ClientBackupsView'
import { ClientSupportView } from '@/components/client/ClientSupportView'
import { ClientContractsView } from '@/components/client/ClientContractsView'

const menuGroups = [
    {
        title: 'ภาพรวมระบบ',
        items: [
            { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
            { id: 'projects', label: 'สถานะโปรเจกต์', icon: Activity },
            { id: 'backups', label: 'คลังข้อมูลสำรอง', icon: FileText },
        ]
    },
    {
        title: 'การเงินและเอกสาร',
        items: [
            { id: 'invoices', label: 'ใบแจ้งหนี้ / ประวัติชำระเงิน', icon: CreditCard },
            { id: 'contracts', label: 'เอกสารสัญญา', icon: FileText },
        ]
    },
    {
        title: 'ความช่วยเหลือ',
        items: [
            { id: 'support', label: 'แจ้งซ่อม (Support Ticket)', icon: Headset },
        ]
    }
]

const allMenuItems = menuGroups.flatMap(group => group.items)

export default function ClientPage() {
    const [activeMenu, setActiveMenu] = useState('dashboard')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return <ClientDashboardView />
            case 'projects':
                return <ClientDashboardView /> // Reusing dashboard for project tracking as designed
            case 'backups':
                return <ClientBackupsView />
            case 'invoices':
                return <ClientInvoicesView />
            case 'contracts':
                return <ClientContractsView />
            case 'support':
                return <ClientSupportView />
            default:
                return (
                    <div className="p-6 bg-white rounded-2xl border border-dashed border-gray-200 text-center text-gray-500 py-20">
                        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">กำลังพัฒนาระบบนี้</h3>
                        <p>อดใจรอก่อน ระบบในส่วนนี้กำลังเตรียมพร้อมให้บริการ</p>
                    </div>
                )
        }
    }

    return (
        <div className="flex bg-gray-50 flex-1 min-h-[calc(100vh-73px)] relative w-full overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-73px)] sticky top-[73px] z-30"
            >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <span className="font-semibold text-gray-800">เมนูหลัก</span>
                        </motion.div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {menuGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-1">
                            {isSidebarOpen && (
                                <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    {group.title}
                                </div>
                            )}
                            {group.items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveMenu(item.id)}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all',
                                        activeMenu === item.id
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 flex-shrink-0", activeMenu === item.id ? "text-indigo-600" : "text-gray-400")} />
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {isSidebarOpen && activeMenu === item.id && (
                                        <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 w-full flex flex-col min-w-0">
                {/* Header */}
                <div className="px-8 py-6 bg-white border-b border-gray-100 sticky top-0 z-20">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {allMenuItems.find((item) => item.id === activeMenu)?.label || 'แดชบอร์ด'}
                    </h1>
                </div>

                {/* Body */}
                <main className="p-8 overflow-y-auto flex-1 h-full w-full">
                    <motion.div
                        key={activeMenu}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        {renderContent()}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
