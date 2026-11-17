import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { translations, LANGUAGES, DEFAULT_LANGUAGE } from '../translations'

export const TranslateContext = createContext(null)

const STORAGE_KEY = 'muhayyo_language'

export const TranslateProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && (saved === 'uz' || saved === 'en')) {
        return saved
      }
    } catch (e) {
      console.warn('LocalStorage language read error:', e)
    }
    // Asosiy standart til: O'zbek tili
    return DEFAULT_LANGUAGE
  })

  // Til o'zgarganda localStorage va <html> lang atributini yangilash
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language)
      document.documentElement.setAttribute('lang', language)
    } catch (e) {
      console.warn('LocalStorage language save error:', e)
    }
  }, [language])

  // Tilni o'zgartirish
  const setLanguage = useCallback((newLang) => {
    if (newLang === 'uz' || newLang === 'en') {
      setLanguageState(newLang)
    }
  }, [])

  // O'zbek va Ingliz tillari o'rtasida almashtirish
  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => (prev === 'uz' ? 'en' : 'uz'))
  }, [])

  /**
   * Tarjima funksiyasi: t(keyPath, params)
   * Misol: t('navbar.searchPlaceholder')
   * Misol: t('songList.count', { count: 5 })
   */
  const t = useCallback((keyPath, params = {}) => {
    if (!keyPath) return ''

    const keys = keyPath.split('.')
    let current = translations[language]

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        // Fallback to default language (uz) if key missing in current language
        let fallback = translations[DEFAULT_LANGUAGE]
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk]
          } else {
            fallback = null
            break
          }
        }
        current = fallback || keyPath
        break
      }
    }

    if (typeof current !== 'string') {
      return String(current ?? keyPath)
    }

    // Parametrlarni almashtirish (masalan: {count}, {title}, {percent})
    let result = current
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue))
      })
    }

    return result
  }, [language])

  const value = useMemo(() => ({
    language,
    currentLang: language,
    isUzbek: language === 'uz',
    isEnglish: language === 'en',
    setLanguage,
    toggleLanguage,
    t,
    languages: LANGUAGES,
    defaultLanguage: DEFAULT_LANGUAGE
  }), [language, setLanguage, toggleLanguage, t])

  return (
    <TranslateContext.Provider value={value}>
      {children}
    </TranslateContext.Provider>
  )
}

export default TranslateProvider
