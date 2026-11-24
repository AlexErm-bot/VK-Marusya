import { Link } from 'react-router-dom';
import styles from './GenresPage.module.scss';
import { capitalize } from '@/utils/format';

interface Props {
  genres: string[];
}

export const GenresPageView = ({ genres }: Props) => {
  return (
    <section>
      <h2 className={styles.title}>Жанры фильмов</h2>
      <ul className={styles.list}>
        {genres.map((genre) => (
          <li className={styles.item} key={genre}>
            <Link
              to={`/genres/${encodeURIComponent(genre)}`}
              className={styles.link}
            >
                <img
                  className={styles.img}
                  src={new URL(`../../assets/images/${genre}.jpg`, import.meta.url).href}
                  alt={genre}
                />
              <span className={styles.name}>{capitalize(genre)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};