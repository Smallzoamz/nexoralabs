'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Database, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { useModal } from '@/lib/modal-context'

interface ClientProfile {
    id: string;
    package_type: string;
}

interface BackupLog {
    id: string;
    client_id: string;
    status: string;
    created_at: string;
    file_size_bytes?: number;
    file_path?: string;
    error_message?: string;
}

export function ClientBackupsView() {
    const { user } = useAuth()
    const { showAlert, showConfirm } = useModal()
    const [backups, setBackups] = useState<BackupLog[]>([])
    const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRequesting, setIsRequesting] = useState(false)
    const [downloadingId, setDownloadingId] = useState<string | null>(null)

    useEffect(() => {
        if (!user?.email) return

        const fetchBackups = async () => {
            try {
                // First get the client profile to know their package type
                // Since user email might be different from client record depending on how they were invited,
                // we lookup client_users link first (from phase 1 schema)
                const { data: clientUser } = await supabase
                    .from('client_users')
                    .select('client_id')
                    .eq('user_id', user.id)
                    .single()

                let clientId = clientUser?.client_id

                // Fallback: If no client_users record, try matching by email in invoices then looking up client
                if (!clientId) {
                    const { data: inv } = await supabase
                        .from('invoices')
                        .select('client_name')
                        .eq('client_email', user.email)
                        .limit(1)
                        .single()

                    if (inv) {
                        const { data: clientMatch } = await supabase
                            .from('clients')
                            .select('id, package_type')
                            .eq('name', inv.client_name)
                            .limit(1)
                            .single()

                        if (clientMatch) {
                            clientId = clientMatch.id
                            setClientProfile(clientMatch)
                        }
                    }
                } else {
                    const { data: clientMatch } = await supabase
                        .from('clients')
                        .select('id, package_type')
                        .eq('id', clientId)
                        .single()
                    setClientProfile(clientMatch)
                }

                if (clientId) {
                    const { data, error } = await supabase
                        .from('backup_logs')
                        .select('*')
                        .eq('client_id', clientId)
                        .order('created_at', { ascending: false })

                    if (error) throw error
                    setBackups(data || [])
                }

            } catch (error) {
                console.error('Error fetching backups:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBackups()
    }, [user])

    const handleDownload = async (log: BackupLog) => {
        if (!log.file_path) {
            showAlert('ไม่พบไฟล์', 'ไม่พบไฟล์สำรองข้อมูลสำหรับรายการนี้', 'error')
            return
        }

        setDownloadingId(log.id)
        try {
            // Get pre-signed URL valid for 60 seconds
            const { data, error } = await supabase.storage
                .from('client_backups')
                .createSignedUrl(log.file_path, 60)

            if (error) throw error

            // Trigger download
            const a = document.createElement('a')
            a.href = data.signedUrl
            a.download = log.file_path.split('/').pop() || 'backup.zip'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)

        } catch (err: unknown) {
            const error = err as Error;
            console.error('Download error:', error)
            showAlert('ข้อผิดพลาด', `ไม่สามารถดาวน์โหลดไฟล์ได้: ${error.message || 'Unknown error'}`, 'error')
        } finally {
            setDownloadingId(null)
        }
    }

    const handleRequestBackup = async () => {
        if (!clientProfile?.id) {
            showAlert('ข้อผิดพลาด', 'ไม่พบข้อมูลโปรเจกต์ที่เชื่อมโยงกับบัญชีนี้ กรุณาติดต่อ Admin', 'error')
            return
        }

        if (!(await showConfirm('ส่งคำร้องขอ', `ระบบจะทำการเรียกดึงข้อมูลสำรองจากเซิร์ฟเวอร์ของคุณมาเก็บไว้ (ใช้เวลาประมาณ 1-3 นาที) ต้องการดำเนินการต่อหรือไม่?`))) return

        setIsRequesting(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const res = await fetch('/api/backup/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ clientId: clientProfile.id })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Unknown error occurred')

            showAlert('สำรองข้อมูลสำเร็จ!', `ระบบนำไฟล์มาเก็บไว้ในคลัง สำเร็จเรียบร้อยแล้ว`, 'success')

            // Refresh list
            const { data: newLogs } = await supabase
                .from('backup_logs')
                .select('*')
                .eq('client_id', clientProfile.id)
                .order('created_at', { ascending: false })

            if (newLogs) setBackups(newLogs)

        } catch (err: unknown) {
            const error = err as Error;
            console.error('Backup req error:', error)
            showAlert('ข้อผิดพลาด', `การสั่งแบ็คอัปฉุกเฉินล้มเหลว: ${error.message}`, 'error')
        } finally {
            setIsRequesting(false)
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
        <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Database className="w-5 h-5 text-indigo-500" />
                            คลังข้อมูลสำรอง (Backups)
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {clientProfile?.package_type === 'pro'
                                ? 'แพ็กเกจ Pro: แบ็คอัประบบทุกวันที่ 1 และ 15 ของแแต่ละเดือน (Zip Storage)'
                                : 'แพ็กเกจ Standard: แบ็คอัประบบทุกวันที่ 1 ของเดือน (JSON)'}
                        </p>
                    </div>
                    {(clientProfile?.package_type === 'pro') && (
                        <button
                            onClick={handleRequestBackup}
                            disabled={isRequesting}
                            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors font-medium text-sm disabled:opacity-50"
                        >
                            {isRequesting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                    กำลังดึงข้อมูล...
                                </div>
                            ) : (
                                'ร้องขอแบ็คอัปฉุกเฉิน'
                            )}
                        </button>
                    )}
                </div>

                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                <th className="p-4 font-medium">วันที่ / เวลา</th>
                                <th className="p-4 font-medium">รายละเอียด</th>
                                <th className="p-4 font-medium">สถานะขนาดไฟล์ (ไบต์)</th>
                                <th className="p-4 font-medium text-right">ดาวน์โหลด</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {backups.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Database className="w-10 h-10 mb-3 opacity-50" />
                                            <p className="font-medium text-gray-500">ยังไม่มีประวัติการสำรองข้อมูล</p>
                                            <p className="text-xs mt-1">ระบบจะทำการสำรองข้อมูลอัตโนมัติตามรอบบิลของคุณ</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                backups.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {new Date(log.created_at).toLocaleString('th-TH')}
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {log.status === 'success' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    บันทึกทับสำเร็จ
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700" title={log.error_message}>
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    ล้มเหลว (แจ้งทีมงาน)
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 font-mono text-gray-500 text-xs">
                                            {log.file_size_bytes ? (log.file_size_bytes / 1024).toFixed(2) + ' KB' : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            {log.status === 'success' && log.file_path && (
                                                <button
                                                    onClick={() => handleDownload(log)}
                                                    disabled={downloadingId === log.id}
                                                    className="inline-flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="ดาวน์โหลดไฟล์สำรองข้อมูล"
                                                >
                                                    {downloadingId === log.id ? (
                                                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
