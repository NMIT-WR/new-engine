import type { ElementType, ComponentPropsWithoutRef } from "react";

export interface ImageProps<T extends ElementType = "img"> {
  as?: T;
  src: string;
  alt: string;
  className?: string;
}

type ImageComponentProps<T extends ElementType> = ImageProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ImageProps<T>>;

export function Image<T extends ElementType = "img">({
  as,
  src,
  alt,
  className,
  ...props
}: ImageComponentProps<T>) {
  const Component = as || "img";

  return <Component src={src} alt={alt} className={className} {...props} />;
}
