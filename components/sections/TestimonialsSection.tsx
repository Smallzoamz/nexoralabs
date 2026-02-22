'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface TestimonialData {
    id: string | number
    name: string
    position: string
    company: string
    content: string
    rating: number
    avatar: string | null
}

const defaultTestimonials: TestimonialData[] = [
    {
        id: 1,
        name: 'คุณสมชาย วิริยะกุล',
        position: 'เจ้าของร้าน',
        company: 'ร้านอาหารบ้านสมชาย',
        content: 'บริการดีมากครับ ทีมงานใส่ใจทุกรายละเอียด เว็บไซต์สวยและใช้งานง่าย ลูกค้าเข้ามาสั่งอาหารเพิ่มขึ้น 30% เลย',
        rating: 5,
        avatar: null,
    },
    {
        id: 2,
        name: 'คุณนภา สุขสันต์',
        position: 'ผู้จัดการ',
        company: 'บริษัท สยามเทรดดิ้ง จำกัด',
        content: 'ระบบ Admin Panel ใช้งานง่ายมาก พนักงานสามารถอัปเดตสินค้าเองได้ ไม่ต้องพึ่งโปรแกรมเมอร์ ประหยัดเวลาและค่าใช้จ่ายไปได้เยอะ',
        rating: 5,
        avatar: null,
    },
    {
        id: 3,
        name: 'คุณวิภา ชัยมงคล',
        position: 'CEO',
        company: 'สตาร์ทอัพ เทคโนโลยี',
        content: 'เริ่มต้นธุรกิจกับเว็บไซต์ที่ดูมืออาชีพ ทำให้ลูกค้าเชื่อมั่นในบริการของเรามากขึ้น ราคาไม่แพงแต่ได้คุณภาพเกินราคา',
        rating: 5,
        avatar: null,
    },
    {
        id: 4,
        name: 'คุณธนพล รักษ์โลก',
        position: 'เจ้าของกิจการ',
        company: 'ร้านกาแฟ Green Bean',
        content: 'ทีมซัพพอร์ตตอบไวมาก มีปัญหาอะไรแจ้งไปตอบกลับภายในไม่กี่นาที สบายใจมากที่มีคนดูแลเว็บไซต์ให้ตลอด 24 ชม.',
        rating: 5,
        avatar: null,
    },
]

export function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

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
                    const mappedData: TestimonialData[] = data.map((t: Record<string, unknown>) => ({
                        id: t.id as string | number,
                        name: t.client_name as string,
                        position: t.client_position as string,
                        company: t.client_company as string,
                        content: t.content as string,
                        rating: (t.rating as number) || 5,
                        avatar: t.avatar_url as string | null,
                    }))
                    setTestimonials(mappedData)
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error)
            }
        }
        fetchTestimonials()
    }, [])

    const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
    }

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
    }

    if (displayTestimonials.length === 0) return null

    return (
        <section className="section-padding gradient-bg overflow-hidden">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                        รีวิวจากลูกค้า
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
                        ลูกค้า
                        <span className="gradient-text">พูดถึงเรา</span>
                    </h2>
                    <p className="text-lg text-secondary-600 leading-loose mt-4">
                        ความประทับใจจากลูกค้าที่ไว้วางใจให้เราดูแลเว็บไซต์ของพวกเขา
                    </p>
                </motion.div>

                {/* Testimonials Carousel */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Main Testimonial */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 text-primary-100">
                                <Quote className="w-16 h-16" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < displayTestimonials[currentIndex].rating
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-secondary-200'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-lg md:text-xl text-secondary-700 leading-loose mb-8">
                                &quot;{displayTestimonials[currentIndex].content}&quot;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
                                    {displayTestimonials[currentIndex].name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-secondary-900">
                                        {displayTestimonials[currentIndex].name}
                                    </h4>
                                    <p className="text-sm text-secondary-500">
                                        {displayTestimonials[currentIndex].position} • {displayTestimonials[currentIndex].company}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-secondary-600 hover:text-primary-600 hover:shadow-xl transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {displayTestimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-primary-500 w-8'
                                        : 'bg-secondary-300 hover:bg-secondary-400'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-secondary-600 hover:text-primary-600 hover:shadow-xl transition-all"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
