import { useParams } from 'react-router-dom';
import { useGetMovieByIdQuery } from '@/app/api/moviesApi';
import { MoviePageView } from './MoviePageView';
import { useAuthModal } from '@/features/ui/hooks/useAuthModal';
import { useFavorite } from '@/features/favorites/hooks/useFavorite';
import styles from './MoviePage.module.scss';
import { MoviePageInfo } from './MoviePageInfo';
import { MovieSkeleton } from '@/components/skeletons/MovieSkeleton';

export const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const { open } = useAuthModal();

  const { data: movie, isLoading, isError } = useGetMovieByIdQuery(id!);

  const { isFavorite, toggleFavorite, isAuthenticated } = useFavorite(movie);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      open('login');
    } else {
      toggleFavorite(e);
    }
  };

  if (isLoading) return <MovieSkeleton />;
  if (isError || !movie) return <p className="status">Фильм не найден</p>;

  return (
    <div className={styles.page}>
      <MoviePageView
        movie={movie}
        isFavorite={isFavorite}
        onToggleFavorite={handleLikeClick}
      />
      <MoviePageInfo movie={movie} />
    </div>
  );
};