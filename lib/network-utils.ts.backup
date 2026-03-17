import { headers } from 'next/headers'

export function getClientNetworkInfo() {
    try {
        const headersList = headers();
        
        // Vercel / Cloudflare specific headers for real IP
        const forwardedFor = headersList.get('x-forwarded-for');
        const realIp = headersList.get('x-real-ip');
        
        // Fallback or local IP extraction
        let ipAddress = 'Unknown';
        if (forwardedFor) {
            ipAddress = forwardedFor.split(',')[0].trim();
        } else if (realIp) {
            ipAddress = realIp;
        }

        const userAgent = headersList.get('user-agent') || 'Unknown';

        return {
            ipAddress,
            userAgent
        };
    } catch {
        // Fallback for client-side or static generation where headers() throws
        return {
            ipAddress: 'Unknown',
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
        }
    }
}
