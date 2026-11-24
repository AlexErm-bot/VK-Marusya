import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useLogoutMutation } from '@/app/api/authApi'
import { logout as logoutAction } from '@/features/auth/authSlice'
import { FavoritesView } from './FavoritesView'
import UserIcon from '@/assets/icons/user-icon.svg?react'
import LikeIcon from '@/assets/icons/like-icon.svg?react'
import MailIcon from '@/assets/icons/mail-icon.svg?react'
import { useNavigate } from 'react-router-dom'
import styles from './ProfilePage.module.scss'

export const ProfilePage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [logoutApi] = useLogoutMutation()

  const [activeTab, setActiveTab] = useState<'account' | 'favorites'>('account')

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap()
    } catch (err) {
      console.error('Ошибка при выходе:', err)
    } finally {
      dispatch(logoutAction())
      navigate('/')
    }
  }

  if (!user) return null

  const initials = `${user.name?.[0] || ''}${user.surname?.[0] || ''}`.toUpperCase()

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Мой аккаунт</h1>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <LikeIcon />
          <span className={styles.textDesktop}>Избранные фильмы</span>
          <span className={styles.textMobile}>Избранное</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'account' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <UserIcon />
          <span className={styles.textDesktop}>Настройки аккаунта</span>
          <span className={styles.textMobile}>Настройки</span>
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === 'account' && (
          <div className={styles.accountInfo}>

            <div className={styles.infoRow}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles.textInfo}>
                <span className={styles.label}>Имя Фамилия</span>
                <span className={styles.value}>{user.name} {user.surname}</span>
              </div>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.avatar}>
                <MailIcon fill="white" />
              </div>
              <div className={styles.textInfo}>
                <span className={styles.label}>Электронная почта</span>
                <span className={styles.value}>{user.email}</span>
              </div>
            </div>

            <button className="primary" onClick={handleLogout}>
              Выйти из аккаунта
            </button>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className={styles.favoritesContent}>
            <FavoritesView />
          </div>
        )}
      </div>
    </section>
  )
}