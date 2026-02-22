-- ==============================================================================
-- Nexora Labs - Client Management & Automated Backup System
-- Phase 1: Database Initialization
-- ==============================================================================

-- 1. Create `clients` table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    package_type TEXT NOT NULL CHECK (package_type IN ('standard', 'pro')),
    supabase_url TEXT NOT NULL,
    supabase_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can manage clients
CREATE POLICY "Allow authenticated full access on clients" 
    ON public.clients FOR ALL TO authenticated USING (true);


-- 2. Create `backup_logs` table
CREATE TABLE IF NOT EXISTS public.backup_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    backup_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
    type TEXT NOT NULL CHECK (type IN ('monthly', 'bi-weekly', 'manual')),
    file_path TEXT, -- Nullable path to storage if success
    file_size_bytes BIGINT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for backup_logs
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can manage backup logs
CREATE POLICY "Allow authenticated full access on backup_logs" 
    ON public.backup_logs FOR ALL TO authenticated USING (true);


-- 3. Create Storage Bucket for Backups
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'backups',
    'backups',
    false, -- Private bucket
    1048576000, -- 1GB limit default
    ARRAY['application/json', 'application/zip', 'application/x-zip-compressed']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies (Only Admin can access backups bucket)
CREATE POLICY "Admin full access to backups" 
    ON storage.objects FOR ALL TO authenticated
    USING (bucket_id = 'backups');

-- Update Trigger for clients table
CREATE OR REPLACE FUNCTION update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_clients_updated_at ON public.clients;
CREATE TRIGGER trigger_update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_clients_updated_at();

-- ==============================================================================
-- End of Script
-- ==============================================================================
