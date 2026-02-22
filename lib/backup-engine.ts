import { createClient } from '@supabase/supabase-js'
import JSZip from 'jszip'

/**
 * Interface mapping client credentials passed in from DB
 */
export interface ClientCredentials {
    id: string
    name: string
    supabase_url: string
    supabase_key: string
    package_type: 'standard' | 'pro'
}

/**
 * Extract all generic public tables from a Supabase instance dynamically 
 * by querying the `pg_meta` or schema metadata if possible. 
 * Note: Since REST API doesn't expose `pg_tables` easily without an RPC,
 * we will require the admin to define the tables they want backed up, or 
 * assume standard Nexora tables for now.
 */
const NEXORA_CORE_TABLES = [
    'services', 'contacts', 'content_blocks',
    'packages', 'site_settings', 'faqs', 'trust_badges', 'invoices'
]

/**
 * Backup Engine Execution
 */
export async function generateClientBackup(clientData: ClientCredentials): Promise<{ buffer: Buffer, fileName: string, type: string }> {
    // 1. Initialize custom Supabase Client targeting the specific Customer DB
    const targetSupabase = createClient(clientData.supabase_url, clientData.supabase_key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const safeName = clientData.name.replace(/[^a-zA-Z0-9_\-]/g, '_')

    // ==========================================
    // Phase 1: Database Extraction (All Packages)
    // ==========================================
    const dbExport: Record<string, Record<string, unknown>[]> = {}

    for (const tableName of NEXORA_CORE_TABLES) {
        try {
            const { data, error } = await targetSupabase.from(tableName).select('*')
            if (!error && data) {
                dbExport[tableName] = data
            }
        } catch {
            // Table might not exist in client DB, skip safely
            console.warn(`[Backup Engine] Skipping table ${tableName} for client ${clientData.name}`)
        }
    }

    const jsonData = JSON.stringify(dbExport, null, 2)

    // ==========================================
    // Phase 2: Storage Extraction (Pro Package Only)
    // ==========================================
    if (clientData.package_type === 'pro') {
        const zip = new JSZip()

        // Add DB JSON
        zip.file('database_export.json', jsonData)

        // Find all buckets first
        const { data: buckets } = await targetSupabase.storage.listBuckets()

        if (buckets && buckets.length > 0) {
            // Loop through each bucket
            for (const bucket of buckets) {
                // List files in the root of the bucket
                // Note: For deep nested folders, a recursive function is needed. 
                // We'll stick to a shallow root/folder fetch for this MVP.
                const { data: files } = await targetSupabase.storage.from(bucket.name).list()

                if (files && files.length > 0) {
                    for (const file of files) {
                        if (file.id === null) continue // pure folder placeholder

                        const { data: fileBlob } = await targetSupabase.storage.from(bucket.name).download(file.name)

                        if (fileBlob) {
                            const arrayBuffer = await fileBlob.arrayBuffer()
                            zip.file(`storage/${bucket.name}/${file.name}`, Buffer.from(arrayBuffer))
                        }
                    }
                }
            }
        }

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

        return {
            buffer: zipBuffer,
            fileName: `${safeName}_backup_${timestamp}.zip`,
            type: 'binary'
        }
    }

    // ==========================================
    // Standard Package (JSON Only Output)
    // ==========================================
    return {
        buffer: Buffer.from(jsonData, 'utf-8'),
        fileName: `${safeName}_backup_${timestamp}.json`,
        type: 'json'
    }
}
