'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    ShoppingBag, Heart, Star, Truck, RotateCcw, Shield,
    Phone, Mail, MapPin, ChevronRight, Crown
} from 'lucide-react'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5 }
    })
}

const products = [
    { name: 'Silk Evening Dress', price: '$2,890', category: 'Dresses', color: 'bg-rose-100' },
    { name: 'Cashmere Blazer', price: '$1,650', category: 'Outerwear', color: 'bg-amber-100' },
    { name: 'Leather Handbag', price: '$3,200', category: 'Accessories', color: 'bg-orange-100' },
    { name: 'Pearl Necklace', price: '$4,500', category: 'Jewelry', color: 'bg-pink-100' },
    { name: 'Suede Ankle Boots', price: '$980', category: 'Shoes', color: 'bg-yellow-100' },
    { name: 'Linen Summer Set', price: '$1,200', category: 'Sets', color: 'bg-emerald-100' },
]

export default function LuxuryFashionDemo() {
    const [mobileMenu, setMobileMenu] = useState(false)

    return (
        <div className="bg-[#FDFBF7] text-[#2D2926]" style={{ fontFamily: "'DM Sans', 'Prompt', sans-serif" }}>
            {/* ── Navbar ── */}
            <nav className="bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-[#E8E0D4] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Crown className="w-6 h-6 text-[#B8860B]" />
                        <span className="font-bold text-xl tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>MAISON</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B6560] tracking-wide uppercase">
                        <a href="#hero" className="hover:text-[#B8860B] transition-colors">Home</a>
                        <a href="#collection" className="hover:text-[#B8860B] transition-colors">Collection</a>
                        <a href="#story" className="hover:text-[#B8860B] transition-colors">Our Story</a>
                        <a href="#contact" className="hover:text-[#B8860B] transition-colors">Contact</a>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <button className="p-2 text-[#6B6560] hover:text-[#B8860B] transition-colors"><Heart className="w-5 h-5" /></button>
                        <button className="p-2 text-[#6B6560] hover:text-[#B8860B] transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#B8860B] text-white text-[10px] flex items-center justify-center rounded-full font-bold">2</span>
                        </button>
                    </div>
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-[#6B6560]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
                {mobileMenu && (
                    <div className="md:hidden bg-[#FDFBF7] border-t border-[#E8E0D4] px-4 py-4 space-y-3">
                        {['Home', 'Collection', 'Our Story', 'Contact'].map(l => (
                            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="block text-[#2D2926] font-medium" onClick={() => setMobileMenu(false)}>{l}</a>
                        ))}
                    </div>
                )}
            </nav>

            {/* ── Hero ── */}
            <section id="hero" className="relative py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5EDE3] via-[#FDFBF7] to-[#F0E6D8]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#B8860B]/10 text-[#B8860B] rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
                                <Crown className="w-3 h-3" /> New Collection 2026
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Timeless <span className="text-[#B8860B]">Elegance</span>,<br />Modern Soul
                            </h1>
                            <p className="text-lg text-[#8A817C] leading-relaxed mb-8 max-w-lg">
                                Discover our curated selection of luxury fashion pieces, each handcrafted from the finest materials by master artisans.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a href="#collection" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2D2926] text-white font-semibold rounded-xl hover:bg-[#1a1715] transition-colors">
                                    Shop Collection <ChevronRight className="w-4 h-4" />
                                </a>
                                <a href="#story" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-[#D4C5B0] text-[#6B6560] font-semibold rounded-xl hover:border-[#B8860B] hover:text-[#B8860B] transition-colors">
                                    Our Story
                                </a>
                            </div>
                        </motion.div>
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="hidden lg:grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="bg-[#F0E6D8] rounded-2xl aspect-[3/4] flex items-center justify-center text-[#C4B59D]">
                                    <ShoppingBag className="w-16 h-16" />
                                </div>
                                <div className="bg-[#E8DDD0] rounded-2xl aspect-square flex items-center justify-center text-[#C4B59D]">
                                    <Crown className="w-12 h-12" />
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="bg-[#E8DDD0] rounded-2xl aspect-square flex items-center justify-center text-[#C4B59D]">
                                    <Heart className="w-12 h-12" />
                                </div>
                                <div className="bg-[#F0E6D8] rounded-2xl aspect-[3/4] flex items-center justify-center text-[#C4B59D]">
                                    <Star className="w-16 h-16" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Perks ── */}
            <section className="py-10 border-y border-[#E8E0D4]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Truck, label: 'Free Worldwide Shipping' },
                        { icon: RotateCcw, label: '30-Day Free Returns' },
                        { icon: Shield, label: 'Authenticity Guaranteed' },
                        { icon: Crown, label: 'VIP Member Perks' },
                    ].map((p, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-[#6B6560]">
                            <p.icon className="w-5 h-5 text-[#B8860B] shrink-0" />
                            <span className="font-medium">{p.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Collection ── */}
            <section id="collection" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="text-sm font-semibold text-[#B8860B] mb-2 uppercase tracking-widest">Featured</div>
                        <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>The Collection</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((p, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                                className="group cursor-pointer">
                                <div className={`${p.color} rounded-2xl aspect-[3/4] flex items-center justify-center mb-4 relative overflow-hidden group-hover:shadow-lg transition-shadow`}>
                                    <ShoppingBag className="w-16 h-16 text-[#C4B59D]/50" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
                                        <button className="px-6 py-2.5 bg-[#2D2926] text-white text-xs font-semibold rounded-lg uppercase tracking-wider hover:bg-[#1a1715] transition-colors">
                                            Quick View
                                        </button>
                                    </div>
                                    <button className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#6B6560] hover:text-[#B8860B] transition-colors opacity-0 group-hover:opacity-100">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="text-xs text-[#B8860B] font-semibold uppercase tracking-wider mb-1">{p.category}</div>
                                <h3 className="font-semibold text-[#2D2926] group-hover:text-[#B8860B] transition-colors">{p.name}</h3>
                                <div className="text-[#6B6560] font-medium mt-0.5">{p.price}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Story ── */}
            <section id="story" className="py-20 bg-[#2D2926] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="text-sm font-semibold text-[#B8860B] mb-2 uppercase tracking-widest">Our Heritage</div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Crafted with Passion Since 1987</h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            From our atelier in Milan to fashion capitals worldwide, Maison has been synonymous with uncompromising quality and timeless design. Each piece tells a story of dedication, artistry, and the pursuit of perfection.
                        </p>
                        <div className="grid grid-cols-3 gap-6 mt-8">
                            {[
                                { value: '37+', label: 'Years' },
                                { value: '150+', label: 'Artisans' },
                                { value: '40+', label: 'Countries' },
                            ].map((s, i) => (
                                <div key={i}>
                                    <div className="text-2xl font-bold text-[#B8860B]">{s.value}</div>
                                    <div className="text-sm text-gray-500">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#3D3530] rounded-2xl aspect-[4/3] flex items-center justify-center">
                        <Crown className="w-24 h-24 text-[#B8860B]/20" />
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="text-sm font-semibold text-[#B8860B] mb-2 uppercase tracking-widest">Reviews</div>
                        <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>What Our Clients Say</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { quote: 'The quality is absolutely extraordinary. Every detail speaks of true craftsmanship.', name: 'Isabella Rossi', role: 'Fashion Editor' },
                            { quote: 'Maison pieces are investment pieces. They only get more beautiful with time.', name: 'Charlotte Dubois', role: 'Stylist' },
                            { quote: 'The VIP experience is unmatched. From personal styling to white-glove delivery.', name: 'Sophia Park', role: 'Entrepreneur' },
                        ].map((t, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                                className="bg-[#F5EDE3] p-7 rounded-2xl">
                                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#B8860B] text-[#B8860B]" />)}</div>
                                <p className="text-[#6B6560] text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                                <div className="font-semibold text-[#2D2926] text-sm">{t.name}</div>
                                <div className="text-xs text-[#8A817C]">{t.role}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact ── */}
            <section id="contact" className="py-20 bg-[#F5EDE3]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-sm font-semibold text-[#B8860B] mb-2 uppercase tracking-widest">Get In Touch</div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Personal Styling Consultation</h2>
                    <p className="text-[#8A817C] mb-10">Book a private appointment with our styling experts for a bespoke experience.</p>
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-[#6B6560] mb-1">Full Name</label>
                                <input type="text" className="w-full px-4 py-2.5 border border-[#E8E0D4] rounded-xl text-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] outline-none bg-[#FDFBF7]" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#6B6560] mb-1">Email</label>
                                <input type="email" className="w-full px-4 py-2.5 border border-[#E8E0D4] rounded-xl text-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] outline-none bg-[#FDFBF7]" placeholder="your@email.com" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#6B6560] mb-1">Message</label>
                            <textarea rows={4} className="w-full px-4 py-2.5 border border-[#E8E0D4] rounded-xl text-sm focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] outline-none resize-none bg-[#FDFBF7]" placeholder="Tell us what you're looking for..." />
                        </div>
                        <button className="w-full py-3 bg-[#2D2926] text-white font-semibold rounded-xl hover:bg-[#1a1715] transition-colors">
                            Book Consultation
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-[#8A817C]">
                        <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#B8860B]" /> +39 02 1234 5678</span>
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#B8860B]" /> atelier@maison.com</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#B8860B]" /> Via Montenapoleone, Milan</span>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-[#2D2926] text-gray-500 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-white font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <Crown className="w-5 h-5 text-[#B8860B]" /> MAISON
                    </div>
                    <p className="text-xs">© 2026 Maison. All rights reserved. | Template Demo by Nexora Labs</p>
                </div>
            </footer>
        </div>
    )
}
