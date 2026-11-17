import { useState, useEffect, useRef, useCallback } from 'react'
import useTranslate from './useTranslate'

/**
 * Custom Hook for Audio Playback Management
 * Ensures a single robust Audio instance with error handling,
 * full playback controls, playlist iteration, and time formatting.
 */
export const useAudioPlayer = ({ songs = [], onRecordPlay, onNotification } = {}) => {
  const { t } = useTranslate()
  const audioRef = useRef(null)
  
  const [currentSong, setCurrentSong] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoop, setIsLoop] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  // Keep references to current state for audio event listeners
  const stateRef = useRef({
    currentSong,
    currentIndex,
    songs,
    isLoop,
    isShuffle
  })

  useEffect(() => {
    stateRef.current = {
      currentSong,
      currentIndex,
      songs,
      isLoop,
      isShuffle
    }
  }, [currentSong, currentIndex, songs, isLoop, isShuffle])

  // Initialize Audio element once
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = volume
    audioRef.current = audio

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    const handleEnded = () => {
      const { isLoop, isShuffle, currentIndex, songs } = stateRef.current
      if (isLoop) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      } else if (isShuffle && songs.length > 1) {
        let randomIndex = Math.floor(Math.random() * songs.length)
        if (randomIndex === currentIndex) {
          randomIndex = (randomIndex + 1) % songs.length
        }
        playTrackByIndex(randomIndex)
      } else {
        advanceNext()
      }
    }

    const handleError = (e) => {
      console.warn('Audio playback error:', e)
      setIsPlaying(false)
      if (onNotification) {
        onNotification({
          type: 'error',
          title: t('notifications.audioErrorTitle'),
          message: t('notifications.audioErrorMsg')
        })
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [onNotification, t])

  // Helper to start playback given an index in songs list
  const playTrackByIndex = useCallback((idx) => {
    const list = stateRef.current.songs
    if (!list || list.length === 0 || idx < 0 || idx >= list.length) return
    const targetSong = list[idx]
    const audio = audioRef.current
    if (!audio) return

    setCurrentSong(targetSong)
    setCurrentIndex(idx)
    setCurrentTime(0)

    // Set audio source (supporting audio_url or url field)
    const audioSrc = targetSong.audio_url || targetSong.url
    if (audio.src !== audioSrc) {
      audio.src = audioSrc
      audio.load()
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
          if (onRecordPlay && targetSong.id) {
            onRecordPlay(targetSong.id)
          }
        })
        .catch(err => {
          console.warn('Playback interrupted or blocked by browser policy:', err)
          setIsPlaying(false)
        })
    }
  }, [onRecordPlay])

  // Play a specific song object or find its index
  const playSong = useCallback((song, indexHint = -1) => {
    if (!song) return
    const list = stateRef.current.songs
    let foundIndex = indexHint
    if (foundIndex < 0 || list[foundIndex]?.id !== song.id) {
      foundIndex = list.findIndex(s => s.id === song.id)
    }
    if (foundIndex !== -1) {
      playTrackByIndex(foundIndex)
    } else {
      // Direct play if not in list
      const audio = audioRef.current
      if (!audio) return
      setCurrentSong(song)
      setCurrentIndex(-1)
      setCurrentTime(0)
      const src = song.audio_url || song.url
      audio.src = src
      audio.load()
      audio.play().then(() => {
        setIsPlaying(true)
        if (onRecordPlay && song.id) onRecordPlay(song.id)
      }).catch(() => setIsPlaying(false))
    }
  }, [playTrackByIndex, onRecordPlay])

  // Toggle play/pause for currently selected song or start first song
  const togglePlay = useCallback((songToToggle = null) => {
    const audio = audioRef.current
    if (!audio) return

    // If a different song was clicked
    if (songToToggle && currentSong && songToToggle.id !== currentSong.id) {
      playSong(songToToggle)
      return
    }

    // If no song is loaded yet, play the first available
    if (!currentSong) {
      const list = stateRef.current.songs
      if (list && list.length > 0) {
        playTrackByIndex(0)
      }
      return
    }

    if (audio.paused) {
      audio.play().catch(err => console.warn('Play error:', err))
    } else {
      audio.pause()
    }
  }, [currentSong, playSong, playTrackByIndex])

  // Next Track (Oldinga)
  const advanceNext = useCallback(() => {
    const { songs, currentIndex, isShuffle } = stateRef.current
    if (!songs || songs.length === 0) return

    if (isShuffle && songs.length > 1) {
      let randomIndex = Math.floor(Math.random() * songs.length)
      if (randomIndex === currentIndex) {
        randomIndex = (randomIndex + 1) % songs.length
      }
      playTrackByIndex(randomIndex)
    } else {
      const nextIndex = (currentIndex + 1) % songs.length
      playTrackByIndex(nextIndex)
    }
  }, [playTrackByIndex])

  // Previous Track (Ortga)
  const advancePrev = useCallback(() => {
    const audio = audioRef.current
    // If more than 3 seconds played, restart current song
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      audio.play().catch(() => {})
      setCurrentTime(0)
      return
    }

    const { songs, currentIndex } = stateRef.current
    if (!songs || songs.length === 0) return
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length
    playTrackByIndex(prevIndex)
  }, [playTrackByIndex])

  // Seek to position
  const seek = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio) return
    const clamped = Math.max(0, Math.min(seconds, duration || 0))
    audio.currentTime = clamped
    setCurrentTime(clamped)
  }, [duration])

  // Adjust volume
  const setVolumeLevel = useCallback((val) => {
    const audio = audioRef.current
    if (!audio) return
    const clamped = Math.max(0, Math.min(val, 1))
    audio.volume = clamped
    setVolume(clamped)
    if (clamped > 0 && isMuted) {
      audio.muted = false
      setIsMuted(false)
    }
  }, [isMuted])

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const nextMuted = !isMuted
    audio.muted = nextMuted
    setIsMuted(nextMuted)
  }, [isMuted])

  // Toggle Loop
  const toggleLoop = useCallback(() => {
    setIsLoop(prev => !prev)
  }, [])

  // Toggle Shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev)
  }, [])

  // Format seconds to mm:ss
  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [])

  return {
    currentSong,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoop,
    isShuffle,
    progressPercent: duration > 0 ? (currentTime / duration) * 100 : 0,
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
  }
}

export default useAudioPlayer
