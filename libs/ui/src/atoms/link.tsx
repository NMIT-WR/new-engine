import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";
import { tv } from "../utils";
import type { VariantProps } from "tailwind-variants";

const linkVariants = tv({
  base: [],
  variants: {},
  defaultVariants: {},
});

export interface BaseLinkProps extends VariantProps<typeof linkVariants> {
  children: ReactNode;
  external?: boolean;
  className?: string;
}

type NativeLinkProps = BaseLinkProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof BaseLinkProps>;

type CustomLinkProps<T extends ElementType> = BaseLinkProps &
  Omit<ComponentPropsWithoutRef<T>, keyof BaseLinkProps> & {
  as: T;
};

export type LinkProps<T extends ElementType = "a"> = T extends "a"
  ? NativeLinkProps & { as?: "a" }
  : CustomLinkProps<T>;

export function Link<T extends ElementType = "a">({
  as,
  children,
  external = false,
  className,
  ...props
}: LinkProps<T>) {
  const Component = (as || "a") as ElementType;

  const externalProps = external && !as
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Component
      className={linkVariants({ className })}
      {...externalProps}
      {...props}
    >
      {children}
    </Component>
  );
}
