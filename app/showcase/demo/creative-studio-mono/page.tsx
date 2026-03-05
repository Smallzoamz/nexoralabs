import { ArrowRight, MoveUpRight, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import MobileNav from '../MobileNav'

export default function StudioMonoDemo() {
    return (
        <div className="min-h-screen bg-[#E5E5E5] text-black font-sans selection:bg-black selection:text-white uppercase">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 h-24 bg-white border-b border-slate-100 z-50 px-6 md:px-12 flex items-center justify-between">
                <div className="font-bold text-2xl tracking-tighter text-white pointer-events-auto">
                    STUDIO—ZERO
                </div>
                <nav className="hidden md:flex items-center gap-12 font-medium text-white text-sm tracking-widest pointer-events-auto">
                    <Link href="#" className="hover:underline underline-offset-4 decoration-2">Index</Link>
                    <Link href="#" className="hover:underline underline-offset-4 decoration-2">Journal</Link>
                    <Link href="#" className="hover:underline underline-offset-4 decoration-2">Information</Link>
                </nav>
                <div className="hidden md:block font-medium text-white text-sm tracking-widest pointer-events-auto">
                    (EST. 2012)
                </div>
                <div className="pointer-events-auto">
                    <MobileNav
                        items={[
                            { label: 'Index', href: '#' },
                            { label: 'Journal', href: '#' },
                            { label: 'Information', href: '#' },
                        ]}
                        buttonClass="text-white bg-white/10 hover:bg-white/20"
                        panelBg="bg-black"
                        linkClass="text-[#E5E5E5] hover:text-white"
                        closeClass="text-white"
                    />
                </div>
            </header>

            {/* Typographic Hero */}
            <section className="min-h-screen pt-32 pb-16 px-6 md:px-12 flex flex-col justify-between border-b border-black">
                <div className="max-w-[1400px] mx-auto w-full">
                    <div className="flex justify-between items-end mb-12 lg:mb-24 mt-12 md:mt-0">
                        <div className="text-xs md:text-sm font-medium tracking-widest max-w-xs leading-relaxed">
                            A multidisciplinary design practice operating at the intersection of culture, art, and commerce.
                        </div>
                        <div className="text-xs md:text-sm font-medium tracking-widest text-right">
                            Based in <br />Berlin & Tokyo
                        </div>
                    </div>

                    <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter break-words hyphens-none">
                        SHAPING <br />
                        <span className="flex items-center gap-4 md:gap-10">
                            <span className="block w-24 h-2 md:w-64 md:h-5 bg-black mt-2 md:mt-5"></span>
                            BEHAVIOR
                        </span>
                        THROUGH <br />
                        DESIGN.
                    </h1>
                </div>

                <div className="mt-16 max-w-[1400px] mx-auto w-full flex justify-between items-center text-xs md:text-sm font-medium tracking-widest border-t border-black pt-4">
                    <span>Scroll to explore</span>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 rotate-90" />
                </div>
            </section>

            {/* Editorials / Selected Work */}
            <section className="py-24 border-b border-black">
                <div className="px-6 md:px-12 mb-16 flex justify-between items-end">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter">INDEX[<span className="text-xl md:text-3xl align-top">04</span>]</h2>
                    <button className="text-xs md:text-sm font-bold tracking-widest pb-1 border-b-2 border-black hover:bg-black hover:text-[#E5E5E5] transition-colors uppercase">
                        View Complete Archive
                    </button>
                </div>

                <div className="grid grid-cols-1 border-t border-black">
                    {[
                        { title: 'The Brutalist Web', client: 'Architecture Mag', year: '2024', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop' },
                        { title: 'Kinetic Typography', client: 'Type Foundry', year: '2023', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop' },
                        { title: 'Silent Objects', client: 'Industrial Design', year: '2023', img: 'https://images.unsplash.com/photo-1534066224250-137b7dd10e14?q=80&w=1887&auto=format&fit=crop' },
                        { title: 'Spatial Experience', client: 'Gallery XYZ', year: '2022', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' },
                    ].map((work, i) => (
                        <div key={i} className="group relative border-b border-black md:grid md:grid-cols-12 md:items-center py-8 md:py-0 px-6 md:px-0 hover:bg-black hover:text-[#E5E5E5] transition-colors duration-300">
                            {/* Hover Image Reveal */}
                            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-40 hidden lg:block overflow-hidden scale-95 group-hover:scale-100">
                                <Image src={work.img} alt={work.title} fill className="object-cover grayscale" />
                            </div>

                            <div className="md:col-span-1 md:py-12 md:px-6 text-sm font-bold tracking-widest hidden md:block border-r border-black group-hover:border-[#E5E5E5]/20">0{i + 1}</div>
                            <div className="md:col-span-5 md:py-12 md:px-12 text-3xl md:text-5xl font-black tracking-tighter mb-4 md:mb-0 truncate border-r border-black group-hover:border-[#E5E5E5]/20">
                                {work.title}
                            </div>
                            <div className="md:col-span-3 md:py-12 md:px-6 text-sm font-bold tracking-widest mb-4 md:mb-0 border-r border-black group-hover:border-[#E5E5E5]/20 flex items-center justify-between">
                                <span>Client:</span> <span>{work.client}</span>
                            </div>
                            <div className="md:col-span-2 md:py-12 md:px-6 text-sm font-bold tracking-widest border-r border-black group-hover:border-[#E5E5E5]/20 flex items-center justify-between">
                                <span>Year:</span> <span>{work.year}</span>
                            </div>
                            <div className="md:col-span-1 md:py-12 md:px-6 flex justify-end">
                                <span className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-[#E5E5E5] group-hover:text-black transition-colors">
                                    <MoveUpRight className="w-5 h-5" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Two-Column: Services & Awards */}
            <section className="flex flex-col md:flex-row border-b border-black">
                {/* Services */}
                <div className="flex-1 border-b md:border-b-0 md:border-r border-black p-6 md:p-12 lg:p-24">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-16 flex items-center gap-4">
                        <Plus className="w-8 h-8" /> CAPABILITIES
                    </h2>
                    <ul className="space-y-6 text-lg md:text-2xl font-bold tracking-tight">
                        <li className="flex justify-between items-end border-b border-black/20 pb-4">
                            <span>Art Direction</span> <span className="text-sm font-medium tracking-widest">01</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-black/20 pb-4">
                            <span>Digital Experience</span> <span className="text-sm font-medium tracking-widest">02</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-black/20 pb-4">
                            <span>Brand Identity</span> <span className="text-sm font-medium tracking-widest">03</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-black/20 pb-4">
                            <span>Print & Packaging</span> <span className="text-sm font-medium tracking-widest">04</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-black/20 pb-4">
                            <span>Spatial Design</span> <span className="text-sm font-medium tracking-widest">05</span>
                        </li>
                    </ul>
                </div>

                {/* Awards */}
                <div className="flex-1 p-6 md:p-12 lg:p-24 bg-black text-[#E5E5E5]">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-16 flex items-center gap-4">
                        <Plus className="w-8 h-8" /> RECOGNITION
                    </h2>
                    <ul className="space-y-6 text-base md:text-xl font-bold tracking-tight">
                        <li className="flex justify-between items-end border-b border-[#E5E5E5]/20 pb-4">
                            <span>Type Directors Club</span> <span className="text-sm font-medium tracking-widest">2024</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-[#E5E5E5]/20 pb-4">
                            <span>D&AD Graphite Pencil</span> <span className="text-sm font-medium tracking-widest">2023</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-[#E5E5E5]/20 pb-4">
                            <span>Awwwards Site of the Month</span> <span className="text-sm font-medium tracking-widest">2023</span>
                        </li>
                        <li className="flex justify-between items-end border-b border-[#E5E5E5]/20 pb-4">
                            <span>European Design Awards</span> <span className="text-sm font-medium tracking-widest">2022</span>
                        </li>
                    </ul>
                    <div className="mt-16 text-xs md:text-sm font-medium tracking-widest leading-relaxed max-w-sm">
                        While we appreciate industry recognition, our primary gauge of success remains the measurable impact and longevity of our work for clients.
                    </div>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="p-6 md:p-12 lg:p-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-0 border-b border-black pb-12 mb-12">
                    <h2 className="text-5xl md:text-8xl lg:text-[10vw] font-black leading-[0.85] tracking-tighter w-full max-w-4xl">
                        LET&apos;S <br />
                        COLLABORATE.
                    </h2>
                    <button className="bg-black text-[#E5E5E5] px-8 py-6 text-xs md:text-sm font-bold tracking-widest hover:bg-transparent hover:text-black border-2 border-transparent hover:border-black transition-colors shrink-0">
                        START A PROJECT
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs md:text-sm font-bold tracking-widest">
                    <div className="flex flex-col gap-4">
                        <span className="text-black/50 mb-2">Socials</span>
                        <Link href="#" className="hover:underline underline-offset-4 decoration-2">Instagram</Link>
                        <Link href="#" className="hover:underline underline-offset-4 decoration-2">Twitter / X</Link>
                        <Link href="#" className="hover:underline underline-offset-4 decoration-2">LinkedIn</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-black/50 mb-2">Studios</span>
                        <p>Mitte, Berlin<br />10115 DE</p>
                        <p className="mt-2">Shibuya, Tokyo<br />150-0002 JP</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-black/50 mb-2">Inquiries</span>
                        <a href="mailto:hello@studio-zero.com" className="hover:underline underline-offset-4 decoration-2 break-all">hello@studio-zero.com</a>
                        <a href="tel:+49123456789" className="hover:underline underline-offset-4 decoration-2">+49 123 456 789</a>
                    </div>
                    <div className="flex flex-col gap-4 md:items-end md:text-right">
                        <span className="text-black/50 mb-2">Legal</span>
                        <p>&copy; {new Date().getFullYear()} STUDIO—ZERO</p>
                        <Link href="#" className="hover:underline underline-offset-4 decoration-2">Imprint</Link>
                        <Link href="#" className="hover:underline underline-offset-4 decoration-2">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
