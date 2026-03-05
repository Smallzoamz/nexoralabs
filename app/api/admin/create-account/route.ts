import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        const body = await req.json()
        const { name, email, package_type, website_name, supabase_url, supabase_key, force } = body

        if (!name || !email) {
            return NextResponse.json(
                { error: 'กรุณาระบุชื่อและอีเมลของลูกค้า' },
                { status: 400 }
            )
        }

        // 1. Check if user already exists
        console.log('[create-account] Checking if user exists:', email, 'force:', force)
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()
        if (usersError) {
            console.error('[create-account] Error listing users:', usersError)
            throw usersError
        }

        let userExists = usersData.users.find(u => u.email === email)
        console.log('[create-account] User exists:', !!userExists, userExists?.id)

        // If force=true and user exists, delete the old user first
        if (force && userExists) {
            console.log('[create-account] Force mode: deleting old user:', userExists.id)

            // Delete related records first
            const { data: linkData } = await supabase
                .from('client_users')
                .select('client_id')
                .eq('user_id', userExists.id)
                .single()

            if (linkData?.client_id) {
                await supabase.from('client_websites').delete().eq('client_id', linkData.client_id)
                await supabase.from('client_users').delete().eq('client_id', linkData.client_id)
                await supabase.from('clients').delete().eq('id', linkData.client_id)
            }

            // Delete the auth user
            await supabase.auth.admin.deleteUser(userExists.id)
            userExists = undefined
            console.log('[create-account] Old user deleted, will create new one')
        }

        if (userExists) {
            // User already exists — still create website record if website_name provided
            if (website_name) {
                console.log('[create-account] User exists, creating website record...')
                // Find client_id from client_users
                const { data: linkData } = await supabase
                    .from('client_users')
                    .select('client_id')
                    .eq('user_id', userExists.id)
                    .single()

                await supabase.from('client_websites').insert([{
                    client_id: linkData?.client_id || null,
                    client_email: email,
                    website_name: website_name,
                    package: package_type || 'standard',
                    status: 'pending'
                }])
            }

            return NextResponse.json({
                success: true,
                alreadyExists: true,
                message: 'ลูกค้ามีบัญชีอยู่แล้ว เพิ่มโปรเจกต์ใหม่เรียบร้อย',
                data: { email, password: null }
            })
        }

        // 2. Generate random 8 character password
        const generatedPassword = Math.random().toString(36).slice(-8)
        console.log('[create-account] Generated password for:', email)

        // 3. Create Auth User
        console.log('[create-account] Creating auth user...')
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: generatedPassword,
            email_confirm: true,
            user_metadata: {
                role: 'client',
                name: name
            }
        })

        if (authError) {
            console.error('[create-account] Auth user creation failed:', authError)
            throw authError
        }
        const newUser = authData.user
        console.log('[create-account] Auth user created:', newUser?.id)

        // 4. Create Client Profile
        console.log('[create-account] Creating client profile...')

        // Normalize package_type to valid values
        let normalizedPackage = package_type?.toLowerCase() || 'standard'
        if (normalizedPackage.includes('pro') || normalizedPackage.includes('professional')) {
            normalizedPackage = 'pro'
        } else if (!normalizedPackage.includes('standard')) {
            normalizedPackage = 'standard'
        }

        const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .insert([{
                name,
                package_type: normalizedPackage,
                supabase_url: supabase_url || '-',
                supabase_key: supabase_key || '-',
                is_active: true
            }])
            .select()
            .single()

        if (clientError) {
            console.error('[create-account] Client creation failed:', clientError)
            // Cleanup Auth User if client creation fails
            await supabase.auth.admin.deleteUser(newUser.id)
            throw clientError
        }
        console.log('[create-account] Client created:', clientData.id)

        // 5. Link Auth User to Client
        const { error: linkError } = await supabase
            .from('client_users')
            .insert([{
                user_id: newUser.id,
                client_id: clientData.id
            }])

        if (linkError) {
            // Cleanup
            await supabase.from('clients').delete().eq('id', clientData.id)
            await supabase.auth.admin.deleteUser(newUser.id)
            throw linkError
        }

        // 6. Create Website Record (if website_name provided)
        if (website_name) {
            console.log('[create-account] Creating website record...')
            await supabase.from('client_websites').insert([{
                client_id: clientData.id,
                client_email: email,
                website_name: website_name,
                package: normalizedPackage,
                status: 'pending'
            }])
            console.log('[create-account] Website record created')
        }

        console.log('[create-account] Account creation complete, returning password')
        return NextResponse.json({
            success: true,
            alreadyExists: false,
            message: 'สร้างบัญชีลูกค้าเรียบร้อยแล้ว',
            data: {
                email,
                password: generatedPassword,
                clientId: clientData.id
            }
        })

    } catch (err: unknown) {
        console.error('Create Account API Error:', err)
        const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดภายในระบบ'
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}

