import { twMerge } from "tailwind-merge"

export const UiTagList: React.FC<React.ComponentPropsWithoutRef<"ul">> = ({
  className,
  ...rest
}) => (
  <ul
    {...rest}
    className={twMerge("inline-flex flex-wrap gap-y-2 items-center", className)}
  />
)

export const UiTagListDivider: React.FC<
  React.ComponentPropsWithoutRef<"span">
> = ({ className, ...rest }) => (
  <span {...rest} className={twMerge("w-6 h-px bg-black", className)} />
)
