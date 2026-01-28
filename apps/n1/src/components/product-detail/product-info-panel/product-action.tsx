import { Button } from "@techsio/ui-kit/atoms/button"

export const ProductActions = () => {
  const buttonClass =
    "w-fit px-0 font-light items-center text-fg-secondary underline hover:no-underline hover:bg-transparent"
  return (
    <div className="flex flex-wrap gap-400">
      <Button
        className={buttonClass}
        icon="token-icon-heart-outline"
        size="current"
        theme="unstyled"
        variant="secondary"
      >
        Vložit do oblíbených
      </Button>
      <Button
        className={buttonClass}
        icon="token-icon-paw-outline"
        size="current"
        theme="unstyled"
        variant="secondary"
      >
        Hlídat produkt
      </Button>
      <Button
        className={buttonClass}
        icon="token-icon-help-outline"
        size="current"
        theme="unstyled"
        variant="secondary"
      >
        Dotaz na produkt
      </Button>
      <Button
        className={buttonClass}
        icon="token-icon-email-outline"
        size="current"
        theme="unstyled"
        variant="secondary"
      >
        Poslat kamarádovi
      </Button>
    </div>
  )
}
