import * as React from "react"

export const Undo: React.FC<React.ComponentPropsWithoutRef<"svg">> = (
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
      d="M4 5.25A1.75 1.75 0 0 0 2.25 7v1.75H2c-.086 0-.17.009-.25.025V7A2.25 2.25 0 0 1 4 4.75h16A2.25 2.25 0 0 1 22.25 7v1.775A1.257 1.257 0 0 0 22 8.75h-.25V7A1.75 1.75 0 0 0 20 5.25H4Zm-2 4.5h.25v.5H2a.25.25 0 1 1 0-.5Zm1.25.5v-.5h17.5v.5H3.25Zm-1.25 1h.25V17c0 .966.784 1.75 1.75 1.75h16A1.75 1.75 0 0 0 21.75 17v-5.75H22c.086 0 .17-.009.25-.025V17A2.25 2.25 0 0 1 20 19.25H4A2.25 2.25 0 0 1 1.75 17v-5.775c.08.016.164.025.25.025Zm20-1h-.25v-.5H22a.25.25 0 1 1 0 .5Z"
    />
  </svg>
)
