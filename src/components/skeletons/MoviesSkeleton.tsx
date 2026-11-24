import Skeleton from 'react-loading-skeleton'
import styles from './Skeletons.module.scss'

interface Props {
  count?: number
}

export const MoviesSkeleton = ({ count = 5 }: Props) => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <Skeleton height={336} borderRadius={16} />
        </div>
      ))}
    </div>
  )
}