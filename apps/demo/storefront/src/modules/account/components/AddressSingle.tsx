import { twMerge } from "tailwind-merge"
import { StoreCustomerAddress, StoreRegion } from "@medusajs/types"
import { BaseRegionCountry } from "@medusajs/types/dist/http/region/common"
import { Button } from "@/components/Button"
import { UiCloseButton, UiDialog, UiDialogTrigger } from "@/components/Dialog"
import { Icon } from "@/components/Icon"
import { UiModal, UiModalOverlay } from "@/components/ui/Modal"
import { DeleteAddressButton } from "@modules/account/components/DeleteAddressButton"
import { UpsertAddressForm } from "@modules/account/components/UpsertAddressForm"

export const AddressSingle: React.FC<{
  address: StoreCustomerAddress
  countries: BaseRegionCountry[]
  region: StoreRegion | null | undefined
  className?: string
}> = ({ address, countries, region, className }) => {
  return (
    <div
      className={twMerge(
        "w-full border border-grayscale-200 rounded-xs p-4 flex flex-wrap gap-8 max-lg:flex-col",
        className
      )}
    >
      <div className="flex flex-1 sm:gap-3">
        <Icon
          name="user"
          className="w-6 h-6"
          wrapperClassName="max-sm:hidden"
        />
        <div className="flex flex-col gap-8 flex-1">
          <div className="flex flex-wrap justify-between gap-6">
            <div className="sm:grow sm:basis-0">
              <p className="text-xs text-grayscale-500 mb-1.5">Address</p>
              <p>{address.address_1}</p>
            </div>
            <div className="sm:grow sm:basis-0">
              <p className="text-xs text-grayscale-500 mb-1.5">Country</p>
              <p>
                {countries.find(
                  (country) => country.iso_2 === address.country_code
                )?.display_name || address.country_code}
              </p>
            </div>
          </div>
          {Boolean(address.address_2) && (
            <div>
              <p className="text-xs text-grayscale-500 mb-1.5">
                Apartment, suite, etc.
              </p>
              <p>{address.address_2}</p>
            </div>
          )}
          <div className="flex flex-wrap justify-between gap-6">
            <div className="sm:grow sm:basis-0">
              <p className="text-xs text-grayscale-500 mb-1.5">Postal Code</p>
              <p>{address.postal_code}</p>
            </div>
            <div className="sm:grow sm:basis-0">
              <p className="text-xs text-grayscale-500 mb-1.5">City</p>
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
            className="w-8 px-0 shrink-0"
            aria-label="Delete address"
          />
          <UiModalOverlay>
            <UiModal>
              <UiDialog className="text-center">
                <p className="text-md mb-8">
                  Do you want to delete this address?
                </p>
                <div className="flex gap-6 justify-center">
                  <DeleteAddressButton
                    addressId={address.id}
                    className="max-w-42 w-full"
                  >
                    Confirm
                  </DeleteAddressButton>
                  <UiCloseButton variant="outline" className="max-w-42 w-full">
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
                    first_name: address.first_name ?? "",
                    last_name: address.last_name ?? "",
                    company: address.company ?? "",
                    phone: address.phone ?? "",
                    address_1: address.address_1 ?? "",
                    address_2: address.address_2 ?? "",
                    postal_code: address.postal_code ?? "",
                    city: address.city ?? "",
                    province: address.province ?? "",
                    country_code: address.country_code ?? "",
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
