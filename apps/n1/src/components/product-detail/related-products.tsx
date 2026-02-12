import { useProducts } from "@/hooks/product-hooks"
import { transformProduct } from "@/utils/transform/transform-product"
import { ProductGrid } from "../molecules/product-grid"

type RelatedProductsProps = {
  categories?: string[]
}

export const RelatedProducts = ({ categories }: RelatedProductsProps) => {
  const { products: rawProducts } = useProducts({
    category_id: categories,
    limit: 4,
  })
  const products = rawProducts.map(transformProduct)
  return (
    <div>
      <h3 className="font-bold text-lg">PODOBNÉ PRODUKTY</h3>
      <div className="flex max-w-max-w justify-around">
        {products && <ProductGrid products={products} />}
      </div>
    </div>
  )
}
