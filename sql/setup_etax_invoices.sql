-- E-Tax Invoice Management System
-- ใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax Invoice)

-- 1. Create etax_invoices table
CREATE TABLE IF NOT EXISTS public.etax_invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- เลขที่ใบกำกับภาษี (format: T[YY]XXXXXX)
    invoice_number TEXT NOT NULL UNIQUE,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- ข้อมูลผู้ขาย (Seller)
    seller_name TEXT NOT NULL,
    seller_tax_id TEXT,
    seller_address TEXT,
    seller_branch_code TEXT DEFAULT '00000',
    
    -- ข้อมูลผู้ซื้อ (Buyer)
    buyer_name TEXT NOT NULL,
    buyer_tax_id TEXT,
    buyer_address TEXT,
    buyer_email TEXT,
    buyer_branch_code TEXT DEFAULT '00000',
    
    -- รายละเอียด
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    vat_rate DECIMAL(5, 2) DEFAULT 7.00,
    vat_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    
    -- เชื่อมกับระบบ Invoice เดิม (optional)
    linked_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    
    -- สถานะ
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'cancelled', 'void')),
    
    -- ข้อมูลเพิ่มเติม
    notes TEXT,
    created_by TEXT,
    issued_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.etax_invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for etax_invoices table
-- 1. Anyone authenticated can view
CREATE POLICY "Authenticated users can view etax_invoices"
ON public.etax_invoices FOR SELECT
TO authenticated
USING (true);

-- 2. Anyone authenticated can insert (we check role in frontend)
CREATE POLICY "Authenticated users can insert etax_invoices"
ON public.etax_invoices FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Anyone authenticated can update (we check role in frontend)
CREATE POLICY "Authenticated users can update etax_invoices"
ON public.etax_invoices FOR UPDATE
TO authenticated
USING (true);

-- 4. Anyone authenticated can delete (we check role in frontend)
CREATE POLICY "Authenticated users can delete etax_invoices"
ON public.etax_invoices FOR DELETE
TO authenticated
USING (true);

-- Function to auto-calculate VAT and total
CREATE OR REPLACE FUNCTION public.calculate_etax_amounts()
RETURNS TRIGGER AS $$
BEGIN
    NEW.vat_amount = ROUND(NEW.amount * (NEW.vat_rate / 100), 2);
    NEW.total_amount = NEW.amount + NEW.vat_amount;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger for auto-calculate
DROP TRIGGER IF EXISTS set_etax_amounts ON public.etax_invoices;
CREATE TRIGGER set_etax_amounts
    BEFORE INSERT OR UPDATE ON public.etax_invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_etax_amounts();

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_etax_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_etax_invoices_updated_at ON public.etax_invoices;
CREATE TRIGGER set_etax_invoices_updated_at
    BEFORE UPDATE ON public.etax_invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_etax_invoices_updated_at();

-- 2. Create etax_invoice_items table (รายละเอียดรายการในใบกำกับภาษี)
CREATE TABLE IF NOT EXISTS public.etax_invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    etax_invoice_id UUID NOT NULL REFERENCES public.etax_invoices(id) ON DELETE CASCADE,
    
    item_number INTEGER NOT NULL DEFAULT 1,
    description TEXT NOT NULL,
    quantity DECIMAL(12, 2) DEFAULT 1,
    unit_code TEXT DEFAULT 'EA',
    unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.etax_invoice_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view etax_invoice_items"
ON public.etax_invoice_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Superadmin can manage etax_invoice_items"
ON public.etax_invoice_items FOR ALL
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'superadmin'
    )
);

-- Function to auto-calculate item amount
CREATE OR REPLACE FUNCTION public.calculate_etax_item_amount()
RETURNS TRIGGER AS $$
BEGIN
    NEW.amount = ROUND(NEW.quantity * NEW.unit_price, 2);
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS set_etax_item_amount ON public.etax_invoice_items;
CREATE TRIGGER set_etax_item_amount
    BEFORE INSERT OR UPDATE ON public.etax_invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_etax_item_amount();

-- 3. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_etax_invoices_number ON public.etax_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_etax_invoices_date ON public.etax_invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_etax_invoices_status ON public.etax_invoices(status);
CREATE INDEX IF NOT EXISTS idx_etax_invoices_linked ON public.etax_invoices(linked_invoice_id);

-- 4. Create view for summary
CREATE OR REPLACE VIEW public.etax_invoices_summary AS
SELECT 
    EXTRACT(YEAR FROM invoice_date) as year,
    EXTRACT(MONTH FROM invoice_date) as month,
    COUNT(*) as total_count,
    SUM(total_amount) as total_amount,
    SUM(vat_amount) as total_vat,
    SUM(amount) as total_before_vat,
    COUNT(CASE WHEN status = 'issued' THEN 1 END) as issued_count,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count
FROM public.etax_invoices
GROUP BY EXTRACT(YEAR FROM invoice_date), EXTRACT(MONTH FROM invoice_date)
ORDER BY year DESC, month DESC;
