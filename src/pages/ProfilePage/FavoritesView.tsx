import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '@/app/api/favoritesApi'
import styles from '../HomePage/Top10View.module.scss'
import { Link } from 'react-router-dom'
import Close from '@/assets/icons/closeSmall-icon.svg?react'
import { MoviesSkeleton } from '@/components/skeletons'

export const FavoritesView = () => {
  const { data: favorites = [], isLoading, isError } = useGetFavoritesQuery()
  const [removeFavorite, { isLoading: isRemoving }] = useRemoveFavoriteMutation()

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()

    try {
      await removeFavorite(String(id)).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении из избранного:', err)
    }
  }

  if (isLoading) return <MoviesSkeleton count={2}/>
  if (isError) return <p className='status'>Ошибка загрузки</p>

  if (favorites.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Вы пока не добавили ни одного фильма в избранное.</p>
      </div>
    )
  }

  return (
    <div className={styles.slider}>
      {favorites.map((movie) => (
        <div className={styles.item} key={movie.id}>
          <Link to={`/movie/${movie.id}`} className={styles.link}>
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className={styles.img} />
            ) : (
              <span className={styles.placeholder}>{movie.title}</span>
            )}
            <button
              type="button"
              className={styles.removeBtn}
              onClick={(e) => handleRemove(e, movie.id)}
              disabled={isRemoving}
              aria-label="Удалить из избранного"
            >
              <Close />
            </button>
          </Link>
        </div>
      ))}
    </div>
  )
}