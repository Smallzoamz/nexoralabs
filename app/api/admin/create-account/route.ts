import { NextResponse } from 'next/server'
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
        const body = await req.json()
        const { name, email, package_type, supabase_url, supabase_key } = body

        if (!name || !email) {
            return NextResponse.json(
                { error: 'กรุณาระบุชื่อและอีเมลของลูกค้า' },
                { status: 400 }
            )
        }

        // 1. Check if user already exists
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()
        if (usersError) throw usersError

        const userExists = usersData.users.find(u => u.email === email)
        if (userExists) {
            return NextResponse.json(
                { error: 'อีเมลนี้ถูกใช้งานแล้วในระบบ' },
                { status: 400 }
            )
        }

        // 2. Generate random 8 character password
        const generatedPassword = Math.random().toString(36).slice(-8)

        // 3. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: generatedPassword,
            email_confirm: true,
            user_metadata: {
                role: 'client',
                name: name
            }
        })

        if (authError) throw authError
        const newUser = authData.user

        // 4. Create Client Profile
        const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .insert([{
                name,
                package_type: package_type || 'standard',
                supabase_url: supabase_url || '-',
                supabase_key: supabase_key || '-',
                is_active: true
            }])
            .select()
            .single()

        if (clientError) {
            // Cleanup Auth User if client creation fails
            await supabase.auth.admin.deleteUser(newUser.id)
            throw clientError
        }

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

        return NextResponse.json({
            success: true,
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
