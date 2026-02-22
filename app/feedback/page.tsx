'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Send, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        client_name: '',
        client_company: '',
        content: '',
        rating: 5,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.client_name || !formData.content) {
            setErrorMsg('กรุณากรอกชื่อและข้อความรีวิวให้ครบถ้วน')
            return
        }

        setIsSubmitting(true)
        setErrorMsg('')

        try {
            const { error } = await supabase.from('testimonials').insert([{
                ...formData,
                is_active: false // Require admin approval
            }])

            if (error) throw error

            setIsSuccess(true)
        } catch (error) {
            console.error('Error submitting feedback:', error)
            setErrorMsg('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">ขอบคุณสำหรับรีวิว!</h2>
                    <p className="text-secondary-600 mb-8">
                        ทางเราได้รับความประทับใจของคุณเรียบร้อยแล้ว ขอบคุณที่ไว้วางใจใช้บริการกับเราครับ
                    </p>
                    <Link href="/" className="btn-primary inline-flex">
                        กลับสู่หน้าหลัก
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-secondary-500 hover:text-primary-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    กลับหน้าหลัก
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-8 md:p-10 border-b border-secondary-100">
                        <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                            แบ่งปันความประทับใจ
                        </h1>
                        <p className="text-secondary-600">
                            ความคิดเห็นของคุณช่วยให้เราพัฒนาบริการให้ดียิ่งขึ้นไปอีก
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                        {errorMsg && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                ชื่อของคุณ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.client_name}
                                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                placeholder="เช่น สมชาย ใจดี"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                ชื่อบริษัท / ธุรกิจ (ตัวเลือก)
                            </label>
                            <input
                                type="text"
                                value={formData.client_company}
                                onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                placeholder="เช่น บริษัท เอบีซี จำกัด"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                เรทติ้งความพึงพอใจ
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-secondary-200'} transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                รีวิวบริการของเรา <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                                placeholder="ช่วยเล่าความประทับใจ หรือข้อเสนอแนะในการใช้บริการ..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full py-4 text-base"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    กำลังส่งข้อมูล...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    ส่งรีวิว
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
