import { supabase } from '@/lib/supabase'

export async function logAdminAction(adminEmail: string, actionType: string, details: string = '') {
    try {
        const { error } = await supabase
            .from('admin_logs')
            .insert({
                admin_email: adminEmail,
                action_type: actionType,
                details: details
            })

        if (error) {
            console.error('Failed to log admin action:', error)
        }
    } catch (err) {
        console.error('Error in logAdminAction:', err)
    }
}
