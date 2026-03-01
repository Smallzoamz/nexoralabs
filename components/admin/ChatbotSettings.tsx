'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useModal } from '@/lib/modal-context'
import { Save, Bot } from 'lucide-react'

interface ChatSettings {
    id: string
    bot_name: string
    welcome_message: string
    system_prompt: string
}

export function ChatbotSettings() {
    const { showAlert } = useModal()
    const [settings, setSettings] = useState<ChatSettings | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const fetchSettings = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('chatbot_settings')
                .select('*')
                .limit(1)
                .single()

            if (error && error.code !== 'PGRST116') throw error // Ignore no row found
            if (data) {
                setSettings(data)
            } else {
                setSettings({
                    id: '',
                    bot_name: 'VELOZI Bot',
                    welcome_message: 'สวัสดีครับ ผม VELOZI Bot ผู้ช่วยอัจฉริยะ ยินดีให้บริการ',
                    system_prompt: 'คุณคือผู้ช่วยอัจฉริยะ ทักทายสุภาพ'
                })
            }
        } catch (error: unknown) {
            console.error('Error fetching chatbot settings:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถโหลดการตั้งค่าแชทบอทได้', 'error')
        } finally {
            setIsLoading(false)
        }
    }, [showAlert])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!settings) return

        setIsSaving(true)
        try {
            if (settings.id) {
                const { error } = await supabase
                    .from('chatbot_settings')
                    .update({
                        bot_name: settings.bot_name,
                        welcome_message: settings.welcome_message,
                        system_prompt: settings.system_prompt
                    })
                    .eq('id', settings.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('chatbot_settings')
                    .insert([{
                        bot_name: settings.bot_name,
                        welcome_message: settings.welcome_message,
                        system_prompt: settings.system_prompt
                    }])
                if (error) throw error
                fetchSettings() // refresh to get ID
            }
            showAlert('สำเร็จ', 'บันทึกการตั้งค่าเรียบร้อยแล้ว', 'success')
        } catch (error: unknown) {
            console.error('Error saving settings:', error)
            showAlert('ข้อผิดพลาด', 'ไม่สามารถบันทึกการตั้งค่าได้', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div className="p-8 text-center text-secondary-500">กำลังโหลด...</div>

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-secondary-900">ตั้งค่าแชทบอท</h1>
                    <p className="text-sm text-secondary-500">กำหนดชื่อ ข้อความต้อนรับ และเบื้องหลังการสอน AI (System Prompt)</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">ชื่อบอท (Bot Name)</label>
                        <input
                            type="text"
                            value={settings?.bot_name || ''}
                            onChange={(e) => setSettings(settings ? { ...settings, bot_name: e.target.value } : null)}
                            className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">ข้อความต้อนรับ (Welcome Message)</label>
                        <textarea
                            value={settings?.welcome_message || ''}
                            onChange={(e) => setSettings(settings ? { ...settings, welcome_message: e.target.value } : null)}
                            rows={3}
                            className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">System Prompt (กำหนดพฤติกรรมบอท)</label>
                        <textarea
                            value={settings?.system_prompt || ''}
                            onChange={(e) => setSettings(settings ? { ...settings, system_prompt: e.target.value } : null)}
                            rows={10}
                            className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-mono text-secondary-800"
                            required
                        />
                        <p className="pt-2 text-xs text-secondary-500 mt-2">ระบุเงื่อนไขการตอบคำถาม, สิ่งที่ห้ามตอบ, และบทบาทของ AI อย่างละเอียด</p>
                    </div>
                </div>
                <div className="p-6 border-t border-secondary-100 bg-secondary-50 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-sm transition-colors disabled:opacity-70"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        บันทึกการตั้งค่า
                    </button>
                </div>
            </form>
        </div>
    )
}
