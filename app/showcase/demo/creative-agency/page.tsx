'use client'

import { ArrowUpRight, Box, Hexagon, Play, Sparkles, Star, Triangle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import MobileNav from '../MobileNav'

export default function PlayfulAgencyDemo() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-fuchsia-300">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 h-20 bg-[#0a0a0a] z-50 px-6 md:px-10 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 font-bold text-white flex items-center justify-center text-xl">W</div>
                    <span className="font-bold tracking-tight text-xl">Wonder.</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 font-semibold text-slate-700 text-sm">
                    <Link href="#" className="hover:text-fuchsia-500 transition-colors bg-slate-100 px-4 py-1.5 rounded-full">Home</Link>
                    <Link href="#" className="hover:text-fuchsia-500 transition-colors">Work</Link>
                    <Link href="#" className="hover:text-fuchsia-500 transition-colors">Services</Link>
                    <Link href="#" className="hover:text-fuchsia-500 transition-colors">Studio</Link>
                </nav>
                <button className="hidden md:inline-block bg-slate-900 hover:bg-fuchsia-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors">
                    Say Hello 👋
                </button>
                <MobileNav
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'Work', href: '#' },
                        { label: 'Services', href: '#' },
                        { label: 'Studio', href: '#' },
                    ]}
                    linkClass="text-slate-800 hover:text-fuchsia-500"
                />
            </header>

            {/* Bento Grid Hero */}
            <section className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[600px]">

                    {/* Main Title Box (2x2) */}
                    <div className="md:col-span-2 md:row-span-2 bg-[#F3F0FF] rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Sparkles className="w-5 h-5 text-violet-500" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-4 relative z-10">
                            We build <br />brands that <span className="text-violet-600">pop.</span>
                        </h1>
                        <p className="text-slate-600 font-medium text-lg relative z-10">A creative digital agency making the internet a little more fun.</p>

                        {/* Decorative floating shapes */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-200 rounded-full blur-2xl group-hover:bg-violet-300 transition-colors" />
                    </div>

                    {/* Image / Video Box (1x2) */}
                    <div className="md:col-span-1 md:row-span-2 rounded-3xl overflow-hidden relative group">
                        <Image src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1770&auto=format&fit=crop" alt="Work Setup" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-16 h-16 bg-white/20 backdrop-blur border border-white/50 rounded-full flex items-center justify-center pl-1">
                                <Play className="w-6 h-6 text-white" fill="white" />
                            </button>
                        </div>
                    </div>

                    {/* Stat / Award Box (1x1) */}
                    <div className="md:col-span-1 md:row-span-1 bg-[#FFF0F5] rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                        <Star className="w-10 h-10 text-pink-500 mb-2 group-hover:rotate-180 transition-transform duration-700" fill="currentColor" />
                        <h3 className="text-3xl font-black text-slate-900 mb-1">Awwwards</h3>
                        <p className="text-pink-600 font-bold text-sm">Site of the Day</p>
                    </div>

                    {/* Stat Box (1x1) */}
                    <div className="md:col-span-1 md:row-span-1 bg-[#E0F7FA] rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <h3 className="text-5xl font-black text-cyan-700 mb-1">45+</h3>
                        <p className="text-cyan-800 font-bold text-sm">Happy Clients</p>
                    </div>

                    {/* Scrolling Marquee Box (2x1) */}
                    <div className="md:col-span-2 md:row-span-1 bg-[#FFFDE7] rounded-3xl overflow-hidden flex items-center relative">
                        <div className="absolute left-6 z-10 font-bold text-yellow-800 bg-[#FFFDE7] pr-4 py-2">Our Friends:</div>
                        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] items-center gap-12 pl-36">
                            <span className="text-2xl font-black text-slate-300">Spotify</span>
                            <span className="text-2xl font-black text-slate-300">Nike</span>
                            <span className="text-2xl font-black text-slate-300">Vercel</span>
                            <span className="text-2xl font-black text-slate-300">Airbnb</span>
                            <span className="text-2xl font-black text-slate-300">Figma</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">What we do best.</h2>
                        <p className="text-slate-500 text-lg font-medium max-w-md">From brand identity to digital experiences, we bring your vision to life with a pop of color.</p>
                    </div>
                    <button className="bg-white border-2 border-slate-200 hover:border-slate-900 px-6 py-3 rounded-full font-bold transition-all text-sm shrink-0">
                        View All Services
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Srv 1 */}
                    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-10 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-200 transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-transform">
                            <Hexagon className="w-8 h-8" fill="currentColor" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Branding</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">Logos, visual identity, and brand guidelines that make you stand out in a crowded market.</p>
                        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-violet-600 group-hover:border-violet-600 group-hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                    {/* Srv 2 */}
                    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-10 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-200 transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-8 -rotate-3 group-hover:-rotate-12 transition-transform">
                            <Box className="w-8 h-8" fill="currentColor" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">UX/UI Design</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">Intuitive interfaces and delightful user experiences for web and mobile applications.</p>
                        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-pink-500 group-hover:border-pink-500 group-hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                    {/* Srv 3 */}
                    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-10 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-200 transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-8 rotate-6 group-hover:rotate-12 transition-transform">
                            <Triangle className="w-8 h-8" fill="currentColor" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Development</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">Performant, scalable, and responsive creative coding using the latest tech stack.</p>
                        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-cyan-600 group-hover:border-cyan-600 group-hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Process / Steps */}
            <section className="py-24 px-4 md:px-8 bg-slate-900 text-white rounded-[3rem] mx-4 md:mx-8 my-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-600/20 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/20 blur-[100px] rounded-full" />

                <div className="max-w-5xl mx-auto relative z-10 text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">How we make magic.</h2>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">Our 3-step process is designed to be collaborative, transparent, and most importantly, fun.</p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <div className="text-center p-6">
                        <div className="w-20 h-20 mx-auto bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-700 font-black text-3xl text-fuchsia-400 rotate-[-5deg]">1</div>
                        <h3 className="text-xl font-bold mb-3">Discovery</h3>
                        <p className="text-slate-400 font-medium">We dive deep into your brand, understanding your goals, audience, and wild ideas.</p>
                    </div>
                    <div className="text-center p-6 mt-0 md:mt-12">
                        <div className="w-20 h-20 mx-auto bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-700 font-black text-3xl text-violet-400 rotate-[5deg]">2</div>
                        <h3 className="text-xl font-bold mb-3">Creation</h3>
                        <p className="text-slate-400 font-medium">This is where the fun happens. We design, prototype, and iterate until it&apos;s perfect.</p>
                    </div>
                    <div className="text-center p-6 mt-0 md:mt-24">
                        <div className="w-20 h-20 mx-auto bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-700 font-black text-3xl text-cyan-400 rotate-[-5deg]">3</div>
                        <h3 className="text-xl font-bold mb-3">Launch</h3>
                        <p className="text-slate-400 font-medium">We hit the big green button, celebrate, and watch your new digital baby thrive.</p>
                    </div>
                </div>
            </section>

            {/* CTA / Footer */}
            <section className="py-32 px-4 text-center">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-fuchsia-100 to-violet-100 rounded-[3rem] p-12 md:p-24 shadow-xl shadow-violet-200/50">
                    <div className="flex justify-center mb-8">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-16 h-16 rounded-full border-4 border-fuchsia-100 overflow-hidden relative">
                                    <Image src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop&crop=faces&auto=compress`} alt="Team" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">Let&apos;s talk about <br />your next project.</h2>
                    <button className="bg-slate-900 hover:bg-fuchsia-600 text-white px-10 py-5 rounded-full text-lg font-black transition-all hover:scale-105 shadow-xl shadow-slate-900/20">
                        Start a Conversation 🚀
                    </button>
                </div>
            </section>

            <footer className="py-8 text-center text-slate-500 font-medium text-sm border-t border-slate-200">
                <p>&copy; 2024 Wonder Agency. Making the web weird since 2020.</p>
            </footer>

            {/* Marquee Animation Definition */}
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    )
}
