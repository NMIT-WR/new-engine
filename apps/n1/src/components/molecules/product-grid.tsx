import type { Product } from '@/types/product'
import { ProductCard } from '@new-engine/ui/molecules/product-card'
import Image from 'next/image'

export const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="mx-auto grid max-w-max-w grid-cols-4 gap-200">
      {products.map((product, index) => (
        <ProductCard
          key={product.title}
          className="max-w-[250px] cursor-pointer place-items-center hover:shadow-lg"
        >
          <ProductCard.Name className="text-center">
            {product.title}
          </ProductCard.Name>
          <ProductCard.Image
            as={Image}
            width={250}
            height={250}
            src={product.imageSrc}
            className="aspect-square"
          />
          <div className="flex flex-col items-center gap-200">
            <ProductCard.Badges>
              <ProductCard.Badge variant="new">Novinka</ProductCard.Badge>
              <ProductCard.Badge variant="limited">
                Více variant
              </ProductCard.Badge>
            </ProductCard.Badges>
            <ProductCard.Actions>
              <ProductCard.Button
                buttonVariant="custom"
                className="h-8 w-8 border border-gray-400 bg-surface px-50 py-50"
              >
                <span className="text-fg-primary">42</span>
              </ProductCard.Button>
              <ProductCard.Button
                buttonVariant="custom"
                className="h-8 w-8 border border-gray-400 bg-surface px-50 py-50"
              >
                <span className="text-fg-primary">43</span>
              </ProductCard.Button>
              <ProductCard.Button
                buttonVariant="custom"
                className="h-8 w-8 border border-gray-400 bg-surface px-50 py-50"
              >
                <span className="text-fg-primary">44</span>
              </ProductCard.Button>
            </ProductCard.Actions>
          </div>
          <ProductCard.Stock status="in-stock" className="my-400">
            {product.stockValue}
          </ProductCard.Stock>
          <ProductCard.Price>{product.price}</ProductCard.Price>
          <ProductCard.Actions>
            <ProductCard.Button
              buttonVariant="cart"
              icon="icon-[mdi--cart-outline]"
            >
              <span className="font-bold uppercase">Do košíku</span>
            </ProductCard.Button>
          </ProductCard.Actions>
        </ProductCard>
      ))}
    </div>
  )
}
