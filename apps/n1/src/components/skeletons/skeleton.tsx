import { tv } from '@techsio/ui-kit/utils'
import type { VariantProps } from 'tailwind-variants'

const skeletonVariants = tv({
  base: '',
  variants: {
    variant: {},
  },
})

type SkeletonTypes = VariantProps<typeof skeletonVariants>
