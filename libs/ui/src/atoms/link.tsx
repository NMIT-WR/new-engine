import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import { tv } from "../utils";
import type { VariantProps } from "tailwind-variants";

// WIP
const linkVariants = tv({
  base: [],
  variants: {},
  defaultVariants: {},
});

export interface LinkProps<T extends ElementType = "a">
  extends VariantProps<typeof linkVariants> {
  as?: T;
  children: ReactNode;
  href?: string;
  external?: boolean;
  className?: string;
}

// Compose LinkProps with props for element T
type LinkComponentProps<T extends ElementType> = LinkProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof LinkProps<T>>;

export function Link<T extends ElementType = "a">({
  as,
  children,
  href,
  external = false,
  className,
  ...props
}: LinkComponentProps<T>) {
  const Component = as || "a";

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Component
      className={linkVariants({ className })}
      href={href}
      {...externalProps}
      {...props}
    >
      {children}
    </Component>
  );
}
