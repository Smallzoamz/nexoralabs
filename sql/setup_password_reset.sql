-- Password Reset Token System

-- 1. Create password_resets table
CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets(email);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON public.password_resets(token);

-- Policies: Everyone can create and read (for password reset flow)
CREATE POLICY "Anyone can create password reset"
ON public.password_resets FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read password reset by token"
ON public.password_resets FOR SELECT
TO public
USING (true);

-- Only authenticated can update (mark as used)
CREATE POLICY "Authenticated can update password reset"
ON public.password_resets FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated can delete password reset"
ON public.password_resets FOR DELETE
TO authenticated
USING (true);

-- 2. Function to clean up expired tokens (call this periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_password_resets()
RETURNS void AS $$
BEGIN
    DELETE FROM public.password_resets 
    WHERE expires_at < timezone('utc'::text, now()) 
    OR used_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Function to generate secure token
CREATE OR REPLACE FUNCTION public.generate_password_reset_token()
RETURNS TEXT AS $$
DECLARE
    token_text TEXT;
BEGIN
    -- Generate a random token using PostgreSQL's random function
    token_text := encode(gen_random_bytes(32), 'hex');
    RETURN token_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
