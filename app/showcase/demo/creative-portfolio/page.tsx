import { ArrowRight, Code, Figma, Framer, Github, Instagram, Layers, Mail, PenTool, Sparkles, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import MobileNav from '../MobileNav'

export default function CreativePortfolioDemo() {
    return (
        <div className="min-h-screen bg-[#FDF8F5] text-slate-800 font-sans selection:bg-pink-300/40 relative">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-300/40 to-orange-300/40 blur-[100px] rounded-full point-events-none -z-10 mix-blend-multiply" />
            <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-violet-300/40 to-fuchsia-300/40 blur-[120px] rounded-full point-events-none -z-10 mix-blend-multiply" />
            <div className="absolute bottom-0 right-[-10%] w-[700px] h-[700px] bg-gradient-to-tl from-yellow-200/40 to-orange-300/40 blur-[150px] rounded-full point-events-none -z-10 mix-blend-multiply" />

            {/* Navigation */}
            <header className="fixed top-0 inset-x-0 h-20 bg-white border-b border-slate-100 z-50 flex items-center px-6 md:px-12 justify-between">
                <div className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">
                    Anya.Studio
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <Link href="#" className="hover:text-pink-500 transition-colors">Work</Link>
                    <Link href="#" className="hover:text-pink-500 transition-colors">Experience</Link>
                    <Link href="#" className="hover:text-pink-500 transition-colors">Playground</Link>
                </nav>
                <button className="hidden md:inline-block bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors shadow-lg shadow-slate-900/20">
                    Let&apos;s Talk
                </button>
                <MobileNav
                    items={[
                        { label: 'Work', href: '#' },
                        { label: 'Experience', href: '#' },
                        { label: 'Playground', href: '#' },
                    ]}
                    linkClass="text-slate-800 hover:text-pink-500"
                />
            </header>

            {/* Hero */}
            <section className="pt-48 pb-32 px-8 flex flex-col items-center text-center relative z-10">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-8 border-4 border-white shadow-xl shadow-pink-500/10 relative">
                    <Image
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop"
                        alt="Anya Profile"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-white shadow-sm mb-6 font-medium text-sm text-slate-600">
                    <Sparkles className="w-4 h-4 text-orange-500" /> Multi-disciplinary Designer & Developer
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8 max-w-4xl">
                    Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-orange-500">digital experiences</span> with soul.
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed font-medium mb-12">
                    I blur the line between design and engineering to build products that people love. Currently based in Amsterdam.
                </p>

                <div className="absolute top-[30%] left-[15%] hidden lg:block hover:scale-110 transition-transform">
                    <div className="bg-white p-4 rounded-2xl shadow-xl shadow-orange-500/10 rotate-[-12deg] border border-orange-100">
                        <PenTool className="w-8 h-8 text-pink-500" />
                    </div>
                </div>
                <div className="absolute top-[50%] right-[15%] hidden lg:block hover:scale-110 transition-transform">
                    <div className="bg-white p-4 rounded-2xl shadow-xl shadow-fuchsia-500/10 rotate-[15deg] border border-fuchsia-100">
                        <Code className="w-8 h-8 text-violet-500" />
                    </div>
                </div>
            </section>

            {/* Work / Masonry Gallery */}
            <section className="py-24 px-4 sm:px-8 relative z-10 w-full max-w-[1400px] mx-auto">
                <div className="flex items-center justify-between mb-16 px-4">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Selected Works</h2>
                    <Link href="#" className="hidden sm:flex items-center gap-2 font-bold text-slate-600 hover:text-pink-500 transition-colors">
                        View All <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {/* Project 1 */}
                    <div className="break-inside-avoid relative group w-full rounded-3xl overflow-hidden bg-white shadow-md cursor-pointer hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500">
                        <div className="relative h-[400px] w-full bg-orange-100">
                            <Image src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1770&auto=format&fit=crop" alt="Project" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out p-8 mix-blend-multiply" />
                        </div>
                        <div className="p-8 absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="text-orange-300 font-bold text-xs uppercase tracking-wider mb-2 block">Fintech App</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Vault Banking</h3>
                        </div>
                    </div>

                    {/* Project 2 */}
                    <div className="break-inside-avoid relative group w-full rounded-3xl overflow-hidden bg-white shadow-md cursor-pointer hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500">
                        <div className="relative h-[600px] w-full bg-violet-100">
                            <Image src="https://images.unsplash.com/photo-1627398225058-f4c1be2720d1?q=80&w=1887&auto=format&fit=crop" alt="Project" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        </div>
                        <div className="p-8 absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="text-violet-300 font-bold text-xs uppercase tracking-wider mb-2 block">Web3 Platform</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Nexus NFT</h3>
                        </div>
                    </div>

                    {/* Project 3 */}
                    <div className="break-inside-avoid relative group w-full rounded-3xl overflow-hidden bg-white shadow-md cursor-pointer hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500">
                        <div className="relative h-[300px] w-full bg-pink-100">
                            <Image src="https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=1770&auto=format&fit=crop" alt="Project" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        </div>
                        <div className="p-8 absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="text-pink-300 font-bold text-xs uppercase tracking-wider mb-2 block">Brand Identity</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Lumina Cosmetics</h3>
                        </div>
                    </div>

                    {/* Project 4 */}
                    <div className="break-inside-avoid relative group w-full rounded-3xl overflow-hidden bg-white shadow-md cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                        <div className="relative h-[500px] w-full bg-blue-100">
                            <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1770&auto=format&fit=crop" alt="Project" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        </div>
                        <div className="p-8 absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="text-blue-300 font-bold text-xs uppercase tracking-wider mb-2 block">SaaS Dashboard</span>
                            <h3 className="text-2xl font-bold text-white mb-2">MetricsPro</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience & Tools Section */}
            <section className="py-24 px-8 relative z-10">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">

                    {/* Experience */}
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-12">Experience</h2>
                        <div className="space-y-12">
                            <div className="relative pl-8 border-l-2 border-pink-200">
                                <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-pink-500 border-4 border-[#FDF8F5]"></div>
                                <span className="text-pink-500 font-bold text-sm bg-pink-100 px-3 py-1 rounded-full mb-3 inline-block">2022 — Present</span>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">Senior Product Designer</h3>
                                <p className="text-slate-600 font-medium">Stripe</p>
                                <p className="mt-4 text-slate-600 leading-relaxed text-sm">Leading design systems and core workflow experiences for enterprise clients, increasing adoption by 45%.</p>
                            </div>
                            <div className="relative pl-8 border-l-2 border-orange-200">
                                <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-orange-500 border-4 border-[#FDF8F5]"></div>
                                <span className="text-orange-500 font-bold text-sm bg-orange-100 px-3 py-1 rounded-full mb-3 inline-block">2019 — 2022</span>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">Frontend Engineer & UI/UX</h3>
                                <p className="text-slate-600 font-medium">Spotify</p>
                                <p className="mt-4 text-slate-600 leading-relaxed text-sm">Bridged the gap between design and engineering, building complex interactive components for the web player.</p>
                            </div>
                            <div className="relative pl-8 border-l-2 border-violet-200">
                                <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-violet-500 border-4 border-[#FDF8F5]"></div>
                                <span className="text-violet-500 font-bold text-sm bg-violet-100 px-3 py-1 rounded-full mb-3 inline-block">2017 — 2019</span>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">Digital Designer</h3>
                                <p className="text-slate-600 font-medium">Creative Agency Co.</p>
                                <p className="mt-4 text-slate-600 leading-relaxed text-sm">Crafted award-winning campaigns and marketing sites for global brands like Nike, Apple, and Google.</p>
                            </div>
                        </div>
                    </div>

                    {/* Tools */}
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-12">Toolkit</h2>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">I love exploring new tools and technologies. Here is my current stack for bringing ideas to life.</p>

                        <div className="flex flex-wrap gap-4">
                            {[
                                { icon: Figma, name: 'Figma', color: 'bg-rose-100 text-rose-600' },
                                { icon: Layers, name: 'React / Next.js', color: 'bg-cyan-100 text-cyan-600' },
                                { icon: Code, name: 'TypeScript', color: 'bg-blue-100 text-blue-600' },
                                { icon: Framer, name: 'Framer Motion', color: 'bg-fuchsia-100 text-fuchsia-600' },
                                { icon: PenTool, name: 'Tailwind CSS', color: 'bg-teal-100 text-teal-600' }
                            ].map((tool, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.color}`}>
                                        <tool.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-slate-800">{tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA / Contact */}
            <section className="py-32 px-8 relative z-10 text-center">
                <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-3xl rounded-[3rem] p-12 md:p-20 border border-white shadow-2xl shadow-pink-500/10">
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">Let&apos;s create <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">magic together.</span></h2>
                    <p className="text-xl text-slate-600 mb-12 font-medium">Currently available for freelance projects. Available for full-time opportunities starting Jan 2025.</p>
                    <a href="mailto:hello@anya.studio" className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-5 rounded-full text-lg font-bold transition-transform hover:scale-105 shadow-xl shadow-slate-900/20">
                        <Mail className="w-6 h-6" /> hello@anya.studio
                    </a>

                    <div className="mt-16 flex items-center justify-center gap-6">
                        <a href="#" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-pink-500 hover:shadow-lg transition-all border border-slate-100"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-pink-500 hover:shadow-lg transition-all border border-slate-100"><Github className="w-5 h-5" /></a>
                        <a href="#" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-pink-500 hover:shadow-lg transition-all border border-slate-100"><Instagram className="w-5 h-5" /></a>
                    </div>
                </div>
                <div className="mt-24 text-slate-500 text-sm font-medium">
                    &copy; 2024 Anya Studio. Designed with ♥
                </div>
            </section>
        </div>
    )
}
