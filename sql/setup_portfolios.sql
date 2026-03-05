-- Portfolios System Setup Script

-- 1. Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    client_name TEXT,
    category TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolios table
-- 1. Public can view active portfolios
CREATE POLICY "Public can view active portfolios"
ON public.portfolios FOR SELECT
TO public
USING (is_active = true);

-- 2. Authenticated users (Admin) can view all portfolios
CREATE POLICY "Admin can view all portfolios"
ON public.portfolios FOR SELECT
TO authenticated
USING (true);

-- 3. Authenticated users (Admin) can insert portfolios
CREATE POLICY "Admin can insert portfolios"
ON public.portfolios FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Authenticated users (Admin) can update portfolios
CREATE POLICY "Admin can update portfolios"
ON public.portfolios FOR UPDATE
TO authenticated
USING (true);

-- 5. Authenticated users (Admin) can delete portfolios
CREATE POLICY "Admin can delete portfolios"
ON public.portfolios FOR DELETE
TO authenticated
USING (true);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_portfolios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER set_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_portfolios_updated_at();

-- 2. Create Storage Bucket for portfolios
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for portfolios bucket
-- Drop existing policies if they exist to avoid conflicts when re-running
DROP POLICY IF EXISTS "Public can view portfolios" ON storage.objects;
DROP POLICY IF EXISTS "Admin can insert portfolios" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolios" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolios" ON storage.objects;

-- 1. Public can view images
CREATE POLICY "Public can view portfolios"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolios');

-- 2. Admin can insert images
CREATE POLICY "Admin can insert portfolios"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolios');

-- 3. Admin can update images
CREATE POLICY "Admin can update portfolios"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolios');

-- 4. Admin can delete images
CREATE POLICY "Admin can delete portfolios"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolios');
