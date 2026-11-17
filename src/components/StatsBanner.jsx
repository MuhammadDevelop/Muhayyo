import React from 'react'
import {
  FaShieldHalved,
  FaPlay
} from 'react-icons/fa6'
import useTranslate from '../hooks/useTranslate'

export const StatsBanner = ({ totalSongs, onPlayFirst, currentSong, isPlaying }) => {
  const { t } = useTranslate()

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white shadow-2xl shadow-emerald-500/20 mb-8">
      {/* Decorative background glow circles */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20">
            <FaShieldHalved className="text-emerald-200" />
            <span>{t('stats.secureBadge')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            {t('stats.heading')}
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {t('stats.description')}
          </p>
        </div>

        {/* Action Button & Quick Stat */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <span className="block text-2xl font-black">{totalSongs || 0}</span>
            <span className="text-xs text-emerald-100 font-medium">{t('stats.availableTracks')}</span>
          </div>

          <button
            onClick={onPlayFirst}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-emerald-950 font-bold text-sm shadow-xl hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <FaPlay className="text-emerald-600" />
            <span>{isPlaying ? t('stats.nowPlaying') : t('stats.listenNow')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatsBanner
