import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { ipHash, userAgent, path } = body

        if (!ipHash || !path) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.json({ error: 'Configuration missing' }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { error } = await supabase
            .from('site_analytics')
            .insert([{ ip_hash: ipHash, user_agent: userAgent, path }])

        if (error) {
            console.error('Analytics tracking error:', error)
            return NextResponse.json({ error: 'Failed to insert track data' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
