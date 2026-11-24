import OK from '@/assets/social/ok-logo.svg?react'
import VK from '@/assets/social/vk-logo.svg?react'
import YOU from '@/assets/social/youtube-logo.svg?react'
import TG from '@/assets/social/tg-logo.svg?react'
import styles from './Footer.module.scss'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <ul className={styles.socialList}>
        <li className={styles.socialItem}>
          <a href="https://vk.ru" className={styles.socialLink}>
            <VK className={styles.socialIcon} />
          </a>
        </li>
        <li className={styles.socialItem}>
          <a href="https://youtube.com" className={styles.socialLink}>
            <YOU className={styles.socialIcon} />
          </a>
        </li>
        <li className={styles.socialItem}>
          <a href="https://ok.ru" className={styles.socialLink}>
            <OK className={styles.socialIcon} />
          </a>
        </li>
        <li className={styles.socialItem}>
          <a href="https://telegram.org" className={styles.socialLink}>
            <TG className={styles.socialIcon} />
          </a>
        </li>
      </ul>
    </footer>
  )
}