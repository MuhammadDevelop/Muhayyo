import React, { useState } from 'react'
import {
  FaEnvelope,
  FaMusic,
  FaXmark,
  FaStar,
  FaCheck
} from 'react-icons/fa6'
import useTranslate from '../hooks/useTranslate'

export const EmailCaptureModal = ({
  isOpen,
  onClose,
  onSubmitEmail
}) => {
  const { t } = useTranslate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const res = onSubmitEmail(email)
    if (res.success) {
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1200)
    } else {
      setError(t('emailModal.errorInvalid'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-fadeIn"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-cyan-500/30 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl p-6 sm:p-8 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label={t('common.close')}
        >
          <FaXmark className="w-5 h-5" />
        </button>

        {/* Icon & Glow */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3 flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl shadow-teal-500/30">
            <FaMusic className="w-8 h-8" />
            <FaStar className="absolute -top-1 -right-1 text-amber-300 w-4 h-4 animate-pulse" />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('emailModal.welcomeTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
            {t('emailModal.welcomeSubtitle')}
          </p>
        </div>

        {/* Success Message */}
        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-bold text-sm flex items-center justify-center gap-2">
            <FaCheck className="w-5 h-5" />
            <span>{t('emailModal.successMsg')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-3.5 text-slate-400 text-sm pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailModal.emailPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition shadow-inner"
                />
              </div>
              {error && (
                <p className="text-xs text-rose-500 font-medium mt-1.5 ml-1">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-teal-500/30 active:scale-98 transition duration-200"
              >
                {t('emailModal.submitBtn')}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
              >
                {t('emailModal.skipBtn')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default EmailCaptureModal
