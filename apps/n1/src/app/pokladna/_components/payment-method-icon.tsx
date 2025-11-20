interface PaymentMethodIconProps {
  method: 'mastercard' | 'paypal' | 'klarna'
  className?: string
}

export function PaymentMethodIcon({
  method,
  className = '',
}: PaymentMethodIconProps) {
  const labels = {
    mastercard: 'Mastercard',
    paypal: 'PayPal',
    klarna: 'Klarna',
  }

  return (
    <div
      className={`rounded border border-border-primary bg-surface p-100 ${className}`}
    >
      <span className="font-semibold text-sm">{labels[method]}</span>
    </div>
  )
}
