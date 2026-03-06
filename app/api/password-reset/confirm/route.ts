import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
    try {
        const { token, newPassword } = await request.json()

        if (!token || !newPassword) {
            return NextResponse.json(
                { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' },
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
                { error: 'ลิงก์ไม่ถูกต้อง หรือหมดอายุ' },
                { status: 400 }
            )
        }

        // Check if token is expired
        const expiresAt = new Date(resetData.expires_at)
        if (expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'ลิงก์หมดอายุ กรุณาขอลิงก์ใหม่อีกครั้ง' },
                { status: 400 }
            )
        }

        // Check if token already used
        if (resetData.used_at) {
            return NextResponse.json(
                { error: 'ลิงก์นี้ถูกใช้งานแล้ว กรุณาขอลิงก์ใหม่อีกครั้ง' },
                { status: 400 }
            )
        }

        // Get user by email
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers()

        if (userError) {
            console.error('Error listing users:', userError)
            return NextResponse.json(
                { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
                { status: 500 }
            )
        }

        const user = userData.users.find(u => u.email?.toLowerCase() === resetData.email.toLowerCase())

        if (!user) {
            return NextResponse.json(
                { error: 'ไม่พบผู้ใช้' },
                { status: 404 }
            )
        }

        // Update password
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
        )

        if (updateError) {
            console.error('Error updating password:', updateError)
            return NextResponse.json(
                { error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' },
                { status: 500 }
            )
        }

        // Mark token as used
        await supabaseAdmin
            .from('password_resets')
            .update({ used_at: new Date().toISOString() })
            .eq('id', resetData.id)

        // Delete all reset tokens for this email (security)
        await supabaseAdmin
            .from('password_resets')
            .delete()
            .eq('email', resetData.email)

        return NextResponse.json({
            message: 'เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่'
        })

    } catch (error) {
        console.error('Password reset confirm error:', error)
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
            { status: 500 }
        )
    }
}
