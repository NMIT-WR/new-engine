import { Button } from '@techsio/ui-kit/atoms/button'

export const ProductActions = () => {
  const buttonClass =
    'w-fit px-0 font-light items-center text-fg-secondary underline hover:no-underline hover:bg-transparent'
  return (
    <div className="flex flex-wrap gap-400">
      <Button
        variant="secondary"
        icon="token-icon-heart-outline"
        theme="unstyled"
        size="current"
        className={buttonClass}
      >
        Vložit do oblíbených
      </Button>
      <Button
        variant="secondary"
        icon="token-icon-paw-outline"
        theme="unstyled"
        size="current"
        className={buttonClass}
      >
        Hlídat produkt
      </Button>
      <Button
        variant="secondary"
        icon="token-icon-help-outline"
        theme="unstyled"
        size="current"
        className={buttonClass}
      >
        Dotaz na produkt
      </Button>
      <Button
        variant="secondary"
        icon="token-icon-email-outline"
        theme="unstyled"
        size="current"
        className={buttonClass}
      >
        Poslat kamarádovi
      </Button>
    </div>
  )
}
