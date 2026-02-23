import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendTelegramNotification } from '@/lib/telegram'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, company, package_interest, message } = body

        if (!name || !email || !phone || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Insert into database
        const { data, error } = await supabase
            .from('contact_submissions')
            .insert([
                {
                    name,
                    email,
                    phone,
                    company: company || null,
                    package_interest: package_interest || null,
                    message,
                    status: 'new'
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Database Error:', error)
            return NextResponse.json({ error: 'Failed to save contact submission' }, { status: 500 })
        }

        // 2. Send Telegram Notification
        const notificationText = `
🚨 <b>New Contact Form Submission!</b> 🚨

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Phone:</b> ${phone}
🏢 <b>Company:</b> ${company ? company : '-'}
📦 <b>Package:</b> ${package_interest ? package_interest : '-'}

💬 <b>Message:</b>
${message}
`
        // We don't block the request if Telegram fails, but we try sending it.
        await sendTelegramNotification(notificationText)

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Contact API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
