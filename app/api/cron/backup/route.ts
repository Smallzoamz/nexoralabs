import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Next.js Edge / Vercel Cron Config
export const runtime = 'nodejs'
// Hobby tier max is 10s, Pro is longer. 
export const maxDuration = 300

export async function GET(req: Request) {
    const url = new URL(req.url)
    const isManual = url.searchParams.get('manual') === 'true'
    const authHeader = req.headers.get('authorization')

    // 1. Validate Cron Secret (Optional but recommended to prevent abuse)
    if (!isManual && process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Init Service Role Supabase Client (For Admin DB)
        const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.ADMIN_SECRET_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback to ANON if no service role is setup in env for testing
        )

        // 2. Determine target groups based on current date
        const today = new Date()
        const dayOfMonth = today.getDate()

        // Rules for Automated:
        // Day 1: Everyone (Standard + Pro)
        // Day 15: Pro only
        const targetPackages = ['pro']
        if (dayOfMonth === 1 || isManual) {
            targetPackages.push('standard')
        }

        // 3. Fetch eligible active clients
        const { data: clients, error } = await adminSupabase
            .from('clients')
            .select('*')
            .eq('is_active', true)
            .in('package_type', targetPackages)

        if (error) {
            console.error('[Cron] Fetch clients error:', error)
            return NextResponse.json({ error: 'Database check failed' }, { status: 500 })
        }

        if (!clients || clients.length === 0) {
            return NextResponse.json({ message: 'No scheduled backups for today' }, { status: 200 })
        }

        const appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3020'

        // 4. Trigger individual backup API internally (as background tasks without waiting for all to finish if many)
        // Or wait for them sequentially if we want to log immediately.
        // For reliability in Vercel, it's safer to wait.
        const results = []

        for (const client of clients) {
            try {
                // Here we call the existing Route we created in Phase 2, but we need
                // to inject the service role token or an admin token so it passes RLS
                // in the POST route.

                // For a more robust server-side execution, we should technically 
                // extract the `generateClientBackup` engine call here directly to avoid 
                // HTTP overhead inside Vercel Serverless. But for simplicity, we mock an HTTP call
                // with the service role token.

                // If this is a true cron, there's no session. The /api/backup/run route relies on `req.headers.get('Authorization')`
                // passing RLS. Since we are already on the server, we might need a workaround for RLS.
                // We'll pass the ANON key or ADMIN proxy key.

                // Ideally, since we are inside nodejs, we can just call the POST API directly via localhost:
                const res = await fetch(`${appUrl}/api/backup/run`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
                        // Note: If RLS blocking occurs, we need to disable RLS strictly for cron or use Service Role bypass
                    },
                    body: JSON.stringify({ clientId: client.id })
                })

                const data = await res.json()
                results.push({ client: client.name, success: res.ok, log: data })

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err)
                results.push({ client: client.name, success: false, error: errorMessage })
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${clients.length} backups`,
            results
        })

    } catch (error) {
        console.error('[CRON ERROR]', error)
        return NextResponse.json({ error: 'Internal system error' }, { status: 500 })
    }
}
