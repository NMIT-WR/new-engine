'use client'

import { LoginForm } from '@/components/forms/login-form'

export default function LoginPage() {
  return (
    <div className="mx-auto w-md max-w-full py-600">
      <LoginForm showForgotPasswordLink showRegisterLink />
    </div>
  )
}
