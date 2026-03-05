-- ==============================================================================
-- Nexora Labs - System Analytics (Data Audit)
-- Phase 1: Create Analytics Database Schema
-- ==============================================================================

-- 1. Create `site_analytics` table
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    path TEXT NOT NULL,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster date-based querying
CREATE INDEX IF NOT EXISTS idx_site_analytics_visited_at ON public.site_analytics(visited_at);

-- Enable RLS for site_analytics
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- 2. Policies
-- Public can INSERT analytics data (anonymous tracking)
CREATE POLICY "Public can insert analytics" 
    ON public.site_analytics FOR INSERT TO public WITH CHECK (true);

-- Only authenticated admins can read analytics data
CREATE POLICY "Admin full access to analytics" 
    ON public.site_analytics FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- End of Script
-- ==============================================================================
