import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  createContext,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const skeletonVariants = tv({
  slots: {
    root: ['animate-skeleton-pulse relative overflow-hidden'],
    circle: ['rounded-full', 'shrink-0'],
    textContainer: ['flex', 'flex-col'],
    textLine: ['h-skeleton-text-line', 'rounded-skeleton-text', 'w-full'],
  },
  variants: {
    variant: {
      primary: { root: 'bg-skeleton-bg-primary' },
      secondary: { root: 'bg-skeleton-bg-secondary' },
    },
    size: {
      sm: { circle: 'size-skeleton-circle-sm' },
      md: { circle: 'size-skeleton-circle-md' },
      lg: { circle: 'size-skeleton-circle-lg' },
      xl: { circle: 'size-skeleton-circle-xl' },
    },
    spacing: {
      sm: { textContainer: 'gap-skeleton-text-sm' },
      md: { textContainer: 'gap-skeleton-text-md' },
      lg: { textContainer: 'gap-skeleton-text-lg' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    spacing: 'md',
  },
})

interface SkeletonContextValue {
  isLoaded: boolean
  styles: ReturnType<typeof skeletonVariants>
  variant?: 'primary' | 'secondary'
}

const SkeletonContext = createContext<SkeletonContextValue | null>(null)

interface SkeletonRootProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    VariantProps<typeof skeletonVariants> {
  isLoaded?: boolean
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}

export function Skeleton({
  isLoaded = false,
  variant,
  children,
  className,
  ref,
  ...props
}: SkeletonRootProps) {
  const styles = skeletonVariants({ variant })

  if (isLoaded) {
    return <>{children}</>
  }

  return (
    <SkeletonContext.Provider value={{ isLoaded, styles, variant }}>
      <div
        ref={ref}
        className={styles.root({ className })}
        aria-busy="true"
        aria-label="Loading content"
        {...props}
      >
        {children}
      </div>
    </SkeletonContext.Provider>
  )
}

interface SkeletonCircleProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoaded?: boolean
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}

Skeleton.Circle = function SkeletonCircle({
  size = 'md',
  isLoaded = false,
  children,
  className,
  ref,
  ...props
}: SkeletonCircleProps) {
  const styles = skeletonVariants({ size })

  if (isLoaded) {
    return <>{children}</>
  }

  return (
    <div
      ref={ref}
      className={styles.root({
        className: styles.circle({ className }),
      })}
      aria-busy="true"
      aria-label="Loading content"
      {...props}
    />
  )
}

interface SkeletonTextProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  noOfLines?: number
  spacing?: 'sm' | 'md' | 'lg'
  lastLineWidth?: string
  isLoaded?: boolean
  children?: ReactNode
  containerClassName?: string
  ref?: Ref<HTMLDivElement>
}

Skeleton.Text = function SkeletonText({
  noOfLines = 3,
  spacing = 'md',
  lastLineWidth = '80%',
  isLoaded = false,
  children,
  containerClassName,
  className,
  ref,
  ...props
}: SkeletonTextProps) {
  const styles = skeletonVariants({ spacing })

  if (isLoaded) {
    return <>{children}</>
  }

  return (
    <div
      ref={ref}
      className={styles.textContainer({ className: containerClassName })}
      {...props}
    >
      {Array.from({ length: noOfLines }).map((_, index) => {
        const isLastLine = index === noOfLines - 1
        const width = isLastLine && noOfLines > 1 ? lastLineWidth : '100%'

        return (
          <div
            key={index}
            className={styles.root({
              className: styles.textLine({ className }),
            })}
            style={{ width }}
            aria-busy="true"
            aria-label="Loading content"
          />
        )
      })}
    </div>
  )
}

interface SkeletonRectangleProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  aspectRatio?: string
  height?: string
  width?: string
  isLoaded?: boolean
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}

Skeleton.Rectangle = function SkeletonRectangle({
  aspectRatio,
  height,
  width = '100%',
  isLoaded = false,
  children,
  className,
  style,
  ref,
  ...props
}: SkeletonRectangleProps) {
  const styles = skeletonVariants()

  if (isLoaded) {
    return <>{children}</>
  }

  return (
    <div
      ref={ref}
      className={styles.root({ className })}
      style={{
        ...style,
        width,
        height,
        aspectRatio,
      }}
      aria-busy="true"
      aria-label="Loading content"
      {...props}
    >
      {children}
    </div>
  )
}
