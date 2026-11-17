import { useState, useEffect, useCallback } from 'react'

const EMAILS_STORAGE_KEY = 'muhayyo_visitor_emails'
const CURRENT_USER_EMAIL_KEY = 'muhayyo_current_user_email'

// Dastlabki namunaviy ma'lumotlar (agar bo'sh bo'lsa ko'rinishi uchun)
const DEFAULT_INITIAL_EMAILS = [
  {
    id: 'demo-1',
    email: 'muhammad.developer@gmail.com',
    date: '17.11.2026, 12:40',
    device: 'Windows (Chrome)',
    status: 'Active'
  },
  {
    id: 'demo-2',
    email: 'muhayyo.fan@mail.ru',
    date: '17.11.2026, 13:15',
    device: 'Android (Mobile)',
    status: 'Active'
  }
]

export const useVisitorEmails = () => {
  const [emails, setEmails] = useState(() => {
    try {
      const saved = localStorage.getItem(EMAILS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.warn('Error reading emails from localStorage:', e)
    }
    return DEFAULT_INITIAL_EMAILS
  })

  const [currentEmail, setCurrentEmail] = useState(() => {
    try {
      return localStorage.getItem(CURRENT_USER_EMAIL_KEY) || ''
    } catch {
      return ''
    }
  })

  // LocalStorage ga saqlab borish
  useEffect(() => {
    try {
      localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails))
    } catch (e) {
      console.error('Error saving emails to localStorage:', e)
    }
  }, [emails])

  // Qurilma va brauzer ma'lumotlarini aniqlash
  const getDeviceInfo = () => {
    if (typeof window === 'undefined') return 'Unknown'
    const ua = navigator.userAgent
    let os = 'Desktop'
    if (/android/i.test(ua)) os = 'Android (Mobile)'
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS (Mobile)'
    else if (/windows/i.test(ua)) os = 'Windows'
    else if (/macintosh|mac os x/i.test(ua)) os = 'macOS'
    else if (/linux/i.test(ua)) os = 'Linux'

    let browser = 'Browser'
    if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome'
    else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari'
    else if (/edg/i.test(ua)) browser = 'Edge'

    return `${os} (${browser})`
  }

  // Yangi email qo'shish
  const addEmail = useCallback((inputEmail) => {
    const trimmed = inputEmail?.trim().toLowerCase()
    if (!trimmed) return { success: false, error: 'empty' }

    // Email formatini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      return { success: false, error: 'invalid' }
    }

    const now = new Date()
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const newRecord = {
      id: Date.now().toString(),
      email: trimmed,
      date: formattedDate,
      device: getDeviceInfo(),
      status: 'Active'
    }

    setEmails(prev => {
      // Agar email avval ro'yxatda bo'lsa, uni boshiga chiqaramiz
      const filtered = prev.filter(item => item.email.toLowerCase() !== trimmed)
      return [newRecord, ...filtered]
    })

    try {
      localStorage.setItem(CURRENT_USER_EMAIL_KEY, trimmed)
      setCurrentEmail(trimmed)
    } catch (e) {
      console.warn('LocalStorage error:', e)
    }

    return { success: true, email: trimmed }
  }, [])

  // Emailni o'chirish
  const deleteEmail = useCallback((id) => {
    setEmails(prev => prev.filter(item => item.id !== id))
  }, [])

  // Barcha ma'lumotlarni CSV / Excel sifatida yuklab olish
  const exportToCsv = useCallback(() => {
    if (emails.length === 0) return

    const headers = ['№', 'Email', 'Kirgan vaqti', 'Qurilma / Tizim', 'Holati']
    const rows = emails.map((item, idx) => [
      idx + 1,
      `"${item.email}"`,
      `"${item.date}"`,
      `"${item.device}"`,
      `"${item.status}"`
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `muhayyo_foydalanuvchilar_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [emails])

  return {
    emails,
    addEmail,
    deleteEmail,
    exportToCsv,
    currentEmail,
    hasSubmittedEmail: Boolean(currentEmail)
  }
}

export default useVisitorEmails
