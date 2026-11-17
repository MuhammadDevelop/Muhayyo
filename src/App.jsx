import React, { useEffect, useCallback } from 'react'
import useTheme from './hooks/useTheme'
import useModal from './hooks/useModal'
import useMusicApi from './hooks/useMusicApi'
import useAudioPlayer from './hooks/useAudioPlayer'
import useTranslate from './hooks/useTranslate'

import Navbar from './components/Navbar'
import StatsBanner from './components/StatsBanner'
import GenreFilter from './components/GenreFilter'
import SongList from './components/SongList'
import AudioPlayerBar from './components/AudioPlayerBar'
import Modal from './components/Modal'

export default function App() {
  const { t } = useTranslate()

  // Theme Hook (Dark / Light mode)
  const { theme, toggleTheme } = useTheme()

  // Modal Hook (Replaces alert)
  const {
    modalState,
    openModal,
    closeModal,
    showSuccess,
    showInfo,
    showError,
    showSongDetail
  } = useModal()

  // Notification dispatcher for custom hooks
  const handleNotification = useCallback((notification) => {
    openModal(notification)
  }, [openModal])

  // Music Backend API Hook
  const {
    songs,
    genres,
    selectedGenre,
    setSelectedGenre,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    loading,
    likedSongIds,
    toggleLike,
    recordPlay,
    refetch
  } = useMusicApi({ onNotification: handleNotification })

  // Audio Playback Hook
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    progressPercent,
    volume,
    isMuted,
    isLoop,
    isShuffle,
    playSong,
    togglePlay,
    advanceNext,
    advancePrev,
    seek,
    setVolumeLevel,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    formatTime
  } = useAudioPlayer({
    songs,
    onRecordPlay: recordPlay,
    onNotification: handleNotification
  })

  // Global Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        advanceNext()
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        advancePrev()
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault()
        toggleMute()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, advanceNext, advancePrev, toggleMute])

  // Open Help / Info Modal
  const handleOpenInfoModal = () => {
    openModal({
      type: 'info',
      title: t('modal.aboutTitle'),
      message: t('modal.aboutMessage'),
      confirmText: t('common.gotIt')
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenInfoModal={handleOpenInfoModal}
        likedCount={likedSongIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32">
        {/* Hero / Stats Banner */}
        <StatsBanner
          totalSongs={songs.length}
          onPlayFirst={() => {
            if (songs.length > 0) {
              if (currentSong) {
                togglePlay()
              } else {
                playSong(songs[0], 0)
              }
            }
          }}
          currentSong={currentSong}
          isPlaying={isPlaying}
        />

        {/* Genre Categories Filter */}
        <div className="mb-6">
          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />
        </div>

        {/* Songs Grid / List */}
        <SongList
          songs={songs}
          loading={loading}
          currentSong={currentSong}
          isPlaying={isPlaying}
          likedSongIds={likedSongIds}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onPlay={playSong}
          onTogglePlay={togglePlay}
          onToggleLike={toggleLike}
          onShowDetail={showSongDetail}
          onRefresh={refetch}
        />
      </main>

      {/* Persistent Bottom Audio Player Bar */}
      <AudioPlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        progressPercent={progressPercent}
        volume={volume}
        isMuted={isMuted}
        isLoop={isLoop}
        isShuffle={isShuffle}
        isLiked={currentSong ? likedSongIds.includes(currentSong.id) : false}
        onTogglePlay={togglePlay}
        onPrev={advancePrev}
        onNext={advanceNext}
        onSeek={seek}
        onSetVolume={setVolumeLevel}
        onToggleMute={toggleMute}
        onToggleLoop={toggleLoop}
        onToggleShuffle={toggleShuffle}
        onToggleLike={toggleLike}
        onShowDetail={showSongDetail}
        formatTime={formatTime}
      />

      {/* Global Notification Modal (No native alert!) */}
      <Modal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        data={modalState.data}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancel={modalState.showCancel}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        onClose={closeModal}
      />

    </div>
  )
}
