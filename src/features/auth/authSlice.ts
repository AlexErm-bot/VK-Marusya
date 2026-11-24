import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean 
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token?: string }>,
    ) => {
      state.user = action.payload.user
      state.token = action.payload.token ?? null
      state.isAuthenticated = true
      state.isInitialized = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isInitialized = true
    },
    finishInitialization: (state) => {
      state.isInitialized = true
    }
  },
})

export const { setCredentials, logout, finishInitialization } = authSlice.actions
export default authSlice.reducer