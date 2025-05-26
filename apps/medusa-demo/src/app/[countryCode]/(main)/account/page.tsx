import { Button } from '@/components/Button'
import { UiDialog, UiDialogTrigger } from '@/components/Dialog'
import { Icon } from '@/components/Icon'
import { UiModal, UiModalOverlay } from '@/components/ui/Modal'
import { UiRadioGroup } from '@/components/ui/Radio'
import { getCustomer } from '@lib/data/customer'
import { getRegion, listRegions } from '@lib/data/regions'
import { AddressMultiple } from '@modules/account/components/AddressMultiple'
import { AddressSingle } from '@modules/account/components/AddressSingle'
import { DefaultBillingAddressSelect } from '@modules/account/components/DefaultBillingAddressSelect'
import { DefaultShippingAddressSelect } from '@modules/account/components/DefaultShippingAddressSelect'
import { PersonalInfoForm } from '@modules/account/components/PersonalInfoForm'
import { RequestPasswordResetButton } from '@modules/account/components/RequestPasswordResetButton'
import { SignOutButton } from '@modules/account/components/SignOutButton'
import { UpsertAddressForm } from '@modules/account/components/UpsertAddressForm'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Account - Personal & security',
  description: 'Manage your personal information and security settings',
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
      <h1 className="mb-8 text-md max-md:font-semibold md:mb-16 md:text-lg">
        Personal &amp; security
      </h1>
      <h2 className="mb-6 font-normal text-md">Personal information</h2>
      <div className="mb-16 flex w-full flex-wrap gap-8 rounded-xs border border-grayscale-200 p-4 max-sm:flex-col sm:items-center md:flex-col md:items-stretch lg:flex-row lg:items-center">
        <div className="flex flex-1 gap-8">
          <Icon name="user" className="h-6 w-6 sm:mt-2.5" />
          <div className="flex gap-6 max-sm:flex-col sm:flex-wrap sm:gap-x-16">
            <div>
              <p className="mb-1.5 text-grayscale-500 text-xs">Name</p>
              <p>
                {[customer.first_name, customer.last_name]
                  .filter(Boolean)
                  .join(' ')}
              </p>
            </div>
            <div>
              <p className="mb-1.5 text-grayscale-500 text-xs">Number</p>
              <p>{customer.phone || '-'}</p>
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
                    first_name: customer.first_name ?? '',
                    last_name: customer.last_name ?? '',
                    phone: customer.phone ?? undefined,
                  }}
                />
              </UiDialog>
            </UiModal>
          </UiModalOverlay>
        </UiDialogTrigger>
      </div>
      <h2 className="mb-6 font-normal text-md">Contact</h2>
      <div className="mb-4 flex w-full flex-wrap items-center gap-x-8 gap-y-6 rounded-xs border border-grayscale-200 p-4">
        <Icon name="user" className="h-6 w-6" />
        <div>
          <p className="mb-1.5 text-grayscale-500 text-xs">Email</p>
          <p>{customer.email}</p>
        </div>
      </div>
      <p className="mb-16 text-grayscale-500 text-xs">
        If you want to change your email please contact us via customer support.
      </p>
      <h2 className="mb-6 font-normal text-md">
        {customer.addresses.length > 1 ? 'Addresses' : 'Address'}
      </h2>
      {customer.addresses.length === 0 && (
        <p className="mb-6 text-grayscale-500">
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
            className="mb-6 flex flex-col gap-x-6 gap-y-8 sm:flex-row sm:flex-wrap md:flex-col lg:flex-row"
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
                  className="h-auto w-full sm:max-w-[calc(50%-0.75rem)] md:max-w-full lg:max-w-[calc(50%-0.75rem)]"
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
      <h2 className="mb-6 font-normal text-md md:mb-4">Change password</h2>
      <p className="mb-6 text-grayscale-500 max-md:text-xs">
        To change your password, we&apos;ll send you an email. Just click on the
        reset button below.
      </p>
      <RequestPasswordResetButton />
      <div className="mt-16 md:hidden">
        <p className="mb-6 text-md">Log out</p>
        <SignOutButton variant="outline" isFullWidth />
      </div>
    </>
  )
}
