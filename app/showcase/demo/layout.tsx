import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Template Demo | Nexora Labs',
    robots: 'noindex, nofollow',
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
