import { useState, useEffect, useCallback } from 'react'
import { API_ENDPOINTS } from '../config/api'
import useTranslate from './useTranslate'

/**
 * Custom Hook for Music Backend API operations
 * Manages songs listing, search filtering, genre tabs, and favorite state.
 */
export const useMusicApi = ({ onNotification } = {}) => {
  const { t } = useTranslate()
  const [songs, setSongs] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default') // 'default' | 'plays' | 'title'
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Local storage for user liked songs
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('muhayyo_liked_songs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Save liked song IDs
  useEffect(() => {
    try {
      localStorage.setItem('muhayyo_liked_songs', JSON.stringify(likedSongIds))
    } catch (e) {
      console.error('LocalStorage save error:', e)
    }
  }, [likedSongIds])

  // Fetch Genres list
  useEffect(() => {
    let isMounted = true
    const fetchGenres = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GENRES)
        if (!response.ok) throw new Error(`HTTP error ${response.status}`)
        const data = await response.json()
        if (isMounted && Array.isArray(data)) {
          setGenres(['All', ...data])
        }
      } catch (err) {
        console.warn('Backend genres fetch error, using default list:', err)
        if (isMounted) {
          setGenres(['All', 'Lo-Fi', 'Electronic', 'Pop', 'Ethno', 'Jazz', 'Chill', 'Rock'])
        }
      }
    }
    fetchGenres()
    return () => { isMounted = false }
  }, [])

  // Fetch Songs list with query parameters
  useEffect(() => {
    let isMounted = true
    const fetchSongs = async () => {
      setLoading(true)
      try {
        const url = new URL(API_ENDPOINTS.SONGS)
        if (selectedGenre && selectedGenre !== 'All') {
          url.searchParams.set('genre', selectedGenre)
        }
        if (searchQuery.trim()) {
          url.searchParams.set('q', searchQuery.trim())
        }

        const response = await fetch(url.toString())
        if (!response.ok) throw new Error(`HTTP error ${response.status}`)
        const data = await response.json()

        if (isMounted) {
          let list = Array.isArray(data) ? data : []
          
          // Apply sorting if requested
          if (sortBy === 'plays') {
            list = [...list].sort((a, b) => (b.plays || 0) - (a.plays || 0))
          } else if (sortBy === 'title') {
            list = [...list].sort((a, b) => a.title.localeCompare(b.title))
          }

          setSongs(list)
          setLoading(false)
        }
      } catch (err) {
        console.error('Fetch songs error:', err)
        if (isMounted) {
          setLoading(false)
          if (onNotification) {
            onNotification({
              type: 'error',
              title: t('notifications.serverErrorTitle'),
              message: t('notifications.serverErrorMsg')
            })
          }
        }
      }
    }

    const timer = setTimeout(() => {
      fetchSongs()
    }, searchQuery ? 300 : 0) // Debounce search

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [selectedGenre, searchQuery, sortBy, refreshTrigger, onNotification, t])

  // Record a play on backend
  const recordPlay = useCallback(async (songId) => {
    if (!songId) return
    try {
      // Optimistic local update
      setSongs(prev => prev.map(s => s.id === songId ? { ...s, plays: (s.plays || 0) + 1 } : s))
      await fetch(API_ENDPOINTS.PLAY_COUNT(songId), { method: 'POST' })
    } catch (err) {
      console.warn('Record play error:', err)
    }
  }, [])

  // Toggle Like status
  const toggleLike = useCallback(async (song) => {
    if (!song?.id) return
    const isCurrentlyLiked = likedSongIds.includes(song.id)
    
    // Update local state
    if (isCurrentlyLiked) {
      setLikedSongIds(prev => prev.filter(id => id !== song.id))
      setSongs(prev => prev.map(s => s.id === song.id ? { ...s, likes: Math.max(0, (s.likes || 1) - 1) } : s))
      if (onNotification) {
        onNotification({
          type: 'info',
          title: t('notifications.removedFromFavTitle'),
          message: t('notifications.removedFromFavMsg', { title: song.title })
        })
      }
    } else {
      setLikedSongIds(prev => [...prev, song.id])
      setSongs(prev => prev.map(s => s.id === song.id ? { ...s, likes: (s.likes || 0) + 1 } : s))
      if (onNotification) {
        onNotification({
          type: 'success',
          title: t('notifications.addedToFavTitle'),
          message: t('notifications.addedToFavMsg', { title: song.title })
        })
      }
    }

    // Try sending like to backend if token/supported
    try {
      await fetch(API_ENDPOINTS.LIKE_SONG(song.id), { method: 'POST' })
    } catch {
      // Ignored for guest mode
    }
  }, [likedSongIds, onNotification, t])

  const refetch = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  return {
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
  }
}

export default useMusicApi
