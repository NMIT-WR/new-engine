import { Heading } from '@/components/heading'

export default function NovinkyPage() {
  return (
    <article className="space-y-600">
      <Heading>Novinky</Heading>

      <section className="py-800">
        <p className="mb-400 text-fg-secondary">Zobrazeno 0 produktů</p>
        <p className="py-800 text-center text-fg-tertiary text-lg">
          Nebyl nalezen žádný produkt
        </p>
      </section>
    </article>
  )
}
