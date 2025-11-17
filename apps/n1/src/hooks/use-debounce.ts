import { debounce, type DebouncedFunction } from '@/utils/debounce'
import { useEffect, useRef } from 'react'

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options?: {
    leading?: boolean
  }
): DebouncedFunction<T> {
  const callbackRef = useRef(callback)
  const debouncedRef = useRef<DebouncedFunction<T> | null>(null)

  callbackRef.current = callback

  useEffect(() => {
    // Create debounced function that calls latest callback
    debouncedRef.current = debounce(
      (...args: Parameters<T>) => {
        callbackRef.current(...args)
      },
      delay,
      options
    )

    // Cleanup: cancel pending execution on unmount or delay change
    return () => {
      debouncedRef.current?.cancel()
    }
  }, [delay, options?.leading]) // Recreate if delay or leading option changes

  return debouncedRef.current || ((() => {}) as DebouncedFunction<T>)
}
