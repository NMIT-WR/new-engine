import { Skeleton } from '@/components/ui/Skeleton'

const SkeletonProductPreview = () => {
  return (
    <div>
      <Skeleton className="mb-4 aspect-square w-full md:mb-6" />
      <div className="flex justify-between max-md:flex-col">
        <div>
          <Skeleton className="mb-2.5 h-3 w-22 md:h-5" />
          <Skeleton className="h-3 w-18 max-md:hidden md:h-3" />
        </div>
        <Skeleton className="h-3 w-18 md:h-6 md:w-22" />
      </div>
    </div>
  )
}

export default SkeletonProductPreview
