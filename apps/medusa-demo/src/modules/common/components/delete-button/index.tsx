'use client'
import { Icon } from '@/components/Icon'
import { withReactQueryProvider } from '@lib/util/react-query'
import { useDeleteLineItem } from 'hooks/cart'

const DeleteButton = ({ id }: { id: string }) => {
  const { mutate, isPending } = useDeleteLineItem()

  return (
    <button
      type="button"
      onClick={() => mutate({ lineId: id })}
      disabled={isPending}
      className="p-1"
      aria-label="Delete"
    >
      <Icon name="trash" className="h-4 w-4 sm:h-6 sm:w-6" />
    </button>
  )
}

export default withReactQueryProvider(DeleteButton)
