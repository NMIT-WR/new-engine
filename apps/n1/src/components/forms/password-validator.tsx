import {
  PASSWORD_REQUIREMENTS,
  isPasswordValid,
} from '@/lib/form-validators'
import { Icon } from '@ui/atoms/icon'

interface PasswordValidatorProps {
  password: string
  showRequirements?: boolean
  className?: string
}

export const PasswordValidator = ({
  password,
  showRequirements = true,
  className = '',
}: PasswordValidatorProps) => {
  const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
    ...req,
    met: req.test(password),
  }))

  const allMet = requirements.every((req) => req.met)
  const hasStarted = password.length > 0

  if (!showRequirements || !hasStarted) {
    return null
  }

  return (
    <div className={`text-sm ${className}`}>
      <p className="mb-50 font-medium text-fg-secondary">Požadavky na heslo:</p>
      <ul className="flex flex-col gap-50">
        {requirements.map((req) => (
          <li
            key={req.id}
            className={`flex items-center gap-100 ${
              req.met ? 'text-success' : 'text-fg-secondary'
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border border-border-secondary text-[.75rem] ${
                req.met ? 'bg-success' : 'bg-surface'
              }`}
              aria-hidden="true"
            >
              {req.met && (
                <Icon icon="token-icon-check" className="text-fg-reverse" />
              )}
            </span>
            <span className="text-2xs">{req.label}</span>
          </li>
        ))}
      </ul>

      {allMet && (
        <p className="mt-100 flex items-center gap-100 text-2xs text-success">
          <span className="font-medium">Heslo splňuje všechny požadavky</span>
        </p>
      )}
    </div>
  )
}

export const usePasswordValidation = (password: string) => {
  const results = PASSWORD_REQUIREMENTS.map((req) => ({
    id: req.id,
    met: req.test(password),
  }))

  return {
    isValid: isPasswordValid(password),
    requirements: results,
  }
}
