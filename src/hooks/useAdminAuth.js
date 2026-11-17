import { useState, useCallback } from 'react'

const ADMIN_STORAGE_KEY = 'muhayyo_admin_session'

// Talab qilingan login va parol
const VALID_USERNAME = 'Muhammad'
const VALID_PASSWORDS = ['Muhammad 02', 'Muhammad02']

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const [authError, setAuthError] = useState('')

  // Login funksiyasi
  const login = useCallback((username, password) => {
    const trimmedUser = username?.trim()
    const trimmedPass = password?.trim()

    if (
      trimmedUser === VALID_USERNAME &&
      VALID_PASSWORDS.includes(trimmedPass)
    ) {
      setIsAdmin(true)
      setAuthError('')
      try {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true')
      } catch (e) {
        console.warn('SessionStorage error:', e)
      }
      return { success: true }
    }

    setAuthError('errorWrongAuth')
    return { success: false, error: 'errorWrongAuth' }
  }, [])

  // Logout funksiyasi
  const logout = useCallback(() => {
    setIsAdmin(false)
    setAuthError('')
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY)
    } catch (e) {
      console.warn('SessionStorage error:', e)
    }
  }, [])

  return {
    isAdmin,
    adminUser: isAdmin ? VALID_USERNAME : null,
    login,
    logout,
    authError,
    clearError: () => setAuthError('')
  }
}

export default useAdminAuth
