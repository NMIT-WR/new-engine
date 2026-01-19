import { Skeleton } from "@techsio/ui-kit/atoms/skeleton"

export default function Loading() {
  return (
    <div className="space-y-400">
      <Skeleton.Rectangle className="h-500 w-4xl" />
      <Skeleton.Rectangle className="h-[160px] w-full" />
      <Skeleton.Rectangle className="h-[400px] w-full" />
    </div>
  )
}
