'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Cpu, Zap, Shield, Code, Terminal, Sparkles,
    ArrowRight, CheckCircle2, Phone, Mail, MapPin, ChevronRight, Layers
} from 'lucide-react'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5 }
    })
}

export default function DarkTechDemo() {
    const [mobileMenu, setMobileMenu] = useState(false)

    return (
        <div className="bg-gray-950 text-gray-200" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* ── Navbar ── */}
            <nav className="bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-7 h-7 text-cyan-400" />
                        <span className="font-bold text-xl text-white">NovaTech<span className="text-cyan-400">.</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#hero" className="hover:text-cyan-400 transition-colors">Home</a>
                        <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
                        <a href="#tech" className="hover:text-cyan-400 transition-colors">Technology</a>
                        <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
                        <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
                    </div>
                    <a href="#contact" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-gray-950 rounded-lg text-sm font-bold hover:bg-cyan-400 transition-colors">
                        Get Access <ArrowRight className="w-4 h-4" />
                    </a>
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
                {mobileMenu && (
                    <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-3">
                        {['Home', 'Features', 'Technology', 'Pricing', 'Contact'].map(l => (
                            <a key={l} href={`#${l.toLowerCase()}`} className="block text-gray-300 font-medium" onClick={() => setMobileMenu(false)}>{l}</a>
                        ))}
                    </div>
                )}
            </nav>

            {/* ── Hero ── */}
            <section id="hero" className="relative py-24 sm:py-32 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-gray-950 to-purple-950/30" />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold mb-8">
                            <Sparkles className="w-3 h-3" /> Next-Gen AI Platform
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                            The Future of<br /><span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Intelligent Systems</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Harness the power of advanced AI, real-time analytics, and cloud-native architecture to build systems that think, learn, and evolve.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                                Start Free Trial <ChevronRight className="w-4 h-4" />
                            </a>
                            <a href="#features" className="inline-flex items-center gap-2 px-8 py-4 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-800/50 transition-colors">
                                <Terminal className="w-4 h-4" /> View Demo
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="py-20 border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider">Features</div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">Built for the Modern Stack</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Cpu, title: 'AI Engine', desc: 'Powered by state-of-the-art neural networks for intelligent decision making.', glow: 'hover:shadow-cyan-500/10' },
                            { icon: Zap, title: 'Realtime Processing', desc: 'Sub-millisecond response times with edge computing infrastructure.', glow: 'hover:shadow-yellow-500/10' },
                            { icon: Shield, title: 'Zero-Trust Security', desc: 'End-to-end encryption with military-grade security protocols.', glow: 'hover:shadow-green-500/10' },
                            { icon: Code, title: 'Developer-First API', desc: 'RESTful and GraphQL APIs with comprehensive SDKs in every language.', glow: 'hover:shadow-purple-500/10' },
                            { icon: Layers, title: 'Auto-Scaling', desc: 'Automatically scales from zero to millions of requests seamlessly.', glow: 'hover:shadow-blue-500/10' },
                            { icon: Terminal, title: 'CLI Tools', desc: 'Powerful command-line tools for deployment and monitoring.', glow: 'hover:shadow-pink-500/10' },
                        ].map((f, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                                className={`bg-gray-900/50 border border-gray-800/50 p-7 rounded-2xl hover:bg-gray-900 hover:border-gray-700 hover:shadow-xl ${f.glow} transition-all duration-300 group cursor-pointer`}>
                                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-5 group-hover:bg-cyan-500/10 transition-colors">
                                    <f.icon className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Tech Stack Bar ── */}
            <section id="tech" className="py-16 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-cyan-500/10 border-y border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-white">Trusted Technology</h2>
                        <p className="text-gray-400 text-sm mt-2">Built on proven infrastructure used by industry leaders</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {[
                            { value: '99.99%', label: 'Uptime SLA' },
                            { value: '<10ms', label: 'Avg Latency' },
                            { value: '50M+', label: 'API Calls/Day' },
                            { value: '256-bit', label: 'Encryption' },
                        ].map((s, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">{s.value}</div>
                                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section id="pricing" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider">Pricing</div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">Simple, Transparent Pricing</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            { name: 'Starter', price: '$49', features: ['10K API calls/mo', 'Basic analytics', 'Email support', 'Community access'], popular: false },
                            { name: 'Pro', price: '$149', features: ['Unlimited API calls', 'Advanced analytics', 'Priority support', 'Custom models', 'Team collaboration'], popular: true },
                            { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Dedicated infrastructure', 'SLA guarantee', '24/7 phone support', 'Custom integrations'], popular: false },
                        ].map((p, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                                className={`p-7 rounded-2xl border ${p.popular ? 'bg-gradient-to-b from-cyan-950/50 to-gray-900 border-cyan-500/30 shadow-xl shadow-cyan-500/5 relative' : 'bg-gray-900/50 border-gray-800/50'}`}>
                                {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 text-gray-950 text-xs font-bold rounded-full">Most Popular</div>}
                                <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                                <div className="text-3xl font-extrabold text-white mb-1">{p.price}<span className="text-sm text-gray-500 font-normal">/mo</span></div>
                                <ul className="space-y-2.5 mt-6 mb-8">
                                    {p.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                                            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-3 rounded-xl font-semibold text-sm ${p.popular ? 'bg-cyan-500 text-gray-950 hover:bg-cyan-400' : 'bg-gray-800 text-white hover:bg-gray-700'} transition-colors`}>
                                    Get Started
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact ── */}
            <section id="contact" className="py-20 border-t border-gray-800/50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider">Contact</div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let&apos;s Build Something Amazing</h2>
                    <p className="text-gray-400 mb-10">Ready to revolutionize your tech stack? Reach out and we&apos;ll get you started.</p>
                    <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 text-left">
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input type="text" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input type="email" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none" placeholder="you@company.com" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                            <textarea rows={4} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none resize-none" placeholder="Tell us about your project..." />
                        </div>
                        <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                            Send Message
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500">
                        <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-cyan-500" /> +1 (555) 987-6543</span>
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-500" /> hello@novatech.ai</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> San Francisco, CA</span>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-800/50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <Cpu className="w-5 h-5 text-cyan-400" /> NovaTech<span className="text-cyan-400">.</span>
                    </div>
                    <p className="text-xs text-gray-600">© 2026 NovaTech. All rights reserved. | Template Demo by Nexora Labs</p>
                </div>
            </footer>
        </div>
    )
}
