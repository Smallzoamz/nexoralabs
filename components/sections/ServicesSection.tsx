'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language-context'
import { t, tr } from '@/lib/translations'

type IconName = keyof typeof LucideIcons

interface ServiceData {
    id: number
    icon: string
    title: string
    description: string
    features: string[]
    is_active: boolean
    order: number
}

export function ServicesSection() {
    const [services, setServices] = useState<ServiceData[]>([])
    const { lang } = useLanguage()

    useEffect(() => {
        async function fetchServices() {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .eq('is_active', true)
                    .order('order', { ascending: true })

                if (error) throw error
                setServices(data || [])
            } catch (error) {
                console.error('Error fetching services:', error)
            }
        }
        fetchServices()
    }, [])

    const defaults = t.services.defaults

    return (
        <section id="services" className="py-20 md:py-28 bg-white">
            <div className="container-custom">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-14">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
                        {tr(t.services.title, lang)}
                    </h2>
                    <p className="text-secondary-500 leading-relaxed">
                        {tr(t.services.subtitle, lang)}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(services.length > 0 ? services : defaults.map((d, i) => ({
                        id: i + 1,
                        icon: d.icon,
                        title: tr(d.title, lang),
                        description: tr(d.description, lang),
                        features: [],
                        is_active: true,
                        order: i + 1
                    }))).map((service, index) => {
                        // For DB data in EN mode, try to find matching default translation
                        let title = service.title
                        let description = service.description
                        if (services.length > 0 && lang === 'en' && defaults[index]) {
                            title = tr(defaults[index].title, lang)
                            description = tr(defaults[index].description, lang)
                        }

                        const IconComponent = (LucideIcons[service.icon as IconName] || LucideIcons.HelpCircle) as React.ElementType

                        return (
                            <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                                className="group bg-white border border-secondary-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all duration-300">
                                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-200 transition-colors">
                                    <IconComponent className="w-7 h-7 text-primary-600" />
                                </div>
                                <h3 className="text-lg font-display font-semibold text-secondary-900 mb-2">{title}</h3>
                                <p className="text-sm text-secondary-500 leading-relaxed">{description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
