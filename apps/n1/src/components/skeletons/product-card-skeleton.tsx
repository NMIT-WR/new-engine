import { Skeleton } from '@new-engine/ui/atoms/skeleton'

export const ProductCardSkeleton = () => {
  return (
    <div className="flex h-full flex-col gap-300">
      {/* Name - single line */}
      <Skeleton className="h-5 w-full rounded-sm" />

      {/* Image - square aspect ratio */}
      <Skeleton.Rectangle aspectRatio="1/1" className="w-full rounded-md" />

      {/* Button */}
      <Skeleton className="h-10 w-24 self-end rounded-md" />
    </div>
  )
}
