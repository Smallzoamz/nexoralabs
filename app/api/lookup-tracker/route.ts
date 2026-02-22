import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
    try {
        const { trackingCode } = await req.json()

        if (!trackingCode) {
            return NextResponse.json(
                { error: 'กรุณาระบุรหัสติดตาม (Tracking Code)' },
                { status: 400 }
            )
        }

        // Initialize Supabase with service role key to bypass RLS for this specific query securely
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Query the invoice using the tracking code
        const { data, error } = await supabase
            .from('invoices')
            .select('client_name, package_details, project_status, created_at, updated_at')
            .eq('tracking_code', trackingCode)
            .maybeSingle()

        if (error) {
            console.error('Error fetching tracking info:', error)
            return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการค้นหา' }, { status: 500 })
        }

        if (!data) {
            return NextResponse.json(
                { error: 'ไม่พบข้อมูลโปรเจกต์จากรหัสติดตามนี้ โปรดตรวจสอบความถูกต้อง' },
                { status: 404 }
            )
        }

        // Mask the client name for privacy (e.g., "John Doe" -> "Joh* D**")
        const words = data.client_name.split(' ');
        const maskedName = words.map((w: string) => {
            if (w.length <= 2) return w;
            return w.substring(0, 2) + '*'.repeat(w.length - 2);
        }).join(' ');

        return NextResponse.json({
            success: true,
            data: {
                client: maskedName,
                package: data.package_details,
                status: data.project_status,
                started_at: data.created_at,
                last_updated: data.updated_at
            }
        })
    } catch (err) {
        console.error('Track API error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
