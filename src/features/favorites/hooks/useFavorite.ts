import { useAppSelector } from '@/app/hooks'
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation
} from '@/app/api/favoritesApi'
import type { Movie } from '@/types'

export const useFavorite = (movie?: Movie | null) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const { data: favorites = [] } = useGetFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  })

  const [addFavorite] = useAddFavoriteMutation()
  const [removeFavorite] = useRemoveFavoriteMutation()

  const id = movie?.id
  const isFavorite = id 
    ? favorites.some((fav) => String(fav.id) === String(id)) 
    : false

  const toggleFavorite = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    if (!id || !movie) return

    try {
      if (isFavorite) {
        removeFavorite(String(id))
      } else {
        addFavorite(movie)
      }
    } catch (err) {
      console.error('Ошибка при изменении избранного:', err)
    }
  }

  return { isFavorite, toggleFavorite, isAuthenticated }
}