import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { openAuthModal, closeAuthModal, switchAuthMode } from '../uiSlice'
import type { AuthMode } from '../uiSlice'

export const useAuthModal = () => {
  const dispatch = useAppDispatch()
  const { isOpen, mode } = useAppSelector((state) => state.ui.authModal)

  return {
    isOpen,
    mode,
    open: (mode: AuthMode = 'login') => dispatch(openAuthModal(mode)),
    close: () => dispatch(closeAuthModal()),
    switchMode: (mode: AuthMode) => dispatch(switchAuthMode(mode)),
  }
}