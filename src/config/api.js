/**
 * API configuration module
 * Loads backend URL safely from Vite environment variables (.env)
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://music-l8kd.onrender.com').replace(/\/+$/, '')

export const API_ENDPOINTS = {
  SONGS: `${API_BASE_URL}/api/songs`,
  GENRES: `${API_BASE_URL}/api/genres`,
  PLAY_COUNT: (id) => `${API_BASE_URL}/api/songs/${id}/play`,
  LIKE_SONG: (id) => `${API_BASE_URL}/api/songs/${id}/like`,
}

// Curated high quality album covers mapped by genre for fallback
export const GENRE_COVERS = {
  'Lo-Fi': 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
  'Electronic': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  'Chill': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  'Ethno': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
  'Jazz': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80',
  'Pop': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
  'Rock': 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80',
  'Default': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
}

/**
 * Helper to obtain a reliable cover art image URL
 */
export const getCoverImage = (song) => {
  if (!song) return GENRE_COVERS.Default
  if (song.cover_url && !song.cover_url.includes('default-cover.svg')) {
    if (song.cover_url.startsWith('http://') || song.cover_url.startsWith('https://')) {
      return song.cover_url
    }
    return `${API_BASE_URL}${song.cover_url.startsWith('/') ? '' : '/'}${song.cover_url}`
  }
  return GENRE_COVERS[song.genre] || GENRE_COVERS.Default
}
