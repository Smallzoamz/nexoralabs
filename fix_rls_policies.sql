-- ==========================================
-- SCRIPT: FIX INSECURE RLS POLICIES
-- PURPOSE: Revoke 'public' ALL access and grant to 'authenticated' users only.
-- HOW TO USE: Run this entire script in the Supabase SQL Editor.
-- ==========================================

-- 1. ลบ Policy เก่าที่อันตราย (อนุญาต public ให้แก้ไขข้อมูลได้) ทิ้งทั้งหมด
DROP POLICY IF EXISTS "Admin full access site_config" ON site_config;
DROP POLICY IF EXISTS "Admin full access hero_section" ON hero_section;
DROP POLICY IF EXISTS "Admin full access services" ON services;
DROP POLICY IF EXISTS "Admin full access packages" ON packages;
DROP POLICY IF EXISTS "Admin full access testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin full access policies" ON policies;
DROP POLICY IF EXISTS "Admin full access contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admin full access cookie_preferences" ON cookie_preferences;

-- 2. สร้าง Policy ใหม่สำหรับให้แอดมิน (ผู้ที่ล็อกอินแล้ว) จัดการข้อมูลได้
-- คำสั่งนี้ล็อกสิทธิ์ให้อนุญาตเฉพาะ Role 'authenticated' เท่านั้น

CREATE POLICY "Admin can manage site_config" ON site_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage hero_section" ON hero_section FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage packages" ON packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage policies" ON policies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage contact_submissions" ON contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage cookie_preferences" ON cookie_preferences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- DONE: ระบบ RLS ปลอดภัยแล้วเรียบร้อย แอดมินจัดการได้ คนนอกอ่านได้อย่างเดียว
-- ==========================================
