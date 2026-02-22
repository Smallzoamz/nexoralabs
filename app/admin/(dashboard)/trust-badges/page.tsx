import TrustBadgeManager from '@/components/admin/TrustBadgeManager'

export const metadata = {
    title: 'จัดการโลโก้ลูกค้า | Nexora Admin',
}

export default function TrustBadgesPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-3xl font-display font-bold text-secondary-900">Trust Badges</h1>
                <p className="text-secondary-500 mt-2">เพิ่ม ลบ และจัดการรูปโลโก้แบรนด์ลูกค้าที่เคยไว้วางใจใช้บริการ เพื่อแสดงในหน้าแรก</p>
            </header>

            <TrustBadgeManager />
        </div>
    )
}
