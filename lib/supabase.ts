import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface SiteConfig {
    id: string
    site_name: string
    site_description: string
    logo_url: string
    favicon_url: string
    contact_email: string
    contact_phone: string
    contact_address: string
    working_hours: string
    social_facebook: string
    social_line: string
    social_instagram: string
    created_at: string
    updated_at: string
}

export interface HeroSection {
    id: string
    title: string
    subtitle: string
    description: string
    primary_cta_text: string
    primary_cta_link: string
    secondary_cta_text: string
    secondary_cta_link: string
    background_image: string
    created_at: string
    updated_at: string
}

export interface Service {
    id: string
    title: string
    description: string
    icon: string
    features: string[]
    order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Package {
    id: string
    name: string
    tier: 'standard' | 'pro'
    setup_price_min: number
    setup_price_max: number
    monthly_price_min: number
    monthly_price_max: number
    features: string[]
    highlight: boolean
    order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Testimonial {
    id: string
    client_name: string
    client_position: string
    client_company: string
    content: string
    avatar_url: string
    rating: number
    order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Policy {
    id: string
    type: 'privacy' | 'terms' | 'cookie'
    title: string
    content: string
    version: string
    effective_date: string
    created_at: string
    updated_at: string
}

export interface CookiePreference {
    id: string
    session_id: string
    necessary: boolean
    analytics: boolean
    marketing: boolean
    preferences: boolean
    ip_address: string
    user_agent: string
    created_at: string
}

export interface ContactSubmission {
    id: string
    name: string
    email: string
    phone: string
    company: string
    message: string
    package_interest: string
    status: 'new' | 'contacted' | 'closed'
    created_at: string
}
