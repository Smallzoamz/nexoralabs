import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        if (!_supabase) {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

            if (!url || !key) {
                // Silently return a no-op chainable object during build if env vars are missing
                /* eslint-disable @typescript-eslint/no-explicit-any */
                const noop: any = () => {
                    const obj: any = {
                        from: noop,
                        select: noop,
                        eq: noop,
                        limit: noop,
                        order: noop,
                        insert: noop,
                        update: noop,
                        delete: noop,
                        rpc: noop,
                        single: noop,
                        maybeSingle: noop,
                        then: (onfulfilled: any) => Promise.resolve({ data: null, error: null }).then(onfulfilled),
                        storage: { from: noop },
                        channel: noop,
                        on: noop,
                        subscribe: noop,
                    };
                    obj.auth = {
                        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
                        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                        admin: obj
                    };
                    return obj;
                }
                return (noop() as any)[prop] || noop
                /* eslint-enable @typescript-eslint/no-explicit-any */
            }
            _supabase = createClient(url, key)
        }
        return (_supabase as unknown as Record<string, unknown>)[prop as string]
    }
})
