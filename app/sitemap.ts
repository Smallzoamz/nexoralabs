import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nexoralabs.com'

    const routes = [
        '',
        '/portfolio',
        '/showcase',
        '/articles',
        '/login',
        '/privacy',
        '/terms',
        '/cookies',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
        priority: route === '' ? 1.0 : route === '/showcase' ? 0.9 : route === '/portfolio' ? 0.8 : 0.5,
    }))

    return [...routes]
}
