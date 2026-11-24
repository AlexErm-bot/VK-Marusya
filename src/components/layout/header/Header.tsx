import MarusiaWhite from '@/assets/icons/marusia-white-logo.svg?react'
import User from '@/assets/icons/user-icon.svg?react'
import UserFull from '@/assets/icons/userFull-icon.svg?react'
import Genre from '@/assets/icons/genre-icon.svg?react'
import Search from '@/assets/icons/search-icon.svg?react'
import { useAuthModal } from '@/features/ui/hooks/useAuthModal'
import { useAppSelector } from '@/app/hooks'
import styles from './Header.module.scss'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { SearchBar } from './SearchBar'

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { open } = useAuthModal()
  const navigate = useNavigate()

  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.link} ${styles.activeTab}` : styles.link
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <MarusiaWhite className={styles.logo} />
      </Link>

      <div className={styles.middleWrap}>
        <NavLink to="/" end className={getLinkClass}>
          Главная
        </NavLink>
        <NavLink to="/genres" className={getLinkClass}>
          Жанры
        </NavLink>
        <div className={styles.desktopSearch}>
          <SearchBar />
        </div>
      </div>

      {isAuthenticated && user ? (
        <NavLink to="/profile" className={getLinkClass}>
          {user?.surname}
        </NavLink>
      ) : (
        <button
          type="button"
          className={styles.link}
          onClick={() => open('login')}
        >
          Войти
        </button>
      )}

      <div className={styles.miniWrap}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Жанры"
          onClick={() => navigate('/genres')}
        >
          <Genre />
        </button>

        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Поиск"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search fillOpacity={1} />
        </button>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => {
            if (!isAuthenticated) {
              open('login')
            } else {
              navigate('/profile')
            }
          }}
          aria-label={isAuthenticated ? 'Личный кабинет' : 'Профиль'}
        >
          {isAuthenticated ? <UserFull fill="white" /> : <User fill="white" />}
        </button>
      </div>

      {isSearchOpen && (
        <div
          className={styles.searchOverlay}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className={styles.searchModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.searchModalHeader}>
              <div className={styles.searchBarWrapper}>
                <SearchBar
                  isMobile
                  onClose={() => setIsSearchOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}