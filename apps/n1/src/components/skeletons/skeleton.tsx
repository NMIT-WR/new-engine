import { tv } from '@new-engine/ui/utils'
import type { VariantProps } from 'tailwind-variants'

const skeletonVariants = tv({
  base: '',
  variants: {
    variant: {},
  },
})

type SkeletonTypes = VariantProps<typeof skeletonVariants>
