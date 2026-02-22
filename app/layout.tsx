import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { defaultSEO, defaultViewport, generateSEOMetadata } from '@/lib/seo'
import { supabase } from '@/lib/supabase'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ModalProvider } from '@/lib/modal-context'

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

export async function generateMetadata(): Promise<Metadata> {
    try {
        const { data: config } = await supabase
            .from('site_config')
            .select('seo_title, seo_description, seo_keywords, og_image_url')
            .limit(1)
            .single()

        if (config) {
            // Build raw SEO config from DB
            const dynamicSEO = {
                title: config.seo_title || defaultSEO.title,
                description: config.seo_description || defaultSEO.description,
                keywords: config.seo_keywords
                    ? config.seo_keywords.split(',').map((k: string) => k.trim())
                    : defaultSEO.keywords,
                image: config.og_image_url || defaultSEO.image,
                url: process.env.NEXT_PUBLIC_SITE_URL,
                type: 'website' as const,
            }

            // Map it to Next.js Metadata object using our helper
            const baseMetadata = generateSEOMetadata(dynamicSEO)

            // Override global templates (e.g. title templating) and global icons
            return {
                ...baseMetadata,
                title: {
                    default: dynamicSEO.title,
                    template: '%s | ' + dynamicSEO.title,
                },
                icons: {
                    icon: '/favicon.ico',
                    apple: '/logos/footer-logo.png',
                },
            }
        }
    } catch (e) {
        console.error('Failed to load dynamic metadata from Supabase:', e)
    }

    // Fallback to static defaults if DB is unreachable
    const baseFallback = generateSEOMetadata(defaultSEO)
    return {
        ...baseFallback,
        title: {
            default: defaultSEO.title,
            template: '%s | ' + defaultSEO.title,
        },
        icons: {
            icon: '/favicon.ico',
            apple: '/logos/footer-logo.png',
        },
    }
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
                <ModalProvider>
                    {children}
                    <FloatingContact />
                </ModalProvider>
            </body>
        </html>
    )
}
