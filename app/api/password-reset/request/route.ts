import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'กรุณากรอกอีเมลให้ถูกต้อง' },
                { status: 400 }
            )
        }

        // Check if user exists in auth.users
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers()

        if (userError) {
            console.error('Error listing users:', userError)
            // Check for rate limit error
            if (userError.message?.includes('rate limit') || userError.message?.includes('Rate limit')) {
                return NextResponse.json(
                    { error: 'ทำคำขอบ่อยเกินไป กรุณาลองใหม่ในอีก 1 นาที' },
                    { status: 429 }
                )
            }
            return NextResponse.json(
                { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
                { status: 500 }
            )
        }

        // Find user by email
        const user = userData.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

        if (!user) {
            // Don't reveal if user exists or not - just return success
            return NextResponse.json({
                message: 'หากอีเมลนี้มีในระบบ จะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้'
            })
        }

        // Check if there's a recent request (within last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { data: recentRequests } = await supabaseAdmin
            .from('password_resets')
            .select('id, created_at')
            .eq('email', email.toLowerCase())
            .gte('created_at', fiveMinutesAgo)
            .limit(1)

        if (recentRequests && recentRequests.length > 0) {
            return NextResponse.json({
                message: 'หากอีเมลนี้มีในระบบ จะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้'
            })
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

        // Delete any existing tokens for this email
        await supabaseAdmin
            .from('password_resets')
            .delete()
            .eq('email', email.toLowerCase())

        // Insert new token
        const { error: insertError } = await supabaseAdmin
            .from('password_resets')
            .insert({
                email: email.toLowerCase(),
                token,
                expires_at: expiresAt.toISOString()
            })

        if (insertError) {
            console.error('Error inserting token:', insertError)
            return NextResponse.json(
                { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
                { status: 500 }
            )
        }

        // Get site URL for the reset link
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://velozi-dev.vercel.app'
        const resetLink = `${siteUrl}/admin/update-password?token=${token}`

        // Send email
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
                <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">VELOZI | Dev</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1e293b; margin-top: 0;">ตั้งรหัสผ่านใหม่</h2>
                        <p style="color: #64748b; line-height: 1.6;">
                            สวัสดีครับ,<br><br>
                            เราได้รับคำขอตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ<br>
                            กรุณาคลิกที่ปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background-color 0.2s;">
                                ตั้งรหัสผ่านใหม่
                            </a>
                        </div>
                        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                            หรือคัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:<br>
                            <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
                        </p>
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin-top: 20px; border-radius: 4px;">
                            <p style="color: #92400e; font-size: 13px; margin: 0;">
                                ⚠️ ลิงก์นี้จะหมดอายุใน 30 นาที หากไม่ได้รับอีเมลนี้จากคุณ กรุณาเพิกเฉย
                            </p>
                        </div>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                            © 2026 VELOZI | Dev. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `

        await sendEmail({
            to: email,
            subject: '🔐 ตั้งรหัสผ่านใหม่ - VELOZI | Dev',
            html: emailHtml
        })

        return NextResponse.json({
            message: 'หากอีเมลนี้มีในระบบ จะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้'
        })

    } catch (error: unknown) {
        console.error('Password reset error:', error)

        // Check for specific rate limit errors
        const errorMessage = error instanceof Error ? error.message : ''
        if (errorMessage.includes('rate limit') || errorMessage.includes('Rate limit')) {
            return NextResponse.json(
                { error: 'ทำคำขอบ่อยเกินไป กรุณาลองใหม่ในอีก 5 นาที' },
                { status: 429 }
            )
        }

        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
            { status: 500 }
        )
    }
}
