import { useState, useEffect } from 'react'

/**
 * Custom Hook for Dark / Light mode management
 * Stores user preference in localStorage and toggles 'dark' class on <html>
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('muhayyo_theme')
    if (saved === 'dark' || saved === 'light') return saved
    // Default to dark mode for modern audio player aesthetic
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('muhayyo_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme
  }
}

export default useTheme
