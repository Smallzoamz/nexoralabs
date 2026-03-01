'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { History, Search, User, Bot, Clock, MessageSquare } from 'lucide-react'

interface ChatSession {
    id: string
    customer_name: string
    customer_email: string
    status: string
    created_at: string
}

interface ChatMessage {
    id: string
    session_id: string
    sender: 'user' | 'ai' | 'admin'
    content: string
    created_at: string
}

export function ChatHistoryViewer() {
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [selectedSession, setSelectedSession] = useState<string | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchSessions()
    }, [])

    useEffect(() => {
        if (selectedSession) {
            fetchMessages(selectedSession)
        }
    }, [selectedSession])

    const fetchSessions = async () => {
        try {
            const { data, error } = await supabase
                .from('chat_sessions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setSessions(data || [])
        } catch (error) {
            console.error('Error fetching sessions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchMessages = async (sessionId: string) => {
        setIsLoadingMessages(true)
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true })

            if (error) throw error
            setMessages(data || [])
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setIsLoadingMessages(false)
        }
    }

    const filteredSessions = sessions.filter(session =>
        session.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) return <div className="p-8 text-center text-secondary-500">กำลังโหลด...</div>

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden flex flex-col md:flex-row h-[700px]">
            {/* Sidebar List */}
            <div className="w-full md:w-1/3 border-r border-secondary-200 flex flex-col h-full bg-secondary-50">
                <div className="p-4 border-b border-secondary-200 bg-white">
                    <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2 mb-3">
                        <History className="w-5 h-5" /> ประวัติการสนทนา
                    </h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ, อีเมล..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredSessions.length === 0 ? (
                        <div className="p-8 text-center text-secondary-500 text-sm">ไม่พบการสนทนา</div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredSessions.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => setSelectedSession(session.id)}
                                    className={`p-4 border-b border-secondary-100 text-left transition-colors hover:bg-white ${selectedSession === session.id ? 'bg-white border-l-4 border-l-primary-500' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="font-semibold text-secondary-900 line-clamp-1 text-sm">{session.customer_name}</div>
                                    <div className="text-xs text-secondary-500 mb-1">{session.customer_email}</div>
                                    <div className="flex items-center gap-1 text-[10px] text-secondary-400 mt-2">
                                        <Clock className="w-3 h-3" />
                                        {new Date(session.created_at).toLocaleString('th-TH')}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat View */}
            <div className="w-full md:w-2/3 flex flex-col h-full bg-white relative">
                {!selectedSession ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-secondary-400 p-8">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                        <p>เลือกการสนทนาจากรายการด้านซ้ายเพื่อดูรายละเอียด</p>
                    </div>
                ) : isLoadingMessages ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b border-secondary-100 bg-white flex justify-between items-center z-10 shadow-sm relative">
                            <div>
                                <h3 className="font-bold text-secondary-900">
                                    {sessions.find(s => s.id === selectedSession)?.customer_name}
                                </h3>
                                <p className="text-xs text-secondary-500">
                                    {sessions.find(s => s.id === selectedSession)?.customer_email}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 flex flex-col gap-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-1.5 mb-1 opacity-70">
                                            {msg.sender === 'user' ? (
                                                <><span className="text-[10px] font-medium text-primary-700">ลูกค้า</span><User className="w-3 h-3 text-primary-700" /></>
                                            ) : (
                                                <><Bot className="w-3 h-3 text-emerald-600" /><span className="text-[10px] font-medium text-emerald-600">AI Bot</span></>
                                            )}
                                        </div>
                                        <div
                                            className={`rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user'
                                                ? 'bg-primary-600 text-white rounded-tr-sm'
                                                : 'bg-white border border-secondary-200 text-secondary-800 rounded-tl-sm shadow-sm'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        </div>
                                        <span className="text-[9px] text-secondary-400 mt-1">
                                            {new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="text-center text-sm text-secondary-400 my-auto">ไม่มีข้อความสนทนา</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
