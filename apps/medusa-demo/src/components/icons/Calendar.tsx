import * as React from "react"

export const Calendar: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
  props
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 4.25A1.75 1.75 0 0 0 3.25 6v2.75H3c-.086 0-.17.009-.25.025V6A2.25 2.25 0 0 1 5 3.75h1.75v.5H5Zm-2 5.5h.25v.5H3a.25.25 0 1 1 0-.5Zm1.25.5v-.5h15.5v.5H4.25Zm-1.25 1h.25V20c0 .966.784 1.75 1.75 1.75h14A1.75 1.75 0 0 0 20.75 20v-8.75H21c.086 0 .17-.009.25-.025V20A2.25 2.25 0 0 1 19 22.25H5A2.25 2.25 0 0 1 2.75 20v-8.775c.08.016.164.025.25.025Zm18-1h-.25v-.5H21a.25.25 0 1 1 0 .5Zm0-1.5h-.25V6A1.75 1.75 0 0 0 19 4.25h-1.75v-.5H19A2.25 2.25 0 0 1 21.25 6v2.775A1.257 1.257 0 0 0 21 8.75Zm-4.75-5v.5h-.5v-.5h.5Zm-.5 1.5h.5V6a.25.25 0 1 1-.5 0v-.75Zm-1-1.5v.5h-5.5v-.5h5.5Zm-6.5 0v.5h-.5v-.5h.5Zm-.5 1.5h.5V6a.25.25 0 0 1-.5 0v-.75Zm.5-2.5h-.5V2a.25.25 0 0 1 .5 0v.75Zm8 0h-.5V2a.25.25 0 1 1 .5 0v.75Z"
    />
  </svg>
)
