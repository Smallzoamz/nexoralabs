-- Migration: Add advanced auditing columns to admin_logs
-- Date: 2026-03-14

-- 1. เผื่อมี View หรือ ฟังก์ชันอื่นๆ ที่พึ่งพิงโครงสร้างเดิม ให้ทำอย่างระมัดระวัง
-- เพิ่มคอลัมน์ใหม่ (ถ้ายังไม่มี)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='ip_address') THEN
        ALTER TABLE public.admin_logs ADD COLUMN ip_address TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='user_agent') THEN
        ALTER TABLE public.admin_logs ADD COLUMN user_agent TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='resource_type') THEN
        ALTER TABLE public.admin_logs ADD COLUMN resource_type TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='resource_id') THEN
        ALTER TABLE public.admin_logs ADD COLUMN resource_id TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='metadata') THEN
        ALTER TABLE public.admin_logs ADD COLUMN metadata JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='status') THEN
        ALTER TABLE public.admin_logs ADD COLUMN status TEXT DEFAULT 'SUCCESS';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='severity') THEN
        ALTER TABLE public.admin_logs ADD COLUMN severity TEXT DEFAULT 'INFO';
    END IF;
END $$;

-- 2. สร้าง Index เพื่อเพิ่มความเร็วในการค้นหาข้อมูล (เนื่องจาก Log จะมีขนาดใหญ่ขึ้น)
CREATE INDEX IF NOT EXISTS idx_admin_logs_action_type ON public.admin_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_resource ON public.admin_logs(resource_type, resource_id);
