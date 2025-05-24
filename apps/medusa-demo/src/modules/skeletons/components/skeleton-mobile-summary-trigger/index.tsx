import { Skeleton } from "@/components/ui/Skeleton"

export const SkeletonMobileCheckoutSummaryTrigger = () => (
  <div className="h-18 flex justify-between items-center w-full">
    <Skeleton colorScheme="white" className="h-6 w-30" />
    <Skeleton colorScheme="white" className="h-6 w-30" />
  </div>
)

export default SkeletonMobileCheckoutSummaryTrigger
