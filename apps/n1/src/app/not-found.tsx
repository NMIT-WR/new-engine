export default function NotFound() {
  return (
    <main className="mx-auto grid w-max-w">
      <article className="mt-900 space-y-400">
        <h1 className="relative font-bold text-2xl after:absolute after:bottom-0 after:left-0 after:h-100 after:w-24 after:bg-primary">
          Stránka nenalezena - 404
        </h1>
        <p className="text-fg-secondary">
          Omlouváme se, ale tato stránka neexistuje. Co se zkusit vrátit na
          hlavní stránku a prozkoumat náš eshop?
        </p>
      </article>
    </main>
  )
}
