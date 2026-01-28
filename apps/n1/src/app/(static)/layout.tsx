import type { ReactNode } from "react"

export default function StaticLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto my-800 grid w-full max-w-max-w px-800">
      {children}
    </main>
  )
}
