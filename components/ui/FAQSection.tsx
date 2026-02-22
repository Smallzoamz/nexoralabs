'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircleQuestion } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface FAQ {
    id: string
    question: string
    answer: string
    sort_order: number
}

export function FAQSection() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchFaqs() {
            try {
                const { data, error } = await supabase
                    .from('faqs')
                    .select('id, question, answer, sort_order')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true })

                if (error) throw error
                setFaqs(data || [])
            } catch (err) {
                console.error("Error fetching FAQs:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchFaqs()
    }, [])

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    if (isLoading) {
        return (
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            </section>
        )
    }

    // Don't render if there are no FAQs to show
    if (faqs.length === 0) return null

    return (
        <section className="py-24 bg-secondary-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-secondary-200 text-sm font-medium text-secondary-600 mb-6 shadow-sm"
                    >
                        <MessageCircleQuestion className="w-4 h-4 text-primary-600" />
                        ไขข้อข้องใจ
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold font-display text-secondary-900 mb-6"
                    >
                        คำถามที่<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">พบบ่อย</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-secondary-600 max-w-2xl mx-auto"
                    >
                        ทุกข้อสงสัยเกี่ยวกับบริการทำเว็บไซต์ เรามีคำตอบให้คุณแล้วที่นี่
                        เพื่อให้คุณมั่นใจก่อนเริ่มต้นทำธุรกิจกับเรา
                    </motion.p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${isOpen ? 'border-primary-200 ring-4 ring-primary-50/50' : 'border-secondary-200 hover:border-primary-200'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <h3 className={`text-lg font-semibold pr-8 transition-colors ${isOpen ? 'text-primary-700' : 'text-secondary-900'
                                        }`}>
                                        {faq.question}
                                    </h3>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-primary-50' : 'bg-secondary-50'
                                        }`}>
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-600' : 'text-secondary-400'
                                            }`} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 pt-0 text-secondary-600 leading-relaxed whitespace-pre-wrap">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
