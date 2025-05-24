import { twMerge } from "tailwind-merge"
import { Skeleton } from "@/components/ui/Skeleton"

const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={twMerge("w-30 h-12", className)} />
}

export default SkeletonButton
