export function useToast() {
  return {
    create: (options: {
      title: string
      description?: string
      type?: 'success' | 'error' | 'info'
    }) => {
      // This is a placeholder implementation
      // In production, this would integrate with your toast notification system
      console.log(
        `[${options.type || 'info'}] ${options.title}:`,
        options.description
      )
    },
  }
}
