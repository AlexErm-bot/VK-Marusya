import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { openTrailerModal, closeTrailerModal } from '../uiSlice'

export const useTrailerModal = () => {
  const dispatch = useAppDispatch()
  const { isOpen, url, title } = useAppSelector((state) => state.ui.trailerModal)

  return {
    isOpen,
    url,
    title,
    open: (url: string, title?: string) => dispatch(openTrailerModal({ url, title })),
    close: () => dispatch(closeTrailerModal()),
  }
}