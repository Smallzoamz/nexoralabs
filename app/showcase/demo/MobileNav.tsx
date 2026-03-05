'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface MobileNavProps {
    items: { label: string; href: string }[]
    /** Text / icon colors for the hamburger button */
    buttonClass?: string
    /** Background for the mobile panel */
    panelBg?: string
    /** Text style for mobile links */
    linkClass?: string
    /** Accent color for close button */
    closeClass?: string
    /** Breakpoint at which the hamburger hides: 'md' | 'lg' */
    hiddenAt?: 'md' | 'lg'
}

export default function MobileNav({
    items,
    buttonClass = 'text-slate-700 bg-slate-100 hover:bg-slate-200',
    panelBg = 'bg-white',
    linkClass = 'text-slate-800 hover:text-blue-600',
    closeClass = 'text-slate-700',
    hiddenAt = 'md',
}: MobileNavProps) {
    const [open, setOpen] = useState(false)

    const hiddenClass = hiddenAt === 'lg' ? 'lg:hidden' : 'md:hidden'

    return (
        <>
            {/* Hamburger Button — always has a visible bg */}
            <button
                onClick={() => setOpen(true)}
                className={`${hiddenClass} p-2.5 rounded-xl transition-colors pointer-events-auto ${buttonClass}`}
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay + Panel */}
            {open && (
                <div className="fixed inset-0 z-[9999]" onClick={() => setOpen(false)}>
                    {/* Backdrop - High opacity for maximum contrast */}
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

                    {/* Panel — Full width on mobile, 320px on small screens+ */}
                    <div
                        className={`absolute top-0 right-0 w-full sm:w-80 h-full ${panelBg} shadow-2xl p-6 flex flex-col gap-2 animate-slide-in`}
                        style={{ opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setOpen(false)}
                            className={`self-end p-2.5 rounded-xl hover:bg-black/10 transition-colors mb-4 ${closeClass}`}
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col gap-1 mt-4">
                            {items.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`block py-4 px-5 rounded-xl text-base font-bold transition-all active:scale-95 hover:bg-black/5 ${linkClass}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Slide-in Animation */}
            <style jsx global>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slideIn 0.25s ease-out;
                }
            `}</style>
        </>
    )
}
