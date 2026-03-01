import { Metadata, Viewport } from 'next'

export const defaultViewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
        { media: '(prefers-color-scheme: dark)', color: '#0284c7' },
    ],
}

interface SEOConfig {
    title: string
    description: string
    keywords?: string[]
    image?: string
    url?: string
    type?: 'website' | 'article'
    publishedTime?: string
    modifiedTime?: string
    author?: string
    noindex?: boolean
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
    const {
        title,
        description,
        keywords = [],
        image = '/og-image.png',
        url = process.env.NEXT_PUBLIC_SITE_URL,
        type = 'website',
        publishedTime,
        modifiedTime,
        author,
        noindex = false,
    } = config

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'VELOZI | Dev'
    const fullTitle = `${title} | ${siteName}`
    const imageUrl = image.startsWith('http') ? image : `${url}${image}`

    return {
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        authors: author ? [{ name: author }] : undefined,
        creator: author,
        publisher: siteName,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: url ? new URL(url) : undefined,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'th_TH',
            type: type === 'article' ? 'article' : 'website',
            ...(type === 'article' && {
                publishedTime,
                modifiedTime,
                authors: author ? [author] : undefined,
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [imageUrl],
            creator: '@nexoralabs',
        },
        robots: noindex
            ? {
                index: false,
                follow: false,
            }
            : {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
        verification: {
            google: 'jfG-HrBVGLKzdB510OOqa-A32AOTG5ieaGAcEpWe8ow',
        },
    }
}

export const defaultSEO: SEOConfig = {
    title: 'VELOZI | Dev - บริการออกแบบและพัฒนาเว็บไซต์เพื่อผู้ประกอบการ SME',
    description:
        'บริการออกแบบและพัฒนาเว็บไซต์มืออาชีพสำหรับธุรกิจขนาดเล็ก-กลาง พร้อมระบบ Admin Panel จัดการเองง่าย ดูแลโดยทีมงานมืออาชีพ',
    keywords: [
        'ออกแบบเว็บไซต์',
        'ดูแลเว็บไซต์',
        'เว็บไซต์ SME',
        'ธุรกิจขนาดเล็ก',
        'เว็บไซต์ราคาถูก',
        'Admin Panel',
        'Web Design Thailand',
        'Website Maintenance',
        'Supabase',
        'Next.js',
    ],
    image: '/og-image.png',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    type: 'website',
}



export const privacySEO: SEOConfig = {
    title: 'นโยบายความเป็นส่วนตัว',
    description: 'นโยบายความเป็นส่วนตัวของ VELOZI | Dev - เราให้ความสำคัญกับข้อมูลส่วนบุคคลของคุณ',
    keywords: ['นโยบายความเป็นส่วนตัว', 'Privacy Policy', 'PDPA'],
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy`,
    noindex: true,
}

export const termsSEO: SEOConfig = {
    title: 'ข้อกำหนดการใช้งาน',
    description: 'ข้อกำหนดและเงื่อนไขการใช้บริการของ VELOZI | Dev',
    keywords: ['ข้อกำหนดการใช้งาน', 'Terms of Service', 'เงื่อนไข'],
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/terms`,
    noindex: true,
}

export const cookieSEO: SEOConfig = {
    title: 'นโยบายคุกกี้',
    description: 'นโยบายการใช้คุกกี้ของ VELOZI | Dev - เรียนรู้ว่าเราใช้คุกกี้อย่างไรและคุณสามารถจัดการได้อย่างไร',
    keywords: ['นโยบายคุกกี้', 'Cookie Policy', 'คุกกี้'],
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/cookies`,
    noindex: true,
}
