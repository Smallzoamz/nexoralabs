'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import {
    Send,
    Mail,
    Phone,
    MapPin,
    Clock,
    MessageCircle,
    CheckCircle2,
    Loader2,
    AlertCircle
} from 'lucide-react'

const contactSchema = z.object({
    name: z.string().min(2, 'กรุณากรอกชื่อ'),
    email: z.string().email('อีเมลไม่ถูกต้อง'),
    phone: z.string().min(9, 'เบอร์โทรไม่ถูกต้อง'),
    company: z.string().optional(),
    package: z.string().optional(),
    message: z.string().min(10, 'กรุณากรอกข้อความอย่างน้อย 10 ตัวอักษร'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface SiteConfig {
    contact_phone: string | null;
    contact_email: string | null;
    social_line: string | null;
    contact_address: string | null;
    working_hours: string | null;
}

const packageOptions = [
    { value: '', label: 'เลือกแพ็กเกจ' },
    { value: 'standard', label: 'Standard Package' },
    { value: 'pro', label: 'Pro Package' },
    { value: 'custom', label: 'Custom Package' },
]

export function ContactSection() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)

    useEffect(() => {
        async function fetchSiteConfig() {
            try {
                const { data, error } = await supabase
                    .from('site_config')
                    .select('*')
                    .single()

                if (error) throw error
                if (data) setSiteConfig(data)
            } catch (error) {
                console.error('Error fetching site config:', error)
            }
        }
        fetchSiteConfig()
    }, [])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    })

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .insert([
                    {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        company: data.company || null,
                        package_interest: data.package || null,
                        message: data.message,
                        status: 'new'
                    }
                ])

            if (error) {
                console.error('Supabase error:', error)
                if (error.message.includes('Rate limit exceeded')) {
                    throw new Error('คุณส่งข้อความบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่ครับ')
                }
                throw new Error('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง')
            }

            setIsSubmitted(true)
            reset()
            setTimeout(() => setIsSubmitted(false), 5000)
        } catch (err: unknown) {
            console.error('Error submitting form:', err)
            setSubmitError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งข้อความ')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="contact" className="section-padding bg-white">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                            ติดต่อเรา
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
                            พร้อมเริ่มต้น
                            <br />
                            <span className="gradient-text">โปรเจคของคุณ?</span>
                        </h2>
                        <p className="text-lg text-secondary-600 leading-loose mt-4 mb-8">
                            ปรึกษาเราฟรี! ทีมงานพร้อมให้คำปรึกษาและช่วยวางแผนเว็บไซต์ที่เหมาะกับธุรกิจของคุณ
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1">โทรหาเรา</h3>
                                    <a href={`tel:${siteConfig?.contact_phone?.replace(/\s/g, '') || '+66XXXXXXXX'}`} className="text-secondary-600 hover:text-primary-600 transition-colors">
                                        {siteConfig?.contact_phone || '+66 XX XXX XXXX'}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1">อีเมล</h3>
                                    <a href={`mailto:${siteConfig?.contact_email || 'contact@nexoralabs.com'}`} className="text-secondary-600 hover:text-primary-600 transition-colors">
                                        {siteConfig?.contact_email || 'contact@nexoralabs.com'}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1">Line Official</h3>
                                    <a href={siteConfig?.social_line || '#'} target="_blank" rel="noreferrer" className="text-secondary-600 hover:text-primary-600 transition-colors">
                                        {siteConfig?.social_line ? (siteConfig.social_line.includes('line.me') ? 'คลิกเพื่อแอดไลน์' : siteConfig.social_line) : '@nexoralabs'}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1">ที่อยู่</h3>
                                    <p className="text-secondary-600">{siteConfig?.contact_address || 'กรุงเทพมหานคร, ประเทศไทย'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900 mb-1">เวลาทำการ</h3>
                                    <p className="text-secondary-600">{siteConfig?.working_hours || 'จันทร์ - ศุกร์: 09:00 - 18:00 น.'}</p>
                                    <p className="text-sm text-secondary-500 mt-1">
                                        กรณีระบบล่มทั้งระบบ: ตอบกลับภายใน 2 ชม.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-secondary-50 rounded-2xl p-6 md:p-8">
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                                        ส่งข้อความสำเร็จ!
                                    </h3>
                                    <p className="text-secondary-600">
                                        เราจะติดต่อกลับภายในเวลาทำการครับ
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                                ชื่อ-นามสกุล *
                                            </label>
                                            <input
                                                {...register('name')}
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                                placeholder="ชื่อของคุณ"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                                เบอร์โทรศัพท์ *
                                            </label>
                                            <input
                                                {...register('phone')}
                                                type="tel"
                                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                                placeholder="0XX XXX XXXX"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            อีเมล *
                                        </label>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                            placeholder="email@example.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                                ชื่อบริษัท
                                            </label>
                                            <input
                                                {...register('company')}
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                                placeholder="ชื่อบริษัท (ถ้ามี)"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                                สนใจแพ็กเกจ
                                            </label>
                                            <select
                                                {...register('package')}
                                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-white"
                                            >
                                                {packageOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            ข้อความ *
                                        </label>
                                        <textarea
                                            {...register('message')}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                                            placeholder="เล่าให้เราฟังเกี่ยวกับโปรเจคของคุณ..."
                                        />
                                        {errors.message && (
                                            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                                        )}
                                    </div>

                                    {submitError && (
                                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-600 font-medium">{submitError}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                กำลังส่ง...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                ส่งข้อความ
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
