import React from 'react'
import SongCard from './SongCard'
import {
  FaSliders,
  FaMusic,
  FaArrowRotateRight
} from 'react-icons/fa6'
import useTranslate from '../hooks/useTranslate'

export const SongList = ({
  songs = [],
  loading,
  currentSong,
  isPlaying,
  likedSongIds = [],
  sortBy,
  setSortBy,
  onPlay,
  onTogglePlay,
  onToggleLike,
  onShowDetail,
  onRefresh
}) => {
  const { t } = useTranslate()

  return (
    <div className="space-y-6">
      {/* Top Header of Songs Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FaMusic className="text-emerald-500 text-lg" />
            <span>{t('songList.title')}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {t('songList.count', { count: songs.length })}
            </span>
          </h3>
        </div>

        {/* Right Sort & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <FaSliders className="text-emerald-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200"
            >
              <option value="default" className="dark:bg-slate-900">{t('songList.sortDefault')}</option>
              <option value="plays" className="dark:bg-slate-900">{t('songList.sortPlays')}</option>
              <option value="title" className="dark:bg-slate-900">{t('songList.sortTitle')}</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-emerald-500 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition shadow-sm"
            title={t('songList.reload')}
            aria-label={t('songList.reload')}
          >
            <FaArrowRotateRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-4 bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 animate-pulse space-y-3"
            >
              <div className="aspect-square w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && songs.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-100/50 dark:bg-slate-900/30 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <FaMusic className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {t('songList.emptyTitle')}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            {t('songList.emptyDesc')}
          </p>
        </div>
      )}

      {/* Songs Grid */}
      {!loading && songs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {songs.map((song, index) => {
            const isCurrent = currentSong?.id === song.id
            const isLiked = likedSongIds.includes(song.id)

            return (
              <SongCard
                key={song.id}
                song={song}
                index={index}
                isCurrent={isCurrent}
                isPlaying={isPlaying}
                isLiked={isLiked}
                onPlay={onPlay}
                onTogglePlay={onTogglePlay}
                onToggleLike={onToggleLike}
                onShowDetail={onShowDetail}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SongList
