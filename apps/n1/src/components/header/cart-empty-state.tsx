import { Button } from '@techsio/ui-kit/atoms/button'
import { Icon } from '@techsio/ui-kit/atoms/icon'

interface CartEmptyStateProps {
  onContinueShopping?: () => void
}

export const CartEmptyState = ({ onContinueShopping }: CartEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icon
        icon="icon-[mdi--cart-outline]"
        className="mb-4 text-6xl text-gray-300"
      />

      <h3 className="mb-2 font-semibold text-gray-900 text-lg">
        Váš košík je prázdný
      </h3>
      <p className="mb-6 text-gray-500 text-sm">
        Přidejte si něco hezkého z naší nabídky
      </p>

      <Button
        variant="primary"
        theme="solid"
        size="md"
        onClick={onContinueShopping}
        className="min-w-[200px]"
      >
        Pokračovat v nákupu
      </Button>
    </div>
  )
}
