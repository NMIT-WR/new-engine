import { Skeleton } from '@/components/ui/Skeleton'

export const SkeletonMobileCheckoutSummaryTrigger = () => (
  <div className="flex h-18 w-full items-center justify-between">
    <Skeleton colorScheme="white" className="h-6 w-30" />
    <Skeleton colorScheme="white" className="h-6 w-30" />
  </div>
)

export default SkeletonMobileCheckoutSummaryTrigger
