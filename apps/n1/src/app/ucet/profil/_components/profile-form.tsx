'use client'

import { useAuth } from '@/hooks/use-auth'
import { useUpdateCustomer } from '@/hooks/use-customer'
import { useToast } from '@/hooks/use-toast'
import {
  cleanPhoneNumber,
  formatPhoneNumber,
} from '@/utils/format/format-phone-number'
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
    phone: formatPhoneNumber(customer?.phone || ''),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateCustomer.mutate(
      { ...formData, phone: cleanPhoneNumber(formData.phone) },
      {
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
      }
    )
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 13) {
      setFormData({ ...formData, phone: formatted })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-200">
      <div className="grid gap-200 md:grid-cols-2">
        <div className="space-y-50">
          <Label className="font-medium">Jméno</Label>
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
          <Label className="font-medium">Příjmení</Label>
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
        <Label className="font-medium">Telefon</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="+420 123 456 789"
        />
      </div>

      <div className="space-y-50">
        <Label className="font-medium">E-mail (nelze změnit)</Label>
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
