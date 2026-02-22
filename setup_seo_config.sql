-- SEO System Setup Script
-- Extends the existing site_config table and creates storage bucket for Open Graph images

-- 1. Create Storage Bucket for assets (OG images, favicons, etc.)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for assets bucket
DROP POLICY IF EXISTS "Public can view assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can insert assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete assets" ON storage.objects;

-- 1. Public can view assets
CREATE POLICY "Public can view assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');

-- 2. Admin can insert assets
CREATE POLICY "Admin can insert assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets');

-- 3. Admin can update assets
CREATE POLICY "Admin can update assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'assets');

-- 4. Admin can delete assets
CREATE POLICY "Admin can delete assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'assets');

-- 2. Add SEO columns to site_config table (if they don't exist)
ALTER TABLE public.site_config 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- Update existing row with default SEO values if they are null
-- (Since there is expected to be only 1 row in a site config table, we update all)
UPDATE public.site_config 
SET 
    seo_title = COALESCE(seo_title, 'Nexora Labs - ออกแบบและพัฒนาเว็บไซต์เพื่อธุรกิจ SME'),
    seo_description = COALESCE(seo_description, 'เรามีบริการรับทําเว็บไซต์ สร้างเว็บไซต์ตามความต้องการ พร้อมดูแลเว็บไซต์ และให้คำปรึกษา แนะนำการทำเว็บไซต์ครบวงจร แบบตรงจุด ช่วยผลักดันและพัฒนาธุรกิจคุณ'),
    seo_keywords = COALESCE(seo_keywords, 'รับทำเว็บไซต์, สร้างเว็บธุรกิจ, ดูแลเว็บไซต์, ทำเว็บ e-commerce, เว็บไซต์พร้อมใช้งาน, เช่าเว็บถูกๆ'),
    og_image_url = COALESCE(og_image_url, '');

-- Note: Policies and triggers for site_config should already exist from previous setups.
