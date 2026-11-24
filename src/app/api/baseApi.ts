import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { RootState } from '@/app/store'
import { logout } from '@/features/auth/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'https://cinemaguide.skillbox.cc',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  const url = typeof args === 'string' ? args : args.url;
  
  const isAuthEndpoint = 
    url.includes('/auth/login') || 
    url.includes('/auth/register') ||
    url.includes('/profile') || 
    url.includes('/user')       

  if (result.error && result.error.status === 401 && !isAuthEndpoint) {
    api.dispatch(logout())
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Favorites', 'Movies'],
  endpoints: () => ({}),
})