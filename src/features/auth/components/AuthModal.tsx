import { Modal } from '@/components/ui/Modal'
import { useAuthModal } from '@/features/ui/hooks/useAuthModal'
import MarusiaLogo from '@/assets/icons/marusia-black-logo.svg?react'
import Close from '@/assets/icons/close-icon.svg?react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import SuccessMessage from './SuccessMessage'
import styles from './AuthModal.module.scss'

export const AuthModal = () => {
  const { isOpen, mode, close, switchMode } = useAuthModal()

  const renderContent = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSuccess={close}
            onSwitch={() => switchMode('register')}
          />
        )
      case 'register':
        return (
          <RegisterForm
            onSuccess={() => switchMode('success')}
            onSwitch={() => switchMode('login')}
          />
        )
      case 'success':
        return <SuccessMessage onSwitch={() => switchMode('login')} />
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.close}
          onClick={close}
          aria-label="Закрыть"
        >
          <Close />
        </button>
        <MarusiaLogo className={styles.logo} />

        {renderContent()}
      </div>
    </Modal>
  )
}