-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- site_config
CREATE TABLE site_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_name TEXT NOT NULL,
    site_description TEXT NOT NULL,
    logo_url TEXT,
    favicon_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_address TEXT,
    working_hours TEXT,
    social_facebook TEXT,
    social_line TEXT,
    social_instagram TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- hero_section
CREATE TABLE hero_section (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    primary_cta_text TEXT,
    primary_cta_link TEXT,
    secondary_cta_text TEXT,
    secondary_cta_link TEXT,
    background_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- services
CREATE TABLE services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    features TEXT[],
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- packages
CREATE TABLE packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT CHECK (tier IN ('standard', 'pro')) NOT NULL,
    setup_price_min INTEGER NOT NULL,
    setup_price_max INTEGER NOT NULL,
    monthly_price_min INTEGER NOT NULL,
    monthly_price_max INTEGER NOT NULL,
    features TEXT[],
    highlight BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- testimonials
CREATE TABLE testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_position TEXT,
    client_company TEXT,
    content TEXT NOT NULL,
    avatar_url TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- policies
CREATE TABLE policies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT CHECK (type IN ('privacy', 'terms', 'cookie')) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    version TEXT,
    effective_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- cookie_preferences
CREATE TABLE cookie_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    necessary BOOLEAN DEFAULT true,
    analytics BOOLEAN DEFAULT false,
    marketing BOOLEAN DEFAULT false,
    preferences BOOLEAN DEFAULT false,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- contact_submissions
CREATE TABLE contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    package_interest TEXT,
    status TEXT CHECK (status IN ('new', 'contacted', 'closed')) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS for all tables
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- 1. Public Read Access (For Website Display)
-- ------------------------------------------
CREATE POLICY "Public can view site config" ON site_config FOR SELECT TO public USING (true);
CREATE POLICY "Public can view hero section" ON hero_section FOR SELECT TO public USING (true);
CREATE POLICY "Public can view services" ON services FOR SELECT TO public USING (true);
CREATE POLICY "Public can view packages" ON packages FOR SELECT TO public USING (true);
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT TO public USING (true);
CREATE POLICY "Public can view policies" ON policies FOR SELECT TO public USING (true);

-- ------------------------------------------
-- 2. Public Insert Access (For User Submissions)
-- ------------------------------------------
CREATE POLICY "Public can insert contact submissions" ON contact_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert cookie preferences" ON cookie_preferences FOR INSERT TO public WITH CHECK (true);

-- ------------------------------------------
-- 3. Admin Full Access (For CMS/Dashboard - CURRENTLY ALLOWING ANON FOR DEVELOPMENT)
-- ------------------------------------------
CREATE POLICY "Admin full access site_config" ON site_config FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access hero_section" ON hero_section FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access services" ON services FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access packages" ON packages FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access policies" ON policies FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access contact_submissions" ON contact_submissions FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access cookie_preferences" ON cookie_preferences FOR ALL TO public USING (true) WITH CHECK (true);

-- ==========================================
-- RATE LIMITING (SPAM PREVENTION)
-- ==========================================

CREATE OR REPLACE FUNCTION check_contact_submission_rate_limit()
RETURNS trigger AS $$
BEGIN
  IF (
    SELECT count(*)
    FROM contact_submissions
    WHERE email = NEW.email
    AND created_at > now() - interval '1 hour'
  ) >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Please wait before submitting another contact request.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_contact_rate_limit
BEFORE INSERT ON contact_submissions
FOR EACH ROW EXECUTE FUNCTION check_contact_submission_rate_limit();
