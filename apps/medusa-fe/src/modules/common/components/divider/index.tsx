import { clx } from '@medusajs/ui'

const Divider = ({ className }: { className?: string }) => (
  <div
    className={clx('mt-1 h-px w-full border-gray-200 border-b', className)}
  />
)

export default Divider
