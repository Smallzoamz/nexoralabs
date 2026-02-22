'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Calendar, User, Eye, ArrowRight, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface ArticleItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    category: string | null;
    author: string | null;
    view_count: number;
    created_at: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<ArticleItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<string>('all')

    useEffect(() => {
        async function fetchArticles() {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('id, title, slug, excerpt, cover_image, category, author, view_count, created_at')
                    .eq('is_published', true)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setArticles(data || [])
            } catch (err) {
                console.error('Error fetching articles:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchArticles()
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Extract unique categories
    const categories = ['all', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean))) as string[]]

    // Filter articles
    const filteredArticles = activeCategory === 'all'
        ? articles
        : articles.filter(a => a.category === activeCategory)

    return (
        <div className="min-h-screen bg-secondary-50 pt-32 pb-24">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-secondary-500 hover:text-primary-600 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        กลับหน้าหลัก
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
                        บทความและข่าวสาร
                    </h1>
                    <p className="text-lg text-secondary-600 leading-relaxed">
                        อัปเดตความรู้ เทรนด์เทคโนโลยี และเทคนิคการทำเว็บไซต์เพื่อธุรกิจของคุณ
                    </p>
                </div>

                {/* Categories Filter */}
                {!isLoading && categories.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600 border border-secondary-200'
                                    }`}
                            >
                                {category === 'all' ? 'ทั้งหมด' : category}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                    </div>
                ) : filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/articles/${article.slug}`} className="block h-full group">
                                    <div className="bg-white rounded-2xl overflow-hidden border border-secondary-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                        {/* Cover Image */}
                                        <div className="aspect-[16/9] w-full relative overflow-hidden bg-secondary-100 shrink-0">
                                            {article.cover_image ? (
                                                <>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={article.cover_image}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    />
                                                    <div className="absolute inset-0 bg-secondary-900/10 group-hover:bg-transparent transition-colors" />
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full">
                                                    <ImageIcon className="w-12 h-12 text-secondary-300" />
                                                </div>
                                            )}

                                            {article.category && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                                                        {article.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 text-xs font-medium text-secondary-500 mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(article.created_at)}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Eye className="w-4 h-4" />
                                                    {article.view_count.toLocaleString()}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                                                {article.title}
                                            </h3>

                                            {article.excerpt && (
                                                <p className="text-secondary-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                                    {article.excerpt}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-5 border-t border-secondary-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                                        <User className="w-3 h-3 text-primary-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-secondary-900">
                                                        {article.author || 'Admin'}
                                                    </span>
                                                </div>
                                                <span className="inline-flex items-center text-sm font-bold text-primary-600 group-hover:translate-x-1 transition-transform">
                                                    อ่านต่อ <ArrowRight className="w-4 h-4 ml-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-secondary-100 shadow-sm max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ImageIcon className="w-10 h-10 text-secondary-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                            ยังไม่มีบทความในขณะนี้
                        </h3>
                        <p className="text-secondary-500 max-w-md mx-auto">
                            เรากำลังจัดเตรียมบทความและเนื้อหาที่เป็นประโยชน์ โปรดติดตามหน้าเว็บไซต์นี้อีกครั้งในเร็วๆ นี้
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
