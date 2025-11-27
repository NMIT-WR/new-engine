import type { HTMLAttributes } from 'react'

interface SkeletonLoaderProps extends HTMLAttributes<HTMLDivElement> {
  count?: number
  containerClassName?: string
}

export function SkeletonLoader({
  count = 1,
  containerClassName,
  className = '',
  style,
  ...props
}: SkeletonLoaderProps) {
  const baseClasses = [
    'relative',
    'overflow-hidden',
    'bg-surface',
    'rounded',
    'animate-pulse',
  ].join(' ')

  if (count > 1) {
    return (
      <div className={containerClassName}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className={`${baseClasses} ${className}`}
            style={style}
            {...props}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`${baseClasses} ${className}`} style={style} {...props} />
  )
}
