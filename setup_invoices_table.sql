-- Create invoices table
CREATE TABLE public.invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_email TEXT NOT NULL,
    client_name TEXT NOT NULL,
    package_details TEXT NOT NULL,
    setup_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    monthly_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Policies for invoices
CREATE POLICY "Allow authenticated full access to invoices" ON public.invoices
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to invoices" ON public.invoices
    FOR SELECT TO public USING (true);
