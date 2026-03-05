import { Box, BrainCircuit, LineChart, Check, Star, Twitter, Github, Linkedin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import MobileNav from '../MobileNav'

export default function DarkTechDemo() {
    return (
        <div className="min-h-screen bg-[#050B14] font-sans text-slate-200 flex flex-col pt-24 relative overflow-hidden">
            {/* Global Animated Glows */}
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute top-1/2 left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

            {/* Header */}
            <header className="fixed top-0 inset-x-0 h-16 bg-slate-950 border-b border-slate-800 z-50 flex items-center px-6 md:px-12 justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all">
                        <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-wider text-white">SYNAPSE AI</span>
                </div>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link href="#" className="hover:text-cyan-400 transition-colors">Solutions</Link>
                    <Link href="#" className="hover:text-cyan-400 transition-colors">Platform</Link>
                    <Link href="#" className="hover:text-cyan-400 transition-colors">Company</Link>
                    <Link href="#" className="hover:text-cyan-400 transition-colors">Careers</Link>
                </nav>

                {/* CTA */}
                <button className="hidden md:inline-block bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] border border-white/10">
                    Get Started
                </button>
                <MobileNav
                    items={[
                        { label: 'Solutions', href: '#' },
                        { label: 'Platform', href: '#' },
                        { label: 'Company', href: '#' },
                        { label: 'Careers', href: '#' },
                    ]}
                    buttonClass="text-white bg-white/10 hover:bg-white/20"
                    panelBg="bg-[#0B1526]"
                    linkClass="text-slate-300 hover:text-cyan-400"
                    closeClass="text-white"
                />
            </header>

            {/* Hero Section */}
            <section className="relative h-[700px] flex flex-col justify-center items-center text-center mt-10">
                {/* Background Neural Network (Simulated with abstract spheres/lines) */}
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
                    <Image
                        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop"
                        alt="Neural Network Abstract"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/80 to-[#050B14]"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 w-full flex flex-col items-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 leading-tight mb-6 tracking-tight drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                        UNLEASHING THE FUTURE<br />OF INTELLIGENCE
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light max-w-3xl">
                        Synapse AI provides cutting-edge neural platforms for enterprise-grade<br />
                        autonomous solutions and predictive analytics.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button className="bg-purple-600/20 text-purple-300 border border-purple-500/50 hover:bg-purple-600/40 px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-sm text-sm uppercase tracking-wider">
                            EXPLORE PLATFORM
                        </button>
                        <button className="bg-cyan-900/40 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-800/60 px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_30px_rgba(8,145,178,0.4)] backdrop-blur-sm text-sm uppercase tracking-wider">
                            VIEW USE CASES
                        </button>
                    </div>
                </div>
            </section>

            {/* Core Technologies Section */}
            <section className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-widest uppercase">
                            OUR CORE TECHNOLOGIES
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group relative bg-[#0B1526]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-[#0F1C33]/80 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col h-full">
                                {/* Icon Container with Glow */}
                                <div className="w-14 h-14 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex flex-col items-center justify-center text-cyan-400 mb-8 shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
                                    <BrainCircuit className="w-7 h-7" />
                                </div>

                                {/* 3D Visual Mock (Using gradient shapes for abstract feel) */}
                                <div className="w-full h-32 mb-8 relative flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full border border-cyan-500/40 absolute animate-[spin_10s_linear_infinite]" />
                                    <div className="w-16 h-16 rounded-full border border-purple-500/40 absolute animate-[spin_8s_linear_infinite_reverse]" />
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full blur-[2px] shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Adaptive Neural<br />Networks</h3>
                                <p className="text-slate-400 leading-relaxed text-sm flex-1">
                                    Dynamic node network is dynamic web-nevar damaged and newed networks.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-[#0B1526]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-[#0F1C33]/80 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex flex-col items-center justify-center text-cyan-400 mb-8 shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
                                    <LineChart className="w-7 h-7" />
                                </div>

                                {/* 3D Visual Mock */}
                                <div className="w-full h-32 mb-8 relative flex items-end justify-center gap-2">
                                    <div className="w-4 h-12 bg-gradient-to-t from-cyan-600/50 to-cyan-400 rounded-t-sm shadow-[0_0_10px_rgba(34,211,238,0.4)]" />
                                    <div className="w-4 h-20 bg-gradient-to-t from-cyan-600/50 to-purple-400 rounded-t-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                                    <div className="w-4 h-16 bg-gradient-to-t from-purple-600/50 to-pink-400 rounded-t-sm shadow-[0_0_10px_rgba(236,72,153,0.4)]" />
                                    <div className="w-4 h-24 bg-gradient-to-t from-blue-600/50 to-cyan-300 rounded-t-sm shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Predictive Analytics<br />Engine</h3>
                                <p className="text-slate-400 leading-relaxed text-sm flex-1">
                                    3D data visualizer in and visualizer to dats solution and predictive analytics.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-[#0B1526]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-[#0F1C33]/80 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex flex-col items-center justify-center text-cyan-400 mb-8 shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
                                    <Box className="w-7 h-7" />
                                </div>

                                {/* 3D Visual Mock */}
                                <div className="w-full h-32 mb-8 relative flex items-center justify-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/80 to-blue-600/80 backdrop-blur-md border border-white/20 transform rotate-45 shadow-[0_0_25px_rgba(34,211,238,0.5)] flex items-center justify-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-white/40 to-transparent border border-white/30 transform rotate-180" />
                                    </div>
                                    {/* Floating mini cubes */}
                                    <div className="absolute top-4 right-1/4 w-4 h-4 bg-purple-400 transform rotate-45 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                                    <div className="absolute bottom-4 left-1/4 w-6 h-6 bg-cyan-300 transform rotate-[30deg] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Automated Model<br />Deployment</h3>
                                <p className="text-slate-400 leading-relaxed text-sm flex-1">
                                    Floating cube workflow and automated model comote model and envronienment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 relative z-10 bg-[#0B1526]/30 border-y border-white/5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-widest uppercase mb-4">
                            SCALE YOUR INTELLIGENCE
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Flexible compute plans for teams of all sizes. Pay only for the neural processing you use.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Starter */}
                        <div className="bg-[#050B14]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col hover:border-cyan-500/30 transition-colors duration-300">
                            <h3 className="text-xl font-bold text-white mb-2">Developer</h3>
                            <p className="text-sm text-slate-400 mb-6">For individuals and small experiments.</p>
                            <div className="text-4xl font-extrabold text-white mb-6">$49<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    '100K Neural Inferences/mo',
                                    '2 Active Models',
                                    'Community Support',
                                    'Standard Latency (400ms)'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                        <Check className="w-5 h-5 text-cyan-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold transition-colors">
                                Start Free Trial
                            </button>
                        </div>

                        {/* Pro (Highlighted) */}
                        <div className="relative bg-gradient-to-b from-[#0F1C33] to-[#050B14] backdrop-blur-xl border border-cyan-500/50 rounded-3xl p-8 flex flex-col shadow-[0_0_40px_rgba(34,211,238,0.15)] md:-transform-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">Enterprise Pro</h3>
                            <p className="text-sm text-slate-400 mb-6">For production workloads and scaling teams.</p>
                            <div className="text-5xl font-extrabold text-white mb-6">$299<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    '5M Neural Inferences/mo',
                                    'Unlimited Active Models',
                                    '24/7 Priority Support',
                                    'Ultra-low Latency (50ms)',
                                    'Custom Model Fine-tuning'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-white">
                                        <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-cyan-400/50">
                                Scale Now
                            </button>
                        </div>

                        {/* Scale */}
                        <div className="bg-[#050B14]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col hover:border-purple-500/30 transition-colors duration-300">
                            <h3 className="text-xl font-bold text-white mb-2">Custom Scale</h3>
                            <p className="text-sm text-slate-400 mb-6">For massive deployments and unique needs.</p>
                            <div className="text-4xl font-extrabold text-white mb-6">Custom</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    'Unlimited Inferences',
                                    'Dedicated GPU Clusters',
                                    'VPC Peering & SSO',
                                    'Dedicated Solutions Architect'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                        <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold transition-colors flex items-center justify-center gap-2">
                                Contact Sales <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                                TRUSTED BY<br />PIONEERS
                            </h2>
                            <p className="text-slate-400 text-lg mb-8">
                                See how leading tech companies are using Synapse AI to redefine what&apos;s possible in their industries.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-[#050B14] overflow-hidden relative">
                                            <Image
                                                src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop&crop=faces&auto=compress`}
                                                alt="User"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="flex text-cyan-400 text-xs">
                                        <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                                    </div>
                                    <span className="text-sm text-slate-300 font-medium">4.9/5 from 2,000+ engineers</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 border-l-cyan-500 border-l-4 rounded-xl p-8 backdrop-blur-sm">
                                <p className="text-lg text-slate-200 mb-6 font-light italic">
                                    &quot;Integrating Synapse&apos;s predictive engine reduced our data processing pipeline latency by 80%. It&apos;s practically magic.&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                                    <div>
                                        <div className="text-white font-bold">Sarah Jenkins</div>
                                        <div className="text-cyan-400 text-sm">CTO, DataFlow Inc.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 border-l-purple-500 border-l-4 rounded-xl p-8 backdrop-blur-sm ml-0 md:ml-12">
                                <p className="text-lg text-slate-200 mb-6 font-light italic">
                                    &quot;The automated model deployment saved our ML team hundreds of hours. We push to prod 10x faster now.&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                                    <div>
                                        <div className="text-white font-bold">Marcus Thorne</div>
                                        <div className="text-purple-400 text-sm">Lead ML Engineer, Nexus</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Futuristic Footer */}
            <footer className="border-t border-white/10 bg-[#0B1526]/80 backdrop-blur-xl text-slate-400 pt-16 pb-8 px-6 mt-auto relative z-10 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                                <BrainCircuit className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-wider text-white">SYNAPSE AI</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 max-w-sm">
                            Building the infrastructure for the next generation of artificial intelligence. Secure, scalable, and blazingly fast.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-slate-500 hover:text-cyan-400 transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="text-slate-500 hover:text-cyan-400 transition-colors"><Github className="w-5 h-5" /></Link>
                            <Link href="#" className="text-slate-500 hover:text-cyan-400 transition-colors"><Linkedin className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Product</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-cyan-400 transition-colors">Neural Engine</Link></li>
                            <li><Link href="#" className="hover:text-cyan-400 transition-colors">Predictive Analytics</Link></li>
                            <li><Link href="#" className="hover:text-cyan-400 transition-colors">Auto-Deploy</Link></li>
                            <li><Link href="#" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-cyan-400 transition-colors">Careers<span className="ml-2 bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30">Hiring</span></Link></li>
                            <li><Link href="#" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium tracking-wider">
                    <p>© 2024 SYNAPSE AI CORPORATION. ALL RIGHTS RESERVED.</p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Security</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
