import { useProducts } from '@/hooks/use-products'
import { ROOT_CATEGORIES } from '@/lib/constants'
import { transformProduct } from '@/utils/transform/transform-product'
import { ProductCard } from '@techsio/ui-kit/molecules/product-card'

export const TopSales = () => {
  const category = ROOT_CATEGORIES[0]
  const data = useProducts({
    category_id: [
      'pcat_01K1RB8G2KVYFH1P049EASAHMN',
      'pcat_01K1RB8G322KC5XCT61EPH0750',
    ],
    limit: 4,
  })

  const products = data?.products.map(transformProduct)

  return (
    <div>
      <h2>Top Sales</h2>
      {products?.map((product) => (
        <ProductCard key={product.id} layout="row">
          <ProductCard.Image width={200} height={200} src={product.imageSrc} />
          <ProductCard.Name>{product.title}</ProductCard.Name>
          <ProductCard.Price>{product.price}</ProductCard.Price>
        </ProductCard>
      ))}
    </div>
  )
}
