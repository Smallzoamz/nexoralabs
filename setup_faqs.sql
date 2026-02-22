-- Table: public.faqs
-- Description: Stores Frequently Asked Questions.

CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Public can view active FAQs
CREATE POLICY "Public can view active FAQs"
ON public.faqs FOR SELECT
USING (is_active = true);

-- 2. Authenticated users (Admin) can view all FAQs
CREATE POLICY "Admin can view all FAQs"
ON public.faqs  FOR SELECT 
TO authenticated 
USING (true);

-- 3. Authenticated users (Admin) can insert FAQs
CREATE POLICY "Admin can insert FAQs" 
ON public.faqs FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 4. Authenticated users (Admin) can update FAQs
CREATE POLICY "Admin can update FAQs" 
ON public.faqs FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 5. Authenticated users (Admin) can delete FAQs
CREATE POLICY "Admin can delete FAQs" 
ON public.faqs FOR DELETE 
TO authenticated 
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_faqs_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_faqs_updated_at ON public.faqs;
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_faqs_updated_at_column();
