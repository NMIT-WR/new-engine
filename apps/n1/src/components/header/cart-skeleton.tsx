export const CartSkeleton = () => {
  return (
    <div className="flex flex-col gap-300">
      {/* Cart items skeleton */}
      <div className="space-y-300">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex animate-pulse gap-300">
            {/* Thumbnail skeleton */}
            <div className="h-16 w-16 rounded-md bg-overlay-light" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-200">
              <div className="h-4 w-3/4 rounded bg-overlay-light" />
              <div className="h-3 w-1/2 rounded bg-overlay-light" />
              <div className="h-4 w-20 rounded bg-overlay-light" />
            </div>

            {/* Controls skeleton */}
            <div className="flex items-center gap-200">
              <div className="h-8 w-8 rounded bg-overlay-light" />
              <div className="h-8 w-8 rounded bg-overlay-light" />
              <div className="h-8 w-8 rounded bg-overlay-light" />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-overlay-light" />

      {/* Totals skeleton */}
      <div className="space-y-200">
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded bg-overlay-light" />
          <div className="h-4 w-16 rounded bg-overlay-light" />
        </div>
        <div className="flex justify-between">
          <div className="h-5 w-16 rounded bg-overlay-light" />
          <div className="h-5 w-20 rounded bg-overlay-light" />
        </div>
      </div>

      {/* Buttons skeleton */}
      <div className="space-y-200 pt-200">
        <div className="h-10 w-full rounded bg-overlay-light" />
        <div className="h-8 w-full rounded bg-overlay-light" />
      </div>
    </div>
  )
}