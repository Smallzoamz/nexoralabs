import { Heart, Search, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function LuxuryFashionDemo() {
    return (
        <div className="min-h-screen bg-[#F5F2EB] font-serif text-[#3A352F] flex flex-col pt-16">
            {/* Header / Top Bar */}
            <div className="fixed top-0 left-0 right-0 h-8 bg-[#EBE5D9] z-50 flex items-center justify-center text-[10px] tracking-widest uppercase font-sans text-[#5A554F]">
                Free Shipping On All Orders Over $200
            </div>

            <header className="fixed top-8 left-0 right-0 h-20 bg-[#F5F2EB] z-40 flex items-center px-8 md:px-12 justify-between border-b border-[#EBE5D9]">
                {/* Logo */}
                <div className="text-2xl md:text-3xl font-normal tracking-wide text-[#947B57]">
                    MAISON AURA
                </div>

                {/* Nav */}
                <nav className="hidden lg:flex items-center gap-8 text-[11px] font-sans font-semibold tracking-widest text-[#3A352F] uppercase">
                    <Link href="#" className="hover:text-[#947B57] transition-colors">NEW ARRIVALS</Link>
                    <Link href="#" className="hover:text-[#947B57] transition-colors">CLOTHING</Link>
                    <Link href="#" className="hover:text-[#947B57] transition-colors">ACCESSORIES</Link>
                    <Link href="#" className="hover:text-[#947B57] transition-colors">BRANDS</Link>
                    <Link href="#" className="hover:text-[#947B57] transition-colors">JOURNAL</Link>
                    <Link href="#" className="text-[#A65B4C] hover:text-[#947B57] transition-colors">SALE</Link>
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-5 text-[#3A352F]">
                    <button className="hover:text-[#947B57] transition-colors"><Search className="w-5 h-5 stroke-[1.5]" /></button>
                    <button className="hover:text-[#947B57] transition-colors"><User className="w-5 h-5 stroke-[1.5]" /></button>
                    <button className="hover:text-[#947B57] transition-colors"><Heart className="w-5 h-5 stroke-[1.5]" /></button>
                    <button className="hover:text-[#947B57] transition-colors relative">
                        <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                        <span className="absolute -top-1.5 -right-2 bg-[#947B57] text-white text-[9px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            2
                        </span>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-[650px] mt-12 flex flex-col justify-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
                        alt="Elegance Fall Winter Collection"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12">
                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-normal leading-tight mb-4 tracking-wide drop-shadow-md">
                            THE ART<br />OF ELEGANCE
                        </h1>
                        <p className="text-lg text-white/90 mb-10 tracking-wider font-light drop-shadow-md">
                            | Fall/Winter &apos;24 Collection
                        </p>
                        <button className="bg-[#F5F2EB]/90 hover:bg-white text-[#3A352F] px-10 py-3 text-xs font-sans font-bold tracking-widest uppercase transition-colors shadow-lg">
                            SHOP NOW
                        </button>
                    </div>
                </div>
            </section>

            {/* Arrivals Section */}
            <section className="py-24 bg-[#F5F2EB]">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl text-[#3A352F] tracking-wider">LATEST ARRIVALS</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Product 1 */}
                        <div className="group flex flex-col bg-[#F9F7F3] border border-[#EBE5D9] transition-all hover:shadow-xl hover:border-[#D1BFA5] overflow-hidden">
                            <div className="relative h-80 w-full overflow-hidden bg-white">
                                <Image
                                    src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800&auto=format&fit=crop"
                                    alt="Amara Silk Blouse"
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 text-[10px] font-sans font-bold tracking-widest uppercase">
                                    New
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-[#F9F7F3] to-[#F1EAD7] group-hover:from-[#EBDBC0] group-hover:to-[#DCBA87] transition-colors duration-500">
                                <h3 className="text-xl mb-1 text-[#3A352F]">Amara Silk Blouse</h3>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="font-sans font-medium text-sm text-[#5A554F]">$380</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase font-sans tracking-tight text-[#5A554F]">Size</span>
                                        <select className="text-xs bg-white border border-[#D1BFA5] px-2 py-0.5 rounded-sm outline-none">
                                            <option>10</option>
                                            <option>12</option>
                                            <option>14</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-transparent border-t border-[#D1BFA5]/50 text-xs font-sans font-bold tracking-widest text-[#5A554F] group-hover:bg-[#3A352F] group-hover:text-white transition-colors uppercase">
                                ADD TO BAG
                            </button>
                        </div>

                        {/* Product 2 */}
                        <div className="group flex flex-col bg-[#F9F7F3] border border-[#EBE5D9] transition-all hover:shadow-xl hover:border-[#D1BFA5] overflow-hidden">
                            <div className="relative h-80 w-full overflow-hidden bg-white">
                                <Image
                                    src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop"
                                    alt="Luxe Cashmere Coat"
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1 pb-4">
                                <h3 className="text-xl mb-1 text-[#3A352F]">Luxe Cashmere Coat</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-sans font-medium text-sm text-[#5A554F]">$1,250</span>
                                    <button className="text-[10px] text-[#947B57] uppercase font-sans tracking-widest border-b border-[#947B57] hover:text-[#3A352F] hover:border-[#3A352F] transition-colors">
                                        QUICK VIEW
                                    </button>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-transparent border-t border-[#EBE5D9] text-xs font-sans font-bold tracking-widest text-[#5A554F] group-hover:bg-[#3A352F] group-hover:text-white transition-colors uppercase">
                                ADD TO BAG
                            </button>
                        </div>

                        {/* Product 3 */}
                        <div className="group flex flex-col bg-[#F9F7F3] border border-[#EBE5D9] transition-all hover:shadow-xl hover:border-[#D1BFA5] overflow-hidden">
                            <div className="relative h-80 w-full overflow-hidden bg-[#EAE8E3]">
                                <Image
                                    src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop"
                                    alt="Onyx Leather Bag"
                                    fill
                                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1 pb-4">
                                <h3 className="text-xl mb-1 text-[#3A352F]">Onyx Leather Bag</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-sans font-medium text-sm text-[#5A554F]">$950</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-transparent border-t border-[#EBE5D9] text-xs font-sans font-bold tracking-widest text-[#5A554F] group-hover:bg-[#3A352F] group-hover:text-white transition-colors uppercase">
                                ADD TO BAG
                            </button>
                        </div>

                        {/* Product 4 */}
                        <div className="group flex flex-col bg-[#F9F7F3] border border-[#EBE5D9] transition-all hover:shadow-xl hover:border-[#D1BFA5] overflow-hidden">
                            <div className="relative h-80 w-full overflow-hidden bg-white">
                                <Image
                                    src="https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=800&auto=format&fit=crop"
                                    alt="Stella Pleated Skirt"
                                    fill
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1 pb-4">
                                <h3 className="text-xl mb-1 text-[#3A352F]">Stella Pleated Skirt</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-sans font-medium text-sm text-[#5A554F]">$310</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-transparent border-t border-[#EBE5D9] text-xs font-sans font-bold tracking-widest text-[#5A554F] group-hover:bg-[#3A352F] group-hover:text-white transition-colors uppercase">
                                ADD TO BAG
                            </button>
                        </div>

                        {/* Product 5 */}
                        <div className="group flex flex-col bg-[#F9F7F3] border border-[#EBE5D9] transition-all hover:shadow-xl hover:border-[#D1BFA5] overflow-hidden">
                            <div className="relative h-80 w-full overflow-hidden bg-[#FAF9F6]">
                                <Image
                                    src="https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=800&auto=format&fit=crop"
                                    alt="Bianca Gold Earrings"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1 pb-4">
                                <h3 className="text-xl mb-1 text-[#3A352F]">Bianca Gold Earrings</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-sans font-medium text-sm text-[#5A554F]">$195</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-transparent border-t border-[#EBE5D9] text-xs font-sans font-bold tracking-widest text-[#5A554F] group-hover:bg-[#3A352F] group-hover:text-white transition-colors uppercase">
                                ADD TO BAG
                            </button>
                        </div>

                        {/* Product 6 */}
                        <div className="group flex flex-col bg-[#F9F7F3] border border-[#EBE5D9] transition-all hover:shadow-xl hover:border-[#D1BFA5] overflow-hidden">
                            <div className="relative h-80 w-full overflow-hidden bg-white">
                                <Image
                                    src="https://images.unsplash.com/photo-1595777457583-95e059f581ce?q=80&w=800&auto=format&fit=crop"
                                    alt="Seraphina Dress"
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1 pb-4">
                                <h3 className="text-xl mb-1 text-[#3A352F]">Seraphina Dress</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-sans font-medium text-sm text-[#5A554F]">$540</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-transparent border-t border-[#EBE5D9] text-xs font-sans font-bold tracking-widest text-[#5A554F] group-hover:bg-[#3A352F] group-hover:text-white transition-colors uppercase">
                                ADD TO BAG
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#EBE5D9] text-[#5A554F] py-16 px-8 mt-auto font-sans">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                    <div className="flex flex-col gap-3">
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Home</Link>
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">About Us</Link>
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Our Stores</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Links</Link>
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Quality</Link>
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Sustainability</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Brands</Link>
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Contact</Link>
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">FAQs</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Journal</Link>
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Press</Link>
                        <Link href="#" className="hover:text-[#3A352F] transition-colors">Careers</Link>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-[#D1BFA5] text-center text-xs tracking-wider">
                    © 2024 MAISON AURA. ALL RIGHTS RESERVED.
                </div>
            </footer>
        </div>
    )
}
