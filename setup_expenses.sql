-- ============================================
-- Setup Expenses Table
-- สำหรับบันทึกรายจ่ายในระบบบัญชี
-- ============================================

-- 1. Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL DEFAULT 'อื่นๆ',
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies (authenticated users only)
CREATE POLICY "Authenticated users can view expenses"
    ON public.expenses FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert expenses"
    ON public.expenses FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update expenses"
    ON public.expenses FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete expenses"
    ON public.expenses FOR DELETE
    TO authenticated
    USING (true);

-- 4. Index for faster date-based queries
CREATE INDEX IF NOT EXISTS expenses_date_idx ON public.expenses(expense_date);
