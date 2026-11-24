import { useGetGenresQuery } from '@/app/api/moviesApi'
import styles from './GenresPage.module.scss'
import { GenresPageView } from './GenresPageView'
import { GenresSkeleton } from '@/components/skeletons'

export const GenresPage = () => {
  const {
    data: genres,
    isLoading: genresLoading,
    isError: genresError,
  } = useGetGenresQuery()

  return (
    <div className={styles.page}>
      {genresLoading && <GenresSkeleton count={8} />}
      {genresError && <div className="status">Ошибка загрузки</div>}
      {genres && <GenresPageView genres={genres} />}
    </div>
  )
}