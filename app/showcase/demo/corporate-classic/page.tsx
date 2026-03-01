'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Building2, Shield, TrendingUp, Users, Phone, Mail, MapPin,
    ChevronRight, Star, ArrowRight, CheckCircle2, BarChart3, Globe, Clock
} from 'lucide-react'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5 }
    })
}

export default function CorporateClassicDemo() {
    const [mobileMenu, setMobileMenu] = useState(false)

    return (
        <div className="font-sans text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* ── Navbar ── */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-7 h-7 text-blue-700" />
                        <span className="font-bold text-xl text-gray-900">Vertex Corp</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <a href="#hero" className="hover:text-blue-700 transition-colors">Home</a>
                        <a href="#about" className="hover:text-blue-700 transition-colors">About</a>
                        <a href="#services" className="hover:text-blue-700 transition-colors">Services</a>
                        <a href="#stats" className="hover:text-blue-700 transition-colors">Results</a>
                        <a href="#contact" className="hover:text-blue-700 transition-colors">Contact</a>
                    </div>
                    <a href="#contact" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </a>
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
                {mobileMenu && (
                    <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
                        {['Home', 'About', 'Services', 'Results', 'Contact'].map(l => (
                            <a key={l} href={`#${l.toLowerCase()}`} className="block text-gray-700 font-medium" onClick={() => setMobileMenu(false)}>{l}</a>
                        ))}
                    </div>
                )}
            </nav>

            {/* ── Hero ── */}
            <section id="hero" className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1e40af 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-6">
                                <Star className="w-3 h-3" /> Trusted by Fortune 500
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                Building <span className="text-blue-700">Tomorrow&apos;s</span> Enterprise Solutions
                            </h1>
                            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                                We help businesses transform their operations with cutting-edge technology, strategic consulting, and world-class implementation.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a href="#contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-700/25">
                                    Schedule a Call <ChevronRight className="w-4 h-4" />
                                </a>
                                <a href="#services" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-colors">
                                    Our Services
                                </a>
                            </div>
                        </motion.div>
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="relative hidden lg:block">
                            <div className="bg-white rounded-2xl shadow-2xl shadow-blue-200/40 p-8 border border-gray-100">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                                        <BarChart3 className="w-8 h-8 text-blue-600" />
                                        <div>
                                            <div className="text-sm text-gray-500">Revenue Growth</div>
                                            <div className="text-xl font-bold text-gray-900">+247%</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                        <TrendingUp className="w-8 h-8 text-green-600" />
                                        <div>
                                            <div className="text-sm text-gray-500">Operational Efficiency</div>
                                            <div className="text-xl font-bold text-gray-900">+89%</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                                        <Users className="w-8 h-8 text-purple-600" />
                                        <div>
                                            <div className="text-sm text-gray-500">Client Satisfaction</div>
                                            <div className="text-xl font-bold text-gray-900">98.5%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── About ── */}
            <section id="about" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Globe, label: 'Global Reach', value: '30+ Countries', color: 'bg-blue-50 text-blue-600' },
                                { icon: Users, label: 'Team Members', value: '500+', color: 'bg-green-50 text-green-600' },
                                { icon: Clock, label: 'Years Experience', value: '15+', color: 'bg-purple-50 text-purple-600' },
                                { icon: Star, label: 'Awards Won', value: '50+', color: 'bg-amber-50 text-amber-600' },
                            ].map((s, i) => (
                                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                                    className="p-6 bg-gray-50 rounded-2xl text-center border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                        <s.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                                    <div className="text-sm text-gray-500">{s.label}</div>
                                </motion.div>
                            ))}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wider">About Us</div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">A Legacy of Innovation and Excellence</h2>
                            <p className="text-gray-500 leading-relaxed mb-6">
                                For over 15 years, Vertex Corp has been at the forefront of digital transformation, helping enterprises navigate complex challenges and realize their full potential.
                            </p>
                            <ul className="space-y-3">
                                {['Data-driven strategic planning', 'Scalable cloud infrastructure', 'Enterprise-grade security', 'Dedicated support 24/7'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Services ── */}
            <section id="services" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wider">What We Do</div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Core Services</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: BarChart3, title: 'Business Strategy', desc: 'Data-driven strategies that align technology with your business objectives for maximum ROI.', color: 'text-blue-600 bg-blue-100' },
                            { icon: Globe, title: 'Digital Transformation', desc: 'End-to-end digital solutions that modernize your operations and customer experiences.', color: 'text-emerald-600 bg-emerald-100' },
                            { icon: Shield, title: 'Cybersecurity', desc: 'Enterprise-grade security solutions that protect your data, infrastructure, and reputation.', color: 'text-purple-600 bg-purple-100' },
                            { icon: TrendingUp, title: 'Growth Marketing', desc: 'Scalable marketing frameworks designed to accelerate customer acquisition and retention.', color: 'text-orange-600 bg-orange-100' },
                            { icon: Users, title: 'Team Augmentation', desc: 'Top-tier talent on demand to supplement your team and accelerate project delivery.', color: 'text-pink-600 bg-pink-100' },
                            { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock monitoring and dedicated support to keep your systems running smoothly.', color: 'text-cyan-600 bg-cyan-100' },
                        ].map((s, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                                className="bg-white p-7 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                                <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <s.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats Banner ── */}
            <section id="stats" className="py-16 bg-blue-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                    {[
                        { value: '500+', label: 'Projects Delivered' },
                        { value: '98%', label: 'Client Retention' },
                        { value: '$2B+', label: 'Revenue Generated' },
                        { value: '30+', label: 'Countries Served' },
                    ].map((s, i) => (
                        <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                            <div className="text-3xl sm:text-4xl font-extrabold mb-1">{s.value}</div>
                            <div className="text-blue-200 text-sm">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wider">Testimonials</div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Our Clients Say</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { quote: 'Vertex Corp transformed our entire digital infrastructure. Our efficiency improved by 300% within the first year.', name: 'Sarah Chen', role: 'CTO, TechVision Inc.' },
                            { quote: 'The team&apos;s strategic approach and deep expertise made our cloud migration seamless and cost-effective.', name: 'Michael Roberts', role: 'VP Engineering, ScaleUp' },
                            { quote: 'Outstanding cybersecurity implementation. We feel confident knowing our data is protected by the best.', name: 'Lisa Yamamoto', role: 'CISO, GlobalFinance' },
                        ].map((t, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                                className="bg-gray-50 p-7 rounded-2xl border border-gray-100">
                                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                                    <div className="text-xs text-gray-400">{t.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact ── */}
            <section id="contact" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <div className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wider">Contact Us</div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Business?</h2>
                            <p className="text-gray-500 leading-relaxed mb-8">Get in touch and let&apos;s discuss how we can help you achieve your goals.</p>
                            <div className="space-y-4">
                                {[
                                    { icon: Phone, label: '+1 (555) 123-4567' },
                                    { icon: Mail, label: 'contact@vertexcorp.com' },
                                    { icon: MapPin, label: '123 Business Ave, Suite 500, San Francisco, CA' },
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center shrink-0">
                                            <c.icon className="w-5 h-5" />
                                        </div>
                                        {c.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="john@company.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" placeholder="Tell us about your project..." />
                                </div>
                                <button className="w-full py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-white font-bold text-lg">
                            <Building2 className="w-6 h-6 text-blue-400" /> Vertex Corp
                        </div>
                        <p className="text-sm">© 2026 Vertex Corp. All rights reserved. <span className="text-gray-600">| Template Demo by Nexora Labs</span></p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
