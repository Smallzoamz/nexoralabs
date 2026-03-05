-- Relax constraints on client_users to allow one user to have multiple client profiles
-- This is necessary for customers who own multiple projects/websites.

ALTER TABLE public.client_users DROP CONSTRAINT IF EXISTS client_users_user_id_key;
ALTER TABLE public.client_users DROP CONSTRAINT IF EXISTS client_users_client_id_key;

-- Note: user_id + client_id should still be unique together to prevent duplicate links
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'client_users_user_id_client_id_key'
    ) THEN
        ALTER TABLE public.client_users ADD CONSTRAINT client_users_user_id_client_id_key UNIQUE (user_id, client_id);
    END IF;
END $$;
