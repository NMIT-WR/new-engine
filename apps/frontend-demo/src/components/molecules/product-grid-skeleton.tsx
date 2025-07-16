import { SkeletonLoader } from "../atoms/skeleton-loader";

export function ProductGridSkeleton({numberOfItems = 1} : { numberOfItems?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(numberOfItems)].map((_, i) => (
        <div key={i} className="space-y-3">
          <SkeletonLoader
            variant="box"
            size="fit"
            className="aspect-square w-full"
          />
          <div className="space-y-2">
            <SkeletonLoader variant="text" size="md" className="w-3/4" />
            <SkeletonLoader variant="text" size="sm" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}