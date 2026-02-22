import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ArrowLeft, Calendar, Eye, User, Share2, Tag } from 'lucide-react'
import Link from 'next/link'


// 1. Generate Static Params for SEO (Tells Next.js which URLs to pre-render)
export async function generateStaticParams() {
    const { data: articles } = await supabase
        .from('articles')
        .select('slug')
        .eq('is_published', true)

    if (!articles) return []

    return articles.map((article) => ({
        slug: article.slug,
    }))
}

// 2. Generate Metadata for SEO (Head tags)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { data: article } = await supabase
        .from('articles')
        .select('title, excerpt, cover_image')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single()

    if (!article) return {}

    return {
        title: `${article.title} | Nexora Labs`,
        description: article.excerpt || 'บทความน่าสนใจจาก Nexora Labs',
        openGraph: {
            title: article.title,
            description: article.excerpt || '',
            images: article.cover_image ? [{ url: article.cover_image }] : [],
        },
    }
}

// Helper to format date
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// 3. The actual Page Component
export default async function ArticleReadPage({ params }: { params: { slug: string } }) {
    // Increment view count via RPC or direct update
    // We do this server-side so it happens on page load
    const { error: rpcError } = await supabase.rpc('increment_article_views', { article_slug: params.slug })
    if (rpcError) {
        console.error('Failed to increment views:', rpcError)
    }

    // Fetch the article data
    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single()

    if (error || !article) {
        notFound()
    }

    return (
        <article className="min-h-screen bg-white pt-24 pb-24">
            {/* Hero Header Area */}
            <div className="bg-secondary-50 border-b border-secondary-100 pt-16 pb-20">
                <div className="container max-w-4xl mx-auto px-4">
                    <Link href="/articles" className="inline-flex items-center text-sm font-medium text-secondary-500 hover:text-primary-600 mb-8 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        กลับสู่หน้ารวมบทความ
                    </Link>

                    {article.category && (
                        <div className="flex items-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-white border border-secondary-200 text-primary-600 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm flex items-center">
                                <Tag className="w-3 h-3 mr-1.5" />
                                {article.category}
                            </span>
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 leading-tight mb-8">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-secondary-600">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center border-2 border-white shadow-sm">
                                <User className="w-5 h-5 text-primary-600" />
                            </div>
                            <span className="text-secondary-900 font-semibold">{article.author || 'Admin'}</span>
                        </div>
                        <div className="w-1 h-1 bg-secondary-300 rounded-full" />
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-secondary-400" />
                            {formatDate(article.created_at)}
                        </div>
                        <div className="w-1 h-1 bg-secondary-300 rounded-full" />
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-secondary-400" />
                            {article.view_count.toLocaleString()} ครั้ง
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container max-w-4xl mx-auto px-4 -mt-10 relative z-10">
                {article.cover_image && (
                    <div className="rounded-2xl overflow-hidden shadow-xl border border-secondary-100 mb-16 bg-white aspect-[21/9]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="bg-white lg:px-12">
                    {article.excerpt && (
                        <div className="text-xl text-secondary-600 leading-relaxed font-medium mb-12 border-l-4 border-primary-500 pl-6 py-2 bg-primary-50/50 rounded-r-xl">
                            {article.excerpt}
                        </div>
                    )}

                    {/* The raw HTML content from the CMS */}
                    <div
                        className="prose prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-img:rounded-xl prose-img:shadow-md"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* Footer Share */}
                <div className="mt-20 pt-8 border-t border-secondary-200 flex items-center justify-between">
                    <p className="text-secondary-500 font-medium text-sm">
                        แบ่งปันบทความนี้
                    </p>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-secondary-50 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}
