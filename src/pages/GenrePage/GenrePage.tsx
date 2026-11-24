import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetMoviesQuery } from '@/app/api/moviesApi';
import Back from '@/assets/icons/chevrone-icon.svg?react'
import styles from './GenrePage.module.scss';
import { capitalize } from '@/utils/format';
import { MoviesSkeleton } from '@/components/skeletons';

const PAGE_SIZE = 10;

export const GenrePage = () => {
    const { genreName } = useParams<{ genreName: string }>();
    const decodedName = genreName ? decodeURIComponent(genreName) : '';

    const [page, setPage] = useState(1);
    const [lastBatchLength, setLastBatchLength] = useState<number | null>(null);

    useEffect(() => {
        setPage(1);
        setLastBatchLength(null);
    }, [decodedName]);

    const {
        data: movies = [],
        isLoading,
        isFetching,
        isError,
    } = useGetMoviesQuery({
        genre: decodedName,
        page,
        count: PAGE_SIZE
    });

    useEffect(() => {
        if (!isFetching && movies.length > 0) {
            const currentBatch = movies.length - (page - 1) * PAGE_SIZE;
            setLastBatchLength(currentBatch);
        }
    }, [isFetching, movies.length, page]);

    const hasMore = lastBatchLength === PAGE_SIZE;

    if (isError) {
        return <p className="status">Ошибка загрузки</p>;
    }

    return (
        <section className={styles.section}>
            <div className={styles.head}>
                <Link to="/genres" className={styles.back}>
                    <Back />
                </Link>
                <h1 className={styles.title}>{capitalize(decodedName)}</h1>
            </div>

            {isLoading && <MoviesSkeleton count={PAGE_SIZE}/>}
            {!isLoading && !isError && movies.length === 0 && (
                <p className={styles.empty}>В этом жанре пока нет фильмов</p>
            )}
            <div className={styles.mainWrap}>
                <ul className={styles.list}>
                    {movies.map((movie) => (
                        <li className={styles.item} key={movie.id}>
                            <Link to={`/movie/${movie.id}`} className={styles.link}>
                                {movie.posterUrl ? (
                                    <img src={movie.posterUrl} alt={movie.title} className={styles.img} />
                                ) : (
                                    <span className={styles.placeholder}>{movie.title}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                {hasMore && (
                    <button
                        type="button"
                        className="primary"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={isFetching}
                    >
                        {isFetching ? 'Загрузка…' : 'Показать ещё'}
                    </button>
                )}
            </div>
        </section>
    )
}