'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface PortfolioItem {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
    client_name: string | null;
    category: string | null;
    website_url: string | null;
}

export default function PortfolioPage() {
    const [portfolios, setPortfolios] = useState<PortfolioItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPortfolios() {
            try {
                // Fetch all active portfolios ordered by admin's sequence
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('is_active', true)
                    .order('order', { ascending: true })

                if (error) throw error
                setPortfolios(data || [])
            } catch (err) {
                console.error('Error fetching portfolios:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPortfolios()
    }, [])

    return (
        <div className="min-h-screen bg-secondary-50 pt-32 pb-24">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-secondary-500 hover:text-primary-600 mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            กลับหน้าหลัก
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
                            ผลงานของเรา
                        </h1>
                        <p className="text-lg text-secondary-600 max-w-2xl">
                            รวบรวมโปรเจกต์และเว็บไซต์ที่เราได้ร่วมพัฒนาให้เป็นส่วนหนึ่งในความสำเร็จของลูกค้า
                        </p>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-32">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                    </div>
                ) : portfolios.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {portfolios.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group rounded-2xl overflow-hidden bg-white border border-secondary-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                            >
                                {/* Image Container */}
                                <div className="aspect-[4/3] w-full relative overflow-hidden bg-secondary-100 shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />

                                    {/* Website Link Overlay */}
                                    {item.website_url && (
                                        <div className="absolute inset-0 bg-secondary-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-20 backdrop-blur-sm">
                                            <a
                                                href={item.website_url.startsWith('http') ? item.website_url : `https://${item.website_url}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-6 py-3 bg-white text-secondary-900 rounded-full font-medium inline-flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                เข้าชมเว็บไซต์จริง
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                                            {item.category || 'Website'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    {item.client_name && (
                                        <p className="text-sm font-medium text-secondary-500 mb-2">
                                            Client: {item.client_name}
                                        </p>
                                    )}
                                    <p className="text-secondary-600 text-sm leading-relaxed flex-1 mt-2 border-t border-secondary-100 pt-4">
                                        {item.description || 'เว็บไซต์คุณภาพสูง ออกแบบและพัฒนาโดยทีมงานมืออาชีพ'}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-secondary-300">
                        <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ImageIcon className="w-10 h-10 text-secondary-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                            เร็วๆ นี้
                        </h3>
                        <p className="text-secondary-500 max-w-md mx-auto">
                            เรากำลังปรับปรุงหน้าผลงานและจัดเตรียมกรณีศึกษาที่น่าสนใจมาให้คุณชม โปรดติดตาม!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
