'use client'

import { Component, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback: ReactNode | ((error: Error) => ReactNode)
  onError?: (error: Error) => void
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  override componentDidCatch(error: Error) {
    this.props.onError?.(error)
  }

  override render() {
    const { error } = this.state
    const { children, fallback } = this.props

    if (error) {
      return typeof fallback === 'function' ? fallback(error) : fallback
    }

    return children
  }
}
