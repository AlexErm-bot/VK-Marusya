import Skeleton from 'react-loading-skeleton'
import styles from './Skeletons.module.scss'

interface Props {
  count?: number
}

export const GenresSkeleton = ({ count = 8 }: Props) => {
  return (
    <ul className={styles.genresList}>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className={styles.genresItem}>
          <div className={styles.genresLink}>
            <Skeleton height={220} borderRadius={0} />
            <div className={styles.genresName}>
              <Skeleton width="60%" height={32} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}