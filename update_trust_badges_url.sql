-- 1. เพิ่มคอลัมน์ website_url สำหรับให้คลิกลิงก์จากโลโก้ได้
ALTER TABLE public.trust_badges 
ADD COLUMN IF NOT EXISTS website_url text;
