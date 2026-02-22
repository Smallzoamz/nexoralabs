import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, Save, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { useModal } from '@/lib/modal-context'

const heroSchema = z.object({
    title: z.string().max(200, 'หัวข้อหลักต้องไม่เกิน 200 ตัวอักษร'),
    subtitle: z.string().max(100, 'หัวข้อรองต้องไม่เกิน 100 ตัวอักษร'),
    description: z.string().max(500, 'คำอธิบายต้องไม่เกิน 500 ตัวอักษร'),
    primary_cta_text: z.string().max(50, 'CTA หลักต้องไม่เกิน 50 ตัวอักษร'),
    primary_cta_link: z.string().max(200, 'ลิงก์ยาวเกินไป'),
    secondary_cta_text: z.string().max(50, 'CTA รองต้องไม่เกิน 50 ตัวอักษร'),
    secondary_cta_link: z.string().max(200, 'ลิงก์ยาวเกินไป'),
})

const serviceSchema = z.object({
    title: z.string().min(1, 'กรุณากรอกชื่อบริการ').max(100, 'ชื่อบริการยาวเกินไป'),
    description: z.string().max(300, 'รายละเอียดต้องไม่เกิน 300 ตัวอักษร'),
    icon: z.string().max(50, 'ชื่อไอคอนยาวเกินไป'),
    is_active: z.boolean(),
})

const testimonialSchema = z.object({
    client_name: z.string().min(1, 'กรุณากรอกชื่อลูกค้า').max(100, 'ชื่อลูกค้ายาวเกินไป'),
    client_company: z.string().max(100, 'ชื่อบริษัทยาวเกินไป').optional(),
    content: z.string().min(1, 'กรุณากรอกรีวิว').max(1000, 'รีวิวยาวเกินไป'),
    rating: z.number().min(1).max(5),
    is_active: z.boolean(),
})

const SECTIONS = [
    {
        id: 'hero',
        name: 'Hero Section',
        description: 'ส่วนแบนเนอร์หลักของหน้าแรก',
    },
    {
        id: 'services',
        name: 'Services Section',
        description: 'ส่วนแสดงบริการของเรา',
    },
    {
        id: 'packages',
        name: 'Packages Section',
        description: 'ส่วนแสดงแพ็กเกจบริการ (อ้างอิงจาก PackageManager)',
    },
    {
        id: 'testimonials',
        name: 'Testimonials Section',
        description: 'ส่วนแสดงรีวิวจากลูกค้า',
    },
]

interface HeroData {
    id?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    primary_cta_text?: string;
    primary_cta_link?: string;
    secondary_cta_text?: string;
    secondary_cta_link?: string;
}

interface ServiceItem {
    id: string;
    title: string;
    description: string;
    order: number;
}

interface TestimonialItem {
    id: string;
    client_name: string;
    client_company: string;
    content: string;
    is_active?: boolean;
    rating?: number;
}

