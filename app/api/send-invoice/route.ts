import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { invoice, pdfBase64 } = body

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

        // Create HTML Email Template
        const htmlTemplate = `
        <div style="font-family: 'Sarabun', 'Prompt', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
            
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">Nexora Labs</h1>
                <p style="color: #64748b; margin-top: 5px;">ใบแจ้งหนี้ / E-Invoice</p>
            </div>

            <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #334155;">เรียน <strong>${invoice.client_name}</strong>,</p>
                <p style="color: #475569; line-height: 1.6;">รายละเอียดใบแจ้งหนี้สำหรับบริการ <strong>${invoice.package_details}</strong> พร้อมให้บริการชำระเงินแล้ว รายละเอียดมีดังนี้:</p>

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

                <p style="color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
                    กรุณาชำระเงินตามช่องทางด้านบน และ <strong>แนบสลิปโอนเงิน</strong> ที่ลิงก์ด้านบนได้เลยครับ
                </p>

                <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #94a3b8; font-size: 13px; margin: 0;">หากมีข้อซักถาม กรุณาติดต่อทางเรา <br>ขอขอบพระคุณที่ไว้วางใจ Nexora Labs</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <p style="color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} Nexora Labs. All rights reserved.</p>
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

        // Send Email
        const info = await transporter.sendMail({
            from: `"Nexora Labs" <${process.env.EMAIL_USER}>`,
            to: invoice.client_email,
            subject: `ใบแจ้งหนี้ - ${invoice.package_details}`,
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
