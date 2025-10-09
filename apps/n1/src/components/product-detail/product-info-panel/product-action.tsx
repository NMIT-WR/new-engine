import { Button } from '@new-engine/ui/atoms/button'

export const ProductActions = () => {
  const buttonClass =
    'w-fit px-0 font-light text-fg-secondary underline hover:no-underline hover:bg-transparent'
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4">
      <Button
        variant="secondary"
        icon="token-icon-heart-outline"
        theme="borderless"
        className={buttonClass}
      >
        Vložit do oblíbených
      </Button>
      <Button
        variant="secondary"
        icon="token-icon-paw-outline"
        theme="borderless"
        className={buttonClass}
      >
        Hlídat produkt
      </Button>
      <Button
        variant="secondary"
        icon="token-icon-help-outline"
        theme="borderless"
        className={buttonClass}
      >
        Dotaz na produkt
      </Button>
      <Button
        variant="secondary"
        icon="token-icon-email-outline"
        theme="borderless"
        className={buttonClass}
      >
        Poslat kamarádovi
      </Button>
    </div>
  )
}
