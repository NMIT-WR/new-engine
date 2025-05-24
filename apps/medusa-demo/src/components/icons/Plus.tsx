import * as React from "react"

export const Plus: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
  props
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M11.25 18.813v-14h1.5v14h-1.5Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M19 12.563H5v-1.5h14v1.5Z"
      clipRule="evenodd"
    />
  </svg>
)
