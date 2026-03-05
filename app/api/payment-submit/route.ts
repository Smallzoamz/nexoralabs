import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendTelegramNotification } from '@/lib/telegram'

export async function POST(request: Request) {
    try {
        // Create client inside handler to avoid build-time initialization error
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        )

        const body = await request.json()
        const { invoice_id, amount, slip_url, client_name, package_details } = body

        if (!invoice_id || !slip_url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Insert into database
        const { error } = await supabase
            .from('payment_submissions')
            .insert({
                invoice_id,
                amount,
                slip_url,
                status: 'pending'
            })

        if (error) {
            console.error('Database Error:', error)
            return NextResponse.json({ error: 'Failed to submit payment' }, { status: 500 })
        }

        // 2. Send Telegram Notification
        const notificationText = `
💰 <b>New Payment Slip Uploaded!</b> 💰

👤 <b>Client:</b> ${client_name || 'Unknown'}
📦 <b>Package:</b> ${package_details || '-'}
🏷️ <b>Invoice ID:</b> ${invoice_id.substring(0, 8)}...
💵 <b>Amount Transfered:</b> ฿${Number(amount).toLocaleString('th-TH')}

📄 <a href="${slip_url}">View Slip Image</a>

Please verify this slip in the Admin Dashboard!
`
        try {
            await sendTelegramNotification(notificationText)
        } catch (telegramError) {
            console.error('Telegram notification failed (non-blocking):', telegramError)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Payment Submit API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
