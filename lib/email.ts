import nodemailer from 'nodemailer'

// Create shared transporter for all email APIs
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
})

// Note: Don't verify on startup - it will be verified when first used

export interface EmailOptions {
    to: string
    subject: string
    html: string
    from?: string
    attachments?: Array<{
        filename: string
        content: Buffer | string
        contentType?: string
    }>
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    const companyName = process.env.NEXT_PUBLIC_SITE_NAME || 'VELOZI | Dev'

    await transporter.sendMail({
        from: options.from || `"${companyName}" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments
    })
}

export { transporter }
