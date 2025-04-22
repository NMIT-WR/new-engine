import { Skeleton } from "@/components/ui/Skeleton"

const SkeletonProductPreview = () => {
  return (
    <div>
      <Skeleton className="mb-4 md:mb-6 w-full aspect-square" />
      <div className="flex justify-between max-md:flex-col">
        <div>
          <Skeleton className="mb-2.5 h-3 md:h-5 w-22" />
          <Skeleton className="max-md:hidden h-3 md:h-3 w-18" />
        </div>
        <Skeleton className="h-3 md:h-6 w-18 md:w-22" />
      </div>
    </div>
  )
}

export default SkeletonProductPreview
