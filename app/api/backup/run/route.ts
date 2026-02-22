import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateClientBackup, ClientCredentials } from '@/lib/backup-engine'

// 1 Hour timeout (hobby max 10s usually, but for pro edge functions it can be longer)
// We are assuming a basic Node.js runtime here.
export const maxDuration = 300

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { clientId } = body

        if (!clientId) {
            return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
        }

        const authHeader = req.headers.get('Authorization')

        // Initialize an authorized client for this request context
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        ...(authHeader ? { Authorization: authHeader } : {})
                    }
                }
            }
        )

        // 1. Fetch Client Credentials from Admin Database
        const { data: client, error: fetchError } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single()

        if (fetchError || !client) {
            return NextResponse.json({ error: 'Client not found or db error' }, { status: 404 })
        }

        // 2. Mark log as Pending
        const { data: logEntry, error: logInitError } = await supabase
            .from('backup_logs')
            .insert({
                client_id: client.id,
                status: 'pending',
                type: 'manual'   // Can be 'monthly' or 'bi-weekly' if triggered by Cron later
            })
            .select()
            .single()

        if (logInitError) {
            console.error('[Backup API] Failed to initialize log:', logInitError)
            return NextResponse.json({ error: 'System log error' }, { status: 500 })
        }

        try {
            // 3. Execute Engine
            const backupResult = await generateClientBackup(client as ClientCredentials)

            // 4. Upload to Admin's active 'backups' bucket
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('backups')
                .upload(`${client.id}/${backupResult.fileName}`, backupResult.buffer, {
                    contentType: backupResult.type === 'zip' ? 'application/zip' : 'application/json',
                    upsert: true
                })

            if (uploadError) throw uploadError

            // 5. Update Log to Success
            await supabase
                .from('backup_logs')
                .update({
                    status: 'success',
                    file_path: uploadData.path,
                    file_size_bytes: backupResult.buffer.length
                })
                .eq('id', logEntry.id)

            return NextResponse.json({
                success: true,
                message: `Successfully backed up ${client.name}`,
                path: uploadData.path
            }, { status: 200 })

        } catch (engineError: Error | unknown) {
            console.error('[Backup Engine Error]', engineError)

            // Revert Log to Failed
            const errorMessage = engineError instanceof Error ? engineError.message : String(engineError)
            await supabase
                .from('backup_logs')
                .update({
                    status: 'failed',
                    error_message: errorMessage
                })
                .eq('id', logEntry.id)

            return NextResponse.json({ error: 'Backup process failed internally' }, { status: 500 })
        }

    } catch (error) {
        console.error('[Backup API Route Error]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
