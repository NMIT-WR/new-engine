interface ErrorBannerProps {
  title: string
  message: string
  className?: string
}

export const ErrorBanner = ({
  title,
  message,
  className = '',
}: ErrorBannerProps) => {
  return (
    <div
      className={`rounded-md bg-danger-light p-100 text-danger text-sm ${className}`}
      role="alert"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-50 text-xs">{message}</p>
    </div>
  )
}
