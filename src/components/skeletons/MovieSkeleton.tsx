import Skeleton from 'react-loading-skeleton'
import styles from './Skeletons.module.scss'

export const MovieSkeleton = () => {
  return (
    <section className={styles.bannerSection}>
      <div className={styles.bannerMovie}>
        <div className={styles.bannerLeft}>
          <div className={styles.bannerInfo}>
            <div className={styles.bannerPreface}>
              <Skeleton width={70} height={32} borderRadius={16} />
              <Skeleton width={50} height={24} />
              <Skeleton width={150} height={24} />
            </div>
            
            <div className={styles.bannerTitle}>
              <Skeleton width="90%" height={56} />
            </div>
            
            <div className={styles.bannerPlot}>
              <Skeleton count={3} height={32} style={{ marginBottom: '8px' }} />
            </div>
          </div>
          
          <div className={styles.bannerButtons}>
            <Skeleton width={150} height={56} borderRadius={28} />
            <Skeleton width={150} height={56} borderRadius={28} />
            <Skeleton width={56} height={56} circle />
            <Skeleton width={56} height={56} circle />
          </div>
        </div>
        
        <div className={styles.bannerPoster}>
          <Skeleton height={560} borderRadius={16} />
        </div>
      </div>
    </section>
  )
}