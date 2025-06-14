import { useAuth } from '@/hooks/use-auth'

interface PasswordRequirementsProps {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const { usePasswordStrength } = useAuth()
  const { requirements } = usePasswordStrength(password)

  return (
    <div className="space-y-1 text-gray-500 text-xs">
      <p className="font-semibold">Password requirements:</p>
      <ul className="list-inside list-disc space-y-0.5">
        <li className={requirements.length ? 'text-green-600' : ''}>
          At least 8 characters
        </li>
        <li className={requirements.uppercase ? 'text-green-600' : ''}>
          One uppercase letter
        </li>
        <li className={requirements.lowercase ? 'text-green-600' : ''}>
          One lowercase letter
        </li>
        <li className={requirements.number ? 'text-green-600' : ''}>
          One number
        </li>
      </ul>
    </div>
  )
}
