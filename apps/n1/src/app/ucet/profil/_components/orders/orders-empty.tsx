import { Button } from '@techsio/ui-kit/atoms/button'
import { Icon } from '@techsio/ui-kit/atoms/icon'
import Link from 'next/link'

export function OrdersEmpty() {
  return (
    <div className="rounded border border-border-secondary bg-base p-600 text-center">
      <Icon icon="token-icon-archive" className="text-2xl text-fg-secondary" />
      <p className="mb-100 font-medium text-fg-primary">Žádné objednávky</p>
      <p className="mb-400 text-fg-secondary text-sm">
        Zatím jste nevytvořili žádnou objednávku
      </p>
      <Button variant="primary" theme="solid" size="sm">
        <Link href="/produkty">Začít nakupovat</Link>
      </Button>
    </div>
  )
}
