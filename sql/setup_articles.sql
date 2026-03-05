-- Articles / Blog System Setup Script

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT,
    author TEXT DEFAULT 'Admin',
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies for articles table
-- 1. Public can view published articles
CREATE POLICY "Public can view published articles"
ON public.articles FOR SELECT
TO public
USING (is_published = true);

-- 2. Authenticated users (Admin) can view all articles
CREATE POLICY "Admin can view all articles"
ON public.articles FOR SELECT
TO authenticated
USING (true);

-- 3. Authenticated users (Admin) can insert articles
CREATE POLICY "Admin can insert articles"
ON public.articles FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Authenticated users (Admin) can update articles
CREATE POLICY "Admin can update articles"
ON public.articles FOR UPDATE
TO authenticated
USING (true);

-- 5. Authenticated users (Admin) can delete articles
CREATE POLICY "Admin can delete articles"
ON public.articles FOR DELETE
TO authenticated
USING (true);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_articles_updated_at ON public.articles;
CREATE TRIGGER set_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_articles_updated_at();

-- 2. Create Storage Bucket for articles (cover images and embedded content)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for articles bucket
DROP POLICY IF EXISTS "Public can view articles images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can insert articles images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update articles images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete articles images" ON storage.objects;

-- 1. Public can view images
CREATE POLICY "Public can view articles images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'articles');

-- 2. Admin can insert images
CREATE POLICY "Admin can insert articles images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'articles');

-- 3. Admin can update images
CREATE POLICY "Admin can update articles images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'articles');

-- 4. Admin can delete images
CREATE POLICY "Admin can delete articles images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'articles');

-- 3. Function to increment article view count
CREATE OR REPLACE FUNCTION public.increment_article_views(article_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
