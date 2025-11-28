import { SkeletonLoader } from './_components/skeleton-loader'

export default function Loading() {
  return (
    <div className="space-y-400">
      <SkeletonLoader className="h-500 w-4xl" />
      <SkeletonLoader className="h-[160px] w-full" />
      <SkeletonLoader className="h-[400px] w-full" />
    </div>
  )
}
