import { LocalizedLink } from "@/components/LocalizedLink"

const EmptyCartMessage = () => {
  return (
    <div>
      <div className="lg:h-22 pb-12 lg:pb-0 border-b border-b-grayscale-100">
        <h1 className="md:text-2xl text-lg leading-none">Your shopping cart</h1>
      </div>
      <p className="text-base-regular mt-4 mb-6 max-w-[32rem]">
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
