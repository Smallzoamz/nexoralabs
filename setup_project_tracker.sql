-- Update invoices table with Project Status Tracker fields

-- 1. Add project_status column
-- Allowed values: 'pending', 'planning', 'designing', 'developing', 'testing', 'completed'
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS project_status TEXT NOT NULL DEFAULT 'pending'
CHECK (project_status IN ('pending', 'planning', 'designing', 'developing', 'testing', 'completed'));

-- 2. Add tracking_code column
-- Used by clients to lookup their project timeline
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE;

-- Create an index for faster lookups by tracking_code
CREATE INDEX IF NOT EXISTS invoices_tracking_code_idx ON public.invoices(tracking_code);

-- Function to handle generating a random 6-character alphanumeric tracking code
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'NXL-';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars))::int + 1, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Trigger to auto-generate tracking_code for new invoices if not provided
CREATE OR REPLACE FUNCTION trigger_set_tracking_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tracking_code IS NULL OR NEW.tracking_code = '' THEN
        NEW.tracking_code := generate_tracking_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_invoice_tracking_code ON public.invoices;
CREATE TRIGGER set_invoice_tracking_code
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_tracking_code();
