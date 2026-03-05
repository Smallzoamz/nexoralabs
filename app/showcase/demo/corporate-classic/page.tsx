import { BarChart3, Cloud, DollarSign, Facebook, Instagram, Linkedin, Network, Settings, TrendingUp, CheckCircle2, Users, Award, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import MobileNav from '../MobileNav'

export default function CorporateClassicDemo() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col pt-20">
            {/* Navbar */}
            <header className="fixed top-0 inset-x-0 h-20 bg-white border-b border-slate-100 z-50 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Logo Mark */}
                    <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-2xl italic tracking-tighter">
                        S
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-xl leading-tight text-slate-800 tracking-tight">SYNERGY</span>
                        <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Global Consulting</span>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-700">
                    <Link href="#" className="hover:text-blue-600 transition-colors">HOME</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">SERVICES</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">INDUSTRIES</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">CAREERS</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">ABOUT</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">CONTACT</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">BLOG</Link>
                </nav>

                <button className="hidden md:block bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded text-sm font-bold transition-colors">
                    GET IN TOUCH
                </button>
                <MobileNav
                    items={[
                        { label: 'HOME', href: '#' },
                        { label: 'SERVICES', href: '#' },
                        { label: 'INDUSTRIES', href: '#' },
                        { label: 'CAREERS', href: '#' },
                        { label: 'ABOUT', href: '#' },
                        { label: 'CONTACT', href: '#' },
                        { label: 'BLOG', href: '#' },
                    ]}
                    hiddenAt="lg"
                />
            </header>

            {/* Hero Section */}
            <section className="relative h-[600px] flex flex-col justify-center">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                        alt="Corporate Building"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                            TRANSFORMING BUSINESSES<br />FOR THE FUTURE
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed font-medium max-w-2xl">
                            SYNERGY GLOBAL CONSULTING provides expert solutions to drive innovation, growth, and sustainable success worldwide.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <button className="bg-blue-800/90 hover:bg-blue-800 text-white px-8 py-3 rounded font-bold transition-colors border border-blue-800">
                                OUR SERVICES
                            </button>
                            <button className="bg-transparent hover:bg-white/10 text-white px-8 py-3 rounded font-bold transition-colors border-2 border-white">
                                LEARN MORE
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-white flex-1 relative z-10">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 uppercase tracking-tight">OUR SERVICES</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Service 1 */}
                        <div className="border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow bg-white flex flex-col">
                            <div className="w-12 h-12 flex items-center justify-center mb-6 text-slate-700">
                                <TrendingUp className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase">STRATEGIC PLANNING</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                Strategic planning and inventent planner that events and sections for strategic samont.
                            </p>
                            <Link href="#" className="text-slate-900 font-bold text-sm uppercase underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors inline-block mt-auto">
                                Read More
                            </Link>
                        </div>

                        {/* Service 2 */}
                        <div className="border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow bg-white flex flex-col">
                            <div className="w-12 h-12 flex items-center justify-center mb-6 text-slate-700">
                                <Network className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase">DIGITAL TRANSFORMATION</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                Digital transformation provides expert solutions media innovation, network and promœric network.
                            </p>
                            <Link href="#" className="text-slate-900 font-bold text-sm uppercase underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors inline-block mt-auto">
                                Read More
                            </Link>
                        </div>

                        {/* Service 3 */}
                        <div className="border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow bg-white flex flex-col">
                            <div className="w-12 h-12 flex items-center justify-center mb-6 text-slate-700">
                                <DollarSign className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase">FINANCIAL ADVISORY</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                Financial advisory is an stressmary of prometær comannuals or imernse and investments.
                            </p>
                            <Link href="#" className="text-slate-900 font-bold text-sm uppercase underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors inline-block mt-auto">
                                Read More
                            </Link>
                        </div>

                        {/* Service 4 */}
                        <div className="border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow bg-white flex flex-col">
                            <div className="w-12 h-12 flex items-center justify-center mb-6 text-slate-700">
                                <Cloud className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase">TECHNOLOGY CONSULTING</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                Technology consulting and technology prodassos for aivmnerting computenng researchs.
                            </p>
                            <Link href="#" className="text-slate-900 font-bold text-sm uppercase underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors inline-block mt-auto">
                                Read More
                            </Link>
                        </div>

                        {/* Service 5 */}
                        <div className="border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow bg-white flex flex-col">
                            <div className="w-12 h-12 flex items-center justify-center mb-6 text-slate-700">
                                <Settings className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase">OPERATIONS OPTIMIZATION</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                Operations optimization and operations optimization of gears, and oosrs operations.
                            </p>
                            <Link href="#" className="text-slate-900 font-bold text-sm uppercase underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors inline-block mt-auto">
                                Read More
                            </Link>
                        </div>

                        {/* Service 6 */}
                        <div className="border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow bg-white flex flex-col">
                            <div className="w-12 h-12 flex items-center justify-center mb-6 text-slate-700">
                                <BarChart3 className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase">CORPORATE FINANCE</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                Corporate finance is amplifies to analyze avtsvagement scadilities and business manage ment.
                            </p>
                            <Link href="#" className="text-slate-900 font-bold text-sm uppercase underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors inline-block mt-auto">
                                Read More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us / Stats Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-200 relative z-10">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-6">WHY CHOOSE SYNERGY?</h2>
                            <p className="text-slate-600 leading-relaxed mb-8">
                                With over two decades of global experience, Synergy brings unparalleled expertise to every engagement. We don&apos;t just advise; we partner with you to implement strategic visions that yield tangible results and long-term exponential growth.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Global Network of Industry Experts',
                                    'Data-Driven Analytical Approach',
                                    'Proven Track Record of ROI',
                                    'Tailored Strategies for Every Client'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded font-bold transition-colors">
                                MEET THE TEAM
                            </button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
                                <Users className="w-10 h-10 mx-auto text-blue-600 mb-4" />
                                <div className="text-4xl font-extrabold text-slate-900 mb-2">500+</div>
                                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Clients Worldwide</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center mt-8">
                                <Award className="w-10 h-10 mx-auto text-blue-600 mb-4" />
                                <div className="text-4xl font-extrabold text-slate-900 mb-2">15+</div>
                                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Industry Awards</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
                                <BarChart3 className="w-10 h-10 mx-auto text-blue-600 mb-4" />
                                <div className="text-4xl font-extrabold text-slate-900 mb-2">$2B+</div>
                                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Value Generated</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center mt-8">
                                <Network className="w-10 h-10 mx-auto text-blue-600 mb-4" />
                                <div className="text-4xl font-extrabold text-slate-900 mb-2">35</div>
                                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Global Offices</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio / Case Studies Section */}
            <section className="py-24 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-4">CASE STUDIES</h2>
                            <p className="text-slate-600 max-w-2xl text-lg">
                                Discover how we&apos;ve helped leading enterprises navigate complex challenges and achieve operational excellence.
                            </p>
                        </div>
                        <button className="text-slate-900 font-bold text-sm uppercase underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors shrink-0">
                            VIEW ALL CASES
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Case 1 */}
                        <div className="group cursor-pointer">
                            <div className="relative h-64 w-full mb-6 overflow-hidden rounded-lg">
                                <Image
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                                    alt="Financial Restructuring"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded text-slate-900 uppercase tracking-wider">
                                    Finance
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Global Bank Restructuring</h3>
                            <p className="text-slate-600 line-clamp-2">Complete digital and operational overhaul for a tier-1 European banking institution.</p>
                        </div>
                        {/* Case 2 */}
                        <div className="group cursor-pointer">
                            <div className="relative h-64 w-full mb-6 overflow-hidden rounded-lg">
                                <Image
                                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1770&auto=format&fit=crop"
                                    alt="Tech Implementation"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded text-slate-900 uppercase tracking-wider">
                                    Technology
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Cloud Migration Strategy</h3>
                            <p className="text-slate-600 line-clamp-2">Seamless transition to cloud architecture reducing enterprise IT costs by 40%.</p>
                        </div>
                        {/* Case 3 */}
                        <div className="group cursor-pointer">
                            <div className="relative h-64 w-full mb-6 overflow-hidden rounded-lg">
                                <Image
                                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1770&auto=format&fit=crop"
                                    alt="Market Expansion"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded text-slate-900 uppercase tracking-wider">
                                    Strategy
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">APAC Market Entry</h3>
                            <p className="text-slate-600 line-clamp-2">Strategic planning and execution for a US retail giant entering the Asian market.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-slate-900 text-white relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/20 rounded-l-full blur-3xl translate-x-1/3"></div>

                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4">CLIENT VOICES</h2>
                        <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 md:p-12">
                            <div className="flex gap-1 text-blue-400 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                                &quot;Synergy Global Consulting entirely transformed our approach to digital operations. Their team&apos;s profound industry knowledge and tactical execution allowed us to scale our revenue by 300% within a single fiscal year. An absolutely indispensable partner.&quot;
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden relative border-2 border-slate-600">
                                    <Image
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
                                        alt="Client Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg uppercase tracking-wide">David Chen</h4>
                                    <p className="text-blue-400 text-sm font-medium">CEO, Apex Technologies</p>
                                </div>
                            </div>

                            {/* Carousel Controls */}
                            <div className="absolute right-8 bottom-8 flex gap-2">
                                <button className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center hover:bg-slate-700 transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600 relative z-10">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-white">
                        <h2 className="text-3xl font-extrabold uppercase tracking-tight mb-2">READY TO TRANSFORM YOUR BUSINESS?</h2>
                        <p className="text-blue-100 text-lg">Schedule a consultation with our senior partners today.</p>
                    </div>
                    <button className="bg-white text-blue-900 px-8 py-4 rounded font-bold text-lg hover:bg-blue-50 transition-colors shrink-0 shadow-xl shadow-blue-900/20">
                        BOOK CONSULTATION
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 px-8 mt-auto z-10 relative">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Brand & Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2 grayscale brightness-200 contrast-200">
                            <div className="w-8 h-8 bg-white text-slate-900 rounded flex items-center justify-center font-bold text-xl italic tracking-tighter">
                                S
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-lg leading-tight text-white tracking-tight">SYNERGY</span>
                                <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase">Global Consulting</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">© Copyright Global Consulting</p>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-4 text-white">
                        <Link href="#" className="bg-white text-slate-900 p-2 rounded-full hover:bg-slate-200 transition-colors">
                            <Facebook className="w-5 h-5 fill-current" />
                        </Link>
                        <Link href="#" className="bg-white text-slate-900 p-2 rounded-full hover:bg-slate-200 transition-colors">
                            <Instagram className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="bg-white text-slate-900 p-2 rounded-full hover:bg-slate-200 transition-colors">
                            <Linkedin className="w-5 h-5 fill-current" />
                        </Link>
                    </div>

                    {/* Address */}
                    <div className="text-center md:text-right text-slate-300 text-sm leading-relaxed">
                        1233 Main Rohrvain Street,<br />Sarwera, Bander, NY 22306
                    </div>
                </div>
            </footer>
        </div>
    )
}
