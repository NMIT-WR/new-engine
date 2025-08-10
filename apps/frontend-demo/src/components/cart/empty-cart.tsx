import { Icon } from '@new-engine/ui/atoms/icon'
import { LinkButton } from '@new-engine/ui/atoms/link-button'
import Link from 'next/link'

export function EmptyCart() {
  return (
    <div className="py-cart-empty-y text-center">
      <Icon
        icon="icon-[mdi--cart-outline]"
        size="2xl"
        className="mb-cart-empty-icon-margin"
      />
      <h2 className="mb-cart-empty-title-margin font-cart-empty-title text-cart-empty-title">
        Váš košík je prázdný
      </h2>
      <p className="mb-cart-empty-text-margin text-cart-empty-text">
        Vypadá to, že jste do košíku ještě nic nepřidali.
      </p>
      <LinkButton
        href="/products"
        size="lg"
        icon="icon-[mdi--shopping-outline]"
        as={Link}
      >
        Začít Nakupovat
      </LinkButton>
    </div>
  )
}
