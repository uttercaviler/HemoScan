import React, { createContext, useContext, useState } from 'react'
import translations from './translations'

const LanguageContext = createContext()

export const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
]

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en')

    const t = (key) => {
        return translations[language]?.[key] || translations.en[key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
