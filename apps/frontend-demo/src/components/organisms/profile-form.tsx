"use client"
import type { HttpTypes } from "@medusajs/types"
import { Button } from "@techsio/ui-kit/atoms/button"
import { ExtraText } from "@techsio/ui-kit/atoms/extra-text"
import { FormInputRaw as FormInput } from "@techsio/ui-kit/molecules/form-input"
import { SelectTemplate } from "@techsio/ui-kit/templates/select"
import { useEffect, useRef, useState } from "react"
import {
  customerHooks,
  useCreateAddressWithToast,
  useUpdateAddressWithToast,
  useUpdateProfileWithToast,
} from "@/hooks/customer-hooks"
import { COUNTRIES, formatPhoneNumber, formatPostalCode } from "@/lib/address"
import type { FormAddressData, FormUserData } from "@/types/checkout"

type ProfileFormProps = {
  user: HttpTypes.StoreCustomer
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { addresses } = customerHooks.useCustomerAddresses({})
  const createAddressMutation = useCreateAddressWithToast()
  const updateAddressMutation = useUpdateAddressWithToast()
  const updateProfileMutation = useUpdateProfileWithToast()
  const addressDirtyRef = useRef(false)

  // Get the first address as the main address
  const mainAddress = addresses[0]
  const initialAddress = mainAddress
    ? {
        street: mainAddress.address_1 || "",
        city: mainAddress.city || "",
        postalCode: mainAddress.postal_code || "",
        country: mainAddress.country_code || "cz",
      }
    : null

  const isSaving =
    createAddressMutation.isPending || updateAddressMutation.isPending
  const isUpdating = updateProfileMutation.isPending

  const [formAddressData, setFormAddressData] = useState<FormAddressData>({
    street: initialAddress?.street || "",
    city: initialAddress?.city || "",
    postalCode: initialAddress?.postalCode || "",
    country: initialAddress?.country || "cz",
  })

  const [formUserData, setFormUserData] = useState<FormUserData>({
    id: user.id,
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.phone || "",
    company_name: user.company_name || "",
  })

  const hasProfileChanges =
    formUserData.first_name !== user.first_name ||
    formUserData.last_name !== user.last_name ||
    formUserData.phone !== (user.phone || "") ||
    formUserData.company_name !== (user.company_name || "")

  const hasAddressChanges =
    formAddressData.street !== initialAddress?.street ||
    formAddressData.city !== initialAddress?.city ||
    formAddressData.postalCode !== initialAddress?.postalCode ||
    formAddressData.country !== initialAddress?.country

  useEffect(() => {
    if (!initialAddress || addressDirtyRef.current) {
      return
    }
    setFormAddressData({
      street: initialAddress.street || "",
      city: initialAddress.city || "",
      postalCode: initialAddress.postalCode || "",
      country: initialAddress.country || "cz",
    })
  }, [mainAddress?.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const promises: Promise<unknown>[] = []

      if (hasProfileChanges) {
        promises.push(
          updateProfileMutation.mutateAsync({
            first_name: formUserData.first_name,
            last_name: formUserData.last_name,
            phone: formUserData.phone || undefined,
            company_name: formUserData.company_name || undefined,
          })
        )
      }

      if (hasAddressChanges) {
        const addressPayload = {
          address_1: formAddressData.street,
          city: formAddressData.city,
          postal_code: formAddressData.postalCode,
          country_code: formAddressData.country,
        }

        if (mainAddress?.id) {
          // Update existing address
          promises.push(
            updateAddressMutation.mutateAsync({
              addressId: mainAddress.id,
              ...addressPayload,
            })
          )
        } else {
          // Create new address
          promises.push(createAddressMutation.mutateAsync(addressPayload))
        }
      }

      if (promises.length > 0) {
        await Promise.all(promises)
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-pf-container border border-pf-container-border bg-pf-container-bg p-pf-container-padding shadow-pf">
        <div className="mb-pf-header-margin-bottom flex items-center gap-pf-header-gap">
          <h2 className="font-pf-title text-pf-title-size">Osobní údaje</h2>
        </div>

        <div className="space-y-pf-fields-gap">
          <div className="grid gap-pf-grid-gap sm:grid-cols-2">
            <FormInput
              id="address-firstName"
              label="Jméno"
              onChange={(e) =>
                setFormUserData({
                  ...formUserData,
                  first_name: e.target.value,
                })
              }
              placeholder="Jan"
              size="sm"
              value={formUserData.first_name}
            />

            <FormInput
              id="address-lastName"
              label="Příjmení"
              onChange={(e) =>
                setFormUserData({ ...formUserData, last_name: e.target.value })
              }
              placeholder="Novák"
              size="sm"
              value={formUserData.last_name}
            />
          </div>
          <FormInput
            disabled
            helpText={<ExtraText size="sm">E-mail nelze změnit</ExtraText>}
            id="email"
            label="E-mail"
            size="sm"
            type="email"
            value={user.email || ""}
          />

          <FormInput
            id="address-company"
            label={
              <span>
                Firma{" "}
                <span className="text-fg-secondary text-sm">(nepovinné)</span>
              </span>
            }
            onChange={(e) =>
              setFormUserData({ ...formUserData, company_name: e.target.value })
            }
            size="sm"
            value={formUserData.company_name || ""}
          />

          <FormInput
            id="address-phone"
            label={
              <span>
                Telefonní číslo{" "}
                <span className="text-fg-secondary">(nepovinné)</span>
              </span>
            }
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value)
              setFormUserData({ ...formUserData, phone: formatted })
            }}
            placeholder="+420 777 888 999"
            size="sm"
            type="tel"
            value={formUserData.phone}
          />

          <FormInput
            id="address-street"
            label="Ulice a číslo popisné"
            onChange={(e) => {
              addressDirtyRef.current = true
              setFormAddressData({
                ...formAddressData,
                street: e.target.value,
              })
            }}
            placeholder="Hlavní 123"
            size="sm"
            value={formAddressData.street}
          />

          <div className="grid gap-pf-grid-gap sm:grid-cols-2">
            <FormInput
              id="address-city"
              label="Město"
              onChange={(e) => {
                addressDirtyRef.current = true
                setFormAddressData({
                  ...formAddressData,
                  city: e.target.value,
                })
              }}
              placeholder="Praha"
              size="sm"
              value={formAddressData.city}
            />

            <FormInput
              id="address-postalCode"
              label="PSČ"
              onChange={(e) => {
                addressDirtyRef.current = true
                const formatted = formatPostalCode(e.target.value)
                setFormAddressData({
                  ...formAddressData,
                  postalCode: formatted,
                })
              }}
              placeholder="100 00"
              size="sm"
              value={formAddressData.postalCode}
            />
          </div>

          <div className="max-w-[20rem]">
            <SelectTemplate
              id="address-country-select"
              items={COUNTRIES}
              label="Země"
              labelProps={{
                className: "mb-2 block font-medium text-fg-primary text-sm",
              }}
              onValueChange={(details) => {
                const value = details.value[0]
                if (value) {
                  addressDirtyRef.current = true
                  setFormAddressData({
                    ...formAddressData,
                    country: value,
                  })
                }
              }}
              value={[formAddressData.country]}
            />
          </div>
        </div>
        <div className="flex justify-end gap-pf-actions-gap">
          <Button
            disabled={isSaving || isUpdating}
            isLoading={isSaving || isUpdating}
            size="sm"
            type="submit"
          >
            Uložit změny
          </Button>
        </div>
      </div>
    </form>
  )
}
