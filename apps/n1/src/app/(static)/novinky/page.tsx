"use client"
import { ErrorBanner } from "@/components/atoms/error-banner"
import { Heading } from "@/components/heading"
import { ProductGrid } from "@/components/molecules/product-grid"
import { useProducts } from "@/hooks/use-products"
import { PRODUCT_LIMIT } from "@/lib/constants"
import { transformProduct } from "@/utils/transform/transform-product"

export default function NovinkyPage() {
  const {
    products: rawProducts,
    isLoading,
    isSuccess,
    totalCount,
    error,
  } = useProducts({
    limit: PRODUCT_LIMIT,
  })

  const products = rawProducts.map(transformProduct)
  const showLoading = isLoading || !(isSuccess || error)

  return (
    <article className="space-y-600">
      <Heading>Novinky</Heading>

      <section className="py-800">
        {error && (
          <ErrorBanner
            className="mb-400"
            message={error}
            title="Nepodařilo se načíst produkty"
          />
        )}

        {!error && isSuccess && (
          <p className="mb-400 text-fg-secondary">
            Zobrazeno {totalCount} produktů
          </p>
        )}

        <ProductGrid isLoading={showLoading} products={products} />
      </section>
    </article>
  )
}
