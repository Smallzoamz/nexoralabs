'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Sparkles, Monitor, Palette, ShoppingBag, Rocket, X, Eye, Smartphone, Tablet, Play } from 'lucide-react'

/* ─── Template Data ─── */
const categories = [
    { key: 'all', label: 'ทั้งหมด', labelEn: 'All', icon: Sparkles },
    { key: 'business', label: 'ธุรกิจ / องค์กร', labelEn: 'Business', icon: Monitor },
    { key: 'creative', label: 'สร้างสรรค์ / พอร์ตโฟลิโอ', labelEn: 'Creative', icon: Palette },
    { key: 'ecommerce', label: 'ร้านค้าออนไลน์', labelEn: 'E-Commerce', icon: ShoppingBag },
    { key: 'startup', label: 'สตาร์ทอัพ / เทคโนโลยี', labelEn: 'Startup', icon: Rocket },
]

interface Template {
    id: string
    name: string
    nameEn: string
    description: string
    category: string
    image: string
    tags: string[]
    color: string
    demoUrl?: string
}

const templates: Template[] = [
    // Business
    {
        id: 'biz-corporate-classic',
        name: 'Corporate Classic',
        nameEn: 'Corporate Classic',
        description: 'ดีไซน์เรียบหรู เหมาะกับบริษัท องค์กร และธุรกิจที่ต้องการภาพลักษณ์มืออาชีพ',
        category: 'business',
        image: '/showcase/biz-corporate-classic.png',
        tags: ['Professional', 'Clean', 'Corporate'],
        color: 'from-blue-600 to-blue-800',
        demoUrl: '/showcase/demo/corporate-classic',
    },
    {
        id: 'biz-consulting-dark',
        name: 'Consulting Dark',
        nameEn: 'Consulting Dark',
        description: 'ธีมมืดที่ดูทันสมัยและน่าเชื่อถือ เหมาะสำหรับที่ปรึกษาและ Agency',
        category: 'business',
        image: '/showcase/biz-consulting-dark.png',
        tags: ['Dark', 'Bold', 'Glassmorphism'],
        color: 'from-purple-600 to-indigo-800',
    },
    {
        id: 'biz-minimal-green',
        name: 'Green Minimal',
        nameEn: 'Green Minimal',
        description: 'สไตล์มินิมอลสะอาดตา เน้นความเป็นมิตรกับสิ่งแวดล้อม',
        category: 'business',
        image: '/showcase/biz-minimal-green.png',
        tags: ['Minimal', 'Eco-Friendly', 'Soft'],
        color: 'from-emerald-500 to-green-700',
    },
    // Creative
    {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        nameEn: 'Creative Portfolio',
        description: 'เลย์เอาท์แบบอสมมาตรสุดครีเอทีฟ เหมาะกับช่างภาพ ดีไซเนอร์ ศิลปิน',
        category: 'creative',
        image: '/showcase/creative-portfolio.png',
        tags: ['Vibrant', 'Artistic', 'Gradient'],
        color: 'from-pink-500 to-orange-500',
    },
    {
        id: 'creative-agency',
        name: 'Playful Agency',
        nameEn: 'Playful Agency',
        description: 'Bento Grid แบบสนุกสนานแต่มืออาชีพ พร้อมไอคอน 3D',
        category: 'creative',
        image: '/showcase/creative-agency.png',
        tags: ['Bento', 'Pastel', '3D Icons'],
        color: 'from-violet-500 to-fuchsia-500',
    },
    {
        id: 'creative-studio-mono',
        name: 'Mono Studio',
        nameEn: 'Mono Studio',
        description: 'สไตล์ขาว-ดำเน้น Typography ระดับนิตยสาร ดูหรูหราเหนือระดับ',
        category: 'creative',
        image: '/showcase/creative-studio-mono.png',
        tags: ['Monochrome', 'Editorial', 'Serif'],
        color: 'from-gray-700 to-gray-900',
    },
    // E-commerce
    {
        id: 'ecom-fashion',
        name: 'Luxury Fashion',
        nameEn: 'Luxury Fashion',
        description: 'ร้านค้าแฟชันหรูหรา โทนสีนุ่มนวล ดูแพงและน่าช้อป',
        category: 'ecommerce',
        image: '/showcase/ecom-fashion.png',
        tags: ['Luxury', 'Beige', 'Elegant'],
        color: 'from-amber-600 to-yellow-800',
        demoUrl: '/showcase/demo/luxury-fashion',
    },
    {
        id: 'ecom-tech-gadgets',
        name: 'Tech Gadgets',
        nameEn: 'Tech Gadgets',
        description: 'ร้านขายอุปกรณ์เทค ธีมมืดสุดล้ำ พร้อม Neon Accents',
        category: 'ecommerce',
        image: '/showcase/ecom-tech-gadgets.png',
        tags: ['Dark', 'Neon', 'Futuristic'],
        color: 'from-cyan-500 to-blue-700',
    },
    {
        id: 'ecom-food-organic',
        name: 'Food & Organic',
        nameEn: 'Food & Organic',
        description: 'ร้านอาหารออนไลน์ ดีไซน์สดใส อบอุ่น ดึงดูดสายทานอาหารคลีน',
        category: 'ecommerce',
        image: '/showcase/ecom-food-organic.png',
        tags: ['Fresh', 'Warm', 'Organic'],
        color: 'from-orange-500 to-green-600',
    },
    // Startup
    {
        id: 'startup-saas',
        name: 'SaaS Platform',
        nameEn: 'SaaS Platform',
        description: 'Landing Page สำหรับ SaaS พร้อม Pricing, Dashboard Preview แบบมืออาชีพ',
        category: 'startup',
        image: '/showcase/startup-saas.png',
        tags: ['SaaS', 'Gradient', 'Modern'],
        color: 'from-indigo-600 to-violet-700',
    },
    {
        id: 'startup-fintech',
        name: 'Fintech Trust',
        nameEn: 'Fintech Trust',
        description: 'เว็บไซต์ Fintech ที่สร้างความน่าเชื่อถือ พร้อมกราฟและ Trust Badges',
        category: 'startup',
        image: '/showcase/startup-fintech.png',
        tags: ['Finance', 'Trust', 'Dark'],
        color: 'from-emerald-600 to-teal-800',
    },
    {
        id: 'startup-ai-tech',
        name: 'AI & Deep Tech',
        nameEn: 'AI & Deep Tech',
        description: 'เว็บ AI/Tech สุดล้ำ เน้น Neural Network Visual พร้อมโทนสี Cyberpunk',
        category: 'startup',
        image: '/showcase/startup-ai-tech.png',
        tags: ['AI', 'Cyberpunk', 'Futuristic'],
        color: 'from-purple-600 to-cyan-600',
        demoUrl: '/showcase/demo/dark-tech',
    },
]

