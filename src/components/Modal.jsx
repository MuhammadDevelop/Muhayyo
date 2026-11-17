import React, { useEffect } from 'react'
import {
  FaCheck,
  FaTriangleExclamation,
  FaCircleInfo,
  FaXmark,
  FaMusic,
  FaHeart,
  FaHeadphones
} from 'react-icons/fa6'
import { getCoverImage } from '../config/api'
import useTranslate from '../hooks/useTranslate'

/**
 * Reusable Animated Modal Component
 * Replaces native alert() with modern, beautiful popups.
 */
export const Modal = ({
  isOpen,
  type = 'info',
  title = '',
  message = '',
  data = null,
  confirmText,
  cancelText,
  showCancel = false,
  onConfirm,
  onCancel,
  onClose
}) => {
  const { t } = useTranslate()

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const resolvedConfirmText = confirmText || t('common.understand')
  const resolvedCancelText = cancelText || t('common.cancel')

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheck className="w-6 h-6 text-emerald-400" />,
          badgeBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
          btnBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25',
          borderAccent: 'border-emerald-500/40'
        }
      case 'error':
        return {
          icon: <FaXmark className="w-6 h-6 text-rose-400" />,
          badgeBg: 'bg-rose-500/20 border-rose-500/30 text-rose-400',
          btnBg: 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-lg shadow-rose-500/25',
          borderAccent: 'border-rose-500/40'
        }
      case 'warning':
        return {
          icon: <FaTriangleExclamation className="w-6 h-6 text-amber-400" />,
          badgeBg: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
          btnBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/25',
          borderAccent: 'border-amber-500/40'
        }
      case 'song':
        return {
          icon: <FaMusic className="w-6 h-6 text-cyan-400" />,
          badgeBg: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
          btnBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25',
          borderAccent: 'border-cyan-500/40'
        }
      case 'info':
      default:
        return {
          icon: <FaCircleInfo className="w-6 h-6 text-blue-400" />,
          badgeBg: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
          btnBg: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25',
          borderAccent: 'border-blue-500/40'
        }
    }
  }

  const { icon, badgeBg, btnBg, borderAccent } = getIconAndColors()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-fadeIn"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-3xl border ${borderAccent} bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl transition-all transform scale-100 p-6 md:p-8 animate-scaleUp`}
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label={t('common.close')}
        >
          <FaXmark className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-2xl border ${badgeBg} shadow-inner flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
            {type !== 'song' && message && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Custom Song details view if type is 'song' */}
        {type === 'song' && data && (
          <div className="my-5 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={getCoverImage(data)}
                alt={data.title}
                className="w-16 h-16 rounded-xl object-cover shadow-md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {data.title}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                  {t('modal.artist')} <span className="font-medium text-slate-800 dark:text-slate-200">{data.artist}</span>
                </p>
                <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {data.genre ? (t(`genres.${data.genre}`) || data.genre) : t('common.music')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/50 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <FaHeadphones className="text-indigo-400" />
                <span>{t('modal.playCount')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('common.playsCount', { count: data.plays || 0 })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <FaHeart className="text-rose-400" />
                <span>{t('modal.likes')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('common.likesCount', { count: data.likes || 0 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6">
          {showCancel && (
            <button
              onClick={() => {
                onCancel?.()
                onClose?.()
              }}
              className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {resolvedCancelText}
            </button>
          )}

          <button
            onClick={() => {
              onConfirm?.()
              onClose?.()
            }}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${btnBg}`}
          >
            {resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
