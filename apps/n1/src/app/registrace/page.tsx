'use client'
import { RegisterForm } from '@/components/forms/register-form'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className="mx-auto w-md max-w-full py-600">
      <RegisterForm onSuccess={() => router.push('/ucet/profil')} />
    </div>
  )
}
