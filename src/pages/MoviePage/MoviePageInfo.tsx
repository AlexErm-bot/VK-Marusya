import type { Movie } from "@/types";
import styles from './MoviePage.module.scss'
import { getLanguageName } from "@/utils/languages";
import { getMoney } from "@/utils/money";
import { getStatus } from "@/utils/status";


interface Props {
    movie: Movie;
}

export const MoviePageInfo = ({ movie }: Props) => {
    const rawLanguage = getLanguageName(movie.language) ?? "";
    const language = rawLanguage.charAt(0).toUpperCase() + rawLanguage.slice(1);
    return (
        <section className={styles.section}>
            <h2 className={styles.aboutFilm}>О фильме</h2>
            <ul className={styles.list}>
                <li className={styles.item}>
                    <span className={styles.label}>Язык оригинала</span>
                    <span className={styles.value}>{language || '—'}</span>
                </li>

                <li className={styles.item}>
                    <span className={styles.label}>Оригинальное название</span>
                    <span className={styles.value}>{movie.originalTitle || '—'}</span>
                </li>

                <li className={styles.item}>
                    <span className={styles.label}>Бюджет</span>
                    <span className={styles.value}>
                        {getMoney(movie.budget)}
                    </span>
                </li>

                <li className={styles.item}>
                    <span className={styles.label}>Выручка</span>
                    <span className={styles.value}>
                        {getMoney(movie.revenue)}
                    </span>
                </li>

                <li className={styles.item}>
                    <span className={styles.label}>Режиссёр</span>
                    <span className={styles.value}>{movie.director || '—'}</span>
                </li>

                <li className={styles.item}>
                    <span className={styles.label}>Продакшен</span>
                    <span className={styles.value}>{movie.production || '—'}</span>
                </li>

                <li className={styles.item}>
                    <span className={styles.label}>Статус</span>
                    <span className={styles.value}>{getStatus(movie.status)}</span>
                </li>

                <li className={styles.item}>
                    <span className={styles.label}>Награды</span>
                    <span className={styles.value}>{movie.awardsSummary || '—'}</span>
                </li>

            </ul>
        </section>
    )
}