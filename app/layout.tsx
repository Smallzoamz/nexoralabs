import type { Metadata, Viewport } from 'next'
import './globals.css'
import { defaultSEO, defaultViewport, generateSEOMetadata } from '@/lib/seo'
import { supabase } from '@/lib/supabase'
import { FloatingContact } from '@/components/ui/FloatingContact'
import { ModalProvider } from '@/lib/modal-context'
import { LanguageProvider } from '@/lib/language-context'
import { DM_Sans, Prompt } from 'next/font/google'

const dmSans = DM_Sans({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const prompt = Prompt({
    subsets: ['latin', 'thai'],
    weight: ['300', '400', '500', '600', '700'],
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
            // Build raw SEO config from DB - with fallback sanitizer
            const dynamicSEO = {
                title: (config.seo_title || defaultSEO.title).replace(/Nexora Labs/g, 'VELOZI | Dev'),
                description: (config.seo_description || defaultSEO.description).replace(/Nexora Labs/g, 'VELOZI | Dev'),
                keywords: config.seo_keywords
                    ? config.seo_keywords.replace(/Nexora Labs/g, 'VELOZI | Dev').split(',').map((k: string) => k.trim())
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
        <html lang="th" className={`${dmSans.variable} ${prompt.variable}`}>
            <body className="min-h-screen flex flex-col font-sans antialiased">
                <ModalProvider>
                    <LanguageProvider>
                        {/* JSON-LD for AI Search (AEO) */}
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@graph": [
                                        {
                                            "@type": "Organization",
                                            "@id": "https://www.nexoralabs.com/#organization",
                                            "name": "VELOZI | Dev",
                                            "url": "https://www.nexoralabs.com",
                                            "logo": "https://www.nexoralabs.com/logos/navbar-logo.png",
                                            "description": "บริการออกแบบ พัฒนา และดูแลเว็บไซต์ระดับพรีเมียมเพื่อผู้ประกอบการ SME",
                                            "sameAs": [
                                                "https://www.facebook.com/velozi.tech",
                                                "https://line.me/ti/p/~@velozi"
                                            ],
                                            "contactPoint": {
                                                "@type": "ContactPoint",
                                                "telephone": "+66-000-000-000",
                                                "contactType": "customer support",
                                                "areaServed": "TH",
                                                "availableLanguage": ["Thai", "English"]
                                            }
                                        },
                                        {
                                            "@type": "WebSite",
                                            "@id": "https://www.nexoralabs.com/#website",
                                            "url": "https://www.nexoralabs.com",
                                            "name": "VELOZI | Dev - บริการออกแบบและพัฒนาเว็บไซต์เพื่อ SME",
                                            "publisher": {
                                                "@id": "https://www.nexoralabs.com/#organization"
                                            }
                                        }
                                    ]
                                })
                            }}
                        />
                        {children}
                        <FloatingContact />
                    </LanguageProvider>
                </ModalProvider>
            </body>
        </html>
    )
}
