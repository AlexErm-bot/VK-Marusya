import type { Movie } from '@/types'
import { useAppSelector } from '@/app/hooks'
import { getRatingColor } from '@/utils/rating'
import Like from '@/assets/icons/like-icon.svg?react'
import LikeFull from '@/assets/icons/likeFull-icon.svg?react'
import Reload from '@/assets/icons/reload-icon.svg?react'
import styles from './RandomMovieView.module.scss'
import Star from '@/assets/icons/star-icon.svg?react'
import { formatRating } from '@/utils/rating'
import { formatTime } from '@/utils/time'
import { Link } from 'react-router-dom';
import { useTrailerModal } from '@/features/ui/hooks/useTrailerModal';
import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '@/app/api/favoritesApi'
import { useAuthModal } from '@/features/ui/hooks/useAuthModal'

interface Props {
  movie: Movie
  onReload?: () => void
}

export const RandomMovieView = ({
  movie,
  onReload,
}: Props) => {
  const ratingColor = getRatingColor(movie.tmdbRating)
  const { open } = useTrailerModal()
  const { open: openAuth } = useAuthModal()
  const runtime = formatTime(movie.runtime)

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)


  const { data: favorites = [] } = useGetFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  })
  const [addFavorite] = useAddFavoriteMutation()
  const [removeFavorite] = useRemoveFavoriteMutation()

  const movieId = String(movie.id)
  const isFavorite = favorites.some((f) => String(f.id) === movieId)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isFavorite) {
      removeFavorite(movieId)
    } else {
      addFavorite(movie)
    }
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuth('login');
    } else {
      handleToggleFavorite(e);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.movie}>
        <div className={styles.left}>
          <div className={styles.info}>
            <div className={styles.preface}>
              <span className={`${styles.rating} ${styles[ratingColor]}`}>
                <Star className={styles.star} />
                {formatRating(movie.tmdbRating)}</span>
              <span className={styles.year}>
                {movie.releaseYear}</span>
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
            onClick={() => open(movie.trailerUrl, movie.title)}>
              Трейлер
            </button>
            <Link to={`/movie/${movie.id}`} className="secondary">
              О фильме
            </Link>
            <button
              type="button"
              className="iconBtn"
              onClick={handleLikeClick}
              aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              aria-pressed={isFavorite}
            >
              {isFavorite ? <LikeFull /> : <Like />}
            </button>
            <button
              type="button"
              className="iconBtn"
              onClick={onReload}
              aria-label="Показать другой фильм"
            >
              <Reload />
            </button>
          </div>
        </div>
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className={styles.poster}
          />) : null}
      </div>
    </section>
  )
}