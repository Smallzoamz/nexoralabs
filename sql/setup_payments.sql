-- ==============================================================================
-- Nexora Labs - Payment Gateway Automation
-- Phase 1: Create Payment Submissions Database Schema
-- Run this in Supabase SQL Editor
-- ==============================================================================


-- 1. Create `payment_submissions` table to store uploaded payment slips
--    Each row is linked to an invoice and carries the slip image URL + status.
CREATE TABLE IF NOT EXISTS public.payment_submissions (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id      UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount          NUMERIC(12, 2) NOT NULL,
    slip_url        TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_note  TEXT,
    submitted_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    verified_at     TIMESTAMP WITH TIME ZONE
);

-- Index for faster lookups by invoice and status
CREATE INDEX IF NOT EXISTS idx_payment_submissions_invoice_id ON public.payment_submissions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_submissions_status ON public.payment_submissions(status);

-- Enable RLS
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
-- Public can INSERT a payment submission (client uploads their slip)
CREATE POLICY "Public can insert payment submissions"
    ON public.payment_submissions FOR INSERT TO public
    WITH CHECK (true);

-- Only authenticated admin can SELECT, UPDATE, DELETE
CREATE POLICY "Admin full access to payment submissions"
    ON public.payment_submissions FOR ALL TO authenticated
    USING (true);


-- ==============================================================================
-- 2. Create `payment_slips` Storage Bucket via SQL Policy
--    NOTE: The actual bucket must be created in Supabase Dashboard > Storage.
--          Bucket name: "payment-slips"   |   Public: false
--
--    After creating the bucket, run these policies:
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-slips', 'payment-slips', false)
ON CONFLICT (id) DO NOTHING;

-- Allow public (anonymous) users to upload files into the bucket
CREATE POLICY "Public can upload payment slips"
    ON storage.objects FOR INSERT TO public
    WITH CHECK (bucket_id = 'payment-slips');

-- Only authenticated users (Admin) can view/download slips
CREATE POLICY "Admin can view payment slips"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'payment-slips');

-- Only authenticated users (Admin) can delete slips
CREATE POLICY "Admin can delete payment slips"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'payment-slips');


-- ==============================================================================
-- End of Script
-- ==============================================================================
