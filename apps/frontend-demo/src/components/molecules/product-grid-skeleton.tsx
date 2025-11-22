import { SkeletonLoader } from "../atoms/skeleton-loader"

export function ProductGridSkeleton({
  numberOfItems = 1,
}: {
  numberOfItems?: number
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(numberOfItems)].map((_, i) => (
        <div className="space-y-3" key={i}>
          <SkeletonLoader
            className="aspect-square w-full"
            size="fit"
            variant="box"
          />
          <div className="space-y-2">
            <SkeletonLoader className="w-3/4" size="md" variant="text" />
            <SkeletonLoader className="w-1/2" size="sm" variant="text" />
          </div>
        </div>
      ))}
    </div>
  )
}
