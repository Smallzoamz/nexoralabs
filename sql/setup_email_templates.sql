-- สร้างตารางเก็บ Email Templates
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name TEXT NOT NULL UNIQUE, -- เช่น 'INVOICE', 'RECEIPT', 'REMINDER_7', 'REMINDER_3', 'REMINDER_1', 'BROADCAST'
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    variables TEXT, -- คำอธิบายตัวแปร เช่น '[CLIENT_NAME], [AMOUNT], [PAYMENT_LINK]'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- เปิดใช้งาน RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- นโยบาย RLS: เฉพาะแอดมิน (ล็อกอินแล้ว) จัดการได้ทั้งหมด ส่วน Public อ่านไม่ได้
CREATE POLICY "Allow authenticated users to manage email templates"
    ON public.email_templates FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert Default Data
INSERT INTO public.email_templates (template_name, subject, body_html, variables)
VALUES 
(
    'INVOICE',
    'ใบแจ้งหนี้ / Invoice - [CLIENT_NAME]',
    'เรียนคุณ [CLIENT_NAME],<br><br>นี่คือใบแจ้งหนี้รอบใหม่ของคุณ ยอดชำระคือ [AMOUNT] บาท ชำระได้ภายใน [DUE_DATE]<br><br>ชำระเงินที่นี่: <a href="[PAYMENT_LINK]">คลิก</a><br><br>ขอบคุณครับ',
    '[CLIENT_NAME], [AMOUNT], [DUE_DATE], [PAYMENT_LINK]'
),
(
    'RECEIPT',
    'ใบเสร็จรับเงิน / Receipt - [CLIENT_NAME]',
    'เรียนคุณ [CLIENT_NAME],<br><br>เราได้รับยอดชำระเงินจำนวน [AMOUNT] บาทเรียบร้อยแล้ว<br>ระบบได้ส่งเอกสารใบเสร็จแนบมากับอีเมลนี้<br><br>ขอบคุณที่ใช้บริการครับ',
    '[CLIENT_NAME], [AMOUNT]'
),
(
    'REMINDER_7',
    'แจ้งเตือนกำหนดชำระเงิน (เหลืออีก 7 วัน) - [CLIENT_NAME]',
    'เรียนคุณ [CLIENT_NAME],<br><br>บิลของคุณจะครบกำหนดในอีก 7 วัน ยอดชำระ: [AMOUNT] บาท<br>ชำระเงินได้ที่: [PAYMENT_LINK]<br><br>ขอบคุณครับ',
    '[CLIENT_NAME], [AMOUNT], [PAYMENT_LINK], [DUE_DATE]'
);
