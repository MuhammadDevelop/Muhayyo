import React from 'react'
import {
  FaLayerGroup,
  FaHeadphones,
  FaBolt,
  FaHeart,
  FaGuitar,
  FaEarthAmericas,
  FaCompactDisc,
  FaMusic
} from 'react-icons/fa6'
import useTranslate from '../hooks/useTranslate'

const GENRE_ICONS = {
  All: <FaLayerGroup className="w-3.5 h-3.5" />,
  'Lo-Fi': <FaHeadphones className="w-3.5 h-3.5" />,
  'Electronic': <FaBolt className="w-3.5 h-3.5" />,
  'Pop': <FaHeart className="w-3.5 h-3.5" />,
  'Rock': <FaGuitar className="w-3.5 h-3.5" />,
  'Ethno': <FaEarthAmericas className="w-3.5 h-3.5" />,
  'Jazz': <FaCompactDisc className="w-3.5 h-3.5" />,
  'Chill': <FaHeadphones className="w-3.5 h-3.5" />
}

export const GenreFilter = ({ genres = [], selectedGenre, onSelectGenre }) => {
  const { t } = useTranslate()

  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {genres.map((genre) => {
          const isSelected = selectedGenre === genre
          const translatedGenre = t(`genres.${genre}`) || genre

          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 scale-105 border border-emerald-400/30'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{GENRE_ICONS[genre] || <FaMusic className="w-3.5 h-3.5" />}</span>
              <span>{translatedGenre}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default GenreFilter
