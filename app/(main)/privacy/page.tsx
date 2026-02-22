import { Metadata } from 'next'
import { PrivacyPolicy } from '@/components/policies/PrivacyPolicy'
import { privacySEO } from '@/lib/seo'

export const metadata: Metadata = {
    title: privacySEO.title,
    description: privacySEO.description,
    robots: { index: false, follow: false },
}

export default function PrivacyPage() {
    return <PrivacyPolicy />
}
