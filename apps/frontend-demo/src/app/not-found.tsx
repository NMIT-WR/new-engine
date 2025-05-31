import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="btn btn-primary"
          >
            Go to Homepage
          </Link>
          <Link
            href="/products"
            className="btn btn-secondary"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}