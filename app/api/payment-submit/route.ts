import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendTelegramNotification } from '@/lib/telegram'

export async function POST(request: Request) {
    try {
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
        await sendTelegramNotification(notificationText)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Payment Submit API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
