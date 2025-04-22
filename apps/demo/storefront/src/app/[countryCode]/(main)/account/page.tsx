import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCustomer } from "@lib/data/customer"
import { getRegion, listRegions } from "@lib/data/regions"
import { UpsertAddressForm } from "@modules/account/components/UpsertAddressForm"
import { PersonalInfoForm } from "@modules/account/components/PersonalInfoForm"
import { SignOutButton } from "@modules/account/components/SignOutButton"
import { Icon } from "@/components/Icon"
import { Button } from "@/components/Button"
import { UiModal, UiModalOverlay } from "@/components/ui/Modal"
import { UiDialog, UiDialogTrigger } from "@/components/Dialog"
import { RequestPasswordResetButton } from "@modules/account/components/RequestPasswordResetButton"
import { AddressSingle } from "@modules/account/components/AddressSingle"
import { AddressMultiple } from "@modules/account/components/AddressMultiple"
import { DefaultShippingAddressSelect } from "@modules/account/components/DefaultShippingAddressSelect"
import { DefaultBillingAddressSelect } from "@modules/account/components/DefaultBillingAddressSelect"
import { UiRadioGroup } from "@/components/ui/Radio"

export const metadata: Metadata = {
  title: "Account - Personal & security",
  description: "Manage your personal information and security settings",
}

export default async function AccountPersonalAndSecurityPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect(`/${countryCode}/auth/login`)
  }

  const [region, regions] = await Promise.all([
    getRegion(countryCode),
    listRegions(),
  ])
  const countries = regions.flatMap((region) => region.countries ?? [])

  return (
    <>
      <h1 className="text-md md:text-lg mb-8 md:mb-16 max-md:font-semibold">
        Personal &amp; security
      </h1>
      <h2 className="text-md font-normal mb-6">Personal information</h2>
      <div className="w-full border border-grayscale-200 rounded-xs p-4 flex flex-wrap gap-8 max-sm:flex-col sm:items-center md:flex-col md:items-stretch lg:items-center lg:flex-row mb-16">
        <div className="flex gap-8 flex-1">
          <Icon name="user" className="w-6 h-6 sm:mt-2.5" />
          <div className="flex max-sm:flex-col sm:flex-wrap gap-6 sm:gap-x-16">
            <div>
              <p className="text-xs text-grayscale-500 mb-1.5">Name</p>
              <p>
                {[customer.first_name, customer.last_name]
                  .filter(Boolean)
                  .join(" ")}
              </p>
            </div>
            <div>
              <p className="text-xs text-grayscale-500 mb-1.5">Number</p>
              <p>{customer.phone || "-"}</p>
            </div>
          </div>
        </div>
        <UiDialogTrigger>
          <Button variant="outline">Change</Button>
          <UiModalOverlay>
            <UiModal>
              <UiDialog>
                <PersonalInfoForm
                  defaultValues={{
                    first_name: customer.first_name ?? "",
                    last_name: customer.last_name ?? "",
                    phone: customer.phone ?? undefined,
                  }}
                />
              </UiDialog>
            </UiModal>
          </UiModalOverlay>
        </UiDialogTrigger>
      </div>
      <h2 className="text-md font-normal mb-6">Contact</h2>
      <div className="w-full border border-grayscale-200 rounded-xs p-4 flex flex-wrap gap-y-6 gap-x-8 items-center mb-4">
        <Icon name="user" className="w-6 h-6" />
        <div>
          <p className="text-xs text-grayscale-500 mb-1.5">Email</p>
          <p>{customer.email}</p>
        </div>
      </div>
      <p className="text-xs text-grayscale-500 mb-16">
        If you want to change your email please contact us via customer support.
      </p>
      <h2 className="text-md font-normal mb-6">
        {customer.addresses.length > 1 ? "Addresses" : "Address"}
      </h2>
      {customer.addresses.length === 0 && (
        <p className="text-grayscale-500 mb-6">
          You don&apos;t have any addresses saved yet.
        </p>
      )}
      {customer.addresses.length === 1 &&
        customer.addresses.map((address) => (
          <AddressSingle
            key={address.id}
            address={address}
            countries={countries}
            region={region}
            className="mb-6"
          />
        ))}
      {customer.addresses.length > 1 && (
        <>
          <DefaultShippingAddressSelect
            addresses={customer.addresses}
            countries={countries}
          />
          <DefaultBillingAddressSelect
            addresses={customer.addresses}
            countries={countries}
          />
          <UiRadioGroup
            className="flex flex-col sm:flex-row md:flex-col lg:flex-row sm:flex-wrap gap-x-6 gap-y-8 mb-6"
            aria-label="address"
          >
            {customer.addresses
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((address) => (
                <AddressMultiple
                  key={address.id}
                  address={address}
                  countries={countries}
                  region={region}
                  className="h-auto sm:max-w-[calc(50%-0.75rem)] md:max-w-full lg:max-w-[calc(50%-0.75rem)] w-full"
                />
              ))}
          </UiRadioGroup>
        </>
      )}
      <UiDialogTrigger>
        {customer.addresses.length > 0 ? (
          <Button className="mb-16 max-sm:w-full">Add another address</Button>
        ) : (
          <Button className="mb-16 max-sm:w-full">Add address</Button>
        )}
        <UiModalOverlay>
          <UiModal>
            <UiDialog>
              <UpsertAddressForm
                region={region ?? undefined}
                defaultValues={{
                  country_code: countryCode,
                }}
              />
            </UiDialog>
          </UiModal>
        </UiModalOverlay>
      </UiDialogTrigger>
      <h2 className="text-md font-normal mb-6 md:mb-4">Change password</h2>
      <p className="max-md:text-xs text-grayscale-500 mb-6">
        To change your password, we&apos;ll send you an email. Just click on the
        reset button below.
      </p>
      <RequestPasswordResetButton />
      <div className="mt-16 md:hidden">
        <p className="text-md mb-6">Log out</p>
        <SignOutButton variant="outline" isFullWidth />
      </div>
    </>
  )
}
