-- setup_dynamic_contracts.sql
-- Phase 2: Dynamic Contract Builder

-- 1. Table: contract_templates 
-- Stores the HTML/Rich-Text boilerplate for contracts.
CREATE TABLE IF NOT EXISTS public.contract_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL, -- e.g., "Standard Web Dev Contract v1"
    description TEXT,
    content TEXT NOT NULL, -- The rich text HTML boilerplate with tags like [CLIENT_NAME]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: client_contracts
-- Stores the finalized agreed contract attached to a specific client_id.
CREATE TABLE IF NOT EXISTS public.client_contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.contract_templates(id) ON DELETE SET NULL, -- Track which template was used
    title TEXT NOT NULL, -- e.g., "Web Development Agreement - Nexora Labs"
    content TEXT NOT NULL, -- The finalized HTML/Text with all tags replaced
    status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, SENT, SIGNED, EXPIRED
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES --
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contracts ENABLE ROW LEVEL SECURITY;

-- PostgREST RPC / RLS permissions:
-- Admins can do everything
CREATE POLICY "Admin full access contract_templates" ON public.contract_templates TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access client_contracts" ON public.client_contracts TO authenticated USING (true) WITH CHECK (true);

-- Functions & Triggers for updated_at
CREATE OR REPLACE FUNCTION update_contract_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_contract_template_updated_at ON public.contract_templates;
CREATE TRIGGER trigger_update_contract_template_updated_at
    BEFORE UPDATE ON public.contract_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_contract_updated_at();

DROP TRIGGER IF EXISTS trigger_update_client_contract_updated_at ON public.client_contracts;
CREATE TRIGGER trigger_update_client_contract_updated_at
    BEFORE UPDATE ON public.client_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_contract_updated_at();
