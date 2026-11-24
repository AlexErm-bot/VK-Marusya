import { baseApi } from './baseApi'
import type { Movie, MovieFilters } from '@/types'

export const moviesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query<Movie[], MovieFilters | void>({
      query: (filters) => ({
        url: '/movie',
        params: filters ?? undefined,
      }),

      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const { page, ...rest } = queryArgs ?? {};
        return `${endpointName}-${JSON.stringify(rest)}`;
      },

      merge: (currentCache, newItems) => {
        const ids = new Set(currentCache.map((m) => m.id));
        currentCache.push(...newItems.filter((m) => !ids.has(m.id)));
      },

      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ['Movies'],
    }),

    getTop10: builder.query<Movie[], void>({
      query: () => '/movie/top10',
      providesTags: ['Movies'],
    }),

    getGenres: builder.query<string[], void>({
      query: () => '/movie/genres',
      providesTags: ['Movies'],
    }),

    getMovieById: builder.query<Movie, string | number>({
      query: (id) => `/movie/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Movies', id }],
    }),

    getRandomMovie: builder.query<Movie, void>({
      query: () => '/movie/random',
    }),

    searchMovies: builder.query<Movie[], string>({
      query: (title) => ({
        url: '/movie',
        params: { title, count: 5 },
      }),
      providesTags: ['Movies'],
    }),
  }),
})

export const {
  useGetMoviesQuery,
  useGetTop10Query,
  useGetGenresQuery,
  useGetMovieByIdQuery,
  useGetRandomMovieQuery,
  useSearchMoviesQuery
} = moviesApi