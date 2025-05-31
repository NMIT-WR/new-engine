import { tv } from 'ui/src/utils'

const authLayoutVariants = tv({
  slots: {
    root: 'min-h-screen bg-auth-layout-bg flex items-center justify-center p-auth-layout-padding',
    container: 'w-full max-w-auth-layout-max-w',
  },
})

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const styles = authLayoutVariants()
  
  return (
    <div className={styles.root()}>
      <div className={styles.container()}>
        {children}
      </div>
    </div>
  )
}