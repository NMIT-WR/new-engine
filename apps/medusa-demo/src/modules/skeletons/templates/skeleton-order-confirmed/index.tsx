import { Layout, LayoutColumn } from '@/components/Layout'
import { Skeleton } from '@/components/ui/Skeleton'
import SkeletonButton from '@modules/skeletons/components/skeleton-button'

const SkeletonOrderConfirmed = () => {
  return (
    <Layout className="pt-39 pb-36">
      <LayoutColumn
        start={{ base: 1, lg: 3, xl: 4 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <Skeleton className="mb-6 h-17 w-full" />
        <Skeleton className="mb-4 h-12 w-[90%]" />
        <Skeleton className="mb-4 h-12 w-[80%]" />
        <div className="mt-16 flex flex-col gap-8 sm:flex-row">
          <div className="flex-1">
            <Skeleton className="mb-2 h-5 w-30" />
            <Skeleton className="mb-2 h-5 w-25" />
            <Skeleton className="mb-2 h-5 w-20" />
            <Skeleton className="h-5 w-15" />
          </div>
          <div className="flex-1">
            <Skeleton className="mb-2 h-5 w-30" />
            <Skeleton className="mb-2 h-5 w-25" />
            <Skeleton className="mb-2 h-5 w-20" />
            <Skeleton className="h-5 w-15" />
          </div>
        </div>
        <SkeletonButton className="mt-16 w-full" />
      </LayoutColumn>
    </Layout>
  )
}

export default SkeletonOrderConfirmed
