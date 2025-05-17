import * as React from "react"

export const Search: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
  props
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22 22"
    fill="none"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M9.694 2.445a7.25 7.25 0 1 0 0 14.5 7.25 7.25 0 0 0 0-14.5Zm-8.75 7.25a8.75 8.75 0 1 1 17.5 0 8.75 8.75 0 0 1-17.5 0Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m15.694 14.634 5.361 5.36-1.06 1.061-5.361-5.36 1.06-1.061Z"
      clipRule="evenodd"
    />
  </svg>
)
