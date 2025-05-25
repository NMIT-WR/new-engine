import { Skeleton } from '@/components/ui/Skeleton'
import { twMerge } from 'tailwind-merge'

const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={twMerge('h-12 w-30', className)} />
}

export default SkeletonButton
