import React, { useState, useRef, useEffect } from 'react'
import {
  FaMusic,
  FaMagnifyingGlass,
  FaSun,
  FaMoon,
  FaCircleInfo,
  FaXmark,
  FaHeart,
  FaCheck
} from 'react-icons/fa6'
import useTranslate from '../hooks/useTranslate'

export const Navbar = ({
  theme,
  toggleTheme,
  searchQuery,
  setSearchQuery,
  onOpenInfoModal,
  likedCount = 0
}) => {
  const { t, language, setLanguage, languages } = useTranslate()
  const [isLangOpen, setIsLangOpen] = useState(false)
  const langDropdownRef = useRef(null)

  // Tashqariga bosilganda til menyusini yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 select-none">
          <div className="relative group flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
            <FaMusic className="text-white text-lg group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                {t('common.appTitle')}
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {t('common.proBadge')}
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('common.subtitle')}
            </p>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <div className="relative flex items-center">
            <FaMagnifyingGlass className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('navbar.searchPlaceholder')}
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition"
                title={t('navbar.clear')}
                aria-label={t('navbar.clear')}
              >
                <FaXmark className="text-xs" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons: Favorites Count, Language Selector, Info, Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorites Badge */}
          {likedCount > 0 && (
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold"
              title={t('navbar.favorites')}
            >
              <FaHeart className="w-3.5 h-3.5 fill-current" />
              <span>{likedCount}</span>
            </div>
          )}

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm text-xs font-bold"
              title={t('navbar.switchLanguage')}
              aria-label={t('navbar.switchLanguage')}
            >
              <span className="text-sm">
                {language === 'uz' ? '🇺🇿' : '🇬🇧'}
              </span>
              <span className="uppercase text-xs font-bold tracking-wider">
                {language}
              </span>
            </button>

            {/* Language Dropdown Menu */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-scaleUp">
                {languages.map((item) => {
                  const isActive = language === item.code
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code)
                        setIsLangOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.flag}</span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && <FaCheck className="w-3 h-3 text-emerald-500" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Info & Help Modal Trigger */}
          <button
            onClick={onOpenInfoModal}
            className="p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-200"
            title={t('navbar.aboutPlatform')}
            aria-label={t('navbar.aboutPlatform')}
          >
            <FaCircleInfo className="w-5 h-5" />
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
            title={theme === 'dark' ? t('navbar.switchToLight') : t('navbar.switchToDark')}
            aria-label={theme === 'dark' ? t('navbar.switchToLight') : t('navbar.switchToDark')}
          >
            {theme === 'dark' ? (
              <FaSun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <FaMoon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  )
}

export default Navbar
