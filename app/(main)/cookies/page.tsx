import { Metadata } from 'next'
import { CookiePolicy } from '@/components/policies/CookiePolicy'
import { cookieSEO } from '@/lib/seo'

export const metadata: Metadata = {
    title: cookieSEO.title,
    description: cookieSEO.description,
    robots: { index: false, follow: false },
}

export default function CookiesPage() {
    return <CookiePolicy />
}
