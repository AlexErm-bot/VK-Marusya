import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useLoginMutation } from '@/app/api/authApi'
import { useAppDispatch } from '@/app/hooks'
import { setCredentials } from '@/features/auth/authSlice'
import MailIcon from '@/assets/icons/mail-icon.svg?react'
import LockIcon from '@/assets/icons/lock-icon.svg?react'
import styles from './AuthModal.module.scss'

interface Props {
  onSuccess: () => void
  onSwitch: () => void
}

const LoginForm = ({ onSuccess, onSwitch }: Props) => {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState({ email: false, password: false })
  const [login, { isLoading }] = useLoginMutation()
  const [serverError, setServerError] = useState(false)

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading) return
    setServerError(false)

    const isEmailEmpty = !email.trim()
    const isPasswordEmpty = !password.trim()
    const isEmailIncorrect = !isEmailEmpty && !isEmailValid(email)

    const newErrors = {
      email: isEmailEmpty || isEmailIncorrect,
      password: isPasswordEmpty,
    }
    setErrors(newErrors)

    if (newErrors.email || newErrors.password) return

    const result = await login({ email, password })

    if (result.error) {
      setServerError(true)
    } else if (result.data) {
      // Сервер вернул { result: true }. Токена в данных нет — 
      // значит, токен уже в cookie/localStorage, а юзера создаем локально.
      const localUser = {
        email: email,
        surname: email.split('@')[0], 
      } as any 

      dispatch(setCredentials({
        user: localUser,
        token: 'cookie-based-auth'
      }))
      
      onSuccess()
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email) setErrors({ ...errors, email: false })
    if (serverError) setServerError(false) 
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password) setErrors({ ...errors, password: false })
    if (serverError) setServerError(false)
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.inputWrap} ${serverError || errors.email ? styles.inputError : ''}`}>
          <MailIcon className={styles.inputIcon} />
          <input
            type="email"
            className={styles.input}
            placeholder={errors.email ? 'Введите корректный email' : 'Электронная почта'}
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
          />
        </div>

        <div className={`${styles.inputWrap} ${serverError || errors.password ? styles.inputError : ''}`}>
          <LockIcon className={styles.inputIcon} />
          <input
            type="password"
            className={styles.input}
            placeholder={errors.password ? 'Введите пароль' : 'Пароль'}
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
          />
        </div>

        {serverError && (
          <p className={styles.errorText}>Неверный email или пароль</p>
        )}

        <button type="submit" className="primary" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <button type="button" className={styles.switch} onClick={onSwitch} disabled={isLoading}>
        Регистрация
      </button>
    </>
  )
}

export default LoginForm