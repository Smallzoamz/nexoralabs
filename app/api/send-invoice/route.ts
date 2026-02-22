import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { invoice, pdfBase64, serviceContractBase64, installmentScheduleBase64 } = body

        if (!invoice || !invoice.client_email) {
            return NextResponse.json(
                { error: 'ข้อมูลไม่ครบถ้วน กรุณาลองใหม่' },
                { status: 400 }
            )
        }

        // Configure Nodemailer with Boss's Gmail credentials
        // Note: Boss needs to set these in .env.local
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        })

        // Verify connection configuration
        await transporter.verify()

        const totalAmount = Number(invoice.setup_fee) + Number(invoice.monthly_fee)
        const formattedTotal = totalAmount.toLocaleString('th-TH')
        const formattedDate = new Date(invoice.due_date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        const [
            { data: template },
            { data: siteConfig }
        ] = await Promise.all([
            supabase.from('email_templates').select('*').eq('template_name', 'INVOICE').single(),
            supabase.from('site_config').select('site_name').limit(1).maybeSingle()
        ])

        const companyName = siteConfig?.site_name || 'Nexora Labs'

        let customBody = `<p style="font-size: 16px; color: #334155;">เรียน <strong>${invoice.client_name}</strong>,</p>
                <p style="color: #475569; line-height: 1.6;">รายละเอียดใบแจ้งหนี้สำหรับบริการ <strong>${invoice.package_details}</strong> พร้อมให้บริการชำระเงินแล้ว รายละเอียดมีดังนี้:</p>`

        let customSubject = `💳 ใบแจ้งหนี้ใหม่ - ${invoice.package_details}`

        if (template) {
            customSubject = template.subject
                .replace(/\[CLIENT_NAME\]/g, invoice.client_name)
                .replace(/\[AMOUNT\]/g, formattedTotal)
                .replace(/\[DUE_DATE\]/g, formattedDate)
                .replace(/\[PAYMENT_LINK\]/g, `${process.env.NEXT_PUBLIC_SITE_URL}/payment/${invoice.id}`)

            customBody = template.body_html
                .replace(/\[CLIENT_NAME\]/g, invoice.client_name)
                .replace(/\[AMOUNT\]/g, formattedTotal)
                .replace(/\[DUE_DATE\]/g, formattedDate)
                .replace(/\[PAYMENT_LINK\]/g, `${process.env.NEXT_PUBLIC_SITE_URL}/payment/${invoice.id}`)
        }

        // Check if this is the first invoice for this project (same email + same client name = recurring, skip tracking code)
        const { count: existingCount } = await supabase
            .from('invoices')
            .select('id', { count: 'exact', head: true })
            .eq('client_email', invoice.client_email)
            .eq('client_name', invoice.client_name)

        const isFirstInvoice = (existingCount || 0) <= 1
        const trackingCodeSection = isFirstInvoice && invoice.tracking_code
            ? `<div style="background-color: #f0fdf4; padding: 18px; border-radius: 8px; margin: 25px 0; border: 1px solid #bbf7d0;">
                    <p style="margin: 0 0 8px; color: #166534; font-weight: bold; font-size: 14px;">🔍 รหัสติดตามสถานะงานของคุณ</p>
                    <p style="margin: 0; font-family: monospace; font-size: 22px; font-weight: bold; color: #15803d; letter-spacing: 2px;">${invoice.tracking_code}</p>
                    <p style="margin: 8px 0 0; color: #166534; font-size: 12px;">ใช้ตรวจสอบความคืบหน้าโครงการได้ที่ ${process.env.NEXT_PUBLIC_SITE_URL || 'เว็บไซต์ของเรา'}</p>
                </div>`
            : ''

        // Create HTML Email Template
        const htmlTemplate = `
        <div style="font-family: 'Sarabun', 'Prompt', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
            
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">${companyName}</h1>
                <p style="color: #64748b; margin-top: 5px;">ใบแจ้งหนี้ / E-Invoice</p>
            </div>

            <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                ${customBody}

                <div style="margin: 25px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background-color: #f1f5f9;">
                            <th style="padding: 12px 15px; text-align: left; color: #475569; border-bottom: 1px solid #e2e8f0;">รายการ</th>
                            <th style="padding: 12px 15px; text-align: right; color: #475569; border-bottom: 1px solid #e2e8f0;">จำนวนเงิน (฿)</th>
                        </tr>
                        <tr>
                            <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; color: #334155;">ค่าบริการแรกเข้า (Setup Fee)</td>
                            <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #334155;">${Number(invoice.setup_fee).toLocaleString('th-TH')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 15px; border-bottom: 1px solid #e2e8f0; color: #334155;">ค่าบริการอัปเดตและดูแล (Monthly Fee)</td>
                            <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #334155;">${Number(invoice.monthly_fee).toLocaleString('th-TH')}</td>
                        </tr>
                        <tr style="background-color: #f8fafc;">
                            <td style="padding: 15px; font-weight: bold; color: #1e293b;">ยอดชำระสุทธิ (Total Amount)</td>
                            <td style="padding: 15px; text-align: right; font-weight: bold; color: #4f46e5; font-size: 18px;">${formattedTotal}</td>
                        </tr>
                    </table>
                </div>

                <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                    <p style="margin: 0; color: #1e40af; font-weight: bold;">📅 กำหนดชำระภายใน: ${formattedDate}</p>
                </div>

                    <div style="text-align: center; margin: 35px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/payment/${invoice.id}" target="_blank" style="background-color: #142b41; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">ดูช่องทางการชำระเงิน</a>
                </div>

                ${trackingCodeSection}

                <p style="color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
                    กรุณาชำระเงินตามช่องทางด้านบน และ <strong>แนบสลิปโอนเงิน</strong> ที่ลิงก์ด้านบนได้เลยครับ
                </p>

                <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #94a3b8; font-size: 13px; margin: 0;">หากมีข้อซักถาม กรุณาติดต่อทางเรา <br>ขอขอบพระคุณที่ไว้วางใจ ${companyName}</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <p style="color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
            </div>
        </div>
        `

        // Prepare Attachments
        const attachments = []
        if (pdfBase64) {
            // Strip the data:application/pdf;base64, prefix if present
            const base64Data = pdfBase64.split('base64,')[1] || pdfBase64
            attachments.push({
                filename: `Invoice_${invoice.client_name.replace(/\s+/g, '_')}_${new Date(invoice.created_at || Date.now()).getTime()}.pdf`,
                content: base64Data,
                encoding: 'base64',
                contentType: 'application/pdf'
            })
        }

        // Add Service Contract if provided
        if (serviceContractBase64) {
            const base64Data = serviceContractBase64.split('base64,')[1] || serviceContractBase64
            attachments.push({
                filename: `สัญญาจ้าง_${invoice.client_name.replace(/\s+/g, '_')}.pdf`,
                content: base64Data,
                encoding: 'base64',
                contentType: 'application/pdf'
            })
        }

        // Add Installment Schedule if provided
        if (installmentScheduleBase64) {
            const base64Data = installmentScheduleBase64.split('base64,')[1] || installmentScheduleBase64
            attachments.push({
                filename: `ตารางการแบ่งชำระ_${invoice.client_name.replace(/\s+/g, '_')}.pdf`,
                content: base64Data,
                encoding: 'base64',
                contentType: 'application/pdf'
            })
        }

        // Send Email
        const info = await transporter.sendMail({
            from: `"${companyName} | Billing Team" <${process.env.EMAIL_USER}>`,
            to: invoice.client_email,
            subject: customSubject,
            html: htmlTemplate,
            attachments: attachments,
        })

        console.log('Message sent: %s', info.messageId)

        return NextResponse.json({ success: true, messageId: info.messageId }, { status: 200 })

    } catch (err: unknown) {
        console.error('API Send Email Error:', err)
        const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งอีเมล กรุณาตั้งค่า Gmail App Password ให้ถูกต้อง'
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
