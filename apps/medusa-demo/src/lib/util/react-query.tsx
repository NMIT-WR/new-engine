import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'

const queryClient = new QueryClient()

export const ReactQueryProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <>{children}</>
    </QueryClientProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const withReactQueryProvider = <T extends {}>(
  Component: React.FC<T>
) => {
  const WrappedComponent = (props: T) => (
    <ReactQueryProvider>
      <Component {...props} />
    </ReactQueryProvider>
  )

  WrappedComponent.displayName = `withReactQueryProvider(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
