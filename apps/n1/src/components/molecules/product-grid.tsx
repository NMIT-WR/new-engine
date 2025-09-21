import type { Product } from '@/types/product'
import { ProductCard } from '@new-engine/ui/molecules/product-card'

export const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-4 gap-200">
      {products.map((product, index) => (
        <ProductCard
          key={product.title}
          name={product.title}
          price={product.price}
          imageSrc={product.imageSrc}
          stockStatus=""
        />
      ))}
    </div>
  )
}
