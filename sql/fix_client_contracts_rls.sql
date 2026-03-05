-- fix_client_contracts_rls.sql
-- Allow clients to view their own contracts

-- Enable RLS (already enabled but just in case)
ALTER TABLE public.client_contracts ENABLE ROW LEVEL SECURITY;

-- Drop existing restricted policies if any (we previously had an admin-only one)
-- CREATE POLICY "Admin full access client_contracts" ON public.client_contracts TO authenticated USING (true) WITH CHECK (true);

-- Policy: Clients can see contracts where the client_id matches their client_id in client_users
CREATE POLICY "Clients can view own contracts" ON public.client_contracts
    FOR SELECT
    TO authenticated
    USING (
        client_id IN (
            SELECT client_id FROM public.client_users WHERE user_id = auth.uid()
        )
    );

-- Also ensure clients can't edit or delete
-- (No policy needed as we only want SELECT)
