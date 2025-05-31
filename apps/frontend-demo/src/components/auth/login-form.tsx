'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { FormCheckbox } from 'ui/src/molecules/form-checkbox'
import { FormInput } from 'ui/src/molecules/form-input'
import { useToast } from 'ui/src/molecules/toast'
import { tv } from 'ui/src/utils'
import { useAuth } from '../../hooks/use-auth'

const loginFormVariants = tv({
  slots: {
    root: 'bg-auth-card-bg p-auth-card-padding rounded-auth-card shadow-auth-card',
    header: 'text-center mb-auth-header-margin',
    title: 'text-auth-title font-auth-title mb-auth-title-margin',
    subtitle: 'text-auth-subtitle',
    form: 'space-y-auth-form-gap',
    footer: 'mt-auth-footer-margin text-center text-auth-footer',
    link: 'text-auth-link hover:text-auth-link-hover',
  },
})

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const styles = loginFormVariants()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      toast.create({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
        type: 'success',
      })
      router.push('/')
    } catch (error: any) {
      toast.create({
        title: 'Sign in failed',
        description:
          error.message || 'Please check your credentials and try again.',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.root()}>
      <div className={styles.header()}>
        <h1 className={styles.title()}>Welcome Back</h1>
        <p className={styles.subtitle()}>Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form()}>
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={isLoading}
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <FormCheckbox
            id="rememberMe"
            label="Remember me"
            checked={rememberMe}
            onCheckedChange={(details) =>
              setRememberMe(details.checked === true)
            }
            disabled={isLoading}
          />

          <Link href="/auth/forgot-password" className={styles.link()}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          Sign In
        </Button>
      </form>

      <div className={styles.footer()}>
        Don't have an account?{' '}
        <Link href="/auth/register" className={styles.link()}>
          Sign up
        </Link>
      </div>
    </div>
  )
}
