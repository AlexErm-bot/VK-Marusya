import styles from './AuthModal.module.scss'

interface Props {
  onSwitch: () => void
}

const SuccessMessage = ({ onSwitch }: Props) => {
  return (
    <div className={styles.success}>
      <h2 className={styles.title}>Регистрация завершена</h2>

      <p className={styles.successText}>
        Используйте вашу электронную почту для входа
      </p>

      <button
        type="button"
        className={styles.submit}
        onClick={onSwitch}
      >
        Войти
      </button>
    </div>
  )
}

export default SuccessMessage