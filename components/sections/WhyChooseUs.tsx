'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Shield, Headphones, Zap, Code, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language-context'
import { t, tr } from '@/lib/translations'

const icons = [Clock, Shield, Headphones, Zap, Code, TrendingUp]

export function WhyChooseUs() {
    const [trustCount, setTrustCount] = useState<number | null>(null)
    const { lang } = useLanguage()

    useEffect(() => {
        async function fetchTrustCount() {
            try {
                const { count, error } = await supabase
                    .from('trust_badges')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true)
                if (error) throw error
                setTrustCount(count)
            } catch (error) {
                console.error('Error fetching trust badge count:', error)
            }
        }
        fetchTrustCount()
    }, [])

    const reasons = t.whyChooseUs.reasons
    const stats = t.whyChooseUs.stats

    return (
        <section className="py-20 md:py-28 bg-white">
            <div className="container-custom">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-14">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
                        {tr(t.whyChooseUs.title, lang)}
                    </h2>
                    <p className="text-secondary-500 leading-relaxed">
                        {tr(t.whyChooseUs.subtitle, lang)}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {reasons.map((reason, index) => {
                        const Icon = icons[index] || Clock
                        return (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                                className="flex gap-4 items-start">
                                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1.5">{tr(reason.title, lang)}</h3>
                                    <p className="text-sm text-secondary-500 leading-relaxed">{tr(reason.description, lang)}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {trustCount !== null && (
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="bg-primary-600 rounded-2xl p-8 text-white">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-1">{trustCount}+</div>
                                <p className="text-sm text-primary-100">{tr(stats.trusted, lang)}</p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-1">99.9%</div>
                                <p className="text-sm text-primary-100">{tr(stats.uptime, lang)}</p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-1">{tr(stats.responseValue, lang)}</div>
                                <p className="text-sm text-primary-100">{tr(stats.response, lang)}</p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-1">100%</div>
                                <p className="text-sm text-primary-100">{tr(stats.satisfaction, lang)}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
