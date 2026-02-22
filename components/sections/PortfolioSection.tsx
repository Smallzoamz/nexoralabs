'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
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

export function PortfolioSection() {
    const [portfolios, setPortfolios] = useState<PortfolioItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPortfolios() {
            try {
                // Fetch top 6 active portfolios ordered by admin's sequence
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('is_active', true)
                    .order('order', { ascending: true })
                    .limit(6)

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

    if (isLoading || portfolios.length === 0) {
        return null // Don't render section if there's no data
    }

    return (
        <section className="py-24 bg-white relative overflow-hidden" id="portfolio">
            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-6">
                            ผลงานของเรา
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6 leading-tight">
                            ความสำเร็จของลูกค้า <br className="hidden sm:block" />
                            <span className="text-secondary-500">คือความภูมิใจของเรา</span>
                        </h2>
                        <p className="text-lg text-secondary-600 leading-relaxed">
                            ส่วนหนึ่งของผลงานที่เราได้มีโอกาสร่วมพัฒนาและออกแบบ เพื่อยกระดับธุรกิจให้ก้าวทันโลกดิจิทัล
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/portfolio" className="btn-outline inline-flex items-center group">
                            ดูผลงานทั้งหมด
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolios.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group rounded-2xl overflow-hidden bg-secondary-50 border border-secondary-100/50 block shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            {/* Image Container */}
                            <div className="aspect-[4/3] w-full relative overflow-hidden border-b border-secondary-100">
                                <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-transparent transition-colors z-10" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-700 ease-out"
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

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                                        {item.category || 'Website'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-secondary-600 text-sm line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
