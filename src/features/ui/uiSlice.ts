import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type AuthMode = 'login' | 'register' | 'success'

interface UiState {
  authModal: {
    isOpen: boolean
    mode: AuthMode
  },
  trailerModal: {
    isOpen: boolean;
    url: string | null;
    title: string | null;
  }
}

const initialState: UiState = {
  authModal: {
    isOpen: false,
    mode: 'login',
  },
  trailerModal: { isOpen: false, url: null, title: null },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<AuthMode | undefined>) => {
      state.authModal.isOpen = true
      state.authModal.mode = action.payload ?? 'login'
    },
    closeAuthModal: (state) => {
      state.authModal.isOpen = false
    },
    switchAuthMode: (state, action: PayloadAction<AuthMode>) => {
      state.authModal.mode = action.payload
    },
    openTrailerModal: (state, action) => {
      state.trailerModal = { isOpen: true, url: action.payload.url, title: action.payload.title };
    },
    closeTrailerModal: (state) => {
      state.trailerModal.isOpen = false;
    },
  }
})

export const { openAuthModal, closeAuthModal, switchAuthMode, openTrailerModal, closeTrailerModal } = uiSlice.actions
export default uiSlice.reducer