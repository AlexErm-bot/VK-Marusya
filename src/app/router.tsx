import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/mainLayout/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { GenresPage } from '@/pages/GenresPage'
import { GenrePage } from '@/pages/GenrePage';
import { MoviePage } from '@/pages/MoviePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'genres', element: <GenresPage /> },
      { path: 'genres/:genreName', element: <GenrePage /> },
      { path: 'movie/:id', element: <MoviePage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },

    ],
  },
])