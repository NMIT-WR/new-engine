import Image from 'next/image'
import '../../tokens/app-components/molecules/_shipping-selection.css'

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
    month: 'numeric' 
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
    <div className="w-full p-shipping-root">
      <div
        className="space-y-shipping-list grid grid-cols-1 l:grid-cols-2 gap-4"
        role="radiogroup"
        aria-label="Vyberte způsob dopravy"
      >
        {shippingMethods.map((method) => (
          <button
            type="button"
            key={method.id}
            onClick={() => onSelect(method.id)}
            className="relative flex items-center p-shipping-card bg-shipping-card-bg border-shipping-card rounded-shipping-card cursor-pointer transition-all duration-200 hover:bg-shipping-card-bg-hover hover:shadow-shipping-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shipping-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shipping-bg data-[selected=true]:bg-shipping-card-bg-selected data-[selected=true]:border-shipping-card-selected data-[selected=true]:shadow-shipping-card-selected"
            data-selected={selected === method.id}
            role="radio"
            aria-checked={selected === method.id}
            aria-label={`${method.name} - ${method.description} - ${method.price}`}
          >
            <div className="flex items-center gap-shipping-content flex-1">
              {method.image ? (
                <Image
                  src={method.image}
                  alt={method.name}
                  width={100}
                  height={50}
                  className="w-shipping-img h-shipping-img object-contain"
                />
              ) : (
                <div
                  className="w-shipping-img h-shipping-img object-contain flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800"
                >
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-shipping-name font-shipping-name">{method.name}</h3>
                <p className="text-shipping-desc mt-shipping-desc">{method.description}</p>
                <p className="text-shipping-delivery font-shipping-delivery">{method.deliveryDate || method.delivery}</p>
              </div>
              <span className="text-shipping-price font-shipping-price ml-auto">{method.price}</span>
              <div className="w-shipping-radio h-shipping-radio rounded-full border-shipping-radio bg-shipping-radio-bg flex items-center justify-center transition-all duration-200">
                <div
                  className="w-shipping-radio-dot h-shipping-radio-dot rounded-full bg-shipping-radio-dot scale-0 opacity-0 transition-all duration-200 data-[selected=true]:scale-100 data-[selected=true]:opacity-100"
                  data-selected={selected === method.id}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

