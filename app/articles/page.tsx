'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Calendar, User, Eye, ArrowRight, Image as ImageIcon, TrendingUp, Clock, Tag, ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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

    // Memoize article groupings
    const { popularArticles, latestArticles, filteredArticles } = useMemo(() => {
        if (activeCategory !== 'all') {
            const filtered = articles.filter(a => a.category === activeCategory);
            return { popularArticles: [], latestArticles: [], filteredArticles: filtered };
        }

        // If there are less than 4 articles, just show them all in Latest so we don't have an empty section
        if (articles.length <= 3) {
            return { popularArticles: [], latestArticles: articles, filteredArticles: [] };
        }

        const sortedByViews = [...articles].sort((a, b) => {
            if (b.view_count !== a.view_count) {
                return b.view_count - a.view_count;
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        // Top 3 most viewed articles
        const popular = sortedByViews.slice(0, 3);
        const popularIds = new Set(popular.map(a => a.id));

        // The rest are latest articles (already sorted by created_at from DB)
        const latest = articles.filter(a => !popularIds.has(a.id));

        return { popularArticles: popular, latestArticles: latest, filteredArticles: [] };
    }, [articles, activeCategory])

    const ArticleCard = ({ article, isFeatured = false }: { article: ArticleItem, isFeatured?: boolean }) => (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Link href={`/articles/${article.slug}`} className="block h-full group outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl">
                <div className={`bg-white rounded-2xl overflow-hidden border border-secondary-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full ${isFeatured ? 'ring-2 ring-primary-500/20' : ''}`}>
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

                        <div className="absolute top-4 left-4 flex gap-2">
                            {isFeatured && (
                                <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    ยอดฮิต
                                </span>
                            )}
                            {article.category && (
                                <span className="bg-white/95 backdrop-blur-sm text-primary-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                                    {article.category}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-xs font-medium text-secondary-500 mb-4">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatDate(article.created_at)}
                            </div>
                            <div className={`flex items-center gap-1.5 ${isFeatured ? 'text-orange-600 font-bold' : ''}`}>
                                <Eye className="w-4 h-4" />
                                {article.view_count.toLocaleString()} ครั้ง
                            </div>
                        </div>

                        <h3 className={`font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
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
                                <span className="text-sm font-medium text-secondary-900 truncate max-w-[120px]">
                                    {article.author || 'Admin'}
                                </span>
                            </div>
                            <span className="inline-flex items-center text-sm font-bold text-primary-600 group-hover:translate-x-1 transition-transform whitespace-nowrap">
                                อ่านต่อ <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )

    return (
        <div className="min-h-screen bg-secondary-50 flex flex-col">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center justify-center text-sm font-medium text-secondary-500 mb-8 overflow-x-auto whitespace-nowrap">
                            <Link href="/" className="flex items-center hover:text-primary-600 transition-colors">
                                <Home className="w-4 h-4 mr-1.5" />
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 mx-2 text-secondary-300 shrink-0" />

                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`flex items-center transition-colors ${activeCategory === 'all' ? 'text-primary-600' : 'hover:text-primary-600'}`}
                            >
                                บทความทั้งหมด
                            </button>

                            <AnimatePresence>
                                {activeCategory !== 'all' && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0, x: -10 }}
                                        animate={{ opacity: 1, width: 'auto', x: 0 }}
                                        exit={{ opacity: 0, width: 0, x: -10 }}
                                        className="flex items-center overflow-hidden"
                                    >
                                        <ChevronRight className="w-4 h-4 mx-2 text-secondary-300 shrink-0" />
                                        <span className="text-secondary-900 font-semibold truncate max-w-[200px] sm:max-w-none">
                                            Category: &quot;{activeCategory}&quot;
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </nav>

                        <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
                            บทความและข่าวสาร
                        </h1>
                        <p className="text-lg text-secondary-600 leading-relaxed">
                            อัปเดตความรู้ เทรนด์เทคโนโลยี และเทคนิคการทำเว็บไซต์เพื่อธุรกิจของคุณ
                        </p>
                    </div>

                    {/* Categories Filter */}
                    {!isLoading && categories.length > 1 && (
                        <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-10">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 ${activeCategory === category
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105'
                                        : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600 border border-secondary-200 hover:border-primary-200'
                                        }`}
                                >
                                    {category === 'all' ? 'บทความทั้งหมด' : category}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content Area */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-24">
                            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                        </div>
                    ) : articles.length > 0 ? (
                        <div className="space-y-16">
                            {/* Popular Articles Section */}
                            <AnimatePresence mode="wait">
                                {activeCategory === 'all' && popularArticles.length > 0 && (
                                    <motion.section
                                        key="popular-section"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm border border-orange-200/50">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">ยอดฮิตติดเทรนด์</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {popularArticles.map((article) => (
                                                <ArticleCard key={article.id} article={article} isFeatured={true} />
                                            ))}
                                        </div>
                                    </motion.section>
                                )}
                            </AnimatePresence>

                            {/* Latest or Filtered Articles Section */}
                            <motion.section layout="position">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-sm border border-primary-200/50">
                                        {activeCategory === 'all' ? <Clock className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900">
                                        {activeCategory === 'all' ? 'บทความล่าสุด' : `หมวดหมู่: ${activeCategory}`}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <AnimatePresence mode="popLayout">
                                        {(activeCategory === 'all' ? latestArticles : filteredArticles).map((article) => (
                                            <ArticleCard key={article.id} article={article} />
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {(activeCategory === 'all' ? latestArticles : filteredArticles).length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-20 bg-white rounded-3xl border border-secondary-100 shadow-sm"
                                    >
                                        <ImageIcon className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-secondary-900 mb-2">ไม่มีบทความในส่วนนี้</h3>
                                        <p className="text-secondary-500">บทความอื่นๆ อาจถูกแสดงในหมวดยอดฮิตไปแล้ว</p>
                                    </motion.div>
                                )}
                            </motion.section>
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
            </main>
            <Footer />
        </div>
    )
}
