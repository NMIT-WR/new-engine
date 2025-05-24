import { Skeleton } from '@/components/ui/Skeleton'

export default function SkeletonCheckoutSummary() {
  return (
    <>
      <Skeleton colorScheme="white" className="mb-8 h-6 w-full lg:mb-16" />
      <div className="mb-8 flex gap-4 lg:gap-6">
        <Skeleton colorScheme="white" className="aspect-[3/4] w-25 lg:w-33" />
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
            <Skeleton colorScheme="white" className="h-6 w-full" />
          </div>
          <div className="flex flex-col gap-1.5 max-lg:text-xs">
            <Skeleton colorScheme="white" className="h-6 w-full" />
            <Skeleton colorScheme="white" className="h-6 w-full" />
          </div>
        </div>
      </div>
      <div className="mb-8 flex gap-x-6 gap-y-4 max-sm:flex-col">
        <Skeleton colorScheme="white" className="h-12 flex-1 lg:h-14" />
        <Skeleton
          colorScheme="white"
          className="h-12 flex-1 sm:max-w-23 lg:h-14"
        />
      </div>
      <div className="mb-8 flex flex-col gap-2 lg:gap-1">
        <Skeleton colorScheme="white" className="h-6 w-full" />
        <Skeleton colorScheme="white" className="h-6 w-full" />
        <Skeleton colorScheme="white" className="h-6 w-full" />
      </div>
      <div className="flex justify-between text-md">
        <Skeleton colorScheme="white" className="h-8 w-full" />
      </div>
    </>
  )
}
