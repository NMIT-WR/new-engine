'use client'

import { UiConfirmButton } from '@/components/Dialog'
import { withReactQueryProvider } from '@lib/util/react-query'
import { useDeleteCustomerAddress } from 'hooks/customer'

export const DeleteAddressButton = withReactQueryProvider<{
  addressId: string
  className?: string
  children: React.ReactNode
}>(({ addressId, children, ...rest }) => {
  const { mutateAsync, isPending } = useDeleteCustomerAddress()

  return (
    <UiConfirmButton
      {...rest}
      onConfirm={async () => {
        await mutateAsync(addressId).catch((error) => {
          console.error(error)
        })
      }}
      isLoading={isPending}
    >
      {children}
    </UiConfirmButton>
  )
})
