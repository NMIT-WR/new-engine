import type { ElementType, ComponentPropsWithoutRef } from "react";

export interface BaseImageProps {
  src: string;
  alt: string;
  className?: string;
}

type HasImageProps<T extends ElementType> = 'src' extends keyof ComponentPropsWithoutRef<T>
  ? 'alt' extends keyof ComponentPropsWithoutRef<T>
    ? T
    : never
  : never;

type NativeImageProps = BaseImageProps &
  Omit<ComponentPropsWithoutRef<"img">, keyof BaseImageProps>;

type CustomImageProps<T extends ElementType> = BaseImageProps &
  Omit<ComponentPropsWithoutRef<HasImageProps<T>>, keyof BaseImageProps> & {
  as: HasImageProps<T>;
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
