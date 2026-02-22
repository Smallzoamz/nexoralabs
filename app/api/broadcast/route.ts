import { NextResponse } from 'next/dist/server/web/spec-extension/response'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

export async function POST(req: Request) {
    try {
        const { subject, body_html } = await req.json()

        if (!subject || !body_html) {
            return NextResponse.json({ error: 'Missing subject or body' }, { status: 400 })
        }

        // Fetch all unique client emails from invoices table
        // Use DISTINCT to get unique emails directly from database
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select('client_email, client_name')
            .order('client_email', { ascending: true })

        if (error) {
            throw error
        }

        if (!invoices || invoices.length === 0) {
            return NextResponse.json({ error: 'No clients found' }, { status: 404 })
        }

        // Get unique emails using Set (handles any duplicates)
        const uniqueEmails = Array.from(new Set(invoices.map(inv => inv.client_email).filter(Boolean)))

        if (uniqueEmails.length === 0) {
            return NextResponse.json({ error: 'No valid client emails found' }, { status: 404 })
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        })

        let sentCount = 0

        // Send emails sequentially or in small batches to avoid Gmail rate limits
        for (const email of uniqueEmails) {
            try {
                await transporter.sendMail({
                    from: `"Nexora Labs" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: subject,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                            ${body_html}
                            <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px; margin-bottom: 20px;">
                            <p style="font-size: 12px; color: #888; text-align: center;">
                                อีเมลฉบับนี้เป็นการส่งแจ้งเตือนจากระบบอัตโนมัติ<br>
                                © ${new Date().getFullYear()} Nexora Labs
                            </p>
                        </div>
                    `,
                })
                sentCount++
            } catch (emailErr) {
                console.error(`Failed to send broadcast to ${email}:`, emailErr)
                // Continue to next email even if one fails
            }

            // Artificial delay to prevent triggering spam filters (e.g. 100ms)
            await new Promise(resolve => setTimeout(resolve, 100))
        }

        return NextResponse.json({ success: true, sentCount, totalTargets: uniqueEmails.length })
    } catch (err: unknown) {
        console.error('Broadcast API error:', err)
        const msg = err instanceof Error ? err.message : 'Internal Server Error'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}
