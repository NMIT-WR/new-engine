interface DateFormatOptions {
  day?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'long' | 'short'
  year?: 'numeric' | '2-digit'
  weekday?: 'long' | 'short' | 'narrow'
}

export function useDate() {
  const formatDate = (date: Date, options?: DateFormatOptions) => {
    return new Intl.DateTimeFormat('cs-CZ', options).format(date)
  }

  return {
    // Core operations
    addDays: (days: number, from = new Date()) => {
      const result = new Date(from)
      result.setDate(result.getDate() + days)
      return result
    },

    // Formatting
    format: formatDate,

    // Common shortcuts (90% use cases)
    day: (date: Date) => formatDate(date, { day: 'numeric' }),
    short: (date: Date) =>
      formatDate(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    long: (date: Date) =>
      formatDate(date, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),

    // Utilities
    now: () => new Date(),
  }
}
