import { Icon } from "@techsio/ui-kit/atoms/icon"
import { LinkButton } from "@techsio/ui-kit/atoms/link-button"

export function OrdersEmpty() {
  return (
    <div className="rounded border border-border-secondary bg-base p-600 text-center">
      <Icon className="text-2xl text-fg-secondary" icon="token-icon-archive" />
      <p className="mb-100 font-medium text-fg-primary">Žádné objednávky</p>
      <p className="mb-400 text-fg-secondary text-sm">
        Zatím jste nevytvořili žádnou objednávku
      </p>
      <LinkButton href="/produkty" size="sm" theme="solid" variant="primary">
        Začít nakupovat
      </LinkButton>
    </div>
  )
}
