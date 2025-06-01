
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className='min-h-screen bg-auth-layout-bg flex items-center justify-center p-auth-layout-padding'>
      <div className='w-full max-w-auth-layout-max-w'>{children}</div>
    </div>
  )
}
