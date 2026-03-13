'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Filter, RefreshCw, Activity, TerminalSquare, ChevronDown, ChevronUp, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// Extended interface matching the new database schema
interface AdminLog {
    id: string;
    admin_email: string;
    action_type: string;
    details: string;
    resource_type?: string;
    resource_id?: string;
    metadata?: Record<string, unknown>;
    status: string;
    severity: string;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

export function ActivityLogManager() {
    const [logs, setLogs] = useState<AdminLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('ALL')
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    const toggleRow = (id: string) => {
        const next = new Set(expandedRows)
        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
        }
        setExpandedRows(next)
    }

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
        if (type.includes('APPROVE') || type.includes('SUCCESS')) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        if (type.includes('UPDATE') || type.includes('EDIT')) return 'bg-amber-100 text-amber-700 border-amber-200'
        if (type.includes('INSERT') || type.includes('CREATE') || type.includes('ADD')) return 'bg-indigo-100 text-indigo-700 border-indigo-200'
        if (type.includes('FAILED') || type.includes('ERROR')) return 'bg-rose-100 text-rose-700 border-rose-200'
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity?.toUpperCase()) {
            case 'CRITICAL': return <AlertCircle className="w-4 h-4 text-red-500" />
            case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-500" />
            case 'INFO': 
            default: return <Info className="w-4 h-4 text-blue-400" />
        }
    }

    const formatActionType = (type: string) => {
        return type.replace(/_/g, ' ')
    }

    // JSON syntax highlighting alternative for simple viewing
    const formatJSON = (obj: unknown) => {
        if (!obj) return 'ไม่มีข้อมูลเพิ่มเติม'
        try {
            return JSON.stringify(obj, null, 2)
        } catch {
            return String(obj)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                        <TerminalSquare className="w-6 h-6 text-indigo-500" />
                        Admin Activity Log
                    </h2>
                    <p className="text-secondary-600 mt-1">บันทึกประวัติการทำงานและความเคลื่อนไหวในระบบ (Advanced Audit Trail)</p>
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
                            <option value="LOGIN">LOGIN</option>
                            <option value="CREATE_INVOICE">CREATE INVOICE</option>
                            <option value="UPDATE_INVOICE">UPDATE INVOICE</option>
                            <option value="DELETE_INVOICE">DELETE INVOICE</option>
                            <option value="APPROVE_SLIP">APPROVE SLIP</option>
                            {/* Dynamically list standard types, but realistically we filter from fetched or known set */}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary-50 border-b border-secondary-200 text-secondary-600 text-sm">
                                <th className="p-4 font-medium w-12 text-center"></th>
                                <th className="p-4 font-medium w-48">วันเวลา (Time)</th>
                                <th className="p-4 font-medium w-48">ผู้ดำเนินการ (Admin)</th>
                                <th className="p-4 font-medium w-40">การกระทำ (Action)</th>
                                <th className="p-4 font-medium">รายละเอียด (Details)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200 font-mono text-sm">
                            {isLoading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-secondary-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                                            กำลังโหลดประวัติ...
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-secondary-500">
                                        ไม่พบประวัติการทำรายการ
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <React.Fragment key={log.id}>
                                        <tr 
                                            className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedRows.has(log.id) ? 'bg-slate-50' : ''}`}
                                            onClick={() => toggleRow(log.id)}
                                        >
                                            <td className="p-4 text-center text-slate-400">
                                                {expandedRows.has(log.id) ? <ChevronUp className="w-4 h-4 mx-auto" /> : <ChevronDown className="w-4 h-4 mx-auto" />}
                                            </td>
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
                                                <div className="flex items-center gap-2">
                                                    {getSeverityIcon(log.severity)}
                                                    {log.admin_email}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold border ${getActionColor(log.action_type)}`}>
                                                        {formatActionType(log.action_type)}
                                                    </span>
                                                    {log.status === 'FAILED' && (
                                                        <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1 rounded border border-red-100 uppercase">
                                                            FAILED
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                <div className="line-clamp-2">{log.details || '-'}</div>
                                            </td>
                                        </tr>
                                        {expandedRows.has(log.id) && (
                                            <tr className="bg-slate-50 border-b border-secondary-200">
                                                <td colSpan={5} className="p-4 pl-16">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                        {/* Context Info */}
                                                        <div className="col-span-1 space-y-4 text-xs">
                                                            <div>
                                                                <h4 className="text-slate-400 font-semibold mb-1 uppercase tracking-wider">Resource Context</h4>
                                                                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-500">Resource Type:</span>
                                                                        <span className="font-medium text-slate-800">{log.resource_type || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-500">Resource ID:</span>
                                                                        <span className="font-medium text-slate-800 text-right truncate max-w-[150px]" title={log.resource_id}>{log.resource_id || 'N/A'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div>
                                                                <h4 className="text-slate-400 font-semibold mb-1 uppercase tracking-wider">Network & Device</h4>
                                                                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 break-all">
                                                                    <div className="flex flex-col mb-2">
                                                                        <span className="text-slate-500 mb-1">IP Address</span>
                                                                        <span className="font-medium text-slate-800 bg-slate-100 p-1 rounded font-mono text-[10px]">{log.ip_address || 'Unknown'}</span>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-slate-500 mb-1">User Agent</span>
                                                                        <span className="font-medium text-slate-800 bg-slate-100 p-1 rounded font-mono text-[10px]">{log.user_agent || 'Unknown'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Diff Data */}
                                                        <div className="col-span-1 lg:col-span-2">
                                                            <h4 className="text-slate-400 font-semibold mb-1 uppercase tracking-wider text-xs">Data Changes (Metadata)</h4>
                                                            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 h-full min-h-[150px] overflow-auto custom-scrollbar">
                                                                <pre className="text-emerald-400 font-mono text-xs whitespace-pre-wrap">
                                                                    {formatJSON(log.metadata)}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
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
