import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

// In-memory store for rate limiting (Note: This works per-isolate in Edge Runtime)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>()

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 150 // Allow 150 requests per minute per IP

// Helper to create a fast hash of the IP for privacy
async function hashIP(ip: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(ip + process.env.NEXT_PUBLIC_SITE_NAME) // Salt with site name
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
    const hostname = request.headers.get('host') || ''
    const url = request.nextUrl

    // --- Rate Limiting Logic ---
    const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1'
    const now = Date.now()

    // Clean up expired entries occasionally to prevent memory leaks in long-running processes
    if (Math.random() < 0.01) {
        const entries = Array.from(rateLimitMap.entries())
        for (const [key, value] of entries) {
            if (now > value.expiresAt) {
                rateLimitMap.delete(key)
            }
        }
    }

    const currentRateInfo = rateLimitMap.get(ip)

    if (currentRateInfo) {
        if (now > currentRateInfo.expiresAt) {
            // Window expired, reset
            rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS })
        } else {
            // Within window, increment count
            currentRateInfo.count++
            // Check if limit exceeded
            if (currentRateInfo.count > MAX_REQUESTS_PER_WINDOW) {
                return new NextResponse('Too Many Requests', { status: 429 })
            }
        }
    } else {
        // First request from this IP
        rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS })
    }
    // --- End Rate Limiting Logic ---
    if (hostname.startsWith('admin.') || hostname === 'admin.localhost') {
        // Rewrite to admin pages
        url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`
        return NextResponse.rewrite(url)
    }

    // --- Analytics Tracking (Fire & Forget) ---
    // Only track public-facing pages — skip admin, api, _next, static, payment routes
    const publicPath = !url.pathname.startsWith('/admin') &&
        !url.pathname.startsWith('/api') &&
        !url.pathname.startsWith('/_next') &&
        !url.pathname.startsWith('/favicon') &&
        !url.pathname.startsWith('/payment') &&
        !url.pathname.includes('.')

    if (publicPath) {
        try {
            const ipHash = await hashIP(ip)
            const userAgent = request.headers.get('user-agent') || 'unknown'

            const trackingUrl = new URL('/api/track', request.url)
            event.waitUntil(
                fetch(trackingUrl.toString(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ipHash, userAgent, path: url.pathname })
                }).catch(() => { })
            )
        } catch {
            // Silently fail tracking if error happens
        }
    }
    // --- End Analytics Tracking ---

    // Continue for main domain
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
}
