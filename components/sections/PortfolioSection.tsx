'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language-context'
import { t, tr } from '@/lib/translations'

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
    const { lang } = useLanguage()

    useEffect(() => {
        async function fetchPortfolios() {
            try {
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
        return null
    }

    return (
        <section className="py-20 md:py-28 gradient-bg" id="portfolio">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
                        {tr(t.portfolio.title, lang)}
                    </h2>
                    <p className="text-secondary-500 leading-relaxed">
                        {tr(t.portfolio.subtitle, lang)}
                    </p>
                </motion.div>

                {/* Portfolio Grid — Thumbnail + Label */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolios.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            {/* Image Card */}
                            <div className="relative overflow-hidden rounded-xl border border-secondary-200 shadow-sm group-hover:shadow-lg transition-all duration-300">
                                {item.website_url ? (
                                    <a
                                        href={item.website_url.startsWith('http') ? item.website_url : `https://${item.website_url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-auto aspect-[4/3] object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </a>
                                ) : (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-auto aspect-[4/3] object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                            </div>

                            {/* Label below image */}
                            <div className="mt-4 text-center">
                                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                                    {item.title}
                                </h3>
                                {item.category && (
                                    <p className="text-sm text-secondary-400 mt-1">{item.category}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
