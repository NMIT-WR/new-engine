import { Layout, LayoutColumn } from "@/components/Layout"
import { Skeleton } from "@/components/ui/Skeleton"
import SkeletonButton from "@modules/skeletons/components/skeleton-button"

const SkeletonOrderConfirmed = () => {
  return (
    <Layout className="pt-39 pb-36">
      <LayoutColumn
        start={{ base: 1, lg: 3, xl: 4 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <Skeleton className="w-full h-17 mb-6" />
        <Skeleton className="w-[90%] h-12 mb-4" />
        <Skeleton className="w-[80%] h-12 mb-4" />
        <div className="flex flex-col sm:flex-row mt-16 gap-8">
          <div className="flex-1">
            <Skeleton className="w-30 h-5 mb-2" />
            <Skeleton className="w-25 h-5 mb-2" />
            <Skeleton className="w-20 h-5 mb-2" />
            <Skeleton className="w-15 h-5" />
          </div>
          <div className="flex-1">
            <Skeleton className="w-30 h-5 mb-2" />
            <Skeleton className="w-25 h-5 mb-2" />
            <Skeleton className="w-20 h-5 mb-2" />
            <Skeleton className="w-15 h-5" />
          </div>
        </div>
        <SkeletonButton className="w-full mt-16" />
      </LayoutColumn>
    </Layout>
  )
}

export default SkeletonOrderConfirmed
