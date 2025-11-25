'use client'

import { useAuth } from '@/hooks/use-auth'
import { useUpdateCustomer } from '@/hooks/use-customer'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@new-engine/ui/atoms/button'
import { Input } from '@new-engine/ui/atoms/input'
import { useState } from 'react'

export function ProfileForm() {
  const { customer } = useAuth()
  const updateCustomer = useUpdateCustomer()
  const toaster = useToast()

  const [formData, setFormData] = useState({
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    phone: customer?.phone || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateCustomer.mutate(formData, {
      onSuccess: () => {
        toaster.create({
          title: 'Profil aktualizován',
          description: 'Vaše údaje byly úspěšně uloženy.',
          type: 'success',
        })
      },
      onError: () => {
        toaster.create({
          title: 'Chyba',
          description: 'Nepodařilo se aktualizovat profil.',
          type: 'error',
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-md">
      <div className="grid gap-md md:grid-cols-2">
        <div className="space-y-xs">
          <label htmlFor="first_name" className="font-medium text-body-sm">
            Jméno
          </label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            placeholder="Jan"
          />
        </div>
        <div className="space-y-xs">
          <label htmlFor="last_name" className="font-medium text-body-sm">
            Příjmení
          </label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            placeholder="Novák"
          />
        </div>
      </div>

      <div className="space-y-xs">
        <label htmlFor="phone" className="font-medium text-body-sm">
          Telefon
        </label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+420 123 456 789"
        />
      </div>

      <div className="space-y-xs">
        <label className="font-medium text-body-sm text-fg-muted">
          E-mail (nelze změnit)
        </label>
        <Input
          value={customer?.email || ''}
          disabled
          className="bg-surface-subtle"
        />
      </div>

      <Button
        type="submit"
        disabled={updateCustomer.isPending}
        className="w-full md:w-auto"
      >
        {updateCustomer.isPending ? 'Ukládám...' : 'Uložit změny'}
      </Button>
    </form>
  )
}
