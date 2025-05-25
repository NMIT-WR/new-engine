import { twMerge } from 'tailwind-merge'

export const UiTagList: React.FC<React.ComponentPropsWithoutRef<'ul'>> = ({
  className,
  ...rest
}) => (
  <ul
    {...rest}
    className={twMerge('inline-flex flex-wrap items-center gap-y-2', className)}
  />
)

export const UiTagListDivider: React.FC<
  React.ComponentPropsWithoutRef<'span'>
> = ({ className, ...rest }) => (
  <span {...rest} className={twMerge('h-px w-6 bg-black', className)} />
)
