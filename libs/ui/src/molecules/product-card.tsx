import { useId, type HTMLAttributes } from "react";
import clsx from "clsx";
import { Button } from "../atoms/button.tsx";
import { Badge, type BadgeProps } from "../atoms/badge.tsx";
import { slugify } from "../utils.ts";

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  price: string;
  stockStatus: string;
  badges?: Array<BadgeProps>;
  onAddToCart?: () => void;
  addToCartText?: string;
}

export function ProductCard({
  imageUrl,
  name,
  price,
  stockStatus,
  badges = [],
  onAddToCart,
  addToCartText,
  className,
  ...props
}: ProductCardProps) {
  const productCardId = useId();

  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-product-card",
        "bg-product-card",
        "border-product-card rounded-product-card border-(length:--border-product-card-width)",
        "px-product-card-x py-product-card-y",
        "shadow-product-card",
        className
      )}
      {...props}
    >
      <h3
        className={clsx(
          "text-center text-product-card-name-color text-product-card-name-size font-product-card-name leading-product-card-name"
        )}
      >
        {name}
      </h3>

      <img
        src={imageUrl}
        alt={name}
        className={clsx("w-full object-cover", "aspect-product-card-image")}
      />

      {badges.length > 0 && (
        <div
          className={clsx(
            "flex flex-wrap justify-center items-center gap-product-card-badges"
          )}
        >
          {badges.map((badge) => (
            <Badge
              key={`${productCardId}-${slugify(badge.children)}-${
                badge.variant
              }`}
              variant={badge.variant}
              bgColor={badge.variant === "dynamic" ? badge.bgColor : ""}
              fgColor={badge.variant === "dynamic" ? badge.fgColor : ""}
              borderColor={badge.variant === "dynamic" ? badge.borderColor : ""}
            >
              {badge.children}
            </Badge>
          ))}
        </div>
      )}

      <p
        className={clsx(
          "text-center text-product-card-stock-color text-product-card-stock-size font-product-card-stock"
        )}
      >
        {stockStatus}
      </p>

      <p
        className={clsx(
          "text-center text-product-card-price-color text-product-card-price-size font-product-card-price"
        )}
      >
        {price}
      </p>

      <Button
        variant="primary"
        theme="solid"
        onClick={onAddToCart}
        icon="token-icon-cart-primary"
        block
      >
        {addToCartText}
      </Button>
    </div>
  );
}
