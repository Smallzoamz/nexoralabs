import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { invoice, amount } = body

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

        const htmlTemplate = `
        <div style="font-family: 'Sarabun', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0fdf4; border-radius: 12px;">
            
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background-color: #16a34a; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 28px; line-height: 60px;">✓</span>
                </div>
                <h1 style="color: #15803d; margin: 0; font-size: 26px;">ชำระเงินสำเร็จ!</h1>
                <p style="color: #64748b; margin-top: 5px;">Nexora Labs | Billing Team</p>
            </div>

            <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);">
                <p style="font-size: 16px; color: #334155;">เรียน <strong>${invoice.client_name}</strong>,</p>
                <p style="color: #475569; line-height: 1.6;">เราได้ยืนยันการชำระเงินค่าบริการของท่านเรียบร้อยแล้ว ขอขอบพระคุณที่ไว้วางใจ Nexora Labs ครับ 🙏</p>

                <div style="margin: 25px 0; border: 1px solid #bbf7d0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #dcfce7; padding: 12px 15px; font-weight: bold; color: #15803d; border-bottom: 1px solid #bbf7d0;">
                        ใบเสร็จรับเงิน (Receipt)
                    </div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 15px; color: #475569; border-bottom: 1px solid #f0fdf4;">เลขที่ใบเสร็จ</td>
                            <td style="padding: 10px 15px; text-align: right; font-weight: bold; border-bottom: 1px solid #f0fdf4; color: #334155;">${receiptNo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 15px; color: #475569; border-bottom: 1px solid #f0fdf4;">วันที่ชำระ</td>
                            <td style="padding: 10px 15px; text-align: right; border-bottom: 1px solid #f0fdf4; color: #334155;">${todayTH}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 15px; color: #475569; border-bottom: 1px solid #f0fdf4;">บริการ</td>
                            <td style="padding: 10px 15px; text-align: right; border-bottom: 1px solid #f0fdf4; color: #334155;">${invoice.package_details}</td>
                        </tr>
                        <tr style="background-color: #f0fdf4;">
                            <td style="padding: 14px 15px; font-weight: bold; color: #1e293b;">ยอดชำระสุทธิ</td>
                            <td style="padding: 14px 15px; text-align: right; font-weight: bold; color: #16a34a; font-size: 20px;">฿${formattedAmount}</td>
                        </tr>
                    </table>
                </div>

                <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px;">📋 ท่านจะได้รับบิลสำหรับเดือนถัดไปตามรอบปกติ หากมีข้อสงสัย ติดต่อเราได้ที่ contact@nexoralabs.com</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #94a3b8; font-size: 13px; margin: 0;">ขอบคุณที่ไว้วางใจ Nexora Labs <br/>© ${new Date().getFullYear()} Nexora Labs | Billing Team</p>
                </div>
            </div>
        </div>
        `

        await transporter.sendMail({
            from: `"Nexora Labs | Billing Team" <${process.env.EMAIL_USER}>`,
            to: invoice.client_email,
            subject: `✅ ยืนยันการชำระเงิน - ${invoice.package_details} (${receiptNo})`,
            html: htmlTemplate,
        })

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (err: unknown) {
        console.error('Send Receipt Email Error:', err)
        const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งอีเมลใบเสร็จ'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
