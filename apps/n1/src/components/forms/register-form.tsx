'use client'

import { useRegister } from '@/hooks/use-register'
import { Button } from '@new-engine/ui/atoms/button'
import { Input } from '@new-engine/ui/atoms/input'
import { Label } from '@new-engine/ui/atoms/label'
import { Checkbox } from '@new-engine/ui/molecules/checkbox'
import Link from 'next/link'
import { type FormEvent, useRef, useState } from 'react'
import { PasswordValidator, usePasswordValidation } from './password-validator'

interface RegisterFormProps {
  onSuccess?: () => void
  toggle?: () => void
  showLoginLink?: boolean
  className?: string
}

export const RegisterForm = ({
  onSuccess,
  toggle,
  showLoginLink = true,
  className,
}: RegisterFormProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const passwordValidation = usePasswordValidation(password)

  const register = useRegister({
    onSuccess: () => {
      formRef.current?.reset()
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setAcceptTerms(false)
      onSuccess?.()
    },
    onError: (error) => {
      console.error('Registration failed:', error.message)
    },
  })

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword
  const passwordsDontMatch =
    confirmPassword.length > 0 && password !== confirmPassword

  const getFormValidity = () => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.includes('@') &&
      passwordValidation.isValid &&
      passwordsMatch &&
      acceptTerms
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!getFormValidity()) {
      // Client-side validation
      console.error('Form is not valid')
      return
    }

    if (!acceptTerms) {
      console.error('Terms must be accepted')
      return
    }

    register.mutate({
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
    })
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className={`mt-100 flex flex-col gap-200 ${className}`}
    >
      {/* Server Error Banner */}
      {register.error && (
        <div className="rounded-md bg-danger-light p-100 text-danger text-sm">
          <p className="font-medium">Registrace se nezdařila</p>
          <p className="mt-50 text-xs">{register.error.message}</p>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-100">
        <div className="flex flex-col gap-50">
          <Label htmlFor="register-first-name" required>
            Jméno
          </Label>
          <Input
            id="register-first-name"
            name="firstName"
            type="text"
            placeholder="Jan"
            required
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={register.isPending}
            className="peer user-invalid:border-danger user-valid:border-success focus-visible:user-invalid:ring-danger focus-visible:user-valid:ring-success"
          />
          <p className="invisible font-medium text-2xs text-danger peer-user-invalid:visible">
            Vyplňte prosím jméno
          </p>
        </div>

        <div className="flex flex-col gap-50">
          <Label htmlFor="register-last-name" required>
            Příjmení
          </Label>
          <Input
            id="register-last-name"
            name="lastName"
            type="text"
            placeholder="Novák"
            required
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={register.isPending}
            className="peer user-invalid:border-danger user-valid:border-success focus-visible:user-invalid:ring-danger focus-visible:user-valid:ring-success"
          />
          <p className="invisible font-medium text-2xs text-danger peer-user-invalid:visible">
            Vyplňte prosím příjmení
          </p>
        </div>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-50">
        <Label htmlFor="register-email" required>
          E-mailová adresa
        </Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          placeholder="vas@email.cz"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={register.isPending}
          className="peer user-invalid:border-danger user-valid:border-success focus-visible:user-invalid:ring-danger focus-visible:user-valid:ring-success"
        />
        <p className="invisible font-medium text-2xs text-danger peer-user-invalid:visible">
          Zadejte platnou e-mailovou adresu
        </p>
      </div>

      {/* Password Field with Real-time Validation */}
      <div className="flex flex-col gap-50">
        <Label htmlFor="register-password" required>
          Heslo
        </Label>
        <Input
          id="register-password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={register.isPending}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`transition-colors ${
            password.length > 0
              ? passwordValidation.isValid
                ? 'border-success focus-visible:ring-success'
                : 'border-danger focus-visible:ring-danger'
              : ''
          }`}
        />

        {/* Real-time Password Requirements */}
        <PasswordValidator password={password} showRequirements />
      </div>

      {/* Confirm Password Field with Match Indicator */}
      <div className="flex flex-col gap-50">
        <Label htmlFor="register-confirm-password" required>
          Potvrzení hesla
        </Label>
        <Input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={register.isPending}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`transition-colors ${
            confirmPassword.length > 0
              ? passwordsMatch
                ? 'border-success focus-visible:ring-success'
                : 'border-danger focus-visible:ring-danger'
              : ''
          }`}
        />

        {/* Password Match Indicator */}
        {passwordsMatch && (
          <span className="font-medium text-success text-xs">
            Hesla se shodují
          </span>
        )}
        {passwordsDontMatch && (
          <span className="font-medium text-danger text-xs">
            Hesla se neshodují
          </span>
        )}
      </div>

      <div>
        <Checkbox
          name="accept-terms"
          labelText="Souhlasím s podmínkami"
          className="text-xs"
          checked={acceptTerms}
          onCheckedChange={(details) =>
            setAcceptTerms(details.checked === true)
          }
          required
        />
      </div>

      <Button
        type="submit"
        size="sm"
        block
        disabled={register.isPending || !getFormValidity()}
      >
        {register.isPending ? 'Registruji...' : 'Zaregistrovat se'}
      </Button>

      {showLoginLink && (
        <div className="text-center text-fg-primary text-sm">
          <span className="text-fg-secondary">Již máte účet? </span>
          <Link
            href="/prihlaseni"
            className="font-medium hover:underline"
            onClick={toggle}
          >
            Přihlaste se
          </Link>
        </div>
      )}
    </form>
  )
}
