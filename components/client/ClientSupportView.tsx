'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { MessageSquare, Send, Plus } from 'lucide-react'
import { useModal } from '@/lib/modal-context'

interface Ticket {
    id: string;
    subject: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Reply {
    id: string;
    ticket_id: string;
    sender_type: string;
    message: string;
    created_at: string;
}

export function ClientSupportView() {
    const { user } = useAuth()
    const { showAlert, showConfirm } = useModal()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
    const [replies, setReplies] = useState<Reply[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Form states
    const [isCreating, setIsCreating] = useState(false)
    const [newSubject, setNewSubject] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [replyText, setReplyText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!user?.email) return
        fetchTickets()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        if (activeTicket) {
            fetchReplies(activeTicket.id)
        }
    }, [activeTicket])

    useEffect(() => {
        scrollToBottom()
    }, [replies])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchTickets = async () => {
        try {
            // Get client_id first via client_users
            const { data: clientUser, error: cuError } = await supabase
                .from('client_users')
                .select('client_id')
                .eq('user_id', user?.id)
                .single()

            if (cuError || !clientUser) throw new Error('Client profile not found')

            const { data, error } = await supabase
                .from('support_tickets')
                .select('*')
                .eq('client_id', clientUser.client_id)
                .order('updated_at', { ascending: false })

            if (error) throw error
            setTickets(data || [])
            setTickets(data || [])
        } catch (error) {
            console.error('Error fetching tickets:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchReplies = async (ticketId: string) => {
        try {
            const { data, error } = await supabase
                .from('support_replies')
                .select('*')
                .eq('ticket_id', ticketId)
                .order('created_at', { ascending: true })

            if (error) throw error
            setReplies(data || [])
        } catch (error) {
            console.error('Error fetching replies:', error)
        }
    }

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSubject.trim() || !newDesc.trim()) return

        setIsSubmitting(true)
        try {
            // Get client_id first via client_users
            const { data: clientUser, error: cuError } = await supabase
                .from('client_users')
                .select('client_id')
                .eq('user_id', user?.id)
                .single()

            if (cuError || !clientUser) throw new Error('ไม่พบข้อมูลโปรไฟล์ลูกค้าในระบบ กรุณาติดต่อ Admin')

            const { data, error } = await supabase
                .from('support_tickets')
                .insert({
                    id: `TICK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    client_id: clientUser.client_id,
                    subject: newSubject.trim(),
                    description: newDesc.trim(),
                    status: 'open',
                    priority: 'normal'
                })
                .select()
                .single()

            if (error) throw error

            setTickets([data, ...tickets])
            setIsCreating(false)
            setNewSubject('')
            setNewDesc('')
            setActiveTicket(data)
            showAlert('เปิด Ticket สำเร็จ', 'ระบบได้รับเรื่องของคุณแล้ว ทีมงานจะตอบกลับโดยเร็วที่สุด', 'success')
        } catch (err: unknown) {
            const error = err as Error;
            console.error('Error creating ticket:', error)
            showAlert('เกิดข้อผิดพลาด', error.message || 'ไม่สามารถเปิด Ticket ได้', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyText.trim() || !activeTicket) return

        setIsSubmitting(true)
        try {
            const { data, error } = await supabase
                .from('support_replies')
                .insert({
                    ticket_id: activeTicket.id,
                    sender_type: 'client',
                    message: replyText.trim()
                })
                .select()
                .single()

            if (error) throw error

            setReplies([...replies, data])
            setReplyText('')

            // Update ticket updated_at
            await supabase
                .from('support_tickets')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', activeTicket.id)

            // Optimistically update ticket list
            setTickets(tickets.map(t =>
                t.id === activeTicket.id
                    ? { ...t, updated_at: new Date().toISOString() }
                    : t
            ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))

        } catch (err) {
            console.error('Error sending reply:', err)
            showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถส่งข้อความได้', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCloseTicket = async () => {
        if (!activeTicket) return
        if (!(await showConfirm('ปิด Ticket', 'คุณต้องการปิด Ticket นี้ใช่หรือไม่? หากพบปัญหาใหม่กรุณาเปิด Ticket ใหม่'))) return

        try {
            const { error } = await supabase
                .from('support_tickets')
                .update({ status: 'resolved' })
                .eq('id', activeTicket.id)

            if (error) throw error

            const updatedTicket = { ...activeTicket, status: 'resolved' }
            setActiveTicket(updatedTicket)
            setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t))
            showAlert('สำเร็จ', 'ปิด Ticket เรียบร้อยแล้ว', 'success')
        } catch {
            showAlert('ผิดพลาด', 'ไม่สามารถปิด Ticket ได้', 'error')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
            {/* Tickets List */}
            <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col w-full md:w-1/3 overflow-hidden ${activeTicket ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        ประวัติการแจ้งซ่อม
                    </h2>
                    <button
                        onClick={() => {
                            setIsCreating(true)
                            setActiveTicket(null)
                        }}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
                        title="เปิด Ticket ใหม่"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {tickets.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 text-sm">
                            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            ยังไม่มีประวัติการแจ้งปัญหา
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <button
                                key={ticket.id}
                                onClick={() => {
                                    setActiveTicket(ticket)
                                    setIsCreating(false)
                                }}
                                className={`w-full text-left p-4 rounded-xl transition-all border ${activeTicket?.id === ticket.id
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                    : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ticket.status === 'open' ? 'bg-orange-100 text-orange-700' :
                                        ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {ticket.status === 'open' && 'รอดำเนินการ'}
                                        {ticket.status === 'in_progress' && 'กำลังแก้ไข'}
                                        {ticket.status === 'resolved' && 'เสร็จสิ้น'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(ticket.updated_at).toLocaleDateString('th-TH')}
                                    </span>
                                </div>
                                <h3 className={`font-medium line-clamp-1 text-sm ${activeTicket?.id === ticket.id ? 'text-indigo-900' : 'text-gray-900'}`}>{ticket.subject}</h3>
                                <p className="text-xs text-gray-500 line-clamp-1 mt-1">{ticket.description}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat/Form Area */}
            <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden ${!activeTicket && !isCreating ? 'hidden md:flex items-center justify-center bg-gray-50/30' : 'flex'}`}>

                {!activeTicket && !isCreating ? (
                    <div className="text-center text-gray-400">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>เลือก Ticket จากรายการด้านซ้าย<br />หรือกดปุ่ม + เพื่อแจ้งปัญหาใหม่</p>
                    </div>
                ) : isCreating ? (
                    // Create New Ticket Form
                    <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">เปิด Ticket แจ้งปัญหา/สอบถาม</h2>
                                <p className="text-gray-500 text-sm mt-1">กรุณาระบุรายละเอียดให้ชัดเจนเพื่อให้ทีมงานช่วยเหลือได้รวดเร็วขึ้น</p>
                            </div>
                            <button onClick={() => setIsCreating(false)} className="md:hidden text-gray-400 p-2">
                                ยกเลิก
                            </button>
                        </div>

                        <form onSubmit={handleCreateTicket} className="space-y-4 flex-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อเรื่อง (Subject)</label>
                                <input
                                    type="text"
                                    required
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50"
                                    placeholder="เช่น ขอเปลี่ยนรูปภาพหน้าแรก, พบปัญหาการล็อกอิน"
                                    maxLength={100}
                                />
                            </div>
                            <div className="flex-1 flex flex-col min-h-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด (Description)</label>
                                <textarea
                                    required
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 resize-none"
                                    placeholder="อธิบายปัญหาที่พบ หรือสิ่งที่ต้องการให้ช่วยเหลือ..."
                                />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newSubject.trim() || !newDesc.trim()}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all flex items-center gap-2 font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                                    ส่งข้อมูลให้ทีมงาน
                                </button>
                            </div>
                        </form>
                    </div>
                ) : activeTicket ? (
                    // Chat Interface
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-start bg-white z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <button onClick={() => setActiveTicket(null)} className="md:hidden mr-2 text-gray-500">
                                        &larr; กลับ
                                    </button>
                                    <span className="text-sm text-gray-500">Ticket #{activeTicket.id.split('-')[0]}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTicket.status === 'open' ? 'bg-orange-100 text-orange-700' :
                                        activeTicket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {activeTicket.status === 'open' && 'รอดำเนินการ (Open)'}
                                        {activeTicket.status === 'in_progress' && 'กำลังแก้ไข (In Progress)'}
                                        {activeTicket.status === 'resolved' && 'เสร็จสิ้น (Resolved)'}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 line-clamp-2 md:line-clamp-none">{activeTicket.subject}</h2>
                            </div>
                            {activeTicket.status !== 'resolved' && (
                                <button
                                    onClick={handleCloseTicket}
                                    className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors whitespace-nowrap hidden sm:block"
                                >
                                    ปิด Ticket
                                </button>
                            )}
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50/50">
                            {/* Initial Description */}
                            <div className="flex justify-end">
                                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none p-4 max-w-[85%] md:max-w-[70%] shadow-sm">
                                    <p className="text-sm whitespace-pre-wrap">{activeTicket.description}</p>
                                    <span className="text-[10px] text-indigo-200 mt-2 block text-right">
                                        {new Date(activeTicket.created_at).toLocaleString('th-TH')}
                                    </span>
                                </div>
                            </div>

                            {/* Standard System Auto-reply (simulated) */}
                            {replies.length === 0 && activeTicket.status !== 'resolved' && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none p-4 max-w-[85%] md:max-w-[70%] shadow-sm">
                                        <p className="text-sm">ระบบได้รับเรื่องของคุณแล้ว ทีมงาน Support จะตรวจสอบและติดต่อกลับโดยเร็วที่สุด ขอบคุณค่ะ</p>
                                        <span className="text-[10px] text-gray-400 mt-2 block">
                                            ระบบอัตโนมัติ
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Replies */}
                            {replies.map((reply, index) => {
                                const isClient = reply.sender_type === 'client'
                                return (
                                    <div key={index} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-2xl p-4 max-w-[85%] md:max-w-[70%] shadow-sm ${isClient
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                                            <span className={`text-[10px] mt-2 block ${isClient ? 'text-indigo-200 text-right' : 'text-gray-400'}`}>
                                                {!isClient && 'ทีมงาน Support • '}
                                                {new Date(reply.created_at).toLocaleString('th-TH')}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            {activeTicket.status === 'resolved' ? (
                                <div className="text-center py-3 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    Ticket นี้ถูกปิดเรียบร้อยแล้ว หากพบปัญหาเพิ่มเติมกรุณาเปิด Ticket ใหม่
                                </div>
                            ) : (
                                <form onSubmit={handleSendReply} className="flex items-end gap-2 relative">
                                    {/* Optional: Upload button later */}
                                    {/* <button type="button" className="p-3 text-gray-400 hover:text-indigo-600 transition-colors bg-gray-50 hover:bg-indigo-50 rounded-xl">
                                        <Paperclip className="w-5 h-5" />
                                    </button> */}
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="พิมพ์ข้อความตอบกลับ..."
                                        className="flex-1 max-h-32 min-h-[44px] py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSendReply(e)
                                            }
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !replyText.trim()}
                                        className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 flex-shrink-0"
                                    >
                                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                                    </button>
                                </form>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    )
}
