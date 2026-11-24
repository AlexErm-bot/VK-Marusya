import type { Movie } from '@/types'
import styles from './Top10View.module.scss'

interface Props {
  top10: Movie[]
}

export const Top10View = ({ top10 }: Props) => {
  return (
    <section>
      <h2 className={styles.title}>Топ 10 фильмов</h2>
      <div className={styles.slider}>
        {top10.map((item, index) => (
          <div className={styles.item} key={item.id}>
            <a href={`/movie/${item.id}`} className={styles.link}>
              <span className={styles.rank}>{index + 1}</span>
              {item.posterUrl ? (
                <img src={item.posterUrl} alt={item.title} className={styles.img} />
              ) : (
                <div className={styles.placeholder}>{item.title}</div>
              )}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}