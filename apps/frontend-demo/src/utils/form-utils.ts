import type { FormEvent } from 'react'

/**
 * Create a form submit handler that prevents default behavior
 */
export function createFormHandler<T extends HTMLFormElement = HTMLFormElement>(
  handler: (data: FormData) => void | Promise<void>
) {
  return async (event: FormEvent<T>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    await handler(formData)
  }
}

/**
 * Simple form submit handler with preventDefault
 */
export function handleFormSubmit(
  event: FormEvent<HTMLFormElement>,
  callback: () => void
) {
  event.preventDefault()
  callback()
}
