'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Send, AlertCircle, Search } from 'lucide-react'

interface Ticket {
    id: string;
    subject: string;
    description: string;
    status: string;
    client_id: string;
    created_at: string;
    updated_at: string;
    clients?: { name: string };
}

interface Reply {
    id: string;
    ticket_id: string;
    sender_type: string;
    message: string;
    created_at: string;
}
import { useModal } from '@/lib/modal-context'

export function SupportTicketManager() {
    const { showAlert, showConfirm } = useModal()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
    const [replies, setReplies] = useState<Reply[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filters
    const [statusFilter, setStatusFilter] = useState('all') // all, open, in_progress, resolved
    const [searchQuery, setSearchQuery] = useState('')

    // Form states
    const [replyText, setReplyText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchTickets()

        // Set up realtime subscription for new tickets/replies
        const channel = supabase
            .channel('support_updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'support_tickets' },
                () => {
                    fetchTickets()
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'support_replies' },
                (payload) => {
                    if (activeTicket && payload.new.ticket_id === activeTicket.id) {
                        fetchReplies(activeTicket.id)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
            const { data, error } = await supabase
                .from('support_tickets')
                .select('*, clients(name)')
                .order('updated_at', { ascending: false })

            if (error) throw error
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

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyText.trim() || !activeTicket) return

        setIsSubmitting(true)
        try {
            const { data, error } = await supabase
                .from('support_replies')
                .insert({
                    ticket_id: activeTicket.id,
                    sender_type: 'admin',
                    message: replyText.trim()
                })
                .select()
                .single()

            if (error) throw error

            setReplies([...replies, data])
            setReplyText('')

            // Update ticket updated_at and status if it was 'open'
            const updates: Record<string, string> = { updated_at: new Date().toISOString() }
            if (activeTicket.status === 'open') {
                updates.status = 'in_progress'
            }

            await supabase
                .from('support_tickets')
                .update(updates)
                .eq('id', activeTicket.id)

            // Optimistically update active ticket and list
            const updatedActiveTicket = { ...activeTicket, ...updates }
            setActiveTicket(updatedActiveTicket)
            setTickets(tickets.map(t =>
                t.id === activeTicket.id ? updatedActiveTicket : t
            ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))

        } catch (err) {
            console.error('Error sending reply:', err)
            showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถส่งข้อความได้', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateStatus = async (newStatus: string) => {
        if (!activeTicket) return
        if (!(await showConfirm('เปลี่ยนสถานะ', `ต้องการเปลี่ยนสถานะ Ticket นี้เป็น ${newStatus === 'resolved' ? 'เสร็จสิ้น' : 'กำลังแก้ไข'} ใช่หรือไม่?`))) return

        try {
            const { error } = await supabase
                .from('support_tickets')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', activeTicket.id)

            if (error) throw error

            const updatedTicket = { ...activeTicket, status: newStatus, updated_at: new Date().toISOString() }
            setActiveTicket(updatedTicket)
            setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t))
            showAlert('สำเร็จ', 'อัปเดตสถานะเรียบร้อยแล้ว', 'success')
        } catch {
            showAlert('ผิดพลาด', 'ไม่สามารถอัปเดตสถานะได้', 'error')
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
        const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (ticket.clients?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesStatus && matchesSearch
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
            {/* Tickets List - Admin View */}
            <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col w-full md:w-1/3 overflow-hidden ${activeTicket ? 'hidden md:flex' : 'flex'}`}>
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 flex flex-col gap-3 bg-gray-50/50">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        Support Tickets
                    </h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาตามหัวข้อ, อีเมล..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex gap-2 text-sm overflow-x-auto pb-1">
                        {['all', 'open', 'in_progress', 'resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${statusFilter === status
                                    ? 'bg-indigo-600 text-white font-medium'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {status === 'all' && 'ทั้งหมด'}
                                {status === 'open' && 'รอดำเนินการ'}
                                {status === 'in_progress' && 'กำลังแก้ไข'}
                                {status === 'resolved' && 'เสร็จสิ้น'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {filteredTickets.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 text-sm">
                            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            ไม่พบข้อมูล Ticket ที่ค้นหา
                        </div>
                    ) : (
                        filteredTickets.map(ticket => (
                            <button
                                key={ticket.id}
                                onClick={() => {
                                    setActiveTicket(ticket)
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
                                <div className="text-xs text-indigo-500 font-medium mt-1 truncate">{ticket.clients?.name || 'ลูกค้าไม่ระบุชื่อ'}</div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat/Form Area - Admin View */}
            <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden ${!activeTicket ? 'hidden md:flex items-center justify-center bg-gray-50/30' : 'flex'}`}>

                {!activeTicket ? (
                    <div className="text-center text-gray-400">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>เลือก Ticket จากรายการด้านซ้ายเพื่อดูรายละเอียดและตอบกลับ</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-start bg-white z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <button onClick={() => setActiveTicket(null)} className="md:hidden mr-2 text-gray-500">
                                        &larr; กลับ
                                    </button>
                                    <span className="text-sm text-gray-500">Ticket #{activeTicket.id.split('-')[0]}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full outline outline-1 outline-offset-1 ${activeTicket.status === 'open' ? 'bg-orange-100 text-orange-700 outline-orange-200' :
                                        activeTicket.status === 'in_progress' ? 'bg-blue-100 text-blue-700 outline-blue-200' :
                                            'bg-green-100 text-green-700 outline-green-200'
                                        }`}>
                                        {activeTicket.status === 'open' && 'รอดำเนินการ'}
                                        {activeTicket.status === 'in_progress' && 'กำลังแก้ไข'}
                                        {activeTicket.status === 'resolved' && 'เสร็จสิ้น'}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 line-clamp-2 md:line-clamp-none mt-2">{activeTicket.subject}</h2>
                                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="font-medium text-indigo-600">{activeTicket.clients?.name || 'ลูกค้าไม่ระบุชื่อ'}</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                {activeTicket.status === 'open' && (
                                    <button
                                        onClick={() => handleUpdateStatus('in_progress')}
                                        className="text-sm px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors whitespace-nowrap"
                                    >
                                        รับเรื่อง (กำลังแก้ไข)
                                    </button>
                                )}
                                {activeTicket.status !== 'resolved' && (
                                    <button
                                        onClick={() => handleUpdateStatus('resolved')}
                                        className="text-sm px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors whitespace-nowrap"
                                    >
                                        ทำเครื่องหมายว่าเสร็จสิ้น
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50/50">
                            {/* Initial Description */}
                            <div className="flex justify-start"> {/* Admin sees client message on the left */}
                                <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none p-4 max-w-[85%] md:max-w-[70%] shadow-sm">
                                    <p className="text-sm whitespace-pre-wrap">{activeTicket.description}</p>
                                    <span className="text-[10px] text-gray-400 mt-2 block">
                                        ลูกค้า • {new Date(activeTicket.created_at).toLocaleString('th-TH')}
                                    </span>
                                </div>
                            </div>

                            {/* Replies */}
                            {replies.map((reply, index) => {
                                const isAdmin = reply.sender_type === 'admin'
                                return (
                                    <div key={index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-2xl p-4 max-w-[85%] md:max-w-[70%] shadow-sm ${isAdmin
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                                            <span className={`text-[10px] mt-2 block ${isAdmin ? 'text-indigo-200 text-right' : 'text-gray-400'}`}>
                                                {!isAdmin && 'ลูกค้า • '}
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
                                <div className="text-center py-3 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                                    <AlertCircle className="w-5 h-5 opacity-50" />
                                    Ticket นี้ถูกปิดโดย Admin หรือ ลูกค้าแล้ว
                                    <button
                                        onClick={() => handleUpdateStatus('open')}
                                        className="text-xs text-indigo-600 hover:underline mt-1"
                                    >
                                        เปิด Ticket อีกครั้ง
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSendReply} className="flex items-end gap-2 relative">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="พิมพ์ข้อความตอบกลับลูกค้า..."
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
                )}
            </div>
        </div>
    )
}
