import Image from 'next/image'
import '../../tokens/app-components/molecules/_shipping-selection.css'
import { Button } from '@ui/atoms/button'

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: string
  delivery: string
  deliveryDate?: string
  image?: string
}

// Helper function to calculate delivery date
const getDeliveryDate = (daysToAdd: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysToAdd)
  return date.toLocaleDateString('cs-CZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  })
}

const shippingMethods: ShippingMethod[] = [
  {
    id: 'ppl',
    name: 'PPL',
    description: 'Doručení na adresu',
    price: '89 Kč',
    delivery: 'Doručení za 2-3 pracovní dny',
    deliveryDate: `Doručení ${getDeliveryDate(2)} - ${getDeliveryDate(3)}`,
    image: '/assets/ppl.webp',
  },
  {
    id: 'dhl',
    name: 'DHL',
    description: 'Expresní doručení',
    price: '129 Kč',
    delivery: 'Doručení za 1-2 pracovní dny',
    deliveryDate: `Doručení ${getDeliveryDate(1)} - ${getDeliveryDate(2)}`,
    image: '/assets/dhl.webp',
  },
  {
    id: 'zasilkovna',
    name: 'Zásilkovna',
    description: 'Výdejní místa po celé ČR',
    price: '65 Kč',
    delivery: 'Doručení za 2-3 pracovní dny',
    deliveryDate: `Doručení ${getDeliveryDate(2)} - ${getDeliveryDate(3)}`,
    image: '/assets/zasilkovna.webp',
  },
  {
    id: 'balikovna',
    name: 'Balíkovna',
    description: 'Široká síť výdejních míst',
    price: '59 Kč',
    delivery: 'Doručení za 2-3 pracovní dny',
    deliveryDate: `Doručení ${getDeliveryDate(2)} - ${getDeliveryDate(3)}`,
    image: '/assets/balikovna.webp',
  },
  {
    id: 'personal',
    name: 'Osobní odběr',
    description: 'Vyzvednutí na prodejně',
    price: 'Zdarma',
    delivery: 'Připraveno ihned',
    deliveryDate: 'Vyzvednutí dnes',
    image: '/assets/instore.webp',
  },
]

export interface ShippingSelectionProps {
  selected: string
  onSelect: (method: string) => void
}

export function ShippingSelection({
  selected,
  onSelect,
}: ShippingSelectionProps) {
  return (
    <div className="w-full p-2 sm:p-4">
      <div
        className="grid grid-cols-1 gap-3 sm:gap-4"
        role="radiogroup"
        aria-label="Vyberte způsob dopravy"
      >
        {shippingMethods.map((method) => (
          <Button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className="relative flex items-center rounded-lg border-2 border-border-subtle bg-surface p-3 transition-all duration-200 hover:bg-surface-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base data-[selected=true]:border-primary data-[selected=true]:bg-surface-selected data-[selected=true]:shadow-lg sm:p-4"
            data-selected={selected === method.id}
            role="radio"
            aria-checked={selected === method.id}
            aria-label={`${method.name} - ${method.description} - ${method.price}`}
          >
            {' '}
            <div className="flex flex-1 items-center gap-3 sm:gap-4">
              {method.image && (
                <Image
                  src={method.image}
                  alt={method.name}
                  width={100}
                  height={50}
                  className="h-[30px] w-[60px] object-contain sm:h-[40px] sm:w-[80px] lg:h-[50px] lg:w-[100px]"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-fg-primary">
                  {method.name}
                </h3>
                <p className="mt-0.5 text-fg-secondary text-xs sm:text-sm">
                  {method.description}
                </p>
                <p className="font-medium text-fg-secondary text-xs">
                  {method.deliveryDate || method.delivery}
                </p>
              </div>
              <span className="ml-auto font-bold text-fg-primary sm:text-lg">
                {method.price}
              </span>
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-base transition-all duration-200 sm:h-5 sm:w-5">
                <div
                  className="h-2 w-2 scale-0 rounded-full bg-primary opacity-0 transition-all duration-200 data-[selected=true]:scale-100 data-[selected=true]:opacity-100 sm:h-2.5 sm:w-2.5"
                  data-selected={selected === method.id}
                />
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
