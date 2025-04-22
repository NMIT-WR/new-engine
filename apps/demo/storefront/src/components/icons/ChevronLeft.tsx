import * as React from "react"

export const ChevronLeft: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
  props
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m14.53 5 1.061 1.06-5.47 5.47 5.47 5.47-1.06 1.06L8 11.53 14.53 5Z"
      clipRule="evenodd"
    />
  </svg>
)
