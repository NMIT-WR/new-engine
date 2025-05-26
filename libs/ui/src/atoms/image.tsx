import type { ElementType, ComponentPropsWithoutRef } from "react";

export interface BaseImageProps {
  src: string;
  alt: string;
  className?: string;
}

type NativeImageProps = BaseImageProps &
  Omit<ComponentPropsWithoutRef<"img">, keyof BaseImageProps>;

type CustomImageProps<T extends ElementType> = BaseImageProps &
  Omit<ComponentPropsWithoutRef<T>, keyof BaseImageProps> & {
  as: T;
};

export type ImageProps<T extends ElementType = "img"> = T extends "img"
  ? NativeImageProps & { as?: "img" }
  : CustomImageProps<T>;

export function Image<T extends ElementType = "img">({
  as,
  src,
  alt,
  className,
  ...props
}: ImageProps<T>) {
  const Component = (as || "img") as ElementType;

  return <Component src={src} alt={alt} className={className} {...props} />;
}
