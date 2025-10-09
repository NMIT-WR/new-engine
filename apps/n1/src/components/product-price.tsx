interface ProductPriceProps {
  priceWithTax: string
  priceWithoutTax?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ProductPrice = ({
  priceWithTax,
  priceWithoutTax,
  size = 'md',
  className = '',
}: ProductPriceProps) => {
  const sizeClasses = {
    sm: 'text-md',
    md: 'text-lg',
    lg: 'text-xl',
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={`font-bold ${sizeClasses[size]}`}>{priceWithTax}</span>
      {priceWithoutTax && (
        <span className="text-fg-secondary text-sm">
          {priceWithoutTax} bez DPH
        </span>
      )}
    </div>
  )
}
