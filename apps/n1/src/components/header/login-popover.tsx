'use client'
import { Icon } from '@new-engine/ui/atoms/icon'
import { Popover } from '@new-engine/ui/molecules/popover'
import { LoginForm } from '../forms/login-form'
import { useHeaderContext } from './store/header-context'

export const LoginPopover = () => {
  const { isLoginFormOpen, toggleLoginForm } = useHeaderContext()

  const handleToggle = () => {
    toggleLoginForm()
  }

  return (
    <Popover
      id="login-popover"
      trigger={
        <Icon
          icon="icon-[mdi--account-outline]"
          className="text-fg-reverse hover:text-primary"
        />
      }
      open={isLoginFormOpen}
      onOpenChange={toggleLoginForm}
      triggerClassName="text-3xl px-0 py-0 hover:bg-transparent"
      gutter={12}
      placement="bottom-end"
      contentClassName="w-sm max-w-[calc(100vw-2rem)]"
      title="Přihlášení"
      shadow={false}
    >
      <LoginForm
        showForgotPasswordLink
        showRegisterLink
        toggle={handleToggle}
        onSuccess={handleToggle}
      />
    </Popover>
  )
}
