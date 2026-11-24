import { useGetRandomMovieQuery, useGetTop10Query } from '@/app/api/moviesApi'
import { RandomMovieView } from './RandomMovieView'
import { Top10View } from './Top10View'
import { useAuthModal } from '@/features/ui/hooks/useAuthModal'
import { useFavorite } from '@/features/favorites/hooks/useFavorite'
import styles from './HomePage.module.scss'
import { MoviesSkeleton } from '@/components/skeletons'
import { MovieSkeleton } from '@/components/skeletons/MovieSkeleton'

export const HomePage = () => {
  const {
    data: randomMovie,
    isLoading: isRandomLoading,
    isError: isRandomError,
    refetch: refetchRandom,
  } = useGetRandomMovieQuery()

  const {
    data: top10,
    isLoading: isTop10Loading,
    isError: isTop10Error,
  } = useGetTop10Query()

  return (
    <div className={styles.page}>
      {isRandomLoading && <MovieSkeleton />}
      {isRandomError && <div className='status'>Ошибка загрузки</div>}

      {randomMovie && (
        <RandomMovieView
          movie={randomMovie}
          onReload={() => refetchRandom()}
        />
      )}

      {isTop10Loading && <MoviesSkeleton count={10}/>}
      {isTop10Error && <div className='status'>Ошибка загрузки</div>}

      {top10 && <Top10View top10={top10} />}
    </div>
  )
}