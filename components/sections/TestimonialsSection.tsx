'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/language-context'
import { t, tr } from '@/lib/translations'

interface TestimonialData {
    id: string | number
    name: string
    position: string
    company: string
    content: string
    rating: number
    avatar: string | null
}

export function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const { lang } = useLanguage()

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const { data, error } = await supabase
                    .from('testimonials')
                    .select('*')
                    .eq('is_active', true)
                    .order('order', { ascending: true })
                if (error) throw error
                if (data && data.length > 0) {
                    const mappedData: TestimonialData[] = data.map((item: Record<string, unknown>) => ({
                        id: item.id as string | number,
                        name: item.client_name as string,
                        position: item.client_position as string,
                        company: item.client_company as string,
                        content: item.content as string,
                        rating: (item.rating as number) || 5,
                        avatar: item.avatar_url as string | null,
                    }))
                    setTestimonials(mappedData)
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error)
            }
        }
        fetchTestimonials()
    }, [])

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

    if (testimonials.length === 0) return null

    return (
        <section className="py-20 md:py-28 gradient-bg overflow-hidden">
            <div className="container-custom">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-14">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
                        {tr(t.testimonials.title, lang)}
                    </h2>
                    <p className="text-secondary-500 leading-relaxed">
                        {tr(t.testimonials.subtitle, lang)}
                    </p>
                </motion.div>

                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                            className="grid md:grid-cols-[1fr,auto] gap-8 items-center">
                            <div className="bg-white border border-secondary-200 rounded-2xl p-8 md:p-10 relative shadow-sm">
                                <div className="text-primary-200 mb-4"><Quote className="w-12 h-12" /></div>
                                <div className="flex gap-1 mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < testimonials[currentIndex].rating ? 'text-amber-400 fill-amber-400' : 'text-secondary-200'}`} />
                                    ))}
                                </div>
                                <p className="text-lg text-secondary-700 leading-relaxed mb-6">{testimonials[currentIndex].content}</p>
                                <div className="flex items-center gap-3 pt-5 border-t border-secondary-100">
                                    <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                                        {testimonials[currentIndex].name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-secondary-900">{testimonials[currentIndex].name}</h4>
                                        <p className="text-sm text-secondary-500">{testimonials[currentIndex].position} • {testimonials[currentIndex].company}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col items-center gap-4">
                                <div className="w-48 h-48 rounded-2xl bg-primary-100 flex items-center justify-center overflow-hidden">
                                    {testimonials[currentIndex].avatar ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={testimonials[currentIndex].avatar!} alt={testimonials[currentIndex].name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-6xl font-bold text-primary-300">{testimonials[currentIndex].name.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button onClick={prev} className="w-10 h-10 rounded-full bg-white border border-secondary-200 flex items-center justify-center text-secondary-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button key={index} onClick={() => setCurrentIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex ? 'bg-primary-500 w-7' : 'bg-secondary-300 hover:bg-secondary-400'}`}
                                    aria-label={`Go to testimonial ${index + 1}`} />
                            ))}
                        </div>
                        <button onClick={next} className="w-10 h-10 rounded-full bg-white border border-secondary-200 flex items-center justify-center text-secondary-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