export function ContentManager() {
    const { showAlert, showConfirm } = useModal()
    const [selectedSection, setSelectedSection] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Data states
    const [heroData, setHeroData] = useState<HeroData | null>(null)
    const [servicesData, setServicesData] = useState<ServiceItem[]>([])
    const [testimonialsData, setTestimonialsData] = useState<TestimonialItem[]>([])

    // New item states
    const [newService, setNewService] = useState({ title: '', description: '', icon: 'check', is_active: true })
    const [newTestimonial, setNewTestimonial] = useState({ client_name: '', client_company: '', content: '', rating: 5, is_active: true })

    useEffect(() => {
        fetchAllContent()
    }, [])

    const fetchAllContent = async () => {
        try {
            // Fetch Hero
            const { data: hero, error: heroError } = await supabase
                .from('hero_section')
                .select('*')
                .limit(1)
                .single()

            if (heroError && heroError.code !== 'PGRST116') throw heroError
            if (hero) setHeroData(hero)

            // Fetch Services
            const { data: services, error: servicesError } = await supabase
                .from('services')
                .select('*')
                .order('order', { ascending: true })

            if (servicesError) throw servicesError
            if (services) setServicesData(services)

            // Fetch Testimonials
            const { data: testimonials, error: testError } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false })

            if (testError) throw testError
            if (testimonials) setTestimonialsData(testimonials)

        } catch (err: unknown) {
            console.error('Error fetching content:', err)
        }
    }

    const handleSaveHero = async () => {
        try {
            setIsSaving(true)

            const payload = {
                title: heroData?.title || '',
                subtitle: heroData?.subtitle || '',
                description: heroData?.description || '',
                primary_cta_text: heroData?.primary_cta_text || '',
                primary_cta_link: heroData?.primary_cta_link || '',
                secondary_cta_text: heroData?.secondary_cta_text || '',
                secondary_cta_link: heroData?.secondary_cta_link || '',
            }

            // Validate with Zod
            heroSchema.parse(payload)

            const payloadWithDate = {
                ...payload,
                updated_at: new Date().toISOString()
            }

            if (heroData?.id) {
                const { error } = await supabase.from('hero_section').update(payloadWithDate).eq('id', heroData.id)
                if (error) throw error
            } else {
                const { data, error } = await supabase.from('hero_section').insert([payloadWithDate]).select().single()
                if (error) throw error
                setHeroData(data)
            }
            showAlert('สำเร็จ', 'บันทึกสำเร็จ', 'success')
        } catch (err: unknown) {
            console.error('Save error:', err)
            if (err instanceof z.ZodError) {
                showAlert('ข้อมูลไม่ถูกต้อง', `เกิดข้อผิดพลาด: ${err.errors[0].message}`, 'error')
            } else {
                showAlert('ข้อผิดพลาด', 'บันทึกไม่สำเร็จ', 'error')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddService = async () => {
        try {
            setIsSaving(true)

            // Validate with Zod
            serviceSchema.parse(newService)

            const payload = {
                ...newService,
                order: servicesData.length
            }
            const { data, error } = await supabase.from('services').insert([payload]).select().single()
            if (error) throw error
            setServicesData([...servicesData, data])
            setNewService({ title: '', description: '', icon: 'check', is_active: true })
        } catch (err: unknown) {
            console.error('Save error:', err)
            if (err instanceof z.ZodError) {
                showAlert('ข้อมูลไม่ถูกต้อง', `เกิดข้อผิดพลาด: ${err.errors[0].message}`, 'error')
            } else {
                showAlert('ข้อผิดพลาด', 'เพิ่มบริการไม่สำเร็จ', 'error')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteService = async (id: string) => {
        if (!(await showConfirm('ยืนยันลบ', 'ลบบริการนี้หรือไม่?'))) return
        try {
            const { error } = await supabase.from('services').delete().eq('id', id)
            if (error) throw error
            setServicesData(servicesData.filter(s => s.id !== id))
            // Re-sequence order for remaining services
            const remaining = servicesData.filter(s => s.id !== id).map((s, idx) => ({ ...s, order: idx }))
            await supabase.from('services').upsert(remaining.map(s => ({ id: s.id, order: s.order })))
            setServicesData(remaining)
        } catch (err: unknown) {
            console.error(err)
            showAlert('ข้อผิดพลาด', 'ลบไม่สำเร็จ', 'error')
        }
    }

    const handleAddTestimonial = async () => {
        try {
            setIsSaving(true)

            // Validate with Zod
            testimonialSchema.parse(newTestimonial)

            const { data, error } = await supabase.from('testimonials').insert([newTestimonial]).select().single()
            if (error) throw error
            setTestimonialsData([data, ...testimonialsData])
            setNewTestimonial({ client_name: '', client_company: '', content: '', rating: 5, is_active: true })
        } catch (err: unknown) {
            console.error('Save error:', err)
            if (err instanceof z.ZodError) {
                showAlert('ข้อมูลไม่ถูกต้อง', `เกิดข้อผิดพลาด: ${err.errors[0].message}`, 'error')
            } else {
                showAlert('ข้อผิดพลาด', 'เพิ่มรีวิวไม่สำเร็จ', 'error')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteTestimonial = async (id: string) => {
        if (!(await showConfirm('ยืนยันลบ', 'ลบรีวิวนี้หรือไม่?'))) return
        try {
            const { error } = await supabase.from('testimonials').delete().eq('id', id)
            if (error) throw error
            setTestimonialsData(testimonialsData.filter(t => t.id !== id))
        } catch (err: unknown) {
            console.error(err)
            showAlert('ข้อผิดพลาด', 'ลบไม่สำเร็จ', 'error')
        }
    }

    const handleToggleTestimonialActivity = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error

            setTestimonialsData(testimonialsData.map(t =>
                t.id === id ? { ...t, is_active: !currentStatus } : t
            ))
            showAlert('สำเร็จ', `เปลี่ยนสถานะเป็น ${!currentStatus ? 'แสดงผล' : 'ซ่อน'} แล้ว`, 'success')
        } catch (err) {
            console.error(err)
            showAlert('ข้อผิดพลาด', 'อัปเดตสถานะไม่สำเร็จ', 'error')
        }
    }

    return (
        <div className="space-y-6">
            {/* Section List */}
            {!selectedSection && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SECTIONS.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedSection(section.id)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <Edit className="w-5 h-5 text-primary-600" />
                                </div>
                                <span className="text-xs text-secondary-400">Section</span>
                            </div>
                            <h3 className="font-semibold text-secondary-900 mb-2">{section.name}</h3>
                            <p className="text-sm text-secondary-500 mb-4">{section.description}</p>
                            <div className="flex items-center gap-2">
                                <button className="flex-1 btn-secondary text-sm py-2">
                                    <Edit className="w-4 h-4 mr-1" />
                                    แก้ไข
                                </button>
                                <button className="p-2 text-secondary-400 hover:text-primary-600 transition-colors">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Section Editor */}
            {selectedSection && (
                <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
                    <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-secondary-900">
                                {SECTIONS.find((s) => s.id === selectedSection)?.name}
                            </h2>
                            <p className="text-sm text-secondary-500">
                                {SECTIONS.find((s) => s.id === selectedSection)?.description}
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedSection(null)}
                            className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Hero Section Editor */}
                        {selectedSection === 'hero' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        หัวข้อหลัก
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={heroData?.title || ''}
                                        onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                                        placeholder="ใช้การขึ้นบรรทัดใหม่ (Enter) เพื่อเน้นข้อความในบรรทัดที่ 2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        ข้อความเหนือหัวข้อ (Subtitle / Badge)
                                    </label>
                                    <input
                                        type="text"
                                        value={heroData?.subtitle || ''}
                                        onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        คำอธิบาย
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={heroData?.description || ''}
                                        onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            ปุ่ม CTA หลัก
                                        </label>
                                        <input
                                            type="text"
                                            value={heroData?.primary_cta_text || ''}
                                            onChange={(e) => setHeroData({ ...heroData, primary_cta_text: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            ปุ่ม CTA รอง
                                        </label>
                                        <input
                                            type="text"
                                            value={heroData?.secondary_cta_text || ''}
                                            onChange={(e) => setHeroData({ ...heroData, secondary_cta_text: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Services Section Editor */}
                        {selectedSection === 'services' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        หัวข้อ Section
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="บริการครบวงจรสำหรับเว็บไซต์ธุรกิจคุณ"
                                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    />
                                </div>

                                {/* List of Services */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-secondary-900">รายการบริการที่มีอยู่ ({servicesData.length})</h4>
                                    {servicesData.map((service, idx) => (
                                        <div key={service.id || idx} className="flex items-center justify-between p-4 bg-secondary-50 border border-secondary-100 rounded-xl">
                                            <div>
                                                <h5 className="font-semibold text-secondary-900">{service.title}</h5>
                                                <p className="text-sm text-secondary-500 line-clamp-1">{service.description}</p>
                                            </div>
                                            <button
                                                className="p-2 text-secondary-400 hover:text-red-600 transition-colors"
                                                onClick={() => handleDeleteService(service.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Service Form */}
                                <div className="border border-dashed border-secondary-300 rounded-xl p-6 bg-secondary-50/50">
                                    <h4 className="font-medium text-secondary-900 mb-4">เพิ่มบริการใหม่</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">ชื่อบริการ</label>
                                            <input
                                                type="text"
                                                value={newService.title}
                                                onChange={e => setNewService({ ...newService, title: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none"
                                                placeholder="เช่น ออกแบบเว็บไซต์"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">รายละเอียด</label>
                                            <textarea
                                                value={newService.description}
                                                onChange={e => setNewService({ ...newService, description: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none resize-none"
                                                rows={2}
                                                placeholder="คำอธิบายบริการแบบย่อ..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">ไอคอน (ชื่อจาก Lucide)</label>
                                            <input
                                                type="text"
                                                value={newService.icon}
                                                onChange={e => setNewService({ ...newService, icon: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none"
                                                placeholder="เช่น Code, Monitor, Smartphone"
                                            />
                                        </div>
                                        <button
                                            className="btn-secondary text-sm w-full"
                                            onClick={handleAddService}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                            บันทึกบริการใหม่
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Testimonials Section Editor */}
                        {selectedSection === 'testimonials' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        หัวข้อ Section
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="ความประทับใจจากลูกค้าที่ไว้วางใจเรา"
                                        className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    />
                                </div>

                                {/* List of Testimonials */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-secondary-900">รีวิวที่มีอยู่ ({testimonialsData.length})</h4>
                                    {testimonialsData.map((testimonial, idx) => (
                                        <div key={testimonial.id || idx} className="flex items-center justify-between p-4 bg-secondary-50 border border-secondary-100 rounded-xl">
                                            <div className="flex-1 mr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="font-semibold text-secondary-900">{testimonial.client_name}</h5>
                                                    <span className="text-xs text-secondary-500">({testimonial.client_company || 'ไม่ระบุ'})</span>
                                                    {!testimonial.is_active && (
                                                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">รออนุมัติ</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-secondary-500 line-clamp-2">&quot;{testimonial.content as string}&quot;</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handleToggleTestimonialActivity(testimonial.id, !!testimonial.is_active)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${testimonial.is_active ? 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                                >
                                                    {testimonial.is_active ? 'ซ่อน' : 'อนุมัติ'}
                                                </button>
                                                <button
                                                    className="p-2 text-secondary-400 hover:text-red-600 transition-colors"
                                                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Testimonial Form */}
                                <div className="border border-dashed border-secondary-300 rounded-xl p-6 bg-secondary-50/50">
                                    <h4 className="font-medium text-secondary-900 mb-4">เพิ่มรีวิวใหม่</h4>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-secondary-700 mb-2">ชื่อลูกค้า</label>
                                                <input
                                                    type="text"
                                                    value={newTestimonial.client_name}
                                                    onChange={e => setNewTestimonial({ ...newTestimonial, client_name: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none"
                                                    placeholder="เช่น คุณสมชาย"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-secondary-700 mb-2">ชื่อบริษัท</label>
                                                <input
                                                    type="text"
                                                    value={newTestimonial.client_company}
                                                    onChange={e => setNewTestimonial({ ...newTestimonial, client_company: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none"
                                                    placeholder="เช่น บริษัท ABC จำกัด"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">ข้อความรีวิว</label>
                                            <textarea
                                                value={newTestimonial.content}
                                                onChange={e => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none resize-none"
                                                rows={3}
                                                placeholder="ความวิจารณ์จากลูกค้า..."
                                            />
                                        </div>
                                        <button
                                            className="btn-secondary text-sm w-full"
                                            onClick={handleAddTestimonial}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                            บันทึกรีวิวใหม่
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-6 border-t border-secondary-100 flex justify-end gap-4">
                        <button
                            onClick={() => setSelectedSection(null)}
                            className="btn-outline"
                        >
                            ยกเลิก
                        </button>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                if (selectedSection === 'hero') handleSaveHero()
                                // Added dummy cases for Services & Testimonials for now
                            }}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                            บันทึก
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
