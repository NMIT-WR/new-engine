import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-not-found-code-margin font-not-found-code text-not-found-code text-not-found-code-size">
          404
        </h1>
        <h2 className="mb-not-found-title-margin font-not-found-title text-not-found-title text-not-found-title-size">
          Stránka nenalezena
        </h2>
        <p className="mb-not-found-text-margin text-not-found-text">
          Stránka, kterou hledáte, neexistuje nebo byla přesunuta.
        </p>
        <div className="flex justify-center gap-not-found-actions-gap">
          <Link href="/" className="">
            Přejít na úvodní stránku
          </Link>
          <Link href="/products" className="">
            Prohlédnout produkty
          </Link>
        </div>
      </div>
    </div>
  )
}
