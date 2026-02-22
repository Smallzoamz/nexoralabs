'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Filter, RefreshCw, Activity, TerminalSquare } from 'lucide-react'

interface AdminLog {
    id: string;
    admin_email: string;
    action_type: string;
    details: string;
    created_at: string;
}

export function ActivityLogManager() {
    const [logs, setLogs] = useState<AdminLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('ALL')

    const fetchLogs = useCallback(async () => {
        setIsLoading(true)
        try {
            let query = supabase
                .from('admin_logs')
                .select('*')
                .order('created_at', { ascending: false })

            if (filterType !== 'ALL') {
                query = query.eq('action_type', filterType)
            }

            if (searchTerm) {
                query = query.or(`admin_email.ilike.%${searchTerm}%,details.ilike.%${searchTerm}%`)
            }

            // Limit to 500 records to keep UI snappy
            const { data, error } = await query.limit(500)

            if (error) throw error
            setLogs(data || [])
        } catch (error) {
            console.error('Error fetching admin logs:', error)
        } finally {
            setIsLoading(false)
        }
    }, [filterType, searchTerm])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const getActionColor = (type: string) => {
        if (type.includes('LOGIN')) return 'bg-blue-100 text-blue-700 border-blue-200'
        if (type.includes('DELETE')) return 'bg-red-100 text-red-700 border-red-200'
        if (type.includes('APPROVE')) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        if (type.includes('UPDATE') || type.includes('EDIT')) return 'bg-amber-100 text-amber-700 border-amber-200'
        if (type.includes('INSERT') || type.includes('CREATE') || type.includes('ADD')) return 'bg-indigo-100 text-indigo-700 border-indigo-200'
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }

    const formatActionType = (type: string) => {
        return type.replace(/_/g, ' ')
    }

    // We can extract unique action types for the filter dropdown if needed in the future

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                        <TerminalSquare className="w-6 h-6 text-indigo-500" />
                        Admin Activity Log
                    </h2>
                    <p className="text-secondary-600 mt-1">บันทึกประวัติการทำงานและความเคลื่อนไหวในระบบ (Audit Trail)</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                    title="รีเฟรชข้อมูล"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาจากอีเมลแอดมิน หรือรายละเอียด..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                        />
                    </div>
                    <div className="w-full sm:w-48 relative">
                        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none bg-white"
                        >
                            <option value="ALL">ทุกกิจกรรม</option>
                            {/* Dynamically list standard types, but realistically we filter from fetched or known set */}
                            <option value="LOGIN">LOGIN</option>
                            <option value="CREATE">CREATE</option>
                            <option value="UPDATE">UPDATE</option>
                            <option value="DELETE">DELETE</option>
                            <option value="APPROVE">APPROVE</option>
                            <option value="REJECT">REJECT</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary-50 border-b border-secondary-200 text-secondary-600 text-sm">
                                <th className="p-4 font-medium w-48">วันเวลา (Time)</th>
                                <th className="p-4 font-medium w-48">ผู้ดำเนินการ (Admin)</th>
                                <th className="p-4 font-medium w-40">การกระทำ (Action)</th>
                                <th className="p-4 font-medium">รายละเอียด (Details)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200 font-mono text-sm">
                            {isLoading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-secondary-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                                            กำลังโหลดประวัติ...
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-secondary-500">
                                        ไม่พบประวัติการทำรายการ
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-slate-500 text-xs">
                                            {new Date(log.created_at).toLocaleString('th-TH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })}
                                        </td>
                                        <td className="p-4 font-medium text-slate-700 truncate max-w-[200px]" title={log.admin_email}>
                                            {log.admin_email}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-1 rounded text-xs font-bold border ${getActionColor(log.action_type)}`}>
                                                {formatActionType(log.action_type)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            {log.details || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center gap-2 justify-center text-xs text-secondary-400 mt-4">
                <Activity className="w-4 h-4" />
                <span>แสดงข้อมูลย้อนหลังสูงสุด 500 รายการล่าสุด</span>
            </div>
        </div>
    )
}
