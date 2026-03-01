"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";

interface Message {
    id: string;
    sender: "user" | "ai" | "admin";
    content: string;
}

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Pre-chat form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isStarting, setIsStarting] = useState(false);

    // Chat states
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const addWelcomeMessage = useCallback(() => {
        setMessages([
            {
                id: "welcome",
                sender: "ai",
                content: "สวัสดีครับ ผม VELOZI Bot ยินดีให้บริการครับ รบกวนแจ้งเรื่องที่ต้องการสอบถามได้เลยครับ",
            },
        ]);
    }, []);

    const fetchChatHistory = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/chat/history?sessionId=${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.messages && data.messages.length > 0) {
                    setMessages(data.messages);
                } else {
                    // First time opening with session but no messages yet
                    addWelcomeMessage();
                }
            }
        } catch (error) {
            console.error("Failed to fetch chat history:", error);
        }
    }, [addWelcomeMessage]);

    // Load session from local storage on mount
    useEffect(() => {
        const storedSession = localStorage.getItem("chatbot_session_id");
        if (storedSession) {
            setSessionId(storedSession);
            fetchChatHistory(storedSession);
        }
    }, [fetchChatHistory]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const startSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        setIsStarting(true);
        try {
            const res = await fetch("/api/chat/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            if (res.ok) {
                const data = await res.json();
                setSessionId(data.sessionId);
                localStorage.setItem("chatbot_session_id", data.sessionId);
                addWelcomeMessage();
            } else {
                alert("ไม่สามารถเริ่มการแชทได้ กรุณาลองใหม่อีกครั้ง");
            }
        } catch (error) {
            console.error("Session start error:", error);
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsStarting(false);
        }
    };

    const sendMessage = async (text: string = inputValue) => {
        if (!text.trim() || !sessionId) return;

        const userMessage: Message = {
            id: Date.now().toString(), // temp ID
            sender: "user",
            content: text.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, message: text.trim() }),
            });

            if (res.ok) {
                const data = await res.json();
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(), // temp ID
                    sender: "ai",
                    content: data.response,
                };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                // Handle error visually if needed
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now().toString(), sender: "ai", content: "ขออภัยครับ ระบบเกิดข้อผิดพลาดชั่วคราว ไม่สามารถตอบกลับได้" }
                ]);
            }
        } catch (error) {
            console.error("Send message error:", error);
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), sender: "ai", content: "ขออภัยครับ การเชื่อมต่อมีปัญหา กรุณาลองใหม่อีกครั้ง" }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const defaultMenus = [
        "เช็คราคาแพ็กเกจ",
        "ขั้นตอนการทำงาน",
        "มีบริการดูแลหลังการขายไหม?",
        "ต้องการให้ติดต่อกลับ",
    ];

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 left-6 z-[100] py-3 px-5 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 group"
                    >
                        <MessageSquare className="w-6 h-6" />
                        <span className="font-semibold text-sm">คุยกับ AI</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 left-6 z-[100] w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary-600 text-white flex justify-between items-center shrink-0">
                            <div className="flex flex-col">
                                <span className="font-semibold flex items-center gap-2">
                                    <Bot className="w-5 h-5" />
                                    VELOZI Bot
                                </span>
                                <span className="text-xs text-primary-foreground/80">Support Online</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col relative">
                            {!sessionId ? (
                                /* Pre-chat Form */
                                <form
                                    onSubmit={startSession}
                                    className="flex flex-col p-6 m-auto w-full gap-4 max-w-sm"
                                >
                                    <div className="text-center mb-4">
                                        <h3 className="font-semibold text-lg text-gray-800">ยินดีต้อนรับสู่ VELOZI</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            กรุณากรอกข้อมูลเพื่อเริ่มการสนทนา
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ชื่อ - นามสกุล
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="เช่น สมชาย ใจดี"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            อีเมล
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isStarting}
                                        className="w-full mt-2 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center"
                                    >
                                        {isStarting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            "เริ่มการสนทนา"
                                        )}
                                    </button>
                                </form>
                            ) : (
                                /* Chat Messages */
                                <div className="flex flex-col p-4 gap-4">
                                    {messages.map((msg, index) => (
                                        <div
                                            key={msg.id || index}
                                            className={`flex w-full mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.sender === "user"
                                                        ? "bg-primary-600 text-white rounded-br-none"
                                                        : "bg-white text-secondary-800 border border-secondary-200 shadow-sm rounded-bl-none"
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Show default menus if only welcome message exists or shortly after */}
                                    {messages.length <= 2 && !isTyping && (
                                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                            {defaultMenus.map((menu) => (
                                                <button
                                                    key={menu}
                                                    onClick={() => sendMessage(menu)}
                                                    className="text-xs bg-white text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-full transition-colors shrink-0"
                                                >
                                                    {menu}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        {sessionId && (
                            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        sendMessage();
                                    }}
                                    className="flex gap-2"
                                >
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="พิมพ์ข้อความ..."
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-transparent rounded-full focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || isTyping}
                                        className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors shrink-0"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
