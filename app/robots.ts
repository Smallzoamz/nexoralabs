import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nexoralabs.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
            {
                // Explicitly allow AI bots for AEO (Answer Engine Optimization)
                userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot'],
                allow: '/',
                disallow: ['/admin', '/api'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
