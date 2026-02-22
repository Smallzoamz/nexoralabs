import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Save, Check, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { useModal } from '@/lib/modal-context'

const packageSchema = z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อแพ็กเกจ').max(50, 'ชื่อแพ็กเกจยาวเกินไป'),
    tier: z.string().max(30, 'Tier ยาวเกินไป'),
    setup_price_min: z.number().min(0, 'ราคาต้องไม่ติดลบ'),
    setup_price_max: z.number().min(0, 'ราคาต้องไม่ติดลบ'),
    monthly_price_min: z.number().min(0, 'ราคาต้องไม่ติดลบ'),
    monthly_price_max: z.number().min(0, 'ราคาต้องไม่ติดลบ'),
    features: z.array(z.string().max(200, 'ฟีเจอร์ยาวเกินไป')).max(50, 'จำนวนฟีเจอร์มากเกินไป'),
    highlight: z.boolean().optional(),
    is_active: z.boolean(),
})

interface PackageItem {
    id: string;
    name: string;
    tier: string;
    setup_price_min: number;
    setup_price_max: number;
    monthly_price_min: number;
    monthly_price_max: number;
    features: string[];
    is_highlight?: boolean;
    highlight?: boolean;
    is_active: boolean;
    order: number;
}

export function PackageManager() {
    const { showAlert } = useModal()
    const [packages, setPackages] = useState<PackageItem[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Partial<PackageItem> | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [newFeature, setNewFeature] = useState('')

    useEffect(() => {
        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .order('order', { ascending: true })

            if (error) throw error
            if (data) setPackages(data)
        } catch (error) {
            console.error('Error fetching packages:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (pkg: PackageItem) => {
        setEditingId(pkg.id)
        setEditForm({ ...pkg, features: pkg.features || [] })
    }

    const handleAddInit = () => {
        setIsAdding(true)
        setEditingId('new')
        setEditForm({
            name: '',
            tier: 'standard',
            setup_price_min: 0,
            setup_price_max: 0,
            monthly_price_min: 0,
            monthly_price_max: 0,
            features: [],
            is_highlight: false,
            is_active: true,
            order: packages.length
        })
    }

    const handleSave = async () => {
        if (!editForm) return
        setIsSaving(true)
        try {
            const payload = {
                name: editForm.name || '',
                tier: editForm.tier || 'standard',
                setup_price_min: editForm.setup_price_min || 0,
                setup_price_max: editForm.setup_price_max || 0,
                monthly_price_min: editForm.monthly_price_min || 0,
                monthly_price_max: editForm.monthly_price_max || 0,
                features: editForm.features || [],
                highlight: editForm.is_highlight || editForm.highlight || false,
                is_active: editForm.is_active || false,
            }

            // Validate with Zod
            packageSchema.parse(payload)

            const finalPayload = {
                ...payload,
                updated_at: new Date().toISOString()
            }

            if (editingId === 'new') {
                const { data, error } = await supabase
                    .from('packages')
                    .insert([finalPayload])
                    .select()
                    .single()

                if (error) throw error
                setPackages([...packages, data])
            } else {
                const { error } = await supabase
                    .from('packages')
                    .update(finalPayload)
                    .eq('id', editingId)

                if (error) throw error

                if (editingId !== 'new') {
                    setPackages((prev) =>
                        prev.map((p) => (p.id === editingId ? { ...p, ...finalPayload } as PackageItem : p))
                    )
                }
                setEditingId(null)
                setEditForm(null)
                setIsAdding(false)
            }
        } catch (err: unknown) {
            console.error('Error updating package:', err)
            if (err instanceof z.ZodError) {
                showAlert('ข้อมูลไม่ถูกต้อง', `เกิดข้อผิดพลาด: ${err.errors[0].message} `, 'error')
            } else {
                showAlert('ข้อผิดพลาด', 'บันทึกไม่สำเร็จ', 'error')
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditForm(null)
        setIsAdding(false)
        setNewFeature('')
    }

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase.from('packages').update({ is_active: !currentStatus }).eq('id', id)
            if (error) throw error
            setPackages((prev) =>
                prev.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p))
            )
        } catch (err: unknown) {
            console.error(err)
        }
    }

    const toggleHighlight = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase.from('packages').update({ highlight: !currentStatus }).eq('id', id)
            if (error) throw error
            setPackages((prev) =>
                prev.map((p) => (p.id === id ? { ...p, highlight: !currentStatus } : p))
            )
        } catch (err: unknown) {
            console.error(err)
        }
    }

    const handleAddFeature = () => {
        if (!newFeature.trim()) return
        setEditForm((prev: Partial<PackageItem> | null) => prev ? ({
            ...prev,
            features: [...(prev.features || []), newFeature.trim()]
        }) : null)
        setNewFeature('')
    }

    const handleRemoveFeature = (indexToRemove: number) => {
        setEditForm((prev: Partial<PackageItem> | null) => prev ? ({
            ...prev,
            features: (prev.features || []).filter((_: string, idx: number) => idx !== indexToRemove)
        }) : null)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-secondary-900">จัดการแพ็กเกจ</h2>
                    <p className="text-sm text-secondary-500">เพิ่ม แก้ไข หรือลบแพ็กเกจบริการ</p>
                </div>
                <button className="btn-primary" onClick={handleAddInit} disabled={isAdding || editingId !== null}>
                    <Plus className="w-5 h-5 mr-2" />
                    เพิ่มแพ็กเกจ
                </button>
            </div>

            {/* Package Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {isAdding && editForm && (
                    <div className="bg-white rounded-xl shadow-sm border border-primary-300 ring-2 ring-primary-100 overflow-hidden">
                        <div className="p-4 flex flex-col gap-3 bg-primary-50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex justify-center items-center text-xs">N</span>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="px-2 py-1 border rounded w-full"
                                        placeholder="ชื่อแพ็กเกจ"
                                    />
                                </h3>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={handleSave} disabled={isSaving || !editForm.name} className="p-2 text-green-600 hover:bg-green-50 rounded disabled:opacity-50">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    </button>
                                    <button onClick={handleCancel} disabled={isSaving} className="p-2 text-secondary-400 hover:bg-secondary-100 rounded disabled:opacity-50">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={editForm.tier}
                                    onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                                    className="px-2 py-1 border rounded text-sm w-1/2"
                                >
                                    <option value="standard">Standard</option>
                                    <option value="pro">Pro</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Pricing */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-secondary-50 rounded-lg">
                                    <p className="text-xs text-secondary-500 mb-1">Setup Fee</p>
                                    <input
                                        type="number"
                                        value={editForm.setup_price_min}
                                        onChange={(e) => setEditForm({ ...editForm, setup_price_min: Number(e.target.value), setup_price_max: Number(e.target.value) })}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                        placeholder="ราคา"
                                    />
                                </div>
                                <div className="p-3 bg-secondary-50 rounded-lg">
                                    <p className="text-xs text-secondary-500 mb-1">รายเดือน</p>
                                    <input
                                        type="number"
                                        value={editForm.monthly_price_min}
                                        onChange={(e) => setEditForm({ ...editForm, monthly_price_min: Number(e.target.value), monthly_price_max: Number(e.target.value) })}
                                        className="w-full px-2 py-1 border rounded text-sm"
                                        placeholder="ราคา"
                                    />
                                </div>
                            </div>
                            <div className="pt-2 border-t border-secondary-100">
                                <p className="text-sm font-medium text-secondary-900 mb-2">ฟีเจอร์</p>
                                <div className="space-y-2 mb-2">
                                    {(editForm.features || []).map((feature: string, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between bg-primary-50 px-3 py-1.5 rounded text-sm">
                                            <span>{feature}</span>
                                            <button onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:text-red-700">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                                        placeholder="เพิ่มฟีเจอร์ใหม่..."
                                        className="flex-1 px-3 py-1.5 border rounded text-sm"
                                    />
                                    <button onClick={handleAddFeature} className="px-3 py-1.5 bg-secondary-100 text-secondary-700 rounded text-sm hover:bg-secondary-200">
                                        เพิ่ม
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {packages.map((pkg) => (
                    <motion.div
                        key={pkg.id}
                        layout
                        className={cn(
                            'bg-white rounded-xl shadow-sm border overflow-hidden',
                            (pkg.is_highlight || pkg.highlight) ? 'border-primary-300 ring-2 ring-primary-100' : 'border-secondary-100',
                            !pkg.is_active && 'opacity-60'
                        )}
                    >
                        {/* Header */}
                        <div className={cn(
                            'p-4 flex items-center justify-between',
                            pkg.is_highlight ? 'bg-primary-50' : 'bg-secondary-50'
                        )}>
                            <div className="flex items-center gap-3 w-full">
                                <div className={cn(
                                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                    (pkg.is_highlight || pkg.highlight) ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-600'
                                )}>
                                    <span className="font-bold">{String(pkg.name).charAt(0)}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-secondary-900">
                                        {editingId === pkg.id ? (
                                            <input
                                                type="text"
                                                value={editForm?.name || ''}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            `แพ็กเกจ ${pkg.name}`
                                        )}
                                    </h3>
                                    <p className="text-sm text-secondary-500 mt-1 flex items-center gap-2">
                                        <span className="font-medium text-secondary-400">ระดับ:</span>
                                        {editingId === pkg.id ? (
                                            <select
                                                value={editForm?.tier || 'standard'}
                                                onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                                                className="px-2 py-1 border rounded text-xs bg-white text-secondary-700"
                                            >
                                                <option value="standard">Standard</option>
                                                <option value="pro">Pro</option>
                                            </select>
                                        ) : (
                                            <span className="capitalize">{pkg.tier}</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {editingId === pkg.id ? (
                                    <>
                                        <button onClick={handleSave} disabled={isSaving} className="p-2 text-green-600 hover:bg-green-50 rounded disabled:opacity-50">
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        </button>
                                        <button onClick={handleCancel} disabled={isSaving} className="p-2 text-secondary-400 hover:bg-secondary-100 rounded disabled:opacity-50">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => toggleActive(pkg.id, pkg.is_active)}
                                            className={cn(
                                                'px-3 py-1 rounded-full text-xs font-medium',
                                                pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-secondary-100 text-secondary-500'
                                            )}
                                        >
                                            {pkg.is_active ? 'เปิด' : 'ปิด'}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(pkg)}
                                            className="p-2 text-secondary-400 hover:text-primary-600 transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            {/* Pricing */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-secondary-50 rounded-lg">
                                    <p className="text-xs text-secondary-500 mb-1">Setup Fee</p>
                                    {editingId === pkg.id ? (
                                        <input
                                            type="number"
                                            value={editForm?.setup_price_min || ''}
                                            onChange={(e) => setEditForm({ ...editForm, setup_price_min: Number(e.target.value), setup_price_max: Number(e.target.value) })}
                                            className="w-full px-2 py-1 border rounded text-sm"
                                            placeholder="ราคา"
                                        />
                                    ) : (
                                        <p className="font-semibold text-secondary-900">
                                            ฿{Number(pkg.setup_price_min).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <div className="p-3 bg-secondary-50 rounded-lg">
                                    <p className="text-xs text-secondary-500 mb-1">รายเดือน</p>
                                    {editingId === pkg.id ? (
                                        <input
                                            type="number"
                                            value={editForm?.monthly_price_min || ''}
                                            onChange={(e) => setEditForm({ ...editForm, monthly_price_min: Number(e.target.value), monthly_price_max: Number(e.target.value) })}
                                            className="w-full px-2 py-1 border rounded text-sm"
                                            placeholder="ราคา"
                                        />
                                    ) : (
                                        <p className="font-semibold text-secondary-900">
                                            ฿{Number(pkg.monthly_price_min).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="pt-2 border-t border-secondary-100">
                                <p className="text-sm font-medium text-secondary-900 mb-2">ฟีเจอร์</p>
                                {editingId === pkg.id ? (
                                    <>
                                        <div className="space-y-2 mb-2">
                                            {(editForm?.features || []).map((feature: string, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between bg-primary-50 px-3 py-1.5 rounded text-sm">
                                                    <span>{feature}</span>
                                                    <button onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:text-red-700">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newFeature}
                                                onChange={(e) => setNewFeature(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                                                placeholder="เพิ่มฟีเจอร์ใหม่..."
                                                className="flex-1 px-3 py-1.5 border rounded text-sm"
                                            />
                                            <button onClick={handleAddFeature} className="px-3 py-1.5 bg-secondary-100 text-secondary-700 rounded text-sm hover:bg-secondary-200">
                                                เพิ่ม
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <ul className="space-y-1.5">
                                        {(pkg.features || []).map((f: string, i: number) => (
                                            <li key={i} className="flex items-start text-sm text-secondary-600">
                                                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="line-clamp-1">{f}</span>
                                            </li>
                                        ))}
                                        {(!pkg.features || pkg.features.length === 0) && (
                                            <li className="text-sm text-secondary-400 italic">ไม่มีระบุฟีเจอร์</li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            {/* Highlight Toggle */}
                            <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                                <span className="text-sm text-secondary-600">แนะนำ</span>
                                <button
                                    onClick={() => toggleHighlight(pkg.id, Boolean(pkg.highlight || pkg.is_highlight))}
                                    disabled={editingId === pkg.id}
                                    className={cn(
                                        'w-12 h-6 rounded-full transition-colors relative',
                                        (pkg.highlight || pkg.is_highlight) ? 'bg-primary-500' : 'bg-secondary-200',
                                        editingId === pkg.id && 'opacity-50 cursor-not-allowed'
                                    )}
                                >
                                    <div className={cn(
                                        'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform',
                                        (pkg.highlight || pkg.is_highlight) ? 'translate-x-6' : 'translate-x-0.5'
                                    )} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
