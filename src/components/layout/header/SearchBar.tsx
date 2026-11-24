import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Search from '@/assets/icons/search-icon.svg?react'
import CloseIcon from '@/assets/icons/closeSmall-icon.svg?react'
import Star from '@/assets/icons/star-icon.svg?react'
import { useSearchMoviesQuery } from '@/app/api/moviesApi'
import { useDebounce } from '@/utils/hooks/useDebounce'
import { formatRating, getRatingColor } from '@/utils/rating'
import { formatTime } from '@/utils/time'
import styles from './SearchBar.module.scss'

interface SearchBarProps {
  onClose?: () => void
  isMobile?: boolean
}

export const SearchBar = ({ onClose, isMobile }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)

  const { data: searchResults = [], isFetching } = useSearchMoviesQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2,
  })

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isMobile) return
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setSearchQuery('')
        setIsFocused(false) 
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile])

  const handleClose = () => {
    setSearchQuery('')
    setIsDropdownOpen(false)
    setIsFocused(false)
    onClose?.()
  }

  return (
    <div
      className={`${styles.searchWrap} ${isMobile ? styles.isMobile : ''}`}
      ref={dropdownRef}
    >
      <div className={styles.inputWrapper}>
        <Search className={styles.searchIconLeft}/>

        <input
          type="text"
          className={styles.search}
          placeholder="Поиск"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsDropdownOpen(true)
          }}
          onFocus={() => {
            setIsFocused(true)
            setIsDropdownOpen(true)
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleClose()
          }}
          autoFocus={isMobile}
        />
        {searchQuery && (
          <button type="button" className={styles.clearBtn} onClick={handleClose}>
            <CloseIcon />
          </button>
        )}
      </div>

      {isDropdownOpen && debouncedQuery.length >= 2 && (
        <div className={styles.searchDropdown}>
          {isFetching && <div className={styles.searchLoading}>Поиск...</div>}

          {!isFetching && searchResults.length === 0 && (
            <div className={styles.searchEmpty}>Ничего не найдено</div>
          )}

          <div className={styles.slider}>
            {!isFetching &&
              searchResults.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className={styles.searchItem}
                  onClick={handleClose}
                >
                  {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie.title} className={styles.searchImg} />
                  ) : (
                    <div className={styles.searchPlaseholder}>{movie.title}</div>
                  )}
                  <div className={styles.searchItemInfo}>
                    <div className={styles.searchItemInfoTop}>
                      <span
                        className={`${styles.rating} ${styles[getRatingColor(movie.tmdbRating)]}`}
                      >
                        <Star className={styles.star} />
                        {formatRating(movie.tmdbRating)}
                      </span>
                      <span className={styles.year}>{movie.releaseYear}</span>
                      <span className={styles.genres}>{movie.genres.join(', ')}</span>
                      {movie.runtime ? (
                        <span className={styles.runtime}>{formatTime(movie.runtime)}</span>
                      ) : null}
                    </div>
                    <span className={styles.searchItemTitle}>{movie.title}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}