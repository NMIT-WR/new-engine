import Image from 'next/image'
import '../../tokens/app-components/molecules/_payment-selection.css'
import { Button } from '@ui/atoms/button'
import { Icon } from '@ui/atoms/icon'

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
  return (
    <div className="w-full p-2 sm:p-4">
      <div className="mb-3 flex items-center gap-2 text-fg-secondary text-xs sm:mb-4 sm:text-sm">
        <Icon icon="token-icon-lock"/>
        <span>Všechny platby jsou zabezpečené a šifrované</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4 lg:gap-4">
        {paymentMethods.map((method) => (
          <Button
            theme="borderless"
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`relative flex h-[100px] flex-col items-center justify-center rounded-lg border-2 border-border-subtle bg-surface p-2 transition-all duration-200 hover:bg-surface-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base data-[selected=true]:border-primary data-[selected=true]:bg-surface-selected data-[selected=true]:shadow-lg sm:h-[140px] sm:p-3 lg:h-[180px] lg:p-4`}
            data-selected={selected === method.id}
            aria-pressed={selected === method.id}
            aria-label={`Vybrat platební metodu ${method.name}`}
          >
            {' '}
            <div
              className={`absolute top-1 right-1 flex h-5 w-5 scale-0 items-center justify-center rounded-full bg-primary opacity-0 transition-all duration-200 data-[selected=true]:scale-100 data-[selected=true]:opacity-100 sm:top-2 sm:right-2 sm:h-6 sm:w-6`}
              data-selected={selected === method.id}
            >
              <Icon icon="token-icon-check" className="text-fg-reverse" />
            </div>
            <Image
              src={method.image}
              alt={method.name}
              width={120}
              height={80}
              className="h-[40px] w-[60px] object-contain sm:h-[50px] sm:w-[80px] lg:h-[60px] lg:w-[100px]"
            />
            <span className="mt-1 text-center font-medium text-xs sm:mt-2 sm:text-sm">
              {method.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
