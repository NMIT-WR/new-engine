import { Heading } from '@/components/heading'
import { rootCategories } from '@/data/static/categories'
import Link from 'next/link'

export default function CategoryNotFound() {
  return (
    <main className="mx-auto grid w-max-w max-w-screen">
      <article className="mt-900 space-y-400 px-500">
        <Heading>Kategorie nenalezena - 404</Heading>
        <p className="text-fg-secondary">
          Omlouváme se, ale tato kategorie neexistuje nebo byla odstraněna.
        </p>
        <nav className="space-y-300">
          <h2 className="font-semibold text-lg">Prohlédněte si naše kategorie:</h2>
          <ul className="flex flex-wrap gap-200">
            {rootCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/kategorie/${category.handle}`}
                  className="inline-block bg-surface px-400 py-200 text-fg-primary transition-colors hover:bg-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-fg-tertiary text-sm">
          Nebo se vraťte na{' '}
          <Link href="/" className="text-fg-primary underline hover:no-underline">
            hlavní stránku
          </Link>
          .
        </p>
      </article>
    </main>
  )
}
