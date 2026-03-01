import { Box, BrainCircuit, LineChart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function DarkTechDemo() {
    return (
        <div className="min-h-screen bg-[#050B14] font-sans text-slate-200 flex flex-col pt-24 relative overflow-hidden">
            {/* Global Animated Glows */}
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute top-1/2 left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

            {/* Header */}
            <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-16 bg-[#0B1526]/40 backdrop-blur-xl border border-white/5 rounded-2xl z-50 flex items-center px-6 justify-between shadow-[0_0_30px_rgba(0,255,255,0.05)]">
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
                <button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] border border-white/10">
                    Get Started
                </button>
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

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#050B14] text-slate-400 py-8 px-6 mt-auto relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium tracking-wider">
                    <p>© 2024 SYNAPSE AI</p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
