import { ArrowRight, BarChart4, ChevronRight, Fingerprint, Globe2, Landmark, Lock, ShieldCheck, Smartphone, TrendingUp, User, Wallet } from 'lucide-react'
import Link from 'next/link'
import MobileNav from '../MobileNav'

export default function StartupFintechDemo() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-500/30">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 h-20 bg-white z-50 flex items-center justify-between px-6 md:px-12 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold tracking-tight text-xl text-slate-900 hidden sm:block">AegisPay</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
                    <Link href="#" className="hover:text-teal-600 transition-colors">Products</Link>
                    <Link href="#" className="hover:text-teal-600 transition-colors">Business</Link>
                    <Link href="#" className="hover:text-teal-600 transition-colors">Developers</Link>
                    <Link href="#" className="hover:text-teal-600 transition-colors">Security</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="#" className="hidden sm:block text-slate-600 font-semibold text-sm hover:text-slate-900 transition-colors">Sign in</Link>
                    <button className="hidden md:inline-block bg-slate-900 hover:bg-teal-600 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors">
                        Open Account
                    </button>
                    <MobileNav
                        items={[
                            { label: 'Products', href: '#' },
                            { label: 'Business', href: '#' },
                            { label: 'Developers', href: '#' },
                            { label: 'Security', href: '#' },
                        ]}
                        linkClass="text-slate-800 hover:text-teal-600"
                    />
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative max-w-7xl mx-auto overflow-hidden">
                {/* Background Shapes */}
                <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-teal-50 rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] -z-10" />

                <div className="w-full md:w-1/2 relative z-10 flex flex-col items-start text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-6 border border-teal-100">
                        <ShieldCheck className="w-4 h-4" /> FDIC Insured Provider
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-6">
                        Finance,<br />
                        <span className="text-teal-600">without borders.</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
                        The global financial operating system for modern businesses and individuals. Send, spend, and save seamlessly across 150+ countries.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-teal-600/20 text-lg flex items-center justify-center gap-2">
                            Get Started <ChevronRight className="w-5 h-5" />
                        </button>
                        <button className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full font-bold transition-colors text-lg flex items-center justify-center gap-2">
                            Talk to Sales
                        </button>
                    </div>

                    {/* Mini Stats */}
                    <div className="mt-16 flex items-center gap-8 pt-8 border-t border-slate-200 w-full">
                        <div>
                            <div className="text-3xl font-black text-slate-900 mb-1">$50B+</div>
                            <div className="text-sm font-medium text-slate-500">Processed Annually</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 mb-1">2M+</div>
                            <div className="text-sm font-medium text-slate-500">Active Customers</div>
                        </div>
                    </div>
                </div>

                {/* Hero App Mockup / Visual */}
                <div className="w-full md:w-1/2 relative min-h-[500px] lg:min-h-[700px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-blue-500/10 rounded-[3rem] transform rotate-3" />

                    {/* Main Card */}
                    <div className="relative z-20 w-80 h-[500px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border-4 border-slate-50 p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex gap-2 items-center">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-slate-600" /></div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium">Hello,</div>
                                    <div className="text-sm font-bold text-slate-900">Alex Chen</div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><ActionIcon /></div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-3xl p-6 mb-6 relative overflow-hidden shadow-lg shadow-slate-900/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                            <div className="text-sm text-slate-400 font-medium mb-1">Total Balance</div>
                            <div className="text-3xl font-black mb-6">$124,580.00</div>
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                <TrendingUp className="w-4 h-4" /> +$4,200.50 (3.5%) this month
                            </div>
                        </div>

                        <div className="flex justify-between mb-8">
                            <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center"><ArrowRight className="w-5 h-5" /></div><span className="text-xs font-bold text-slate-600">Send</span></div>
                            <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><ArrowRight className="w-5 h-5 transform rotate-180" /></div><span className="text-xs font-bold text-slate-600">Receive</span></div>
                            <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center"><Globe2 className="w-5 h-5" /></div><span className="text-xs font-bold text-slate-600">Exchange</span></div>
                        </div>

                        <div className="flex-1">
                            <div className="text-sm font-bold text-slate-900 mb-4">Recent Transactions</div>
                            <div className="space-y-4">
                                <TransactionItem name="Apple Store" cat="Tech" amt="-$1,099.00" date="Today" />
                                <TransactionItem name="Stripe Payout" cat="Income" amt="+$8,450.00" date="Yesterday" positive={true} />
                                <TransactionItem name="Equator Coffee" cat="Food" amt="-$4.50" date="Yesterday" />
                            </div>
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <div className="absolute top-10 right-0 z-30 bg-white p-4 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 flex items-center gap-4 transform translate-x-1/2 animate-bounce-slow">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protected</div>
                            <div className="text-sm font-bold text-slate-900">Bank-level Security</div>
                        </div>
                    </div>

                    <div className="absolute bottom-20 left-0 z-30 bg-white p-4 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col gap-2 transform -translate-x-1/4">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Reach</div>
                        <div className="text-2xl font-black text-slate-900 flex items-center gap-2"><Globe2 className="w-6 h-6 text-blue-500" /> 150+</div>
                        <div className="text-xs font-medium text-slate-500">Countries Supported</div>
                    </div>
                </div>
            </section>

            {/* Security Row */}
            <section className="py-12 border-y border-slate-100 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <p className="text-slate-500 font-bold text-sm tracking-widest uppercase shrink-0">Trusted by modern teams</p>

                    <div className="flex items-center gap-8 md:gap-16 opacity-50 overflow-x-auto pb-4 md:pb-0 w-full justify-start md:justify-center">
                        <div className="text-2xl font-black text-slate-400">Spotify</div>
                        <div className="text-2xl font-black text-slate-400">Airbnb</div>
                        <div className="text-2xl font-black text-slate-400">Discord</div>
                        <div className="text-2xl font-black text-slate-400">Notion</div>
                        <div className="text-2xl font-black text-slate-400">Uber</div>
                    </div>
                </div>
            </section>

            {/* 3 Step Process */}
            <section className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Financial freedom in minutes.</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Skip the branches, the waiting lines, and the endless paperwork. We&apos;ve built an experience that respects your time.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-slate-200 border-t-2 border-dashed border-teal-200" />

                        {[
                            { step: '01', icon: Smartphone, title: 'Download & Apply', desc: 'Get our award-winning app and apply in under 3 minutes using your ID.' },
                            { step: '02', icon: Fingerprint, title: 'Instant Verification', desc: 'Our biometric AI verifies your identity instantly, safely, and securely.' },
                            { step: '03', icon: Landmark, title: 'Start Spending', desc: 'Get your virtual card immediately and start spending in 150+ currencies.' }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full bg-white shadow-xl shadow-teal-900/5 border border-slate-100 flex items-center justify-center mb-8 relative">
                                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-teal-500 rounded-full text-white font-black flex items-center justify-center border-4 border-white shadow-sm">
                                        {item.step}
                                    </div>
                                    <item.icon className="w-12 h-12 text-teal-600" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Bento Grid */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Everything your money needs.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[600px]">

                        {/* Large Box 1 */}
                        <div className="md:col-span-8 md:row-span-1 bg-white border border-slate-200 rounded-3xl p-10 flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex-1 pr-6 flex flex-col justify-center">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><BarChart4 className="w-6 h-6" /></div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-time Insights</h3>
                                <p className="text-slate-600 font-medium leading-relaxed mb-6">Categorize spending automatically, track subscriptions, and set smart budgets that adapt to your lifestyle.</p>
                                <Link href="#" className="font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">Learn more <ArrowRight className="w-4 h-4" /></Link>
                            </div>
                            <div className="flex-1 relative mt-8 md:mt-0 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-end justify-center pt-8">
                                <div className="w-full flex items-end justify-between px-8 pb-4">
                                    <div className="w-8 bg-blue-200/50 rounded-t-sm h-16 group-hover:h-20 transition-all"></div>
                                    <div className="w-8 bg-blue-300/50 rounded-t-sm h-24 group-hover:h-32 transition-all"></div>
                                    <div className="w-8 bg-blue-400/50 rounded-t-sm h-12 group-hover:h-16 transition-all"></div>
                                    <div className="w-8 bg-blue-500/80 rounded-t-sm h-32 group-hover:h-40 transition-all"></div>
                                    <div className="w-8 bg-blue-600 rounded-t-sm h-20 group-hover:h-28 transition-all"></div>
                                </div>
                            </div>
                        </div>

                        {/* Small Box 1 */}
                        <div className="md:col-span-4 md:row-span-1 bg-gradient-to-br from-teal-500 to-emerald-600 text-white border border-teal-400 rounded-3xl p-10 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-4xl font-black mb-2 flex items-center gap-2">4.25% <TrendingUp className="w-6 h-6" /></h3>
                                <div className="text-teal-100 font-bold tracking-widest uppercase text-xs mb-6">Apy on Savings</div>
                                <p className="text-teal-50 font-medium leading-relaxed">Make your idle cash work harder for you. Interest paid daily, access funds anytime without penalties.</p>
                            </div>
                        </div>

                        {/* Small Box 2 */}
                        <div className="md:col-span-4 md:row-span-1 bg-slate-900 text-white border border-slate-800 rounded-3xl p-10 shadow-2xl flex flex-col">
                            <div className="w-12 h-12 bg-slate-800 text-teal-400 rounded-2xl flex items-center justify-center mb-6 border border-slate-700"><Lock className="w-6 h-6" /></div>
                            <h3 className="text-2xl font-bold mb-3">Bank-level Security</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">Your funds are held in safeguarded accounts at tiered-1 partner banks. Insured up to $250k by the FDIC.</p>
                        </div>

                        {/* Large Box 2 */}
                        <div className="md:col-span-8 md:row-span-1 bg-white border border-slate-200 rounded-3xl p-10 flex flex-col justify-center shadow-sm">
                            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6"><Globe2 className="w-6 h-6" /></div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Borderless Spending</h3>
                            <p className="text-slate-600 font-medium leading-relaxed max-w-xl">Spend abroad without hidden fees. Access interbank exchange rates automatically whenever you use your Aegis card in over 150 countries.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA App Download */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-600"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/50 rounded-full blur-[100px]" />

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                    <div className="flex-1 text-white">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to take control?</h2>
                        <p className="text-lg text-teal-100 mb-10 max-w-lg font-medium">Join 2 million others taking control of their finances. Download the app today and get your account in 3 minutes.</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-xl">
                                <span className="font-bold flex flex-col items-start leading-tight">
                                    <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Download on the</span>
                                    <span className="text-lg">App Store</span>
                                </span>
                            </button>
                            <button className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-xl">
                                <span className="font-bold flex flex-col items-start leading-tight">
                                    <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Get it on</span>
                                    <span className="text-lg">Google Play</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full h-[400px] md:h-[600px] mt-12 md:mt-0 flex items-center justify-center">
                        <div className="w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col p-6 animate-pulse-slow">
                            <div className="flex justify-between items-center text-white mb-8 pt-4">
                                <div className="text-xs font-bold">9:41</div>
                                <div className="flex gap-2">
                                    <div className="w-16 h-4 bg-slate-700 rounded-full"></div>
                                </div>
                            </div>

                            <div className="text-center text-slate-400 text-sm font-bold tracking-widest uppercase mb-2 mt-8">Balance</div>
                            <div className="text-4xl font-black text-white text-center mb-12">$8,450.00</div>

                            <div className="bg-teal-500 rounded-2xl p-6 text-white mb-8">
                                <div className="text-xs font-bold tracking-widest uppercase opacity-80 mb-6">Virtual Card</div>
                                <div className="text-xl font-bold tracking-widest mb-4">**** 4289</div>
                                <div className="flex justify-between text-xs font-bold opacity-80">
                                    <span>A. CHEN</span>
                                    <span>12/26</span>
                                </div>
                            </div>

                            <div className="w-full h-12 bg-slate-800 rounded-xl mb-4"></div>
                            <div className="w-full h-12 bg-slate-800 rounded-xl mb-4"></div>
                            <div className="w-full h-12 bg-slate-800 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-16 px-6 border-t border-slate-200">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16 text-sm font-semibold text-slate-500">
                    <div className="col-span-2 lg:col-span-2 pr-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                                <Wallet className="w-3 h-3 text-white" />
                            </div>
                            <span className="font-bold tracking-tight text-xl text-slate-900">AegisPay</span>
                        </div>
                        <p className="mb-6 leading-relaxed max-w-sm">AegisPay is a financial technology company, not a bank. Banking services provided by Coastal Community Bank, Member FDIC.</p>
                    </div>
                    <div>
                        <h4 className="text-slate-900 font-bold mb-6 tracking-wide text-xs uppercase">Products</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Checking</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Savings</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Credit Cards</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Investments</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-slate-900 font-bold mb-6 tracking-wide text-xs uppercase">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Press</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-slate-900 font-bold mb-6 tracking-wide text-xs uppercase">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Security</Link></li>
                            <li><Link href="#" className="hover:text-teal-600 transition-colors">Status</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function ActionIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
    )
}

function TransactionItem({ name, cat, amt, date, positive = false }: { name: string, cat: string, amt: string, date: string, positive?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">{name.charAt(0)}</div>
                <div>
                    <div className="text-sm font-bold text-slate-900">{name}</div>
                    <div className="text-xs text-slate-500 font-medium">{cat} • {date}</div>
                </div>
            </div>
            <div className={`text-sm font-bold ${positive ? 'text-emerald-500' : 'text-slate-900'}`}>{amt}</div>
        </div>
    )
}
