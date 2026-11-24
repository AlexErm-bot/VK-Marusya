import type { Movie } from '@/types'
import { getRatingColor } from '@/utils/rating'
import Like from '@/assets/icons/like-icon.svg?react'
import LikeFull from '@/assets/icons/likeFull-icon.svg?react'
import styles from './MoviePage.module.scss'
import Star from '@/assets/icons/star-icon.svg?react'
import { formatRating } from '@/utils/rating'
import { formatTime } from '@/utils/time'
import { useTrailerModal } from '@/features/ui/hooks/useTrailerModal'

interface Props {
  movie: Movie
  onToggleFavorite?: (e: React.MouseEvent) => void
  isFavorite?: boolean
}

export const MoviePageView = ({
  movie,
  onToggleFavorite,
  isFavorite = false,
}: Props) => {
  const ratingColor = getRatingColor(movie.tmdbRating)
  const runtime = formatTime(movie.runtime)
  const { open } = useTrailerModal()

  return (
    <section className={styles.section}>
      <div className={styles.movie}>
        <div className={styles.left}>
          <div className={styles.info}>
            <div className={styles.preface}>
              <span className={`${styles.rating} ${styles[ratingColor]}`}>
                <Star className={styles.star} />
                {formatRating(movie.tmdbRating)}</span>
              <span className={styles.year}>{movie.releaseYear}</span>
              <span className={styles.genres}>{movie.genres.join(', ')}</span>
              {movie.runtime ? (
                <span className={styles.runtime}>{runtime}</span>
              ) : null}
            </div>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.plot}>{movie.plot}</p>
          </div>
          <div className={styles.buttons}>
            <button 
              type="button" 
              className="primary"
              onClick={() => open(movie.trailerUrl, movie.title)}
            >
              Трейлер
            </button>
            <button
              type="button"
              className="iconBtn"
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              aria-pressed={isFavorite}
            >
              {isFavorite ? <LikeFull /> : <Like />}
            </button>
          </div>
        </div>
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className={styles.poster}
          />
        ) : null}
      </div>
    </section>
  )
}