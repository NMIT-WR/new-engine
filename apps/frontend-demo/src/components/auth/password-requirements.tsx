import { validatePassword } from "@/lib/auth/validation"

interface PasswordRequirementsProps {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const { requirements } = validatePassword(password)

  return (
    <div className="space-y-1 pl-100 text-fg-primary text-xs">
      <p className="font-semibold">Požadavky na heslo:</p>
      <ul className="list-inside list-disc space-y-0.5 text-fg-secondary">
        <li className={requirements.length ? "text-success" : ""}>
          Alespoň 8 znaků
        </li>
        <li className={requirements.uppercase ? "text-success" : ""}>
          Jedno velké písmeno
        </li>
        <li className={requirements.lowercase ? "text-success" : ""}>
          Jedno malé písmeno
        </li>
        <li className={requirements.number ? "text-success" : ""}>
          Jedno číslo
        </li>
      </ul>
    </div>
  )
}
