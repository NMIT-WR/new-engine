import { Icon } from '@ui/atoms/icon'
import { LinkButton } from '@ui/atoms/link-button'
import Link from 'next/link'

export function OrdersEmpty() {
  return (
    <div className="rounded-sm border border-orders-border bg-orders-card-bg p-orders-empty text-center">
      <Icon
        icon="icon-[mdi--archive-outline]"
        className="mx-auto mb-md h-16 w-16 text-fg-tertiary"
      />
      <p className="mb-xs font-medium text-orders-fg-primary">
        Žádné objednávky
      </p>
      <p className="mb-md text-orders-fg-secondary text-orders-md">
        Zatím jste nevytvořili žádnou objednávku
      </p>
      <LinkButton
        as={Link}
        variant="primary"
        theme="solid"
        href="/products"
        size="sm"
      >
        Začít nakupovat
      </LinkButton>
    </div>
  )
}
