export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center px-0 justify-center bg-auth-layout-bg p-auth-layout-padding">
      <div className="w-full max-w-auth-layout-max-w">{children}</div>
    </div>
  )
}
