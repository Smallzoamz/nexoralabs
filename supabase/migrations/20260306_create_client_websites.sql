-- Migration: create_client_websites
-- Creates a table to store client website/project records

CREATE TABLE IF NOT EXISTS client_websites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  client_email TEXT NOT NULL,
  website_name TEXT NOT NULL,
  package TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'planning', 'designing', 'developing', 'testing', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE client_websites ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "service_role_full_access" ON client_websites
  FOR ALL USING (true) WITH CHECK (true);

-- Allow clients to read their own websites
CREATE POLICY "clients_read_own_websites" ON client_websites
  FOR SELECT USING (
    client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
