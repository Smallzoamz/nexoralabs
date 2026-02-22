'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Edit2, Save, RefreshCw, Send, Users } from 'lucide-react'
import { useModal } from '@/lib/modal-context'
import { logAdminAction } from '@/lib/admin-logger'
import { useAuth } from '@/lib/auth-context'

interface EmailTemplate {
    id: string;
    template_name: string;
    subject: string;
    body_html: string;
    variables: string;
    updated_at: string;
}

export function EmailTemplateManager() {
    const { showAlert, showConfirm } = useModal()
    const { user } = useAuth()
    const [templates, setTemplates] = useState<EmailTemplate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ subject: '', body_html: '' })

    // Broadcast State
    const [isBroadcasting, setIsBroadcasting] = useState(false)
    const [broadcastData, setBroadcastData] = useState({ subject: '', body_html: '' })
    const [clientCount, setClientCount] = useState(0)

    const fetchTemplates = useCallback(async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('email_templates')
                .select('*')
                .order('template_name', { ascending: true })

            if (error) throw error
            setTemplates(data || [])

            // Get unique client emails count for broadcast info
            const { count } = await supabase
                .from('invoices')
                .select('client_email', { count: 'exact', head: true })

            setClientCount(count || 0)
        } catch (error) {
            console.error('Error fetching templates:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTemplates()
    }, [fetchTemplates])

    const handleEdit = (template: EmailTemplate) => {
        setEditingId(template.id)
        setFormData({
            subject: template.subject,
            body_html: template.body_html
        })
    }

    const handleSave = async (id: string, name: string) => {
        try {
            const { error } = await supabase
                .from('email_templates')
                .update({
                    subject: formData.subject,
                    body_html: formData.body_html,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (error) throw error

            setTemplates(templates.map(t => t.id === id ? { ...t, ...formData } : t))
            setEditingId(null)
            showAlert('บันทึกสำเร็จ', 'อัปเดตเทมเพลตอีเมลเรียบร้อยแล้ว', 'success')

            logAdminAction(user?.email || 'System', 'UPDATE_EMAIL_TEMPLATE', `แก้ไขเทมเพลต ${name}`)
        } catch (error) {
            console.error('Error updating template:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถบันทึกเทมเพลตได้', 'error')
        }
    }

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!broadcastData.subject || !broadcastData.body_html) {
            showAlert('ข้อมูลไม่ครบ', 'กรุณากรอกหัวข้อและเนื้อหาอีเมล', 'error')
            return
        }

        if (!(await showConfirm('ยืนยันการส่งประกาศ', `ระบบจะทำการส่งอีเมลประกาศนี้ไปยังลูกค้าทั้งหมด ${clientCount} รายการ ยืนยันใช่หรือไม่?`))) {
            return
        }

        setIsBroadcasting(true)
        try {
            const response = await fetch('/api/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(broadcastData)
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Broadcast failed')

            showAlert('ส่งสำเร็จ', `ส่งอีเมลประกาศสำเร็จ ${result.sentCount} ฉบับ`, 'success')
            setBroadcastData({ subject: '', body_html: '' })

            logAdminAction(user?.email || 'System', 'SEND_BROADCAST', `ส่งอีเมลประกาศเรื่อง: ${broadcastData.subject}`)
        } catch (error: unknown) {
            console.error('Broadcast error:', error)
            const msg = error instanceof Error ? error.message : 'Unknown error'
            showAlert('ข้อผิดพลาด', `การส่งอีเมลล้มเหลว: ${msg}`, 'error')
        } finally {
            setIsBroadcasting(false)
        }
    }

    const getTemplateNameTH = (name: string) => {
        const map: Record<string, string> = {
            'INVOICE': 'ส่งใบแจ้งหนี้ใหม่',
            'RECEIPT': 'ส่งใบเสร็จรับเงิน',
            'REMINDER_7': 'ทวงหนี้ (ก่อน 7 วัน)',
            'BROADCAST': 'เทมเพลตสำหรับ Broadcast'
        }
        return map[name] || name
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                        <Mail className="w-6 h-6 text-indigo-500" />
                        จัดการเทมเพลตอีเมล (Email Templates)
                    </h2>
                    <p className="text-secondary-600 mt-1">ปรับแต่งข้อความอีเมลอัตโนมัติหรือส่งประกาศหาลูกค้า</p>
                </div>
                <button
                    onClick={fetchTemplates}
                    className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Template List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-secondary-800">เทมเพลตระบบ (System Templates)</h3>

                    {isLoading && templates.length === 0 ? (
                        <div className="p-8 text-center text-secondary-500 bg-white rounded-2xl border border-secondary-200">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                            กำลังโหลดเทมเพลต...
                        </div>
                    ) : (
                        templates.filter(t => t.template_name !== 'BROADCAST').map((template) => (
                            <div key={template.id} className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-secondary-900">{getTemplateNameTH(template.template_name)}</h4>
                                        <p className="text-xs text-secondary-500 font-mono mt-1">คีย์: {template.template_name}</p>
                                    </div>
                                    {editingId !== template.id && (
                                        <button
                                            onClick={() => handleEdit(template)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {editingId === template.id ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-secondary-700 mb-1">หัวข้ออีเมล (Subject)</label>
                                            <input
                                                type="text"
                                                value={formData.subject}
                                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-secondary-700 mb-1">เนื้อหา (HTML / Text)</label>
                                            <textarea
                                                value={formData.body_html}
                                                onChange={e => setFormData({ ...formData, body_html: e.target.value })}
                                                rows={5}
                                                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                            />
                                        </div>
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                                            <strong>ตัวแปรที่ใช้ได้:</strong> {template.variables}
                                        </div>
                                        <div className="flex gap-2 justify-end pt-2">
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
                                            >
                                                ยกเลิก
                                            </button>
                                            <button
                                                onClick={() => handleSave(template.id, template.template_name)}
                                                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" /> บันทึก
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="text-sm bg-slate-50 p-2 rounded border border-slate-100">
                                            <span className="font-semibold text-secondary-700">Subject:</span> {template.subject}
                                        </div>
                                        <div className="text-sm text-secondary-600 line-clamp-2 italic">
                                            {template.body_html.replace(/<[^>]*>?/gm, '')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Broadcast Section */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-secondary-800 flex items-center gap-2">
                        <Send className="w-5 h-5 text-emerald-500" />
                        ส่งประกาศถึงลูกค้า (Broadcast)
                    </h3>

                    <form onSubmit={handleBroadcast} className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6 space-y-5">
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                            <Users className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-emerald-900">ฐานข้อมูลลูกค้า</h4>
                                <p className="text-sm text-emerald-700 mt-1">
                                    ระบบจะส่งไปยังอีเมลลูกค้าทั้งหมด <strong>{clientCount}</strong> รายการที่มีในบิลแจ้งหนี้
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">หัวข้ออีเมลประกาศ</label>
                            <input
                                type="text"
                                value={broadcastData.subject}
                                onChange={e => setBroadcastData({ ...broadcastData, subject: e.target.value })}
                                placeholder="เช่น แจ้งปิดปรับปรุงระบบ หรือ โปรโมชั่นพิเศษ"
                                required
                                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">เนื้อหาอีเมล (รองรับ HTML)</label>
                            <textarea
                                value={broadcastData.body_html}
                                onChange={e => setBroadcastData({ ...broadcastData, body_html: e.target.value })}
                                placeholder="พิมพ์ข้อความที่ต้องการส่งหาลูกค้า..."
                                rows={6}
                                required
                                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isBroadcasting || clientCount === 0}
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isBroadcasting ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    กำลังทะยอยส่ง...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    ยืนยันส่ง Broadcast
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
