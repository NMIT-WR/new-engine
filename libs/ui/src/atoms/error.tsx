import { type VariantProps } from "tailwind-variants";
import { tv } from "../utils";
import { Icon } from "./icon";

const errorVariants = tv({
  base: ["text-error-text", "flex items-center gap-1"],
  variants: {
    size: {
      sm: "text-error-sm",
      md: "text-error-md",
      lg: "text-error-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ErrorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorVariants> {
  ref?: React.Ref<HTMLDivElement>;
  showIcon?: boolean;
  children: React.ReactNode;
}

function Error({
  className,
  showIcon,
  children,
  ref,
  size,
  ...props
}: ErrorProps) {
  return (
    <div
      ref={ref}
      className={errorVariants({
        size,
        className,
      })}
      {...props}
    >
      {showIcon && <Icon icon="token-icon-error" />}
      <span>{children}</span>
    </div>
  );
}

export { Error, errorVariants };
