'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Settings,
    FileText,
    Package,
    Users,
    MessageSquare,
    Menu,
    X,
    LogOut,
    ChevronRight,
    ShieldCheck,
    BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import { SiteSettings } from '@/components/admin/SiteSettings'
import { ContentManager } from '@/components/admin/ContentManager'
import { PackageManager } from '@/components/admin/PackageManager'
import { ContactManager } from '@/components/admin/ContactManager'
import { InvoiceManager } from '@/components/admin/InvoiceManager'
import { PaymentSettings } from '@/components/admin/PaymentSettings'
import TrustBadgeManager from '@/components/admin/TrustBadgeManager'
import ClientManager from '@/components/admin/ClientManager'
import { CreditCard, Landmark } from 'lucide-react'

const menuGroups = [
    {
        title: 'ภาพรวมระบบ',
        items: [
            { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
            { id: 'analytics', label: 'ดูรายงาน', icon: BarChart3 },
            { id: 'site', label: 'ตั้งค่าเว็บไซต์', icon: Settings },
        ]
    },
    {
        title: 'จัดการระบบ',
        items: [
            { id: 'content', label: 'จัดการเนื้อหา', icon: FileText },
            { id: 'packages', label: 'จัดการแพ็กเกจ', icon: Package },
            { id: 'trust-badges', label: 'โลโก้ลูกค้า', icon: ShieldCheck },
        ]
    },
    {
        title: 'ลูกค้าและรายได้',
        items: [
            { id: 'contacts', label: 'รายการติดต่อ', icon: MessageSquare },
            { id: 'clients', label: 'เว็บลูกค้าทั้งหมด', icon: Users },
            { id: 'invoices', label: 'ใบแจ้งหนี้', icon: CreditCard },
            { id: 'payment', label: 'ช่องทางการชำระเงิน', icon: Landmark },
        ]
    }
]

// Create a flat array for easy lookup (e.g., getting label by id)
const allMenuItems = menuGroups.flatMap(group => group.items)

export default function AdminPage() {
    const [activeMenu, setActiveMenu] = useState('dashboard')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return <AdminDashboard onNavigate={setActiveMenu} />
            case 'analytics':
                return <AnalyticsDashboard />
            case 'site':
                return <SiteSettings />
            case 'content':
                return <ContentManager />
            case 'packages':
                return <PackageManager />
            case 'contacts':
                return <ContactManager />
            case 'invoices':
                return <InvoiceManager />
            case 'payment':
                return <PaymentSettings />
            case 'trust-badges':
                return <TrustBadgeManager />
            case 'clients':
                return <ClientManager />
            default:
                return <AdminDashboard onNavigate={setActiveMenu} />
        }
    }

    return (
        <div className="min-h-screen bg-secondary-50 flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-secondary-900 text-white flex flex-col fixed h-full z-30"
            >
                {/* Logo */}
                <div className="p-4 border-b border-secondary-800 flex items-center justify-between">
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                                <span className="font-bold">W</span>
                            </div>
                            <span className="font-display font-bold">Admin Panel</span>
                        </motion.div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-secondary-800 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {menuGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-1">
                            {isSidebarOpen && (
                                <div className="px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2">
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
                                            ? 'bg-primary-500 text-white'
                                            : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 flex-shrink-0", activeMenu === item.id ? "text-white" : "text-secondary-400")} />
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-medium text-sm"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {isSidebarOpen && activeMenu === item.id && (
                                        <ChevronRight className="w-4 h-4 ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-secondary-800">
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-secondary-300 hover:bg-secondary-800 hover:text-white transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-medium">ออกจากระบบ</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div
                className={cn(
                    'flex-1 transition-all duration-300',
                    isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'
                )}
            >
                {/* Header */}
                <header className="bg-white border-b border-secondary-200 sticky top-0 z-20">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-display font-bold text-secondary-900">
                                {allMenuItems.find((item) => item.id === activeMenu)?.label || 'แดชบอร์ด'}
                            </h1>
                            <p className="text-sm text-secondary-500">
                                จัดการข้อมูลเว็บไซต์ของคุณ
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="font-bold text-primary-600">A</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-6">
                    <motion.div
                        key={activeMenu}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderContent()}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
