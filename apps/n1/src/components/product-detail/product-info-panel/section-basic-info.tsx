export const SectionBasicInfo = ({
  children,
  divider = true,
}: { children: React.ReactNode; divider?: boolean }) => {
  return (
    <section
      className="flex flex-col gap-400 border-border-secondary data-[divider=true]:border-b data-[divider=true]:pb-200"
      data-divider={divider}
    >
      {children}
    </section>
  )
}
