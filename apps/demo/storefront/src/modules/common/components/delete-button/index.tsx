"use client"
import { Icon } from "@/components/Icon"
import { withReactQueryProvider } from "@lib/util/react-query"
import { useDeleteLineItem } from "hooks/cart"

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
      <Icon name="trash" className="w-4 h-4 sm:w-6 sm:h-6" />
    </button>
  )
}

export default withReactQueryProvider(DeleteButton)
