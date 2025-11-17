import { Button } from '@new-engine/ui/atoms/button'
import { Icon } from '@new-engine/ui/atoms/icon'

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
      
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Váš košík je prázdný
      </h3>
      <p className="mb-6 text-sm text-gray-500">
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