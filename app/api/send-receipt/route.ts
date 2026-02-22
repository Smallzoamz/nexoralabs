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
        const { invoice, amount, pdfBase64 } = body

        if (!invoice || !invoice.client_email) {
            return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        })

        await transporter.verify()

        const formattedAmount = Number(amount).toLocaleString('th-TH')
        const receiptNo = `REC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Date.now().toString().slice(-6)}`
        const todayTH = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })

        // Pretty SVG checkmark icon
        const checkmarkSvg = `
        <div style="width:72px;height:72px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 8px 24px rgba(22,163,74,0.35);display:flex;align-items:center;justify-content:center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>`

        const { data: template } = await supabase
            .from('email_templates')
            .select('*')
            .eq('template_name', 'RECEIPT')
            .single()

        let customBody = `<p style="font-size:16px;color:#334155;margin:0 0 8px;">เรียน <strong>${invoice.client_name}</strong>,</p>
                    <p style="color:#475569;line-height:1.7;margin:0 0 28px;">เราได้รับยืนยันการชำระเงินค่าบริการของท่านเรียบร้อยแล้ว ขอขอบพระคุณที่ไว้วางใจ Nexora Labs ครับ 🙏</p>`

        let customSubject = `✅ ยืนยันการชำระเงิน - ${invoice.package_details} (${receiptNo})`

        if (template) {
            customSubject = template.subject
                .replace(/\[CLIENT_NAME\]/g, invoice.client_name)
                .replace(/\[AMOUNT\]/g, formattedAmount)

            customBody = template.body_html
                .replace(/\[CLIENT_NAME\]/g, invoice.client_name)
                .replace(/\[AMOUNT\]/g, formattedAmount)
        }

        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background-color:#f0fdf4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <div style="max-width:600px;margin:30px auto;padding:20px;">

            <!-- Header Card -->
            <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                
                <!-- Green top stripe -->
                <div style="height:6px;background:linear-gradient(90deg,#22c55e,#16a34a);"></div>

                <div style="padding:40px 40px 32px;text-align:center;border-bottom:1px solid #f0fdf4;">
                    ${checkmarkSvg}
                    <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;color:#15803d;letter-spacing:-0.5px;">ชำระเงินสำเร็จ! 🎉</h1>
                    <p style="margin:0;color:#64748b;font-size:14px;">Nexora Labs | Billing Team</p>
                </div>

                <!-- Body -->
                <div style="padding:32px 40px;">
                    ${customBody}

                    <!-- Receipt Details -->
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                        <div style="background:linear-gradient(90deg,#f0fdf4,#dcfce7);padding:14px 20px;border-bottom:1px solid #bbf7d0;">
                            <p style="margin:0;font-weight:700;color:#15803d;font-size:14px;letter-spacing:0.5px;">📄 ใบเสร็จรับเงิน</p>
                        </div>
                        <table style="width:100%;border-collapse:collapse;">
                            <tr>
                                <td style="padding:12px 20px;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;width:45%;">เลขที่ใบเสร็จ</td>
                                <td style="padding:12px 20px;text-align:right;font-weight:600;color:#1e293b;border-bottom:1px solid #f1f5f9;font-family:monospace;">${receiptNo}</td>
                            </tr>
                            <tr>
                                <td style="padding:12px 20px;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">วันที่ชำระ</td>
                                <td style="padding:12px 20px;text-align:right;color:#334155;border-bottom:1px solid #f1f5f9;">${todayTH}</td>
                            </tr>
                            <tr>
                                <td style="padding:12px 20px;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">บริการ</td>
                                <td style="padding:12px 20px;text-align:right;color:#334155;border-bottom:1px solid #f1f5f9;">${invoice.package_details}</td>
                            </tr>
                            <tr style="background:linear-gradient(90deg,#f0fdf4,#f8fafc);">
                                <td style="padding:16px 20px;font-weight:700;color:#1e293b;font-size:15px;">ยอดชำระสุทธิ</td>
                                <td style="padding:16px 20px;text-align:right;font-weight:800;color:#16a34a;font-size:24px;">฿${formattedAmount}</td>
                            </tr>
                        </table>
                    </div>

                    ${pdfBase64 ? '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin-bottom:24px;"><p style="margin:0;color:#1e40af;font-size:14px;">📎 ใบเสร็จรับเงินแบบ PDF แนบมาพร้อมอีเมลฉบับนี้แล้วครับ</p></div>' : ''}

                    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;">
                        <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">📋 ท่านจะได้รับบิลสำหรับเดือนถัดไปตามรอบปกติ หากมีข้อสงสัย ติดต่อเราได้ที่ <a href="mailto:contact@nexoralabs.com" style="color:#d97706;font-weight:600;">contact@nexoralabs.com</a></p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="padding:20px 40px 28px;text-align:center;border-top:1px solid #f1f5f9;">
                    <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.8;">ขอบคุณที่ไว้วางใจ <strong>Nexora Labs</strong><br/>© ${new Date().getFullYear()} Nexora Labs | Billing Team</p>
                </div>
            </div>

        </div>
        </body>
        </html>`

        // Build nodemailer message with optional PDF attachment
        type MailAttachment = { filename: string; content: Buffer; contentType: string }
        const attachments: MailAttachment[] = []
        if (pdfBase64) {
            // pdfBase64 is a data URI: "data:application/pdf;base64,<base64data>"
            const base64Data = pdfBase64.split(',')[1]
            if (base64Data) {
                attachments.push({
                    filename: `Receipt_${receiptNo}_${invoice.client_name.replace(/\s+/g, '_')}.pdf`,
                    content: Buffer.from(base64Data, 'base64'),
                    contentType: 'application/pdf',
                })
            }
        }

        await transporter.sendMail({
            from: `"Nexora Labs | Billing Team" <${process.env.EMAIL_USER}>`,
            to: invoice.client_email,
            subject: customSubject,
            html: htmlTemplate,
            attachments,
        })

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (err: unknown) {
        console.error('Send Receipt Email Error:', err)
        const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งอีเมลใบเสร็จ'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
