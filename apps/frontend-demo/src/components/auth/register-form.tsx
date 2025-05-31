'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from 'ui/src/atoms/button'
import { FormInput } from 'ui/src/molecules/form-input'
import { FormCheckbox } from 'ui/src/molecules/form-checkbox'
import { useToast } from 'ui/src/molecules/toast'
import { tv } from 'ui/src/utils'
import { useAuth } from '../../hooks/use-auth'

const registerFormVariants = tv({
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

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { signUp } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const styles = registerFormVariants()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.create({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        type: 'error',
      })
      return
    }

    if (!acceptTerms) {
      toast.create({
        title: 'Terms not accepted',
        description: 'Please accept the terms and conditions.',
        type: 'error',
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      toast.create({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
        type: 'success',
      })
      router.push('/auth/login')
    } catch (error: any) {
      toast.create({
        title: 'Registration failed',
        description: error.message || 'Please try again later.',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.root()}>
      <div className={styles.header()}>
        <h1 className={styles.title()}>Create Account</h1>
        <p className={styles.subtitle()}>Sign up to get started</p>
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
          autoComplete="new-password"
        />

        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
          autoComplete="new-password"
        />

        <FormCheckbox
          id="acceptTerms"
          label="I agree to the Terms and Conditions"
          checked={acceptTerms}
          onCheckedChange={(details) => setAcceptTerms(details.checked === true)}
          disabled={isLoading}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || !acceptTerms}
        >
          Create Account
        </Button>
      </form>

      <div className={styles.footer()}>
        Already have an account?{' '}
        <Link href="/auth/login" className={styles.link()}>
          Sign in
        </Link>
      </div>
    </div>
  )
}