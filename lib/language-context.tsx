'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'th' | 'en'

interface LanguageContextType {
    lang: Language
    toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'th',
    toggleLang: () => { },
})

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>('th')

    const toggleLang = () => {
        setLang((prev) => (prev === 'th' ? 'en' : 'th'))
    }

    return (
        <LanguageContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)
