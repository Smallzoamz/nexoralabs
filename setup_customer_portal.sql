-- setup_customer_portal.sql
-- Phase 1 Customer Portal & Support Ticket System Schema

-- 1. Table: client_users (Links Supabase Auth Users to existing clients)
-- We assume auth.users will be populated when we invite clients.
CREATE TABLE IF NOT EXISTS public.client_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id),
    UNIQUE(client_id)
);

-- 2. Table: support_tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id TEXT PRIMARY KEY, -- String ID like TICK-202401-ABCD
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH, URGENT
    status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: support_replies
CREATE TABLE IF NOT EXISTS public.support_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id TEXT NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'CLIENT' or 'ADMIN'
    sender_id UUID, -- If CLIENT, might be auth.users id or client_id. If ADMIN, can be null or admin id.
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES --
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_replies ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admin full access client_users" ON public.client_users TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access support_tickets" ON public.support_tickets TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access support_replies" ON public.support_replies TO authenticated USING (true) WITH CHECK (true);

-- Functions & Triggers for updated_at on tickets
CREATE OR REPLACE FUNCTION update_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_ticket_updated_at ON public.support_tickets;
CREATE TRIGGER trigger_update_ticket_updated_at
    BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_ticket_updated_at();
