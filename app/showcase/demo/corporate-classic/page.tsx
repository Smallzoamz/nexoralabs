import { BarChart3, Cloud, DollarSign, Facebook, Instagram, Linkedin, Network, Settings, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CorporateClassicDemo() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col pt-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-200 z-50 flex items-center px-8 justify-between">
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
