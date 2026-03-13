import { supabase } from '@/lib/supabase'

export interface LogAdminActionPayload {
    adminEmail: string;
    actionType: string;
    details?: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
    status?: 'SUCCESS' | 'FAILED';
    severity?: 'INFO' | 'WARNING' | 'CRITICAL';
    ipAddress?: string;
    userAgent?: string;
}

// Support both old signature (adminEmail, actionType, details) and new payload object
export async function logAdminAction(
    payloadOrEmail: string | LogAdminActionPayload,
    actionType?: string,
    details: string = ''
) {
    try {
        let insertData: Record<string, unknown> = {};

        if (typeof payloadOrEmail === 'string') {
            // Old signature backward compatibility
            insertData = {
                admin_email: payloadOrEmail,
                action_type: actionType || 'UNKNOWN',
                details: details,
                status: 'SUCCESS',
                severity: 'INFO'
            };
        } else {
            // New signature
            insertData = {
                admin_email: payloadOrEmail.adminEmail,
                action_type: payloadOrEmail.actionType,
                details: payloadOrEmail.details || '',
                resource_type: payloadOrEmail.resourceType || null,
                resource_id: payloadOrEmail.resourceId || null,
                metadata: payloadOrEmail.metadata || null,
                status: payloadOrEmail.status || 'SUCCESS',
                severity: payloadOrEmail.severity || 'INFO',
                ip_address: payloadOrEmail.ipAddress || null,
                user_agent: payloadOrEmail.userAgent || null,
            };
        }

        const { error } = await supabase
            .from('admin_logs')
            .insert(insertData)

        if (error) {
            console.error('Failed to log admin action:', error)
        }
    } catch (err) {
        console.error('Error in logAdminAction:', err)
    }
}
