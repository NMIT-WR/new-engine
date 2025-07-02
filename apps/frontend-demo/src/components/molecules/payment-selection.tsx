import { tv } from '@ui/utils'
import Image from 'next/image'
import '../../tokens/app-components/molecules/_payment-selection.css'

const paymentSelectionStyles = tv({
  slots: {
    root: 'w-full p-payment-root',
    grid: 'grid gap-payment-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    card: [
      'relative flex flex-col items-center justify-center p-payment-card',
      'bg-payment-card-bg border-payment-card rounded-payment-card',
      'cursor-pointer transition-all duration-200',
      'hover:bg-payment-card-bg-hover hover:shadow-payment-card-hover',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-payment-ring',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-payment-bg',
      'data-[selected=true]:bg-payment-card-bg-selected',
      'data-[selected=true]:border-payment-card-selected',
      'data-[selected=true]:shadow-payment-card-selected',
      'h-payment-card',
    ],
    image: 'w-payment-img h-payment-img object-contain',
    label: 'mt-payment-label text-payment-label font-payment-label text-center',
    badge: [
      'absolute top-payment-badge right-payment-badge',
      'w-payment-badge h-payment-badge bg-payment-badge rounded-full',
      'flex items-center justify-center opacity-0 scale-0',
      'transition-all duration-200',
      'data-[selected=true]:opacity-100 data-[selected=true]:scale-100',
    ],
    icon: 'w-payment-icon h-payment-icon text-payment-icon',
  },
})

export interface PaymentMethod {
  id: string
  name: string
  image: string
  available?: boolean
}

const paymentMethods: PaymentMethod[] = [
  { id: 'comgate', name: 'Comgate', image: '/assets/comgate.webp' },
  { id: 'gopay', name: 'GoPay', image: '/assets/gpay.webp' },
  { id: 'paypal', name: 'PayPal', image: '/assets/paypal.webp' },
  { id: 'cash', name: 'Dobírkou', image: '/assets/cash.webp' },
  { id: 'skippay', name: 'SkipPay', image: '/assets/skippay.webp' },
  { id: 'stripe', name: 'Stripe', image: '/assets/stripe.webp' },
  { id: 'card', name: 'Platební kartou', image: '/assets/card.webp' },
  { id: 'qr', name: 'QR platba', image: '/assets/qr.webp' },
]

export interface PaymentSelectionProps {
  selected: string
  onSelect: (method: string) => void
}

export function PaymentSelection({
  selected,
  onSelect,
}: PaymentSelectionProps) {
  const { root, grid, card, image, label, badge, icon } =
    paymentSelectionStyles()

  return (
    <div className={root()}>
      <div className={grid()}>
        {paymentMethods.map((method) => (
          <button
            type="button"
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={card()}
            data-selected={selected === method.id}
            aria-pressed={selected === method.id}
            aria-label={`Vybrat platební metodu ${method.name}`}
          >
            <div className={badge()} data-selected={selected === method.id}>
              <svg className={icon()} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <Image
              src={method.image}
              alt={method.name}
              width={120}
              height={80}
              className={image()}
            />
            <span className={label()}>{method.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

