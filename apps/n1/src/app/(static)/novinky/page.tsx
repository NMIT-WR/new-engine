import { Heading } from '@/components/heading'

export default function NovinkyPage() {
  return (
    <article className="space-y-600">
      <Heading>Novinky</Heading>

      <section className="py-800">
        <p className="py-800 text-center text-fg-tertiary text-lg">
          Aktuálně nemáme žádné novinky.
        </p>
      </section>
    </article>
  )
}
