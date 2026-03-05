import { ArrowRight, Battery, Cpu, Fingerprint, Search, ShoppingBag, Smartphone, Star, User, Wifi } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import MobileNav from '../MobileNav'

export default function TechGadgetsDemo() {
    return (
        <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-blue-600/30">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 h-20 bg-slate-900 z-50 flex items-center justify-between px-6 md:px-12 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold tracking-tight text-white text-xl hidden sm:block">AuraTech</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
                    <Link href="#" className="text-white hover:text-blue-400 transition-colors">Smartphones</Link>
                    <Link href="#" className="hover:text-blue-400 transition-colors">Wearables</Link>
                    <Link href="#" className="hover:text-blue-400 transition-colors">Audio</Link>
                    <Link href="#" className="hover:text-blue-400 transition-colors">Accessories</Link>
                </nav>

                <div className="flex items-center gap-5">
                    <button className="text-slate-400 hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
                    <button className="hidden md:inline-block text-slate-400 hover:text-white transition-colors"><User className="w-5 h-5" /></button>
                    <button className="text-white relative hover:scale-110 transition-transform">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 rounded-full text-[9px] font-bold flex items-center justify-center">1</span>
                    </button>
                    <MobileNav
                        items={[
                            { label: 'Smartphones', href: '#' },
                            { label: 'Wearables', href: '#' },
                            { label: 'Audio', href: '#' },
                            { label: 'Accessories', href: '#' },
                        ]}
                        buttonClass="text-white bg-white/10 hover:bg-white/20"
                        panelBg="bg-black"
                        linkClass="text-slate-300 hover:text-blue-400"
                        closeClass="text-white"
                    />
                </div>
            </header>

            {/* Hero / Spotlight Product */}
            <section className="pt-20 lg:h-screen lg:min-h-[800px] flex flex-col lg:flex-row items-center border-b border-white/10">
                {/* Product Info */}
                <div className="w-full lg:w-1/2 p-12 md:p-24 flex flex-col justify-center order-2 lg:order-1 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/30">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        New Release
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-4">
                        Aura X Pro
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-slate-400 mb-8 max-w-md">
                        Beyond reality. The most advanced computational photography system ever built into a smartphone.
                    </p>
                    <div className="flex items-center gap-6 mb-12">
                        <div className="text-3xl font-bold text-white">$1,199</div>
                        <div className="text-sm font-medium text-slate-500 line-through">$1,399</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-white hover:bg-slate-200 text-black px-8 py-4 rounded-full font-bold transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            Buy Now
                        </button>
                        <button className="bg-transparent border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-full font-bold transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Product Imagery */}
                <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative order-1 lg:order-2 bg-gradient-to-br from-slate-900 to-black overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_60%)]"></div>
                    <div className="relative w-full max-w-md aspect-[3/4] hover:scale-105 transition-transform duration-700 ease-out z-10">
                        <Image
                            src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1858&auto=format&fit=crop"
                            alt="Aura X Pro"
                            fill
                            className="object-contain drop-shadow-[0_0_50px_rgba(37,99,235,0.5)]"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Tech Specs */}
            <section className="py-24 px-6 md:px-12 border-b border-white/10 dark relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Engineered for the extraordinary.</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Every component optimized for maximum performance, efficiency, and intelligence.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Cpu, title: 'Aura Bionic M3', desc: 'The fastest chip ever in a smartphone. 4nm architecture.' },
                            { icon: Battery, title: 'All-Day Power', desc: 'Up to 28 hours video playback. 50% charge in 30 mins.' },
                            { icon: Fingerprint, title: 'Quantum Security', desc: 'Next-generation biometric authentication embedded in screen.' },
                            { icon: Wifi, title: 'HyperSpeed 6G', desc: 'Download entire seasons in seconds with mmWave tech.' }
                        ].map((spec, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:border-blue-500/50 transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <spec.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{spec.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{spec.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related / Ecosystem */}
            <section className="py-24 px-6 md:px-12 border-b border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Complete your setup.</h2>
                            <p className="text-slate-400">Seamless integration across the Aura ecosystem.</p>
                        </div>
                        <Link href="#" className="text-blue-400 font-bold hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-wider shrink-0">
                            Shop All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Aura Sound Pods Pro', price: '$249', img: 'https://images.unsplash.com/photo-1606220588913-b3aec9ce9fce?q=80&w=2070&auto=format&fit=crop', rating: 4.8 },
                            { name: 'Aura Watch Series 5', price: '$399', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072&auto=format&fit=crop', rating: 4.9 },
                            { name: 'MagSafe Wireless Dock', price: '$89', img: 'https://images.unsplash.com/photo-1620387431113-1b9c7b9af3ab?q=80&w=1934&auto=format&fit=crop', rating: 4.6 }
                        ].map((prod, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative h-80 w-full rounded-3xl overflow-hidden bg-slate-900 mb-6 border border-white/5">
                                    <Image src={prod.img} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{prod.name}</h3>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                                            <Star className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" /> {prod.rating}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-slate-300">{prod.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 px-6 md:px-12 text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                <div className="max-w-2xl mx-auto relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Stay ahead of the curve.</h2>
                    <p className="text-slate-400 mb-10 text-lg">Subscribe to receive exclusive offers, early access to new releases, and deep dives into our latest tech.</p>

                    <form className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-white/5 border border-white/10 rounded-full px-6 py-4 flex-1 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all font-medium"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-colors shrink-0">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900/50 border-t border-white/10 pt-16 pb-8 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16 text-sm font-medium text-slate-400">
                    <div className="col-span-2 lg:col-span-2 pr-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Smartphone className="w-5 h-5 text-blue-500" />
                            <span className="font-bold tracking-tight text-white text-lg">AuraTech</span>
                        </div>
                        <p className="mb-6 leading-relaxed">Designing the future of personal technology. Building products that empower creators worldwide.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-xs">Products</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Smartphones</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Tablets</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Wearables</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Laptops</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-xs">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Warranty</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Repair Service</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">User Manuals</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-xs">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Newsroom</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Environment</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-medium text-slate-500">
                    <p>&copy; {new Date().getFullYear()} AuraTech Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Sales</Link>
                        <Link href="#" className="hover:text-white transition-colors">Legal</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
