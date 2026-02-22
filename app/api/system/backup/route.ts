import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60 // Allow up to 60 seconds
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // Authenticate the request (require a valid session token)
        const authHeader = request.headers.get('Authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized. Missing token.' }, { status: 401 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Supabase Configuration Missing')
        }

        // Use service role key to bypass RLS for backup
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const token = authHeader.replace('Bearer ', '')

        // Verify the user is an admin
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
        }

        // Define the tables we want to backup
        const tablesToBackup = [
            'clients',
            'contact_submissions',
            'packages',
            'invoices',
            'payment_settings',
            'site_config',
            'trust_badges'
        ]

        interface BackupData {
            metadata: {
                exported_at: string
                exported_by: string | undefined
                version: string
            }
            data: Record<string, unknown>
        }

        const backupData: BackupData = {
            metadata: {
                exported_at: new Date().toISOString(),
                exported_by: user.email,
                version: '1.0'
            },
            data: {}
        }

        // Fetch all data from the defined tables
        for (const table of tablesToBackup) {
            const { data, error } = await supabase.from(table).select('*')
            if (error) {
                console.error(`Error backing up table ${table}:`, error)
                // We'll continue even if one table fails, but note it
                backupData.data[table] = { error: error.message }
            } else {
                backupData.data[table] = data
            }
        }

        const jsonString = JSON.stringify(backupData, null, 2)
        const buffer = Buffer.from(jsonString, 'utf-8')

        const currentDate = new Date().toISOString().split('T')[0]
        const filename = `nexora_system_backup_${currentDate}.json`

        // Send as a downloadable file
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${filename}"`,
            }
        })

    } catch (error) {
        console.error('System backup error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
