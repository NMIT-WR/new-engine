'use client'

import { useAuth } from '@/hooks/use-auth'
import { useUpdateCustomer } from '@/hooks/use-customer'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@techsio/ui-kit/atoms/button'
import { Input } from '@techsio/ui-kit/atoms/input'
import { Label } from '@techsio/ui-kit/atoms/label'
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
    <form onSubmit={handleSubmit} className="space-y-200">
      <div className="grid gap-200 md:grid-cols-2">
        <div className="space-y-50">
          <label htmlFor="first_name" className="font-medium">
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
        <div className="space-y-50">
          <label htmlFor="last_name" className="font-medium">
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

      <div className="space-y-50">
        <label htmlFor="phone" className="font-medium">
          Telefon
        </label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+420 123 456 789"
        />
      </div>

      <div className="space-y-50">
        <Label className="font-medium text-fg-secondary">
          E-mail (nelze změnit)
        </Label>
        <Input
          value={customer?.email || ''}
          disabled
          className="bg-surface-light"
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
