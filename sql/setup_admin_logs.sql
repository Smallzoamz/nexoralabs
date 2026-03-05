-- สร้างตารางบันทึกประวัติการทำงานของแอดมิน (Admin Activity Logs)
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email TEXT NOT NULL,
    action_type TEXT NOT NULL, -- เช่น LOGIN, DELETE, APPROVE_SLIP, UPDATE_SETTINGS
    details TEXT, -- รายละเอียดเพิ่มเติม เช่น "ลบรูปภาพ portfolio_01.jpg", "อนุมัติสลิป INV-202401-ABCD"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- เปิดใช้งาน RLS (Row Level Security)
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- นโยบาย RLS:
-- 1. เฉพาะแอดมิน (ผู้ที่ล็อกอินแล้ว) เท่านั้นที่สามารถดู Log ได้
CREATE POLICY "Allow authenticated users to select admin logs"
    ON public.admin_logs FOR SELECT
    TO authenticated
    USING (true);

-- 2. เฉพาะแอดมินเท่านั้นที่สามารถเพิ่ม Log ได้
CREATE POLICY "Allow authenticated users to insert admin logs"
    ON public.admin_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 3. ไม่อนุญาตให้แก้ไข Log (เพื่อป้องกันการลบประวัติ)
-- 4. ไม่อนุญาตให้อนุญาตแก้ไข Log

-- ไม่สร้าง Policy สำหรับ UPDATE และ DELETE เพื่อป้องกันการแก้ไขหรือลบประวัติ
