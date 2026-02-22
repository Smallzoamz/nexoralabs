import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { defaultSEO, defaultViewport } from '@/lib/seo'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
})

export const metadata: Metadata = {
    ...defaultSEO,
    title: {
        default: 'Nexora Labs - ออกแบบและดูแลเว็บไซต์สำหรับธุรกิจ SME',
        template: '%s | Nexora Labs',
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/logos/footer-logo.png',
    },
}

export const viewport: Viewport = defaultViewport

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="th" className={`${inter.variable} ${plusJakarta.variable}`}>
            <body className="min-h-screen flex flex-col font-sans antialiased">
                {children}
            </body>
        </html>
    )
}
