'use client'

import { useState } from 'react'
import { Share2, Facebook, Twitter, Link2, Check, MessageCircle } from 'lucide-react'

interface ArticleShareButtonsProps {
    title: string
    url: string
    excerpt?: string
    coverImage?: string
}

export function ArticleShareButtons({ title, url, excerpt, coverImage }: ArticleShareButtonsProps) {
    const [copied, setCopied] = useState(false)

    const encodedTitle = encodeURIComponent(title)
    const encodedUrl = encodeURIComponent(url)

    // Share URLs with article-specific data
    const shareLinks = {
        // Facebook uses Open Graph meta tags from the page, just need the URL
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        // Twitter supports text and URL
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        // LINE supports text and URL
        line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`,
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: excerpt || title,
                    url: url,
                })
            } catch (err) {
                console.error('Error sharing:', err)
            }
        }
    }

    const openShareWindow = (shareUrl: string) => {
        window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=no')
    }

    return (
        <div className="flex items-center gap-3">
            {/* Facebook */}
            <button
                onClick={() => openShareWindow(shareLinks.facebook)}
                className="w-10 h-10 rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5] flex items-center justify-center transition-colors shadow-sm"
                title="แชร์ไป Facebook"
            >
                <Facebook className="w-5 h-5" />
            </button>

            {/* Twitter/X */}
            <button
                onClick={() => openShareWindow(shareLinks.twitter)}
                className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1A8CD8] flex items-center justify-center transition-colors shadow-sm"
                title="แชร์ไป Twitter"
            >
                <Twitter className="w-5 h-5" />
            </button>

            {/* LINE */}
            <button
                onClick={() => openShareWindow(shareLinks.line)}
                className="w-10 h-10 rounded-full bg-[#00B900] text-white hover:bg-[#00A600] flex items-center justify-center transition-colors shadow-sm"
                title="แชร์ไป LINE"
            >
                <MessageCircle className="w-5 h-5" />
            </button>

            {/* Copy Link */}
            <button
                onClick={handleCopyLink}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${copied
                    ? 'bg-green-500 text-white'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    }`}
                title={copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}
            >
                {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
            </button>

            {/* Native Share (Mobile) */}
            {'share' in navigator && (
                <button
                    onClick={handleNativeShare}
                    className="w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center transition-colors shadow-sm"
                    title="แชร์"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            )}
        </div>
    )
}
