'use client'

import { Activity, ArrowRight, BarChart3, CheckCircle2, ChevronRight, Cloud, Code2, Database, Globe, Layers, Lock, MessageSquare, PlayCircle, Shield, Sparkles, X, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import MobileNav from '../MobileNav'

export default function StartupSaaSDemo() {
    const [isAnnual, setIsAnnual] = useState(true)

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 h-20 bg-white z-50 flex items-center justify-between px-6 md:px-12 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center transform -rotate-6">
                        <Layers className="w-5 h-5 text-white transform rotate-6" />
                    </div>
                    <span className="font-bold tracking-tight text-xl text-slate-900 hidden sm:block">StackFlow</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
                    <Link href="#" className="hover:text-indigo-600 transition-colors">Features</Link>
                    <Link href="#" className="hover:text-indigo-600 transition-colors">Solutions</Link>
                    <Link href="#" className="hover:text-indigo-600 transition-colors">Pricing</Link>
                    <Link href="#" className="hover:text-indigo-600 transition-colors">Resources</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="#" className="hidden sm:block text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors">Log in</Link>
                    <button className="hidden md:inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30">
                        Start Free Trial
                    </button>
                    <MobileNav
                        items={[
                            { label: 'Features', href: '#' },
                            { label: 'Solutions', href: '#' },
                            { label: 'Pricing', href: '#' },
                            { label: 'Resources', href: '#' },
                        ]}
                        linkClass="text-slate-800 hover:text-indigo-600"
                    />
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center relative overflow-hidden">
                {/* Background Grid & Glows */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 relative z-10 shadow-sm">
                    <Sparkles className="w-4 h-4" /> Introducing StackFlow 2.0 <ArrowRight className="w-4 h-4" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6 max-w-4xl relative z-10">
                    The modern operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">engineering teams.</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed relative z-10">
                    Align your entire organization on one platform. Plan, build, and ship better products faster with intelligent workflows and AI-powered insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 relative z-10 mb-16">
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 text-lg">
                        Get Started for Free <ChevronRight className="w-5 h-5" />
                    </button>
                    <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg shadow-sm">
                        <PlayCircle className="w-5 h-5 text-indigo-600" /> Watch Demo
                    </button>
                </div>

                {/* Dashboard Image / App Mockup */}
                <div className="relative w-full max-w-6xl mx-auto rounded-[2rem] border border-slate-200 bg-white/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 p-2 md:p-4 z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/10 rounded-[2rem] pointer-events-none"></div>
                    <div className="relative rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50 flex flex-col">
                        {/* Fake Browser Chrome */}
                        <div className="h-12 bg-white flex items-center px-4 gap-2 border-b border-slate-100">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            </div>
                            <div className="ml-4 bg-slate-100 text-slate-400 text-xs px-20 py-1.5 rounded-md w-max mx-auto hidden sm:block flex-1 max-w-md text-center border border-slate-200">
                                app.stackflow.io/dashboard
                            </div>
                        </div>
                        {/* App Content Fake */}
                        <div className="h-[400px] md:h-[600px] w-full relative bg-slate-50 p-6 flex gap-6">
                            {/* Fake Sidebar */}
                            <div className="hidden md:flex w-64 bg-white rounded-xl border border-slate-200 flex-col p-4 gap-2 shadow-sm">
                                <div className="h-10 w-full bg-slate-100 rounded-lg mb-4"></div>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`h-8 w-full rounded-md ${i === 2 ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'}`}></div>
                                ))}
                                <div className="mt-auto h-12 w-full bg-slate-50 rounded-lg border border-slate-100"></div>
                            </div>
                            {/* Fake Main Content */}
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="h-20 w-full bg-white rounded-xl border border-slate-200 flex items-center justify-between p-6 shadow-sm">
                                    <div className="w-48 h-6 bg-slate-100 rounded-full"></div>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200"></div>
                                        <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col sm:flex-row gap-6">
                                    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                        <div className="w-32 h-5 bg-slate-100 rounded-full mb-6"></div>
                                        <div className="w-full h-full bg-gradient-to-tr from-indigo-50 to-white rounded-lg border border-indigo-50/50 flex items-end">
                                            {/* Fake Chart bars */}
                                            <div className="w-full h-48 flex items-end justify-between px-4 pb-0">
                                                {[50, 70, 40, 90, 60, 80, 100, 50, 70].map((h, i) => (
                                                    <div key={i} className="w-8 bg-indigo-500/20 rounded-t-sm" style={{ height: `${h}%` }}>
                                                        <div className="w-full bg-indigo-500 rounded-t-sm" style={{ height: `${h * 0.8}%` }}></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-80 flex flex-col gap-6">
                                        <div className="h-1/2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                            <div className="w-full h-4 bg-slate-100 rounded-full mb-4"></div>
                                            <div className="w-3/4 h-4 bg-slate-100 rounded-full mb-8"></div>
                                            <div className="flex justify-between items-end h-full w-full pb-4">
                                                <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center"><div className="w-10 h-10 bg-indigo-100 rounded-full"></div></div>
                                                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center"><div className="w-10 h-10 bg-emerald-100 rounded-full"></div></div>
                                            </div>
                                        </div>
                                        <div className="h-1/2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                            <div className="w-24 h-5 bg-slate-100 rounded-full mb-4"></div>
                                            <div className="space-y-3">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-full h-8 bg-slate-50 border border-slate-100 rounded-md"></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features (3 Cols) */}
            <section className="py-24 px-6 relative bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-3">Capabilities</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Everything you need to scale.</h3>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Focus on building great products, not managing tools. StackFlow brings your code, project management, and docs into one unified workspace.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: 'Lightning Fast Workflows', desc: 'Automate repetitive tasks and let your team focus on high-impact work. Our AI assistant anticipates what you need next.', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
                            { icon: Activity, title: 'Real-time Analytics', desc: 'Get actionable insights into your team&apos;s velocity, blockages, and code quality. Dashboards update in milliseconds.', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
                            { icon: Shield, title: 'Enterprise-grade Security', desc: 'SOC2 Type II certified out of the box. Granular RBAC, SSO, and audit logs keep your IP completely secure.', color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' },
                            { icon: Database, title: 'Seamless Integrations', desc: 'Connect with GitHub, Jira, Slack, and 150+ other tools. Bi-directional sync means data is always up-to-date.', color: 'text-rose-500', bg: 'bg-rose-50 border-rose-100' },
                            { icon: Cloud, title: 'Global Infrastructure', desc: 'Deployed across 35 edge regions globally. Ensuring your team experiences sub-50ms latency no matter where they are.', color: 'text-cyan-500', bg: 'bg-cyan-50 border-cyan-100' },
                            { icon: MessageSquare, title: 'Contextual Collaboration', desc: 'Discuss code, architecture, and roadmaps directly within the platform. Context is never lost in chat again.', color: 'text-violet-500', bg: 'bg-violet-50 border-violet-100' },
                        ].map((feat, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-200 transition-all group cursor-pointer">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border ${feat.bg}`}>
                                    <feat.icon className={`w-6 h-6 ${feat.color}`} />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{feat.title}</h4>
                                <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section (Interactive Toggle) */}
            <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Simple, transparent pricing.</h2>
                        <p className="text-xl text-slate-600 mb-10">Start for free, upgrade when you need more power.</p>

                        {/* Toggle */}
                        <div className="inline-flex items-center bg-slate-200/50 p-1.5 rounded-full border border-slate-300 shadow-inner">
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${!isAnnual ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${isAnnual ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Annually <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:block">Save 20%</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Plan 1 */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">Perfect for small teams and startups testing the waters.</p>
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-slate-900">{isAnnual ? '$0' : '$0'}</span>
                                <span className="text-slate-500 font-medium">/mo</span>
                            </div>
                            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-3.5 rounded-xl font-bold transition-colors mb-8">Get Started</button>
                            <ul className="space-y-4 text-sm text-slate-600 flex-1">
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Up to 3 team members</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Basic workflow automation</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Standard integrations</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> Community support</li>
                                <li className="flex gap-3 text-slate-400"><X className="w-5 h-5 shrink-0" /> Advanced analytics</li>
                            </ul>
                        </div>

                        {/* Plan 2 (Pro) */}
                        <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl shadow-indigo-500/10 flex flex-col relative transform md:-translate-y-4">
                            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                            <p className="text-slate-400 text-sm mb-6 pb-6 border-b border-slate-700">Everything you need to scale your engineering team rapidly.</p>
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white">{isAnnual ? '$49' : '$59'}</span>
                                <span className="text-slate-400 font-medium">/user/mo</span>
                            </div>
                            <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold transition-colors mb-8 shadow-lg shadow-indigo-500/25">Start 14-Day Trial</button>
                            <ul className="space-y-4 text-sm text-slate-300 flex-1">
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Unlimited team members</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Advanced AI workflows</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> All premium integrations</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Priority 24/7 support</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Custom analytics dashboards</li>
                            </ul>
                        </div>

                        {/* Plan 3 */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
                            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">Custom solutions for large organizations with complex needs.</p>
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-slate-900">Custom</span>
                            </div>
                            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-3.5 rounded-xl font-bold transition-colors mb-8">Contact Sales</button>
                            <ul className="space-y-4 text-sm text-slate-600 flex-1">
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" /> Everything in Professional</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" /> Dedicated success manager</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" /> SSO & Advanced RBAC</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" /> On-premise deployment options</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" /> 99.99% Uptime SLA</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integrations (Logo Cloud style) */}
            <section className="py-24 px-6 bg-white border-t border-slate-200 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 lg:max-w-xl text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Plays well with others.</h2>
                        <p className="text-xl text-slate-600 mb-8">StackFlow seamlessly integrates with the tools your team already uses. No painful migrations required.</p>
                        <Link href="#" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center gap-2 justify-center lg:justify-start">
                            View All 150+ Integrations <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="flex-1 relative w-full aspect-square md:aspect-video lg:aspect-square max-w-2xl mx-auto">
                        {/* Decorative background grid for integrations */}
                        <div className="absolute inset-0 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center">
                            <div className="w-[80%] h-[80%] rounded-full border border-slate-200 flex items-center justify-center bg-white">
                                <div className="w-[60%] h-[60%] rounded-full border border-indigo-100 flex items-center justify-center shadow-inner">
                                    <div className="w-20 h-20 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/30 flex items-center justify-center text-white font-bold text-2xl transform rotate-12">
                                        <Layers className="w-10 h-10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orbiting Icons (Static representation) */}
                        <div className="absolute top-[10%] left-[20%] w-14 h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
                            <Code2 className="w-6 h-6 text-slate-700" />
                        </div>
                        <div className="absolute bottom-[20%] right-[10%] w-16 h-16 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
                            <Database className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="absolute top-[40%] right-[5%] w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="absolute bottom-[10%] left-[15%] w-16 h-16 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
                            <BarChart3 className="w-8 h-8 text-rose-500" />
                        </div>
                        <div className="absolute top-[-5%] right-[30%] w-14 h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-amber-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 md:px-12 bg-white text-center">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight relative z-10">Stop managing work.<br />Start making progress.</h2>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">Join 10,000+ teams shipping better products faster with StackFlow.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/25">
                            Start 14-Day Free Trial
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-colors border border-white/10">
                            Talk to Sales
                        </button>
                    </div>
                    <p className="text-slate-500 text-sm mt-6 relative z-10">No credit card required. Cancel anytime.</p>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="bg-slate-50 py-12 px-6 border-t border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center transform -rotate-6">
                            <Layers className="w-3 h-3 text-white transform rotate-6" />
                        </div>
                        <span className="font-bold text-slate-900">StackFlow</span>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-slate-500">
                        <Link href="#" className="hover:text-indigo-600 transition-colors">Twitter</Link>
                        <Link href="#" className="hover:text-indigo-600 transition-colors">GitHub</Link>
                        <Link href="#" className="hover:text-indigo-600 transition-colors">Discord</Link>
                    </div>
                    <div className="text-sm text-slate-400">
                        &copy; 2024 StackFlow Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
