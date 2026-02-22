import { Metadata } from 'next'
import { TermsOfService } from '@/components/policies/TermsOfService'
import { termsSEO } from '@/lib/seo'

export const metadata: Metadata = {
    title: termsSEO.title,
    description: termsSEO.description,
    robots: { index: false, follow: false },
}

export default function TermsPage() {
    return <TermsOfService />
}
