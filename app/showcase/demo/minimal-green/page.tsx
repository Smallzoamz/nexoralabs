import { ArrowRight, Leaf, Sprout, Wind, Droplet, Sun, Twitter, Instagram, Linkedin, Quote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import MobileNav from '../MobileNav'

export default function MinimalGreenDemo() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-emerald-200">
            {/* Header */}
            <header className="fixed top-6 inset-x-6 h-16 bg-[#fcfdfb] border border-stone-200 z-50 rounded-full px-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <Leaf className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
                    <span className="font-medium tracking-wide text-xl text-emerald-950">ECOVERDE</span>
                </div>
                <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-stone-600">
                    <Link href="#" className="hover:text-emerald-700 transition-colors">Our Mission</Link>
                    <Link href="#" className="hover:text-emerald-700 transition-colors">Initiatives</Link>
                    <Link href="#" className="hover:text-emerald-700 transition-colors">Impact</Link>
                    <Link href="#" className="hover:text-emerald-700 transition-colors">Journal</Link>
                </nav>
                <button className="hidden sm:block bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm shadow-emerald-900/20">
                    Get Involved
                </button>
                <MobileNav
                    items={[
                        { label: 'Our Mission', href: '#' },
                        { label: 'Initiatives', href: '#' },
                        { label: 'Impact', href: '#' },
                        { label: 'Journal', href: '#' },
                    ]}
                    buttonClass="text-emerald-900 bg-emerald-100 hover:bg-emerald-200"
                    linkClass="text-emerald-900 hover:text-emerald-600"
                />
            </header>

            {/* Hero */}
            <section className="pt-40 pb-24 md:pt-56 md:pb-32 px-8 lg:px-16 relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/50 rounded-full blur-[100px] -z-10" />
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-emerald-950 mb-8 leading-[1.05] max-w-5xl">
                    Sustainable design for a <br className="hidden md:block" />
                    <span className="italic text-emerald-700 font-serif">greener tomorrow.</span>
                </h1>
                <p className="text-lg md:text-xl text-stone-600 max-w-2xl mb-12 leading-relaxed">
                    We craft environmentally responsible solutions that harmonize human progress with nature&apos;s delicate balance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-emerald-900 hover:bg-emerald-800 text-white px-8 py-4 rounded-full font-medium transition-colors shadow-lg shadow-emerald-900/20">
                        Explore Our Approach
                    </button>
                </div>

                {/* Hero Image */}
                <div className="w-full max-w-6xl mt-24 relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop"
                        alt="Lush green forest"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </section>

            {/* About / Philosophy */}
            <section className="py-24 px-8 lg:px-16 bg-white border-y border-emerald-900/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
                    <div className="flex-1 space-y-8">
                        <span className="text-emerald-600 font-medium tracking-widest uppercase text-sm">Our Philosophy</span>
                        <h2 className="text-3xl md:text-5xl font-medium text-emerald-950 leading-tight">Rooted in respect for the environment.</h2>
                        <p className="text-stone-600 text-lg leading-relaxed">
                            Since our inception, ECOVERDE has operated on a simple premise: business and ecology are not at odds. By integrating biomimicry and circular economy principles, we develop products and habitats that leave a net-positive impact on our planet.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {[
                                { icon: Sprout, text: 'Zero-waste manufacturing processes.' },
                                { icon: Wind, text: '100% renewable energy operations.' },
                                { icon: Droplet, text: 'Closed-loop water conservation systems.' }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-emerald-900 font-medium">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 relative w-full h-[500px] rounded-[2rem] overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1418065460487-3e41a6c8e15f?q=80&w=2070&auto=format&fit=crop"
                            alt="Sustainable Architecture"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Projects / Sustainability Highlights (Alternating) */}
            <section className="py-32 px-8 lg:px-16 relative">
                <div className="max-w-7xl mx-auto space-y-32">
                    <div className="text-center mb-16">
                        <span className="text-emerald-600 font-medium tracking-widest uppercase text-sm">Impact Areas</span>
                        <h2 className="text-4xl md:text-5xl font-medium text-emerald-950 mt-4">Current Initiatives</h2>
                    </div>

                    {/* Initiative 1 */}
                    <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
                        <div className="flex-1 relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041&auto=format&fit=crop"
                                alt="Forest Restoration"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-emerald-100 text-emerald-700 mb-2">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-medium text-emerald-950">Biodiversity Corridors</h3>
                            <p className="text-stone-600 text-lg leading-relaxed">
                                Our urban planning division focuses on reconnecting fragmented ecosystems through cities, allowing natural flora and fauna to thrive alongside human development.
                            </p>
                            <Link href="#" className="inline-flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-900 transition-colors group pt-4">
                                Read Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Initiative 2 */}
                    <div className="flex flex-col md:flex-row-reverse gap-12 lg:gap-24 items-center">
                        <div className="flex-1 relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1545208942-e2d78703e223?q=80&w=2069&auto=format&fit=crop"
                                alt="Solar Energy"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-amber-100 text-amber-700 mb-2">
                                <Sun className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-medium text-emerald-950">Solar-Integrated Habitats</h3>
                            <p className="text-stone-600 text-lg leading-relaxed">
                                We are pioneering building materials that seamlessly integrate photovoltaics, turning ordinary structures into clean power generators without compromising aesthetics.
                            </p>
                            <Link href="#" className="inline-flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-900 transition-colors group pt-4">
                                Read Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-emerald-950 text-emerald-50 px-8 lg:px-16">
                <div className="max-w-4xl mx-auto text-center">
                    <Quote className="w-16 h-16 text-emerald-800 mx-auto mb-8 opacity-50" />
                    <h2 className="text-3xl md:text-5xl font-serif italic font-light leading-snug mb-12">
                        &quot;ECOVERDE didn&apos;t just redesign our corporate campus; they reimagined our entire relationship with the local ecosystem. The result is a workspace that breathes.&quot;
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden relative border border-emerald-800">
                            <Image
                                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop"
                                alt="Client"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-white">Elena Rostova</p>
                            <p className="text-emerald-400 text-sm">CEO, Nexus Biosciences</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA & Footer */}
            <footer className="pt-24 pb-12 px-8 lg:px-16 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-emerald-50 rounded-[3rem] p-12 md:p-20 text-center mb-24 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-[80px]" />
                        <h2 className="text-4xl md:text-6xl font-medium text-emerald-950 mb-6 relative z-10">Start your green journey.</h2>
                        <p className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">Partner with us to transform your environmental footprint into a legacy of stewardship.</p>
                        <button className="bg-emerald-900 hover:bg-emerald-800 text-white px-8 py-4 rounded-full font-medium transition-colors relative z-10 shadow-lg shadow-emerald-900/20">
                            Schedule a Consultation
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-t border-emerald-900/10 pt-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Leaf className="w-6 h-6 text-emerald-600" />
                                <span className="font-medium tracking-wide text-lg text-emerald-950">ECOVERDE</span>
                            </div>
                            <p className="text-stone-500 text-sm max-w-sm leading-relaxed">
                                Designing for a thriving planet. Certified B Corporation operating globally with offices in Copenhagen, Portland, and Kyoto.
                            </p>
                        </div>
                        <div className="flex gap-12">
                            <div className="space-y-4">
                                <h4 className="text-emerald-950 font-medium">Connect</h4>
                                <div className="flex gap-4">
                                    <Link href="#" className="text-stone-400 hover:text-emerald-600 transition-colors"><Twitter className="w-5 h-5" /></Link>
                                    <Link href="#" className="text-stone-400 hover:text-emerald-600 transition-colors"><Instagram className="w-5 h-5" /></Link>
                                    <Link href="#" className="text-stone-400 hover:text-emerald-600 transition-colors"><Linkedin className="w-5 h-5" /></Link>
                                </div>
                            </div>
                            <div className="space-y-4 text-sm text-stone-500">
                                <p>&copy; 2024 Ecoverde Inc.</p>
                                <div className="flex gap-4">
                                    <Link href="#" className="hover:text-emerald-700 transition-colors">Privacy</Link>
                                    <Link href="#" className="hover:text-emerald-700 transition-colors">Terms</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
