'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { FileText, Search, Loader2, Eye, Printer, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Contract {
    id: string
    title: string
    content: string
    status: string
    created_at: string
}

export function ClientContractsView() {
    const { user } = useAuth()
    const [contracts, setContracts] = useState<Contract[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

    useEffect(() => {
        if (!user) return
        fetchContracts()
    }, [user])

    const fetchContracts = async () => {
        setIsLoading(true)
        try {
            // RLS will handle the filtering by client_id automatically
            const { data, error } = await supabase
                .from('client_contracts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setContracts(data)
        } catch (error) {
            console.error('Error fetching contracts:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredContracts = contracts.filter(contract =>
        contract.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handlePrint = (contract: Contract) => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        printWindow.document.write(`
      <html>
        <head>
          <title>${contract.title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            h1 { color: #1a237e; }
            .content { font-size: 14px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${contract.title}</h1>
            <p>วันที่ออกเอกสาร: ${new Date(contract.created_at).toLocaleDateString('th-TH')}</p>
          </div>
          <div class="content">
            ${contract.content}
          </div>
          <script>
            window.onload = () => {
              window.print();
              // window.close();
            }
          </script>
        </body>
      </html>
    `)
        printWindow.document.close()
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">เอกสารสัญญา</h2>
                        <p className="text-sm text-gray-500">เรียกดูและตรวจสอบสัญญาโครงการของคุณ</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อสัญญา..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full md:w-64"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>กำลังโหลดรายการสัญญา...</p>
                </div>
            ) : filteredContracts.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">ยังไม่มีเอกสารสัญญา</h3>
                    <p className="text-gray-500 mt-1">เมื่อมีการออกสัญญาจากระบบ คุณจะสามารถตรวจสอบได้ที่นี่</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredContracts.map((contract) => (
                        <motion.div
                            key={contract.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold",
                                        contract.status === 'SIGNED' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                        {contract.status === 'SIGNED' ? 'ลงนามแล้ว' : 'ฉบับร่าง'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{contract.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    ออกเมื่อวันที่: {new Date(contract.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedContract(contract)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 hover:text-indigo-600 transition-colors shadow-sm"
                                >
                                    <Eye className="w-4 h-4" /> ดูรายละเอียด
                                </button>
                                <button
                                    onClick={() => handlePrint(contract)}
                                    className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 hover:text-indigo-600 transition-colors shadow-sm"
                                    title="พิมพ์สัญญา / บันทึกเป็น PDF"
                                >
                                    <Printer className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Contract Viewer Modal */}
            <AnimatePresence>
                {selectedContract && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedContract(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10 flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{selectedContract.title}</h3>
                                        <p className="text-xs text-gray-500">แบบร่างสัญญาโครงการ</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePrint(selectedContract)}
                                        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 rounded-full transition-colors"
                                        title="พิมพ์"
                                    >
                                        <Printer className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedContract(null)}
                                        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-8 lg:p-12 overflow-y-auto bg-gray-50/30">
                                <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-sm border border-gray-100 mx-auto max-w-3xl min-h-[1000px]">
                                    <div
                                        className="prose prose-slate max-w-none prose-headings:text-indigo-900"
                                        dangerouslySetInnerHTML={{ __html: selectedContract.content }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
