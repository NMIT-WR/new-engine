import { validatePassword } from '@/lib/auth/validation'

interface PasswordRequirementsProps {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const { requirements } = validatePassword(password)

  return (
    <div className="space-y-1 text-gray-500 text-xs">
      <p className="font-semibold">Požadavky na heslo:</p>
      <ul className="list-inside list-disc space-y-0.5">
        <li className={requirements.length ? 'text-green-600' : ''}>
          Alespoň 8 znaků
        </li>
        <li className={requirements.uppercase ? 'text-green-600' : ''}>
          Jedno velké písmeno
        </li>
        <li className={requirements.lowercase ? 'text-green-600' : ''}>
          Jedno malé písmeno
        </li>
        <li className={requirements.number ? 'text-green-600' : ''}>
          Jedno číslo
        </li>
      </ul>
    </div>
  )
}
