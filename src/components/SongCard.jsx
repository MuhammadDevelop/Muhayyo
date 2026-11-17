import React from 'react'
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
  FaHeadphones,
  FaCircleInfo
} from 'react-icons/fa6'
import { getCoverImage } from '../config/api'
import useTranslate from '../hooks/useTranslate'

export const SongCard = ({
  song,
  index,
  isCurrent,
  isPlaying,
  isLiked,
  onPlay,
  onTogglePlay,
  onToggleLike,
  onShowDetail
}) => {
  const { t } = useTranslate()
  const coverUrl = getCoverImage(song)

  const handleCardClick = () => {
    if (isCurrent) {
      onTogglePlay()
    } else {
      onPlay(song, index)
    }
  }

  const genreDisplay = song.genre ? (t(`genres.${song.genre}`) || song.genre) : t('common.music')

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl p-3.5 transition-all duration-300 border ${
        isCurrent
          ? 'bg-gradient-to-b from-emerald-500/10 via-slate-900/40 to-slate-900/90 dark:from-emerald-500/15 dark:to-slate-900/90 border-emerald-500/50 shadow-xl shadow-emerald-500/15 scale-[1.02]'
          : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-500/5 hover:-translate-y-1'
      }`}
    >
      {/* Cover Image & Overlay */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-md">
        <img
          src={coverUrl}
          alt={song.title}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          onError={(e) => {
            // Graceful fallback to default if image fails
            e.currentTarget.src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
          }}
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Playing Sound Wave Equalizer Indicator */}
        {isCurrent && isPlaying && (
          <div className="absolute top-3 left-3 flex items-end gap-1 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
            <span className="w-1 bg-emerald-400 rounded-full animate-wave-1" />
            <span className="w-1 bg-teal-300 rounded-full animate-wave-2" />
            <span className="w-1 bg-cyan-400 rounded-full animate-wave-3" />
            <span className="w-1 bg-emerald-300 rounded-full animate-wave-4" />
          </div>
        )}

        {/* Genre Pill */}
        <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-400/30">
          {genreDisplay}
        </span>

        {/* Hover / Active Play Button Overlay */}
        <div
          onClick={handleCardClick}
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isCurrent
              ? 'opacity-100 bg-black/20'
              : 'opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px]'
          }`}
        >
          <button
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-2xl ${
              isCurrent && isPlaying
                ? 'bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-emerald-400/60 ring-4 ring-emerald-400/30'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/50 hover:shadow-emerald-400/80 hover:scale-110'
            }`}
            aria-label={isCurrent && isPlaying ? t('songCard.pause') : t('songCard.play')}
          >
            {isCurrent && isPlaying ? (
              <FaPause className="w-5 h-5" />
            ) : (
              <FaPlay className="w-5 h-5 ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Song Info Body */}
      <div className="pt-3.5 pb-1 px-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4
              onClick={handleCardClick}
              className={`font-bold text-sm sm:text-base truncate cursor-pointer transition-colors ${
                isCurrent
                  ? 'text-emerald-500 dark:text-emerald-400'
                  : 'text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400'
              }`}
            >
              {song.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              {song.artist}
            </p>
          </div>

          {/* Like Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleLike(song)
            }}
            className={`p-2 rounded-xl transition-all duration-200 active:scale-125 ${
              isLiked
                ? 'text-rose-500 bg-rose-500/10'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isLiked ? t('songCard.removeFromFavorites') : t('songCard.addToFavorites')}
            aria-label={isLiked ? t('songCard.removeFromFavorites') : t('songCard.addToFavorites')}
          >
            {isLiked ? (
              <FaHeart className="w-4 h-4 fill-rose-500 animate-scaleUp" />
            ) : (
              <FaRegHeart className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Footer Meta: Plays Count & Detail Modal Trigger */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <FaHeadphones className="text-indigo-400" />
            <span>{t('songCard.plays', { count: song.plays || 0 })}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onShowDetail(song)
            }}
            className="flex items-center gap-1 font-semibold text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
            title={t('songCard.detailsTitle')}
          >
            <FaCircleInfo className="w-3.5 h-3.5" />
            <span>{t('songCard.details')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SongCard
