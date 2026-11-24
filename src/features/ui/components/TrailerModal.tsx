import { useEffect, useState, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import CloseIcon from '@/assets/icons/close-icon.svg?react'
import PlayIcon from '@/assets/icons/play-icon.svg?react'
import PauseIcon from '@/assets/icons/pause-icon.svg?react'
import styles from './TrailerModal.module.scss'

interface TrailerModalProps {
  isOpen: boolean
  onClose: () => void
  trailerUrl: string | null
  title?: string | null
}

export const TrailerModal = ({ isOpen, onClose, trailerUrl, title }: TrailerModalProps) => {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showButton, setShowButton] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const playerRef = useRef<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!trailerUrl) {
      setVideoId(null)
      return
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = trailerUrl.match(regExp)

    if (match && match[2].length === 11) {
      setVideoId(match[2])
    } else {
      setVideoId(null)
    }
  }, [trailerUrl])

  useEffect(() => {
    if (!isOpen || !videoId) return

    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    const createPlayer = () => {
      if (iframeRef.current && window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (event: any) => {
              event.target.playVideo()
              setShowButton(true)
              if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
              hideTimerRef.current = setTimeout(() => setShowButton(false), 4000)
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                setIsPlaying(true)
                setShowButton(true)
                if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
                hideTimerRef.current = setTimeout(() => setShowButton(false), 4000)
              }
              if (event.data === 2 || event.data === 0) {
                setIsPlaying(false)
                setShowButton(true)
                if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
                hideTimerRef.current = setTimeout(() => setShowButton(false), 4000)
              }
            }
          }
        })
      }
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      window.onYouTubeIframeAPIReady = createPlayer
    }

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
      }
    }
  }, [isOpen, videoId])

  const handlePlayPause = () => {
    if (!playerRef.current) return

    const nextState = !isPlaying
    setIsPlaying(nextState)

    setShowButton(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setShowButton(false), 4000)

    if (nextState) {
      playerRef.current.playVideo()
    } else {
      playerRef.current.pauseVideo()
    }
  }

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handlePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isPlaying])

  if (!isOpen) return null

  const isButtonVisible = isPlaying
    ? showButton
    : (showButton || isHovering)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.trailerModal}>

        <div className={styles.header}>

        </div>

        <div className={styles.videoContainer}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            <CloseIcon />
          </button>

          <div
            className={styles.videoWrapper}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {videoId ? (
              <>
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&controls=0&rel=0&modestbranding=0&origin=${window.location.origin}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {!isPlaying && <div className={styles.pauseOverlay} />}

                <div
                  className={styles.clickOverlay}
                  onClick={handlePlayPause}
                />

                <button
                  type="button"
                  className={`${styles.controlBtn} ${!isButtonVisible ? styles.isHidden : ''}`}
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <h2 className={`${styles.title}${!isButtonVisible ? styles.isHidden : ''}`}>
                  {title || 'Трейлер'}
                </h2>
              </>
            ) : (
              <p className={styles.error}>Видео недоступно</p>
            )}
          </div>
        </div>

      </div>
    </Modal>
  )
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}