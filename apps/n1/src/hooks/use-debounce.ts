import { debounce, type DebouncedFunction } from '@/utils/debounce'
import { useEffect, useMemo, useRef } from 'react'

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options?: {
    leading?: boolean
  }
): DebouncedFunction<T> {
  const callbackRef = useRef(callback)

  // Always update callback ref to latest version
  callbackRef.current = callback

  // Create debounced function synchronously during render (not after)
  const debouncedFn = useMemo(
    () =>
      debounce(
        (...args: Parameters<T>) => {
          callbackRef.current(...args)
        },
        delay,
        options
      ),
    [delay, options?.leading] // Recreate if delay or leading option changes
  )

  // Cleanup: cancel pending execution on unmount or dependency change
  useEffect(() => {
    return () => {
      debouncedFn.cancel()
    }
  }, [debouncedFn])

  return debouncedFn
}
