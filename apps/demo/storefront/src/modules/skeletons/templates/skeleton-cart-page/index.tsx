import repeat from "@lib/util/repeat"
import SkeletonCartItem from "@modules/skeletons/components/skeleton-cart-item"
import SkeletonOrderSummary from "@modules/skeletons/components/skeleton-order-summary"
import { Layout, LayoutColumn } from "@/components/Layout"
import { Skeleton } from "@/components/ui/Skeleton"

const SkeletonCartPage = () => {
  return (
    <Layout className="py-26 md:pb-36 md:pt-39">
      <LayoutColumn
        start={1}
        end={{ base: 13, lg: 9, xl: 10 }}
        className="mb-14 lg:mb-0"
      >
        <div className="pb-8 md:pb-12 border-b border-b-grayscale-100">
          <Skeleton className="w-54 md:w-108 h-6 md:h-[4.1875rem]" />
        </div>
        <div>
          {repeat(3).map((index) => (
            <SkeletonCartItem key={index} />
          ))}
        </div>
      </LayoutColumn>
      <LayoutColumn
        start={{ base: 1, lg: 9, xl: 10 }}
        end={13}
        className="lg:pt-8"
      >
        <SkeletonOrderSummary />
      </LayoutColumn>
    </Layout>
  )
}

export default SkeletonCartPage