/* ─── Page Component ─── */
type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export default function ShowcasePage() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')

    const filtered = activeCategory === 'all'
        ? templates
        : templates.filter(t => t.category === activeCategory)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-secondary-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">กลับหน้าหลัก</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-600" />
                        <span className="font-bold text-secondary-800">Template Showcase</span>
                    </div>
                    <Link href="/#contact" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                        <ExternalLink className="w-3.5 h-3.5" />
                        ปรึกษาเรา
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="py-16 sm:py-20 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                        <Palette className="w-4 h-4" />
                        Template Gallery
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-900 mb-4 leading-tight">
                        เลือกสไตล์เว็บไซต์<br className="sm:hidden" />
                        <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">ที่ใช่สำหรับคุณ</span>
                    </h1>
                    <p className="text-secondary-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        รวมตัวอย่างดีไซน์เว็บไซต์กว่า {templates.length} แบบ ครอบคลุมทุกประเภทธุรกิจ<br className="hidden sm:block" />
                        เลือกแบบที่ถูกใจ แล้วให้ทีมเราออกแบบเว็บไซต์ในฝันให้คุณ
                    </p>
                </motion.div>
            </section>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(c => {
                        const Icon = c.icon
                        const isActive = activeCategory === c.key
                        return (
                            <button
                                key={c.key}
                                onClick={() => setActiveCategory(c.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${isActive
                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                                    : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {c.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Template Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((t, i) => (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.35, delay: i * 0.06 }}
                                className="group bg-white rounded-2xl border border-secondary-200/60 overflow-hidden hover:shadow-xl hover:shadow-secondary-200/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedTemplate(t)}
                            >
                                {/* Image */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={t.image}
                                        alt={t.name}
                                        fill
                                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-secondary-800 rounded-lg text-xs font-medium">
                                            <Eye className="w-3.5 h-3.5" />
                                            ดูตัวอย่าง
                                        </span>
                                        {t.demoUrl && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600/90 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
                                                <Play className="w-3 h-3" />
                                                Live Demo
                                            </span>
                                        )}
                                    </div>
                                    {/* Category badge */}
                                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-r ${t.color} shadow-sm`}>
                                        {categories.find(c => c.key === t.category)?.labelEn}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="font-bold text-secondary-800 text-lg mb-1.5">{t.name}</h3>
                                    <p className="text-secondary-500 text-sm leading-relaxed mb-3 line-clamp-2">{t.description}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {t.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-0.5 bg-secondary-100 text-secondary-600 rounded-full text-[11px] font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* CTA Bottom */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-violet-600 text-center px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">ชอบแบบไหน? บอกเราได้เลย</h2>
                <p className="text-white/80 mb-8 max-w-lg mx-auto">ทีมเราพร้อมออกแบบเว็บไซต์ตามสไตล์ที่คุณเลือก ปรับแต่งได้ทุกรายละเอียด</p>
                <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-lg shadow-primary-900/20"
                >
                    ติดต่อเราเลย
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </section>

            {/* Preview Modal */}
            <AnimatePresence>
                {selectedTemplate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gray-900/90 border-b border-gray-700/50 shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm text-white truncate">{selectedTemplate.name}</h3>
                                    <p className="text-xs text-gray-400 truncate hidden sm:block">{selectedTemplate.description}</p>
                                </div>
                            </div>

                            {/* Device Toggle */}
                            {selectedTemplate.demoUrl && (
                                <div className="flex items-center gap-1 bg-gray-800 rounded-xl p-1">
                                    {[
                                        { mode: 'desktop' as DeviceMode, icon: Monitor, label: 'Desktop' },
                                        { mode: 'tablet' as DeviceMode, icon: Tablet, label: 'Tablet' },
                                        { mode: 'mobile' as DeviceMode, icon: Smartphone, label: 'Mobile' },
                                    ].map(d => (
                                        <button
                                            key={d.mode}
                                            onClick={() => setDeviceMode(d.mode)}
                                            title={d.label}
                                            className={`p-2 rounded-lg transition-all ${deviceMode === d.mode
                                                    ? 'bg-primary-600 text-white shadow-sm'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                }`}
                                        >
                                            <d.icon className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <Link
                                href="/#contact"
                                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors shadow-sm shrink-0"
                            >
                                สนใจแบบนี้
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Preview Area */}
                        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                            {selectedTemplate.demoUrl ? (
                                <div
                                    className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 h-full"
                                    style={{
                                        width: deviceMode === 'desktop' ? '100%' : deviceMode === 'tablet' ? '768px' : '375px',
                                        maxWidth: '100%',
                                    }}
                                >
                                    <iframe
                                        src={selectedTemplate.demoUrl}
                                        className="w-full h-full border-0"
                                        title={`${selectedTemplate.name} Preview`}
                                    />
                                </div>
                            ) : (
                                <div className="max-w-4xl w-full max-h-full overflow-y-auto rounded-xl">
                                    <Image
                                        src={selectedTemplate.image}
                                        alt={selectedTemplate.name}
                                        width={1920}
                                        height={1080}
                                        className="w-full h-auto rounded-xl"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer Tags */}
                        <div className="px-4 sm:px-6 py-3 bg-gray-900/90 border-t border-gray-700/50 flex items-center justify-between shrink-0">
                            <div className="flex flex-wrap gap-1.5">
                                {selectedTemplate.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-0.5 bg-gray-800 text-gray-300 rounded-full text-[11px] font-medium border border-gray-700">{tag}</span>
                                ))}
                            </div>
                            <div className="text-xs text-gray-500">
                                {selectedTemplate.demoUrl ? (
                                    <span className="flex items-center gap-1.5"><Play className="w-3 h-3 text-green-400" /> Interactive Demo</span>
                                ) : (
                                    <span className="flex items-center gap-1.5"><Eye className="w-3 h-3" /> Static Preview</span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
