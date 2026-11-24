import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useRegisterMutation, useLoginMutation } from '@/app/api/authApi'
import { useAppDispatch } from '@/app/hooks'
import { setCredentials } from '@/features/auth/authSlice'
import MailIcon from '@/assets/icons/mail-icon.svg?react'
import UserIcon from '@/assets/icons/user-icon.svg?react'
import LockIcon from '@/assets/icons/lock-icon.svg?react'
import styles from './AuthModal.module.scss'

interface Props {
  onSuccess: () => void
  onSwitch: () => void
}

const RegisterForm = ({ onSuccess, onSwitch }: Props) => {
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirm: '',
  })

  const [errors, setErrors] = useState({
    email: false,
    firstName: false,
    lastName: false,
    password: false,
    confirm: false,
    passwordsMismatch: false,
  })

  const [serverError, setServerError] = useState<string | null>(null)

  const [register, { isLoading: isRegistering }] = useRegisterMutation()
  const [login, { isLoading: isLoggingIn }] = useLoginMutation()
  const isLoading = isRegistering || isLoggingIn

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: false, passwordsMismatch: false })
    }
    if (serverError) setServerError(null) 
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading) return
    setServerError(null)

    const newErrors = {
      email: !formData.email.trim() || !isEmailValid(formData.email),
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      password: !formData.password.trim(),
      confirm: !formData.confirm.trim(),
      passwordsMismatch: formData.password !== formData.confirm,
    }

    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.firstName,
        surname: formData.lastName,
      }).unwrap()

      const loginResponse = await login({ 
        email: formData.email, 
        password: formData.password 
      }).unwrap()
      
      dispatch(setCredentials({ 
        user: loginResponse.user || { email: formData.email, surname: formData.lastName } as any, 
        token: loginResponse.token || 'cookie-based-auth' 
      }))
      
      onSuccess()
    } catch (err: any) {
      console.error('Ошибка регистрации:', err)
      
      if (err?.status === 409 || err?.data?.error === 'User already exists') {
        setServerError('Пользователь с таким email уже существует')
      } else if (err?.data?.error) {
        setServerError(err.data.error)
      } else {
        setServerError('Ошибка при регистрации. Попробуйте снова.')
      }
    }
  }

  return (
    <>
      <h2 className={styles.title}>Регистрация</h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.inputWrap} ${(serverError || errors.email) ? styles.inputError : ''}`}>
          <MailIcon className={styles.inputIcon} />
          <input
            type="email"
            name="email"
            className={styles.input}
            placeholder={errors.email ? 'Введите корректный email' : 'Электронная почта'}
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className={`${styles.inputWrap} ${(serverError || errors.firstName) ? styles.inputError : ''}`}>
          <UserIcon className={styles.inputIcon} />
          <input
            type="text"
            name="firstName"
            className={styles.input}
            placeholder={errors.firstName ? 'Введите имя' : 'Имя'}
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className={`${styles.inputWrap} ${(serverError || errors.lastName) ? styles.inputError : ''}`}>
          <UserIcon className={styles.inputIcon} />
          <input
            type="text"
            name="lastName"
            className={styles.input}
            placeholder={errors.lastName ? 'Введите фамилию' : 'Фамилия'}
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className={`${styles.inputWrap} ${(serverError || errors.password) ? styles.inputError : ''}`}>
          <LockIcon className={styles.inputIcon} />
          <input
            type="password"
            name="password"
            className={styles.input}
            placeholder={errors.password ? 'Придумайте пароль' : 'Пароль'}
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className={`${styles.inputWrap} ${(serverError || errors.confirm || errors.passwordsMismatch) ? styles.inputError : ''}`}>
          <LockIcon className={styles.inputIcon} />
          <input
            type="password"
            name="confirm"
            className={styles.input}
            placeholder={errors.passwordsMismatch ? 'Пароли не совпадают' : 'Подтвердите пароль'}
            value={formData.confirm}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        {serverError && <p className={styles.errorText}>{serverError}</p>}

        <button type="submit" className="primary" disabled={isLoading}>
          {isLoading ? 'Создание...' : 'Создать аккаунт'}
        </button>
      </form>

      <button type="button" className={styles.switch} onClick={onSwitch} disabled={isLoading}>
        У меня есть пароль
      </button>
    </>
  )
}

export default RegisterForm