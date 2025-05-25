'use client'
import { useFormStatus } from 'react-dom'

import { Button, type ButtonProps } from '@/components/Button'

export function SubmitButton(props: Omit<ButtonProps, 'type'>) {
  const { pending } = useFormStatus()

  return (
    <Button {...props} type="submit" isLoading={pending || props.isLoading} />
  )
}
