import { ArrowUpRight, BarChart, Briefcase, ChevronRight, Globe, Layers, Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import MobileNav from '../MobileNav'

export default function ConsultingDarkDemo() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 h-20 bg-[#0a0a0a] border-b border-white/5 z-50 px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold tracking-tight text-xl">Nexus Advisory</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#" className="hover:text-white transition-colors">Expertise</Link>
                    <Link href="#" className="hover:text-white transition-colors">Insights</Link>
                    <Link href="#" className="hover:text-white transition-colors">About Firm</Link>
                    <Link href="#" className="hover:text-white transition-colors">Careers</Link>
                </nav>
                <button className="hidden md:inline-block bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded text-sm font-semibold transition-colors border border-white/10">
                    Client Portal
                </button>
                <MobileNav
                    items={[
                        { label: 'Expertise', href: '#' },
                        { label: 'Insights', href: '#' },
                        { label: 'About Firm', href: '#' },
                        { label: 'Careers', href: '#' },
                    ]}
                    buttonClass="text-white bg-white/10 hover:bg-white/20"
                    panelBg="bg-[#0a0a0a]"
                    linkClass="text-slate-300 hover:text-indigo-400"
                    closeClass="text-white"
                />
            </header>

            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full point-events-none mix-blend-screen" />
                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-6">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Global Strategy Consulting
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                            Architecting <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                Market Leadership.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-lg leading-relaxed">
                            We guide visionary leaders through complex transformations, unlocking exponential value in an era of unprecedented disruption.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-white text-black hover:bg-slate-200 px-8 py-4 rounded font-bold transition-colors flex items-center justify-center gap-2">
                                Discuss Your Vision <ArrowUpRight className="w-5 h-5" />
                            </button>
                            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded font-bold transition-colors">
                                View Case Studies
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid (Dark Glassmorphism) */}
            <section className="py-24 relative border-y border-white/5 bg-[#0d0d0d]">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Core Competencies</h2>
                            <p className="text-slate-400 text-lg">Deep industry expertise combined with rigorous analytical methodologies to solve your most critical challenges.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Globe, title: 'Corporate Strategy', desc: 'Redefining business models and identifying new vectors for sustainable growth in global markets.' },
                            { icon: BarChart, title: 'Mergers & Acquisitions', desc: 'End-to-end advisory from target identification to post-merger integration and synergy realization.' },
                            { icon: Briefcase, title: 'Operations Excellence', desc: 'Optimizing supply chains, organizational structures, and business processes for maximum efficiency.' }
                        ].map((srv, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300">
                                <srv.icon className="w-10 h-10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                <h3 className="text-xl font-bold text-white mb-3">{srv.title}</h3>
                                <p className="text-slate-400 leading-relaxed mb-8">{srv.desc}</p>
                                <Link href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                    Explore Capability <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Studies / Portfolio Highlights */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 tracking-tight text-center">Impact Delivered</h2>

                    <div className="space-y-8">
                        {/* Case 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-2xl border border-white/10 group bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                            <div className="md:col-span-7 relative h-64 md:h-auto">
                                <Image
                                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                                    alt="Corporate"
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                            </div>
                            <div className="md:col-span-5 p-10 md:p-12 flex flex-col justify-center">
                                <span className="text-indigo-400 text-sm font-bold tracking-wider uppercase mb-3 text-left">Financial Services</span>
                                <h3 className="text-2xl font-bold text-white mb-4 leading-snug">Digital Transformation for a Tier-1 Global Bank</h3>
                                <p className="text-slate-400 mb-8 line-clamp-3">Modernized legacy systems and implemented agile methodologies, resulting in a 40% reduction in operational costs and 3x faster time-to-market for new financial products.</p>
                                <Link href="#" className="inline-flex items-center gap-2 text-white font-semibold hover:text-indigo-400 transition-colors">
                                    Read Full Case <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Case 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-2xl border border-white/10 group bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                            <div className="md:col-span-5 p-10 md:p-12 flex flex-col justify-center order-2 md:order-1">
                                <span className="text-purple-400 text-sm font-bold tracking-wider uppercase mb-3 text-left">Healthcare</span>
                                <h3 className="text-2xl font-bold text-white mb-4 leading-snug">Post-Merger Integration of Top Pharma Giants</h3>
                                <p className="text-slate-400 mb-8 line-clamp-3">Facilitated the smooth integration of two major pharmaceutical companies, achieving projected synergies of $2B ahead of schedule while maintaining critical R&D momentum.</p>
                                <Link href="#" className="inline-flex items-center gap-2 text-white font-semibold hover:text-purple-400 transition-colors">
                                    Read Full Case <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="md:col-span-7 relative h-64 md:h-auto order-1 md:order-2">
                                <Image
                                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                                    alt="Healthcare"
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Members */}
            <section className="py-24 bg-[#0d0d0d] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Our Leadership</h2>
                    <p className="text-slate-400 text-lg mb-16 max-w-2xl mx-auto">Industry veterans bringing decades of actionable insights.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: 'Dr. Evelyn Grant', role: 'Managing Partner', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
                            { name: 'Marcus Sterling', role: 'Senior Partner, Strategy', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' },
                            { name: 'Sophia Lin', role: 'Partner, M&A', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop' },
                            { name: 'James O\'Connor', role: 'Partner, Operations', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop' },
                        ].map((member, i) => (
                            <div key={i} className="group">
                                <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-white/5">
                                    <Image src={member.img} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <h4 className="text-lg font-bold text-white">{member.name}</h4>
                                <p className="text-sm text-indigo-400">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact & Location */}
            <section className="py-24 border-t border-white/10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to reshape<br />your industry?</h2>
                        <p className="text-slate-400 text-lg mb-10">Reach out to our global advisory team.</p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                    <MapPin className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-white">Global Headquarters</h5>
                                    <p className="text-slate-400 text-sm">One World Trade Center, Suite 4500, New York, NY 10007</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                    <Phone className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-white">Direct Line</h5>
                                    <p className="text-slate-400 text-sm">+1 (212) 555-0199</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                    <Mail className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-white">Email Inquiries</h5>
                                    <p className="text-slate-400 text-sm">advisory@nexusconsulting.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">First Name</label>
                                    <input type="text" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Last Name</label>
                                    <input type="text" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Corporate Email</label>
                                <input type="email" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="john@company.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Message</label>
                                <textarea rows={4} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="How can we help you?"></textarea>
                            </div>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition-colors">
                                Submit Inquiry
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/10 px-8 text-center text-sm text-slate-500">
                <p>&copy; 2024 Nexus Advisory Partners. All Rights Reserved.</p>
            </footer>
        </div>
    )
}
