export const CartSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      {/* Cart items skeleton */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            {/* Thumbnail skeleton */}
            <div className="h-16 w-16 rounded-md bg-gray-200" />
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
            </div>
            
            {/* Controls skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-gray-200" />
              <div className="h-8 w-8 rounded bg-gray-200" />
              <div className="h-8 w-8 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* Totals skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>
        <div className="flex justify-between">
          <div className="h-5 w-16 rounded bg-gray-200" />
          <div className="h-5 w-20 rounded bg-gray-200" />
        </div>
      </div>

      {/* Buttons skeleton */}
      <div className="space-y-2 pt-2">
        <div className="h-10 w-full rounded bg-gray-200" />
        <div className="h-8 w-full rounded bg-gray-200" />
      </div>
    </div>
  )
}