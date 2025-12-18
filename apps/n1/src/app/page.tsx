"use client"
import { LinkButton } from "@techsio/ui-kit/atoms/link-button"
import { ErrorBanner } from "@/components/atoms/error-banner"
import { FeatureBlock } from "@/components/atoms/feature-block"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductGrid } from "@/components/molecules/product-grid"
import { featureBlocks, heroCarouselSlides } from "@/data/home"
import { useProductCategories } from "@/hooks/use-product-categories"
import { useProducts } from "@/hooks/use-products"
import { transformProduct } from "@/utils/transform/transform-product"

export default function Home() {
  const { products: rawProducts, isLoading } = useProducts({
    category_id: [
      "pcat_01K1RB8NEB67KSN2VHMBT1XNX7",
      "pcat_01K1RB8NDSY4KAVFFQVRNP2KAD",
    ],
    limit: 8,
  })

  const {
    categories,
    isLoading: isCategoriesLoading,
    isSuccess: isCategoriesSuccess,
    error: categoriesError,
  } = useProductCategories()

  const rootCategories = categories.filter((cat) => !cat.parent_category_id)
  const topCategories = rootCategories.slice(0, 8)
  const showCategoriesLoading =
    isCategoriesLoading || !(isCategoriesSuccess || categoriesError)

  const products = rawProducts.map(transformProduct)

  return (
    <main className="grid justify-center">
      <section className="w-full">
        <HeroCarousel slides={heroCarouselSlides} />
      </section>

      <section className="mx-auto grid max-w-max-w grid-cols-2 px-section py-section md:grid-cols-[repeat(auto-fit,minmax(25%,1fr))]">
        {featureBlocks.map((block) => (
          <FeatureBlock
            key={`${block.maintText}-${block.subText}`}
            {...block}
          />
        ))}
      </section>

      <section className="bg-surface py-section">
        <div className="mx-auto flex w-full max-w-max-w flex-col gap-section px-section">
          <h2 className="text-center font-bold text-xl">TOP kategorie</h2>
          {categoriesError ? (
            <ErrorBanner
              message={categoriesError}
              title="Nepodařilo se načíst kategorie"
            />
          ) : (
            <div className="grid grid-cols-3 place-items-center gap-300 md:grid-cols-4">
              {showCategoriesLoading ? (
                <p className="col-span-full text-center text-fg-secondary">
                  Načítání kategorií…
                </p>
              ) : (
                topCategories.map((category) => (
                  <LinkButton
                    className="border border-overlay bg-surface py-200 text-fg-primary hover:bg-base"
                    href={`/kategorie/${category.handle}`}
                    key={category.id}
                  >
                    {category.name}
                  </LinkButton>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto my-28 w-full max-w-max-w">
        <h2 className="relative mx-auto mb-section flex max-w-max-w items-center justify-center font-bold text-xl">
          <span className="relative z-10 bg-base px-400 text-fg-primary">
            Vybíráme pro vás
          </span>
          <span className="absolute inset-0 flex items-center">
            <span className="w-full border-border-secondary border-t" />
          </span>
        </h2>
        <ProductGrid
          isLoading={isLoading}
          products={products}
          skeletonCount={8}
        />
      </section>
    </main>
  )
}
