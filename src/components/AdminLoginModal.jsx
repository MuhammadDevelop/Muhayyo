import React, { useState, useEffect } from 'react'
import {
  FaUserShield,
  FaLock,
  FaUser,
  FaXmark,
  FaArrowRightToBracket,
  FaCircleExclamation
} from 'react-icons/fa6'
import useTranslate from '../hooks/useTranslate'

export const AdminLoginModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  loginFn,
  authError,
  clearError
}) => {
  const { t } = useTranslate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Oyna yopilganda tozalash
  useEffect(() => {
    if (!isOpen) {
      setUsername('')
      setPassword('')
      clearError?.()
    }
  }, [isOpen, clearError])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const res = loginFn(username, password)
    if (res.success) {
      onLoginSuccess?.()
      onClose?.()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-fadeIn"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/30 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl p-6 sm:p-8 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label={t('common.close')}
        >
          <FaXmark className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <FaUserShield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('admin.loginTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('admin.loginSubtitle')}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5">
            <FaCircleExclamation className="w-4 h-4 flex-shrink-0" />
            <span>{t('admin.errorWrongAuth')}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.usernameLabel')}
            </label>
            <div className="relative flex items-center">
              <FaUser className="absolute left-3.5 text-slate-400 text-sm pointer-events-none" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('admin.usernamePlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.passwordLabel')}
            </label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-3.5 text-slate-400 text-sm pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.passwordPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 active:scale-98 transition duration-200"
          >
            <FaArrowRightToBracket />
            <span>{t('admin.loginBtn')}</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginModal
