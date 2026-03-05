import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { transporter } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const body = await req.json()
        const { invoice, amount, pdfBase64, clientPassword } = body

        if (!invoice || !invoice.client_email) {
            return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
        }

        // Use shared transporter from lib/email.ts

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

        const [
            { data: template },
            { data: siteConfig }
        ] = await Promise.all([
            supabase.from('email_templates').select('*').eq('template_name', 'RECEIPT').single(),
            supabase.from('site_config').select('site_name, contact_email').limit(1).maybeSingle()
        ])

        const companyName = siteConfig?.site_name || 'Nexora Labs'
        const companyEmail = siteConfig?.contact_email || 'contact@nexoralabs.com'

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
                    <p style="margin:0;color:#64748b;font-size:14px;">${companyName} | Billing Team</p>
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

                    ${clientPassword ? `
                    <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                        <div style="background:linear-gradient(90deg,#22c55e,#16a34a);padding:14px 20px;">
                            <p style="margin:0;font-weight:700;color:white;font-size:15px;">🔑 ข้อมูลเข้าสู่ระบบ Customer Portal</p>
                        </div>
                        <div style="padding:20px;">
                            <p style="color:#334155;font-size:14px;margin:0 0 16px;line-height:1.6;">ระบบได้สร้างบัญชีสำหรับติดตามสถานะงานของท่านเรียบร้อยแล้ว สามารถเข้าสู่ระบบได้ด้วยข้อมูลด้านล่าง:</p>
                            <table style="width:100%;border-collapse:collapse;">
                                <tr>
                                    <td style="padding:10px 14px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;width:35%;">📧 Username (Email)</td>
                                    <td style="padding:10px 14px;color:#1e293b;font-weight:600;font-size:14px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${invoice.client_email}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 14px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;">🔒 Password</td>
                                    <td style="padding:10px 14px;color:#1e293b;font-weight:700;font-size:16px;border-bottom:1px solid #e2e8f0;font-family:monospace;letter-spacing:1px;">${clientPassword}</td>
                                </tr>
                            </table>
                            <div style="margin-top:16px;text-align:center;">
                                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nexoralabs.com'}/login" style="display:inline-block;background:linear-gradient(90deg,#22c55e,#16a34a);color:white;padding:12px 32px;border-radius:10px;font-weight:700;text-decoration:none;font-size:14px;">🚀 เข้าสู่ระบบ Customer Portal</a>
                            </div>
                            <p style="margin:12px 0 0;color:#94a3b8;font-size:12px;text-align:center;">⚠️ แนะนำให้เปลี่ยนรหัสผ่านหลังเข้าสู่ระบบครั้งแรก</p>
                        </div>
                    </div>
                    ` : `<div style="background:#fef3c7;border:2px solid #fde68a;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                        <div style="background:linear-gradient(90deg,#f59e0b,#d97706);padding:14px 20px;">
                            <p style="margin:0;font-weight:700;color:white;font-size:15px;">🔐 ข้อมูลเข้าสู่ระบบ</p>
                        </div>
                        <div style="padding:20px;">
                            <p style="color:#92400e;font-size:14px;margin:0 0 12px;line-height:1.6;">ระบบพบว่าท่านมีบัญชีอยู่แล้ว สามารถเข้าสู่ระบบด้วยอีเมลนี้ได้ทันที</p>
                            <div style="margin-top:16px;text-align:center;">
                                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nexoralabs.com'}/login" style="display:inline-block;background:linear-gradient(90deg,#f59e0b,#d97706);color:white;padding:12px 32px;border-radius:10px;font-weight:700;text-decoration:none;font-size:14px;">🚀 เข้าสู่ระบบ Customer Portal</a>
                            </div>
                            <p style="margin:12px 0 0;color:#92400e;font-size:12px;text-align:center;">📧 หากท่านลืมรหัสผ่าน กรุณาคลิก "ลืมรหัสผ่าน" ที่หน้าเข้าสู่ระบบ</p>
                        </div>
                    </div>`}

                    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;">
                        <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">📋 ท่านจะได้รับบิลสำหรับเดือนถัดไปตามรอบปกติ หากมีข้อสงสัย ติดต่อเราได้ที่ <a href="mailto:${companyEmail}" style="color:#d97706;font-weight:600;">${companyEmail}</a></p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="padding:20px 40px 28px;text-align:center;border-top:1px solid #f1f5f9;">
                    <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.8;">ขอบคุณที่ไว้วางใจ <strong>${companyName}</strong><br/>© ${new Date().getFullYear()} ${companyName} | Billing Team</p>
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
            from: `"${companyName} | Billing Team" <${process.env.EMAIL_USER}>`,
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
