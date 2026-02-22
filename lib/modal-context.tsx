'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

type AlertType = 'success' | 'error' | 'info'

interface AlertContextData {
    title: string;
    message: string;
    type: AlertType;
    isOpen: boolean;
}

interface ConfirmContextData {
    title: string;
    message: string;
    isOpen: boolean;
    resolve?: (value: boolean) => void;
}

interface ModalContextType {
    showAlert: (title: string, message: string, type?: AlertType) => void;
    showConfirm: (title: string, message: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false)
    const [alert, setAlert] = useState<AlertContextData>({ title: '', message: '', type: 'info', isOpen: false })
    const [confirm, setConfirm] = useState<ConfirmContextData>({ title: '', message: '', isOpen: false })

    useEffect(() => {
        setMounted(true)
    }, [])

    const showAlert = (title: string, message: string, type: AlertType = 'info') => {
        setAlert({ title, message, type, isOpen: true })
    }

    const showConfirm = (title: string, message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirm({ title, message, isOpen: true, resolve })
        })
    }

    const closeAlert = () => setAlert({ ...alert, isOpen: false })

    const resolveConfirm = (value: boolean) => {
        if (confirm.resolve) confirm.resolve(value)
        setConfirm({ ...confirm, isOpen: false })
    }

    // Map Alert Types to Icons/Colors
    const getAlertIcon = (type: AlertType) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-8 h-8 text-green-500" />
            case 'error': return <AlertCircle className="w-8 h-8 text-red-500" />
            case 'info':
            default: return <Info className="w-8 h-8 text-primary-500" />
        }
    }

    const modalContent = (
        <AnimatePresence>
            {/* ALERT MODAL */}
            {alert.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={closeAlert}
                        className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative bg-white rounded-2xl shadow-xl w-[calc(100%-2rem)] max-w-[400px] overflow-hidden"
                    >
                        <div className="p-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mb-4">
                                {getAlertIcon(alert.type)}
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-2">{alert.title}</h3>
                            <p className="text-secondary-600 font-medium">{alert.message}</p>
                        </div>
                        <div className="p-4 bg-secondary-50 border-t border-secondary-100 flex justify-center">
                            <button
                                onClick={closeAlert}
                                className="px-6 py-2.5 bg-secondary-900 hover:bg-secondary-800 text-white font-medium rounded-xl transition-colors w-full"
                            >
                                ตกลง (OK)
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* CONFIRM MODAL */}
            {confirm.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => resolveConfirm(false)}
                        className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative bg-white rounded-2xl shadow-xl w-[calc(100%-2rem)] max-w-[400px] overflow-hidden"
                    >
                        <button onClick={() => resolveConfirm(false)} className="absolute top-4 right-4 p-1 text-secondary-400 hover:bg-secondary-100 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-6 pt-8 text-center text-secondary-900">
                            <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-amber-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{confirm.title}</h3>
                            <p className="text-secondary-600 font-medium">{confirm.message}</p>
                        </div>
                        <div className="p-4 bg-secondary-50 border-t border-secondary-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => resolveConfirm(false)}
                                className="px-5 py-2.5 text-secondary-600 hover:bg-secondary-200 font-medium rounded-xl transition-colors flex-1"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={() => resolveConfirm(true)}
                                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-sm transition-colors flex-1"
                            >
                                ยืนยัน
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {mounted && createPortal(modalContent, document.body)}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context
}
