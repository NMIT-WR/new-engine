import { FeatureBlock } from '@/components/atoms/feature-block'
import { HeroCarousel } from '@/components/hero-carousel'
import { TopProduct } from '@/components/top-product'
import { featureBlocks, topCategory } from '@/data/home'
import { heroCarouselSlides } from '@/data/home'

export default function Home() {
  return (
    <div className="grid min-h-screen justify-center">
      <header>
        <h1>Nový Engine</h1>
      </header>
      <main>
        <section className="w-full">
          <HeroCarousel slides={heroCarouselSlides} />
        </section>
        <section className="mx-auto flex w-max-w justify-around py-section">
          {featureBlocks.map((block, index) => (
            <FeatureBlock key={index} {...block} />
          ))}
        </section>

        <section className="bg-surface py-section">
          <div className="mx-auto flex w-max-w flex-col gap-section">
            <h2 className="text-center font-bold text-xl">TOP kategorie</h2>
            <div className="flex justify-around gap-800">
              {topCategory.map((category, index) => (
                <TopProduct key={index} {...category} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer>
        <h2>Footer</h2>
      </footer>
    </div>
  )
}
