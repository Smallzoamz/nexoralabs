import { ArrowRight, Leaf, Search, ShoppingCart, Star, Tractor, Truck, User, Wheat } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import MobileNav from '../MobileNav'

export default function FoodOrganicDemo() {
    return (
        <div className="min-h-screen bg-[#FBF9F6] text-[#2C3E2D] font-sans selection:bg-[#E2E8D5]">
            {/* Promo Banner */}
            <div className="bg-[#4A5D4E] text-white text-center py-2 text-sm font-medium tracking-wide">
                Free local delivery on all orders over $50 | 🌿 100% Organic Certified
            </div>

            {/* Navbar */}
            <header className="fixed top-0 inset-x-0 h-20 bg-white border-b border-stone-100 z-50 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-[#6B8E68]" fill="currentColor" />
                    <span className="font-serif font-bold text-2xl tracking-tight text-[#2C3E2D]">Harvest.</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-[#4A5D4E]">
                    <Link href="#" className="hover:text-[#6B8E68] transition-colors">Shop</Link>
                    <Link href="#" className="hover:text-[#6B8E68] transition-colors">Our Farms</Link>
                    <Link href="#" className="hover:text-[#6B8E68] transition-colors">Bundles</Link>
                    <Link href="#" className="hover:text-[#6B8E68] transition-colors">Journal</Link>
                </nav>

                <div className="flex items-center gap-5 text-[#4A5D4E]">
                    <button className="hover:text-[#6B8E68] transition-colors"><Search className="w-5 h-5 stroke-[1.5]" /></button>
                    <button className="hidden md:inline-block hover:text-[#6B8E68] transition-colors"><User className="w-5 h-5 stroke-[1.5]" /></button>
                    <button className="hover:text-[#6B8E68] transition-colors flex items-center gap-2 bg-[#E2E8D5] px-4 py-2 rounded-full">
                        <ShoppingCart className="w-4 h-4 stroke-[1.5]" />
                        <span className="text-sm font-bold">3 items</span>
                    </button>
                    <MobileNav
                        items={[
                            { label: 'Shop', href: '#' },
                            { label: 'Our Farms', href: '#' },
                            { label: 'Bundles', href: '#' },
                            { label: 'Journal', href: '#' },
                        ]}
                        buttonClass="text-[#2C3E2D] bg-[#E2E8D5] hover:bg-[#D4DFBE]"
                        panelBg="bg-[#FBF9F6]"
                        linkClass="text-[#2C3E2D] hover:text-[#6B8E68]"
                        closeClass="text-[#2C3E2D]"
                    />
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative px-4 sm:px-6 md:px-12 py-8 mx-auto max-w-[1600px]">
                <div className="bg-[#E2E8D5] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative flex flex-col lg:flex-row items-center min-h-[600px] border border-[#d2dabc]">

                    {/* Hero Content */}
                    <div className="w-full lg:w-1/2 p-12 lg:p-24 relative z-10 order-2 lg:order-1">
                        <span className="inline-block border border-[#6B8E68] text-[#4A5D4E] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 bg-white/50 backdrop-blur-sm">
                            Fresh From The Field
                        </span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#2C3E2D] leading-[1.1] mb-6">
                            Rooted in <br /><span className="text-[#6B8E68] italic">Nature.</span>
                        </h1>
                        <p className="text-[#4A5D4E] text-lg lg:text-xl mb-10 max-w-md leading-relaxed">
                            Organically grown, locally sourced, and delivered straight from our partnered farms to your kitchen table.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-[#2C3E2D] hover:bg-[#4A5D4E] text-white px-8 py-4 rounded-full font-medium transition-colors shadow-lg shadow-[#2C3E2D]/20 text-center">
                                Shop Seasonal Market
                            </button>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-8 mt-12 pt-12 border-t border-[#4A5D4E]/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6B8E68] shadow-sm">
                                    <Tractor className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-[#4A5D4E]">Local<br />Farmers</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6B8E68] shadow-sm">
                                    <Wheat className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-[#4A5D4E]">100%<br />Organic</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="w-full lg:w-1/2 h-[400px] lg:h-full relative order-1 lg:order-2">
                        {/* Decorative blobs */}
                        <div className="absolute top-10 right-10 w-96 h-96 bg-[#D4DFBE] rounded-full blur-[80px]" />
                        <div className="absolute bottom-10 left-10 w-72 h-72 bg-white rounded-full blur-[60px] opacity-60" />

                        <Image
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
                            alt="Fresh Vegetables"
                            fill
                            className="object-cover lg:rounded-l-[3rem] shadow-[-20px_0_50px_rgba(0,0,0,0.05)]"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Categories (Circular Bubbles) */}
            <section className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto text-center">
                <h2 className="text-3xl font-serif font-bold text-[#2C3E2D] mb-12">Shop by Category</h2>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {[
                        { name: 'Vegetables', img: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=1000&auto=format&fit=crop' },
                        { name: 'Fruits', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1000&auto=format&fit=crop' },
                        { name: 'Dairy & Eggs', img: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?q=80&w=1000&auto=format&fit=crop' },
                        { name: 'Bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop' },
                        { name: 'Pantry', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1000&auto=format&fit=crop' },
                    ].map((cat, i) => (
                        <div key={i} className="group cursor-pointer flex flex-col items-center gap-4">
                            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden relative border-4 border-white shadow-xl shadow-[#4A5D4E]/10 group-hover:scale-105 group-hover:shadow-[#6B8E68]/30 transition-all duration-300">
                                <Image src={cat.img} alt={cat.name} fill className="object-cover" />
                            </div>
                            <span className="font-serif font-bold text-lg text-[#2C3E2D] group-hover:text-[#6B8E68] transition-colors">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top Sellers Grid */}
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <span className="text-[#6B8E68] font-bold uppercase tracking-widest text-xs mb-2 block">Weekly Favorites</span>
                            <h2 className="text-4xl font-serif font-bold text-[#2C3E2D]">Bountiful Harvest</h2>
                        </div>
                        <button className="text-[#4A5D4E] hover:text-[#2C3E2D] font-medium flex items-center gap-2 pb-1 border-b-2 border-transparent hover:border-[#2C3E2D] transition-all">
                            View Entire Market <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { name: 'Organic Heirloom Tomatoes', price: '$5.99', unit: '/ lb', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop', badge: 'Bestseller' },
                            { name: 'Farm Fresh Brown Eggs', price: '$6.50', unit: '/ dz', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800&auto=format&fit=crop' },
                            { name: 'Artisan Sourdough Loaf', price: '$8.00', unit: '/ ea', img: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800&auto=format&fit=crop' },
                            { name: 'Organic Hass Avocados', price: '$4.99', unit: '/ 3-pack', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800&auto=format&fit=crop', badge: 'Sale' }
                        ].map((prod, i) => (
                            <div key={i} className="group flex flex-col bg-[#FBF9F6] border border-[#E2E8D5] rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-[#4A5D4E]/10 transition-all">
                                <div className="relative h-64 w-full bg-white p-6">
                                    {prod.badge && (
                                        <div className={`absolute top-4 left-4 z-10 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${prod.badge === 'Sale' ? 'bg-[#D66D42] text-white' : 'bg-[#E2E8D5] text-[#4A5D4E]'}`}>
                                            {prod.badge}
                                        </div>
                                    )}
                                    <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4A5D4E] hover:text-[#D66D42] hover:bg-[#FBF9F6] shadow-sm transition-colors border border-[#E2E8D5]">
                                        <Leaf className="w-5 h-5" />
                                    </button>
                                    <Image src={prod.img} alt={prod.name} fill className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 rounded-t-3xl" />
                                </div>
                                <div className="p-6 flex flex-col flex-1 border-t border-[#E2E8D5]">
                                    <div className="flex items-center gap-1 text-[#D66D42] mb-2">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5" fill="currentColor" />)}
                                        <span className="text-[#4A5D4E] text-xs font-medium ml-1">(24)</span>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-[#2C3E2D] mb-4 flex-1">{prod.name}</h3>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-[#6B8E68]">{prod.price}</span>
                                            <span className="text-sm font-medium text-[#4A5D4E]">{prod.unit}</span>
                                        </div>
                                        <button className="w-12 h-12 rounded-full bg-[#2C3E2D] hover:bg-[#6B8E68] text-white flex items-center justify-center transition-colors shadow-md">
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Farm/Brand Story */}
            <section className="py-24 px-6 md:px-12 bg-[#2C3E2D] text-[#FBF9F6]">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop"
                            alt="Farming"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2C3E2D] to-transparent h-1/2"></div>
                        <div className="absolute bottom-10 left-10 right-10 flex gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                            <div className="bg-[#6B8E68] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg font-serif">Harvested Daily</h4>
                                <p className="text-[#E2E8D5] text-sm">Picked at peak ripeness and delivered within 24 hours.</p>
                            </div>
                        </div>
                    </div>

                    <div className="xl:pl-12">
                        <span className="text-[#D4DFBE] font-bold uppercase tracking-widest text-xs mb-4 block">Our Story</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight">
                            Cultivating a better food <span className="text-[#A3B899] italic">system.</span>
                        </h2>
                        <p className="text-[#E2E8D5] text-lg leading-relaxed mb-8">
                            We started Harvest with a simple belief: food should be grown with care, respect for the earth, and an uncompromising commitment to quality.
                        </p>
                        <p className="text-[#E2E8D5] text-lg leading-relaxed mb-12">
                            By partnering directly with small-scale, regenerative farms, we cut out the middlemen. This means fairer wages for farmers, a smaller carbon footprint, and the freshest, most nutrient-dense produce touching your plate.
                        </p>
                        <button className="bg-[#FBF9F6] text-[#2C3E2D] hover:bg-[#D4DFBE] px-8 py-4 rounded-full font-bold transition-colors">
                            Meet Our Farmers
                        </button>
                    </div>
                </div>
            </section>

            {/* Newsletter / Footer */}
            <footer className="bg-[#E2E8D5] pt-24 pb-12 px-6 md:px-12 text-[#2C3E2D]">
                <div className="max-w-[1600px] mx-auto">
                    <div className="bg-[#FBF9F6] rounded-[3rem] p-12 md:p-20 text-center mb-24 shadow-sm border border-[#d2dabc]">
                        <h3 className="text-3xl md:text-5xl font-serif font-bold mb-4">Fresh news, delivered.</h3>
                        <p className="text-[#4A5D4E] text-lg mb-10 max-w-xl mx-auto">Sign up for our newsletter to get weekly seasonal recipes, farm updates, and 10% off your first market box.</p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-white border border-[#E2E8D5] rounded-full px-6 py-4 flex-1 text-[#2C3E2D] placeholder:text-[#6B8E68] focus:outline-none focus:border-[#6B8E68] transition-colors"
                            />
                            <button type="submit" className="bg-[#2C3E2D] hover:bg-[#4A5D4E] text-white px-8 py-4 rounded-full font-bold transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 font-medium mb-16 border-b border-[#2C3E2D]/10 pb-16">
                        <div className="col-span-2 lg:col-span-2 pr-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Leaf className="w-8 h-8 text-[#6B8E68]" fill="currentColor" />
                                <span className="font-serif font-bold text-3xl tracking-tight text-[#2C3E2D]">Harvest.</span>
                            </div>
                            <p className="text-[#4A5D4E] leading-relaxed max-w-sm">Cultivating community through organic, sustainable, and regenerative agriculture.</p>
                        </div>
                        <div>
                            <h4 className="font-serif font-bold text-lg mb-6 text-[#2C3E2D]">Market</h4>
                            <ul className="space-y-4 text-[#4A5D4E]">
                                <li><Link href="#" className="hover:text-[#6B8E68]">Shop All</Link></li>
                                <li><Link href="#" className="hover:text-[#6B8E68]">Produce</Link></li>
                                <li><Link href="#" className="hover:text-[#6B8E68]">Meat & Dairy</Link></li>
                                <li><Link href="#" className="hover:text-[#6B8E68]">Pantry Staples</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-serif font-bold text-lg mb-6 text-[#2C3E2D]">About</h4>
                            <ul className="space-y-4 text-[#4A5D4E]">
                                <li><Link href="#" className="hover:text-[#6B8E68]">Our Story</Link></li>
                                <li><Link href="#" className="hover:text-[#6B8E68]">Our Farms</Link></li>
                                <li><Link href="#" className="hover:text-[#6B8E68]">Sustainability</Link></li>
                                <li><Link href="#" className="hover:text-[#6B8E68]">Careers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-serif font-bold text-lg mb-6 text-[#2C3E2D]">Help</h4>
                            <ul className="space-y-4 text-[#4A5D4E]">
                                <li><Link href="#" className="hover:text-[#6B8E68]">FAQ</Link></li>
                                <li><Link href="#" className="hover:text-[#6B8E68]">Shipping</Link></li>
                                <li><Link href="#" className="hover:text-[#6B8E68]">Returns</Link></li>
                                <li><Link href="#" className="hover:text-[#6B8E68]">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between text-sm text-[#4A5D4E] font-medium">
                        <p>&copy; {new Date().getFullYear()} Harvest Organic Markets. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="#" className="hover:text-[#2C3E2D]">Privacy</Link>
                            <Link href="#" className="hover:text-[#2C3E2D]">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
