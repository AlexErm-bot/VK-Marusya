import { baseApi } from './baseApi'
import type { Movie } from '@/types'

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<Movie[], void>({
      query: () => '/favorites',
      providesTags: ['Favorites'],
    }),

    addFavorite: builder.mutation<void, Movie>({
      queryFn: async (movie) => {
        const response = await fetch('https://cinemaguide.skillbox.cc/favorites', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `id=${movie.id}`,
          credentials: 'include',
        })
        if (!response.ok) {
          const errorText = await response.text()
          return { error: { status: response.status, data: errorText } }
        }

        return { data: undefined }
      },
      invalidatesTags: ['Favorites'],

      async onQueryStarted(movie, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
            if (!draft.some((m) => String(m.id) === String(movie.id))) {
              draft.push(movie)
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    }),

    removeFavorite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/favorites/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          favoritesApi.util.updateQueryData('getFavorites', undefined, (draft) => {
            const index = draft.findIndex((movie) => String(movie.id) === id)
            if (index !== -1) {
              draft.splice(index, 1)
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ['Favorites'],
    }),
  }),
})

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi