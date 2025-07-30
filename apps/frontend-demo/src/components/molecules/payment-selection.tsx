import Image from 'next/image'
import '../../tokens/app-components/molecules/_payment-selection.css'
import { PAYMENT_METHODS } from '@/lib/checkout-data'
import { Button } from '@ui/atoms/button'
import { Icon } from '@ui/atoms/icon'
import { useToast } from '@ui/molecules/toast'

interface PaymentSelectionProps {
  selected: string
  onSelect: (method: string) => void
  currentStep: number
  setCurrentStep: (step: number) => void
}

export function PaymentSelection({
  selected,
  onSelect,
  currentStep,
  setCurrentStep,
}: PaymentSelectionProps) {
  const toast = useToast()
  const handleProgress = () => {
    if (selected) {
      setCurrentStep(currentStep + 1)
    } else {
      toast.create({
        type: 'error',
        title: 'Vyberte způsob platby',
        description: 'Pro pokračování je nutné vybrat způsob platby',
      })
    }
  }
  return (
    <div className="w-full space-y-250 py-2 sm:py-4">
      <div className="mb-3 flex items-center gap-2 text-fg-secondary text-xs sm:mb-4 sm:text-sm">
        <Icon icon="token-icon-lock" />
        <span>Všechny platby jsou zabezpečené a šifrované</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4 xl:grid-cols-4">
        {PAYMENT_METHODS.map((method) => (
          <Button
            theme="borderless"
            key={method.id}
            onClick={() => onSelect(method.id)}
            className="relative flex h-[100px] flex-col items-center justify-center rounded-lg border-2 border-border-subtle bg-surface p-2 transition-all duration-200 hover:bg-surface-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base data-[selected=true]:border-primary data-[selected=true]:bg-surface-selected data-[selected=true]:shadow-lg sm:h-[140px] sm:p-3 lg:h-[180px] lg:p-4"
            data-selected={selected === method.id}
            aria-pressed={selected === method.id}
            aria-label={`Vybrat platební metodu ${method.name}`}
          >
            <div
              className="absolute top-1 right-1 flex h-5 w-5 scale-0 items-center justify-center rounded-full bg-primary opacity-0 transition-all duration-200 data-[selected=true]:scale-100 data-[selected=true]:opacity-100 sm:top-2 sm:right-2 sm:h-6 sm:w-6"
              data-selected={selected === method.id}
            >
              <Icon icon="token-icon-check" className="text-fg-reverse" />
            </div>
            <Image
              src={method.image}
              alt={method.name}
              width={120}
              height={80}
              className={`h-[40px] w-[60px] object-contain brightness-100 sm:h-[50px] sm:w-[80px] lg:h-[60px] lg:w-[100px] ${(method.id === 'qr' || method.id === 'cash') && 'dark-white'}`}
            />
            <span className="mt-1 text-center font-medium text-xs sm:mt-2 sm:text-sm">
              {method.name}
            </span>
          </Button>
        ))}
      </div>
      <div className="flex justify-between">
        <Button size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
          Zpět
        </Button>
        <Button size="sm" onClick={handleProgress}>
          Pokračovat
        </Button>
      </div>
    </div>
  )
}
