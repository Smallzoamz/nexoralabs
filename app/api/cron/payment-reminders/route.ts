import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

// SECURITY: This endpoint must only be callable by Vercel's cron scheduler.
// Set CRON_SECRET in your .env.local.
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key to bypass RLS
    )

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    })

    try {
        // Fetch all pending invoices
        const { data: pendingInvoices, error } = await supabase
            .from('invoices')
            .select('id, client_name, client_email, package_details, monthly_fee, setup_fee, due_date')
            .eq('status', 'pending')

        if (error) throw error
        if (!pendingInvoices || pendingInvoices.length === 0) {
            return NextResponse.json({ message: 'No pending invoices. Nothing to do.' }, { status: 200 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0) // Normalize to start of day

        const results = { sent: 0, skipped: 0 }

        for (const invoice of pendingInvoices) {
            const dueDate = new Date(invoice.due_date)
            dueDate.setHours(0, 0, 0, 0) // Normalize

            const diffMs = dueDate.getTime() - today.getTime()
            const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

            let reminderType: '7-day' | '3-day' | '1-day' | null = null
            let subject = ''
            let urgencyColor = '#3b82f6'
            let urgencyLabel = ''

            if (diffDays === 7) {
                reminderType = '7-day'
                subject = `📅 แจ้งเตือนการชำระเงิน - ครบกำหนดในอีก 7 วัน`
                urgencyColor = '#3b82f6'
                urgencyLabel = '⏰ ครบกำหนดในอีก 7 วัน'
            } else if (diffDays === 3) {
                reminderType = '3-day'
                subject = `⚠️ แจ้งเตือนการชำระเงิน - ครบกำหนดในอีก 3 วัน`
                urgencyColor = '#f59e0b'
                urgencyLabel = '⚠️ ครบกำหนดในอีก 3 วัน'
            } else if (diffDays === 1) {
                reminderType = '1-day'
                subject = `🚨 ด่วน! กำหนดชำระเงินคือพรุ่งนี้`
                urgencyColor = '#ef4444'
                urgencyLabel = '🚨 ด่วน! ครบกำหนดพรุ่งนี้'
            }

            if (!reminderType) {
                results.skipped++
                continue
            }

            const totalAmount = Number(invoice.setup_fee) + Number(invoice.monthly_fee)
            const formattedTotal = totalAmount.toLocaleString('th-TH')
            const formattedDueDate = new Date(invoice.due_date).toLocaleDateString('th-TH', {
                year: 'numeric', month: 'long', day: 'numeric'
            })
            const paymentLink = `${process.env.NEXT_PUBLIC_SITE_URL}/payment/${invoice.id}`

            const htmlTemplate = `
            <div style="font-family: 'Sarabun', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1e293b; margin: 0; font-size: 24px;">Nexora Labs | Billing Team</h1>
                    <p style="color: #64748b; margin-top: 5px;">แจ้งเตือนชำระค่าบริการ</p>
                </div>

                <div style="background-color: ${urgencyColor}; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; font-weight: bold; font-size: 16px;">
                    ${urgencyLabel}
                </div>

                <div style="background-color: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
                    <p style="color: #334155; font-size: 16px;">เรียน <strong>${invoice.client_name}</strong>,</p>
                    <p style="color: #475569; line-height: 1.7;">ขอแจ้งเตือนให้ท่านทราบว่า ค่าบริการดูแลรักษาระบบของแพ็กเกจ <strong>${invoice.package_details}</strong> มีกำหนดชำระภายใน <strong style="color: ${urgencyColor};">${formattedDueDate}</strong> ครับ</p>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0; color: #64748b; font-size: 14px;">ยอดชำระสุทธิ (Total)</p>
                        <p style="margin: 5px 0 0; color: #1e293b; font-size: 28px; font-weight: bold;">฿${formattedTotal}</p>
                    </div>

                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${paymentLink}" target="_blank" style="background-color: #142b41; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">ชำระเงิน &amp; แนบสลิปออนไลน์</a>
                    </div>

                    <p style="color: #94a3b8; font-size: 13px; text-align: center;">หากชำระเงินแล้ว กรุณาแนบสลิปที่ลิงก์ด้านบนเพื่อยืนยันการชำระครับ</p>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} Nexora Labs | Billing Team</p>
                </div>
            </div>
            `

            await transporter.sendMail({
                from: `"Nexora Labs | Billing Team" <${process.env.EMAIL_USER}>`,
                to: invoice.client_email,
                subject: `${subject} - ${invoice.package_details}`,
                html: htmlTemplate,
            })

            results.sent++
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${pendingInvoices.length} invoices. Sent: ${results.sent}, Skipped: ${results.skipped}`,
            ...results
        }, { status: 200 })

    } catch (err: unknown) {
        console.error('Payment Reminder Cron Error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
