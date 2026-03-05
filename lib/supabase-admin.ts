import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabaseAdmin: SupabaseClient | null = null

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        if (!_supabaseAdmin) {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const key = process.env.SUPABASE_SERVICE_ROLE_KEY

            if (!url || !key) {
                /* eslint-disable @typescript-eslint/no-explicit-any */
                const noop: any = () => {
                    const obj: any = {
                        from: noop,
                        select: noop,
                        eq: noop,
                        limit: noop,
                        rpc: noop,
                        single: noop,
                        maybeSingle: noop,
                        then: (onfulfilled: any) => Promise.resolve({ data: null, error: null }).then(onfulfilled),
                    };
                    obj.auth = { admin: obj };
                    return obj;
                }
                return (noop() as any)[prop] || noop
                /* eslint-enable @typescript-eslint/no-explicit-any */
            }

            _supabaseAdmin = createClient(url, key, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            })
        }
        return (_supabaseAdmin as unknown as Record<string, unknown>)[prop as string]
    }
})
