import { Skeleton } from '@/components/ui/Skeleton'
import SkeletonButton from '@modules/skeletons/components/skeleton-button'

const SkeletonAccountPage = () => {
  return (
    <>
      <Skeleton className="mb-8 h-11 w-75 md:mb-16" />
      <Skeleton className="mb-6 h-9 w-60" />
      <div className="mb-16 flex w-full flex-wrap gap-8 rounded-xs border border-grayscale-200 p-4 max-lg:flex-col lg:items-center">
        <div className="flex flex-1 gap-8">
          <Skeleton className="mt-2.5 h-6 w-6" />
          <div className="flex gap-6 max-sm:flex-col sm:flex-wrap sm:gap-x-16">
            <div>
              <Skeleton className="mb-1.5 h-4 w-14" />
              <Skeleton className="h-6 w-22" />
            </div>
            <div>
              <Skeleton className="mb-1.5 h-4 w-14" />
              <Skeleton className="h-6 w-22" />
            </div>
          </div>
        </div>
        <SkeletonButton className="w-full lg:w-27" />
      </div>
      <Skeleton className="mb-6 h-9 w-60" />
      <div className="mb-4 flex w-full flex-wrap items-center gap-x-8 gap-y-6 rounded-xs border border-grayscale-200 p-4">
        <Skeleton className="mt-2.5 h-6 w-6" />
        <div>
          <Skeleton className="mb-1.5 h-4 w-14" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
    </>
  )
}

export default SkeletonAccountPage
