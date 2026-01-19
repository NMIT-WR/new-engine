import { useEffect, useMemo, useRef } from "react"
import { type DebouncedFunction, debounce } from "@/utils/debounce"

export function useDebounce<T extends (...args: unknown[]) => unknown>(
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
    [delay, options?.leading, options] // Recreate if delay or leading option changes
  )

  // Cleanup: cancel pending execution on unmount or dependency change
  useEffect(
    () => () => {
      debouncedFn.cancel()
    },
    [debouncedFn]
  )

  return debouncedFn
}
