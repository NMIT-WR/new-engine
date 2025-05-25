import { Button } from '@/components/Button'
import { UiCloseButton, UiDialog, UiDialogTrigger } from '@/components/Dialog'
import { Icon } from '@/components/Icon'
import { UiModal, UiModalOverlay } from '@/components/ui/Modal'
import type { StoreCustomerAddress, StoreRegion } from '@medusajs/types'
import type { BaseRegionCountry } from '@medusajs/types/dist/http/region/common'
import { DeleteAddressButton } from '@modules/account/components/DeleteAddressButton'
import { UpsertAddressForm } from '@modules/account/components/UpsertAddressForm'
import { twMerge } from 'tailwind-merge'

export const AddressSingle: React.FC<{
  address: StoreCustomerAddress
  countries: BaseRegionCountry[]
  region: StoreRegion | null | undefined
  className?: string
}> = ({ address, countries, region, className }) => {
  return (
    <div
      className={twMerge(
        'flex w-full flex-wrap gap-8 rounded-xs border border-grayscale-200 p-4 max-lg:flex-col',
        className
      )}
    >
      <div className="flex flex-1 sm:gap-3">
        <Icon
          name="user"
          className="h-6 w-6"
          wrapperClassName="max-sm:hidden"
        />
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-wrap justify-between gap-6">
            <div className="sm:grow sm:basis-0">
              <p className="mb-1.5 text-grayscale-500 text-xs">Address</p>
              <p>{address.address_1}</p>
            </div>
            <div className="sm:grow sm:basis-0">
              <p className="mb-1.5 text-grayscale-500 text-xs">Country</p>
              <p>
                {countries.find(
                  (country) => country.iso_2 === address.country_code
                )?.display_name || address.country_code}
              </p>
            </div>
          </div>
          {Boolean(address.address_2) && (
            <div>
              <p className="mb-1.5 text-grayscale-500 text-xs">
                Apartment, suite, etc.
              </p>
              <p>{address.address_2}</p>
            </div>
          )}
          <div className="flex flex-wrap justify-between gap-6">
            <div className="sm:grow sm:basis-0">
              <p className="mb-1.5 text-grayscale-500 text-xs">Postal Code</p>
              <p>{address.postal_code}</p>
            </div>
            <div className="sm:grow sm:basis-0">
              <p className="mb-1.5 text-grayscale-500 text-xs">City</p>
              <p>{address.city}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2.5">
        <UiDialogTrigger>
          <Button
            iconName="trash"
            size="sm"
            variant="outline"
            className="w-8 shrink-0 px-0"
            aria-label="Delete address"
          />
          <UiModalOverlay>
            <UiModal>
              <UiDialog className="text-center">
                <p className="mb-8 text-md">
                  Do you want to delete this address?
                </p>
                <div className="flex justify-center gap-6">
                  <DeleteAddressButton
                    addressId={address.id}
                    className="w-full max-w-42"
                  >
                    Confirm
                  </DeleteAddressButton>
                  <UiCloseButton variant="outline" className="w-full max-w-42">
                    Cancel
                  </UiCloseButton>
                </div>
              </UiDialog>
            </UiModal>
          </UiModalOverlay>
        </UiDialogTrigger>
        <UiDialogTrigger>
          <Button variant="outline" size="sm" className="shrink-0">
            Change
          </Button>
          <UiModalOverlay>
            <UiModal>
              <UiDialog>
                <UpsertAddressForm
                  region={region ?? undefined}
                  addressId={address.id}
                  defaultValues={{
                    first_name: address.first_name ?? '',
                    last_name: address.last_name ?? '',
                    company: address.company ?? '',
                    phone: address.phone ?? '',
                    address_1: address.address_1 ?? '',
                    address_2: address.address_2 ?? '',
                    postal_code: address.postal_code ?? '',
                    city: address.city ?? '',
                    province: address.province ?? '',
                    country_code: address.country_code ?? '',
                  }}
                />
              </UiDialog>
            </UiModal>
          </UiModalOverlay>
        </UiDialogTrigger>
      </div>
    </div>
  )
}
