-- Create payment_settings table
CREATE TABLE IF NOT EXISTS public.payment_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    promptpay_number TEXT NOT NULL DEFAULT '',
    promptpay_name TEXT NOT NULL DEFAULT '',
    bank_name TEXT NOT NULL DEFAULT '',
    bank_account_no TEXT NOT NULL DEFAULT '',
    bank_account_name TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Ensure to drop them if they exist first, to avoid errors if rerunning
DROP POLICY IF EXISTS "Public can view payment_settings" ON public.payment_settings;
DROP POLICY IF EXISTS "Admin full access payment_settings" ON public.payment_settings;

CREATE POLICY "Public can view payment_settings" 
ON public.payment_settings 
FOR SELECT 
TO public 
USING (true);

-- Assuming Admin access relies on anon/public access currently based on schema
CREATE POLICY "Admin full access payment_settings" 
ON public.payment_settings 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- Insert initial empty row if table is empty
INSERT INTO public.payment_settings (id, promptpay_number, promptpay_name, bank_name, bank_account_no, bank_account_name)
SELECT 
  uuid_generate_v4(),
  '080-000-0000',
  'Company Name Co.,Ltd.',
  'Kasikornbank',
  '123-4-56789-0',
  'Company Name Co.,Ltd.'
WHERE NOT EXISTS (
  SELECT id FROM public.payment_settings
);
