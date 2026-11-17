import React from 'react'
import {
  FaPlay,
  FaPause,
  FaBackwardStep,
  FaForwardStep,
  FaRepeat,
  FaShuffle,
  FaVolumeHigh,
  FaVolumeLow,
  FaVolumeXmark,
  FaHeart,
  FaRegHeart,
  FaCircleInfo
} from 'react-icons/fa6'
import { getCoverImage } from '../config/api'
import useTranslate from '../hooks/useTranslate'

/**
 * Sticky Bottom Audio Player Bar
 * Features luminous, bright buttons for Previous, Next, Play/Pause,
 * seek bar, volume control, and track metadata.
 */
export const AudioPlayerBar = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  progressPercent,
  volume,
  isMuted,
  isLoop,
  isShuffle,
  isLiked,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onSetVolume,
  onToggleMute,
  onToggleLoop,
  onToggleShuffle,
  onToggleLike,
  onShowDetail,
  formatTime
}) => {
  const { t } = useTranslate()

  if (!currentSong) return null

  const coverUrl = getCoverImage(currentSong)
  const genreDisplay = currentSong.genre ? (t(`genres.${currentSong.genre}`) || currentSong.genre) : t('common.music')

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] transition-all duration-300">
      
      {/* Top progress seek line */}
      <div className="relative w-full group py-1 -mt-1 cursor-pointer">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime || 0}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute inset-0 w-full h-1.5 opacity-0 cursor-pointer z-10"
        />
        {/* Visual progress bar background */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-150 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md shadow-emerald-500/50 scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Track Information */}
        <div className="flex items-center gap-3 w-full md:w-1/4 min-w-0 justify-between md:justify-start">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative group/art flex-shrink-0 cursor-pointer" onClick={() => onShowDetail(currentSong)}>
              <img
                src={coverUrl}
                alt={currentSong.title}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-lg border border-slate-200 dark:border-slate-700/60"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/art:opacity-100 flex items-center justify-center transition-opacity text-white text-xs">
                <FaCircleInfo />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4
                  onClick={() => onShowDetail(currentSong)}
                  className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate cursor-pointer hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                >
                  {currentSong.title}
                </h4>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {genreDisplay}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Like Heart Button */}
          <button
            onClick={() => onToggleLike(currentSong)}
            className={`p-2 rounded-xl transition-all active:scale-125 ${
              isLiked
                ? 'text-rose-500 bg-rose-500/10'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isLiked ? t('player.removeFromFavorites') : t('player.addToFavorites')}
            aria-label={isLiked ? t('player.removeFromFavorites') : t('player.addToFavorites')}
          >
            {isLiked ? (
              <FaHeart className="w-5 h-5 fill-rose-500" />
            ) : (
              <FaRegHeart className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Center: Vibrant Control Buttons (Bright, Glowing) */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Shuffle */}
            <button
              onClick={onToggleShuffle}
              className={`p-2.5 rounded-xl transition-all ${
                isShuffle
                  ? 'text-cyan-400 bg-cyan-500/20 shadow-inner'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={isShuffle ? t('player.shuffleActive') : t('player.shuffle')}
              aria-label={isShuffle ? t('player.shuffleActive') : t('player.shuffle')}
            >
              <FaShuffle className="w-4 h-4" />
            </button>

            {/* PREVIOUS BUTTON (ORTGA) - YORQIN CYAN/TEAL TUGMA */}
            <button
              onClick={onPrev}
              className="group relative p-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-white shadow-lg shadow-cyan-500/35 hover:shadow-cyan-400/70 hover:scale-110 active:scale-95 transition-all duration-200 border border-cyan-300/40"
              title={t('player.prev')}
              aria-label={t('player.prev')}
            >
              <FaBackwardStep className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-md group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* PLAY / PAUSE BUTTON (TO'XTATISH VA DAVOM ETISH) - YORQIN NEON GLOW TUGMA */}
            <button
              onClick={() => onTogglePlay()}
              className={`relative p-4 rounded-full text-slate-950 transition-all duration-300 transform hover:scale-110 active:scale-90 border-2 border-white/60 ${
                isPlaying
                  ? 'bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-300 shadow-[0_0_25px_rgba(16,185,129,0.7)] animate-pulse'
                  : 'bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]'
              }`}
              title={isPlaying ? t('player.pause') : t('player.play')}
              aria-label={isPlaying ? t('player.pause') : t('player.play')}
            >
              {isPlaying ? (
                <FaPause className="w-6 h-6 text-slate-950 drop-shadow" />
              ) : (
                <FaPlay className="w-6 h-6 ml-0.5 text-slate-950 drop-shadow" />
              )}
            </button>

            {/* NEXT BUTTON (OLDINGA) - YORQIN PURPLE/PINK TUGMA */}
            <button
              onClick={onNext}
              className="group relative p-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/35 hover:shadow-purple-400/70 hover:scale-110 active:scale-95 transition-all duration-200 border border-pink-300/40"
              title={t('player.next')}
              aria-label={t('player.next')}
            >
              <FaForwardStep className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-md group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Repeat/Loop */}
            <button
              onClick={onToggleLoop}
              className={`p-2.5 rounded-xl transition-all ${
                isLoop
                  ? 'text-emerald-400 bg-emerald-500/20 shadow-inner'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={isLoop ? t('player.repeatActive') : t('player.repeat')}
              aria-label={isLoop ? t('player.repeatActive') : t('player.repeat')}
            >
              <FaRepeat className="w-4 h-4" />
            </button>
          </div>

          {/* Time Scrubber Display */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 w-full max-w-xs justify-center">
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {formatTime(currentTime)}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume & Extra Controls */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
            title={isMuted ? t('player.unmute') : t('player.mute')}
            aria-label={isMuted ? t('player.unmute') : t('player.mute')}
          >
            {isMuted || volume === 0 ? (
              <FaVolumeXmark className="w-5 h-5 text-rose-400" />
            ) : volume < 0.5 ? (
              <FaVolumeLow className="w-5 h-5" />
            ) : (
              <FaVolumeHigh className="w-5 h-5 text-emerald-400" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onSetVolume(Number(e.target.value))}
            className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            title={t('player.volume', { percent: Math.round((isMuted ? 0 : volume) * 100) })}
          />
        </div>

      </div>
    </div>
  )
}

export default AudioPlayerBar
