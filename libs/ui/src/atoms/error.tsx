import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../utils";

const errorVariants = tv({
  base: ["text-error-text", "flex items-start gap-1"],
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
  children?: React.ReactNode;
}

function Error({
  className,
  showIcon,
  children,
  ref,
  size,
  ...props
}: ErrorProps) {
  if (!children) return null;

  return (
    <div
      ref={ref}
      className={cn(
        errorVariants({
          size,
          className,
        })
      )}
      {...props}
    >
      {showIcon && (
        <span className="icon-[mdi-light--alert-circle] w-4 h-4 flex-shrink-0 mt-0.5" />
      )}
      <span>{children}</span>
    </div>
  );
}

export { Error, errorVariants };
