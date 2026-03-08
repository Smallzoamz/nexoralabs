import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'ไม่พบ token' },
                { status: 400 }
            )
        }

        // Find the reset token
        const { data: resetData, error: resetError } = await supabaseAdmin
            .from('password_resets')
            .select('*')
            .eq('token', token)
            .single()

        if (resetError || !resetData) {
            return NextResponse.json(
                { error: 'Token ไม่ถูกต้อง' },
                { status: 400 }
            )
        }

        // Check if token is expired
        const expiresAt = new Date(resetData.expires_at)
        if (expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Token หมดอายุ' },
                { status: 400 }
            )
        }

        // Check if token already used
        if (resetData.used_at) {
            return NextResponse.json(
                { error: 'Token นี้ถูกใช้งานแล้ว' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            valid: true,
            email: resetData.email
        })

    } catch (error) {
        console.error('Password reset verify error:', error)
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
            { status: 500 }
        )
    }
}
