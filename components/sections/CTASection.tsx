'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { t, tr } from '@/lib/translations'

export function CTASection() {
    const { lang } = useLanguage()

    return (
        <section className="bg-primary-800">
            <div className="container-custom py-12 md:py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                            {tr(t.cta.title, lang)}
                        </h2>
                        <p className="text-primary-200 text-sm md:text-base">
                            {tr(t.cta.subtitle, lang)}
                        </p>
                    </div>
                    <Link href="#contact"
                        className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-primary-700 bg-white rounded-full hover:bg-primary-50 transition-all shadow-lg whitespace-nowrap group flex-shrink-0">
                        {tr(t.cta.button, lang)}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
