export type DebouncedFunction<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): void
  cancel: () => void
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
  options?: {
    leading?: boolean
  }
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
      lastArgs = null
    }
  }

  const debouncedFn = (...args: Parameters<T>): void => {
    lastArgs = args

    if (options?.leading && timeoutId === null) {
      fn(...args)
      timeoutId = setTimeout(() => {
        timeoutId = null
        lastArgs = null
      }, delay)
      return
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (lastArgs !== null) {
        fn(...lastArgs)
      }
      timeoutId = null
      lastArgs = null
    }, delay)
  }

  debouncedFn.cancel = cancel

  return debouncedFn as DebouncedFunction<T>
}
