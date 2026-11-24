import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useGetProfileQuery } from '@/app/api/authApi'
import { useAppDispatch } from '@/app/hooks'
import { setCredentials, finishInitialization } from '@/features/auth/authSlice'
import { router } from '@/app/router'
import { AuthModal } from '@/features/auth/components/AuthModal'
import { TrailerModal } from '@/features/ui/components/TrailerModal'
import { useTrailerModal } from '@/features/ui/hooks/useTrailerModal'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const App = () => {
  const dispatch = useAppDispatch()
  
  const { data: user, isLoading, isError, isSuccess } = useGetProfileQuery()
  
  const { isOpen, url, title, close } = useTrailerModal()

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setCredentials({ user }))
    } else if (isError) {
      dispatch(finishInitialization())
    }
  }, [user, isSuccess, isError, dispatch])

  if (isLoading || (!isSuccess && !isError)) {
    return (
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <p className='status'>Загрузка...</p>
      </SkeletonTheme>
    )
  }

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <RouterProvider router={router} />
      <TrailerModal
        isOpen={isOpen}
        onClose={close}
        trailerUrl={url}
        title={title}
      />
      <AuthModal />
    </SkeletonTheme>
  )
}