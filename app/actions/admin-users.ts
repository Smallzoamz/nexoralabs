'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@/lib/auth-context'

export interface AdminUser {
    id: string
    email: string
    name: string
    role: UserRole
    created_at: string
    last_sign_in_at?: string
}

// --------------------------------------------------------------------------
// Ensure caller is authorized (Note: In a real production app with sensitive data, 
// you should verify the caller via cookies or passing a token. For simplicity 
// here, we rely on the component wrapping these calls restricting access).
// --------------------------------------------------------------------------

// Fetch all staff (superadmin, admin, moderator)
export async function getAdminUsers(): Promise<{ success: boolean; data?: AdminUser[]; error?: string }> {
    try {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers()
        if (error) throw error

        const adminUsers = data.users
            .map(user => ({
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.name || 'Unknown',
                role: (user.user_metadata?.role || 'admin') as UserRole,
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at
            }))
            .filter(user => ['superadmin', 'admin', 'moderator'].includes(user.role))

        return { success: true, data: adminUsers }
    } catch (error: unknown) {
        console.error('Error fetching admin users:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// Create a new staff account
export async function createAdminUser(
    email: string,
    password: string,
    name: string,
    role: UserRole
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name,
                role
            }
        })

        if (error) throw error

        revalidatePath('/admin')
        return { success: true }
    } catch (error: unknown) {
        console.error('Error creating admin user:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// Update an existing staff account (role or name)
export async function updateAdminUser(
    uid: string,
    name: string,
    role: UserRole,
    password?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const updates: {
            user_metadata: { name: string; role: UserRole }
            password?: string
        } = {
            user_metadata: { name, role }
        }

        if (password && password.trim() !== '') {
            updates.password = password
        }

        const { error } = await supabaseAdmin.auth.admin.updateUserById(uid, updates)

        if (error) throw error

        revalidatePath('/admin')
        return { success: true }
    } catch (error: unknown) {
        console.error('Error updating admin user:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// Delete a staff account
export async function deleteAdminUser(uid: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(uid)

        if (error) throw error

        revalidatePath('/admin')
        return { success: true }
    } catch (error: unknown) {
        console.error('Error deleting admin user:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}
