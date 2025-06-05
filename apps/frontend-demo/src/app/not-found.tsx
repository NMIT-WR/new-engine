import Link from 'next/link'

export default function NotFound() {
  
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center'>
      <div className='text-center'>
        <h1 className='mb-not-found-code-margin font-not-found-code text-not-found-code-size text-not-found-code'>404</h1>
        <h2 className='mb-not-found-title-margin font-not-found-title text-not-found-title-size text-not-found-title'>Page Not Found</h2>
        <p className='mb-not-found-text-margin text-not-found-text'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className='flex justify-center gap-not-found-actions-gap'>
          <Link href="/" className="">
            Go to Homepage
          </Link>
          <Link href="/products" className="">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}
