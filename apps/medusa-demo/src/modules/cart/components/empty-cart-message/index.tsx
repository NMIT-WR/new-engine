import { LocalizedLink } from '@/components/LocalizedLink'

const EmptyCartMessage = () => {
  return (
    <div>
      <div className="border-b border-b-grayscale-100 pb-12 lg:h-22 lg:pb-0">
        <h1 className="text-lg leading-none md:text-2xl">Your shopping cart</h1>
      </div>
      <p className="mt-4 mb-6 max-w-[32rem] text-base-regular">
        You don&apos;t have anything in your cart. Let&apos;s change that, use
        the link below to start browsing our products.
      </p>
      <div>
        <LocalizedLink href="/store">Explore products</LocalizedLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
