import { useId, type HTMLAttributes } from "react";
import clsx from "clsx";
import { Button } from "../atoms/button.tsx";
import { Badge, type BadgeProps } from "../atoms/badge.tsx";
import { slugify, tv } from "../utils.ts";

type AreaName = "title" | "image" | "badges" | "stock" | "price" | "actions";

type GridAreaType = `grid-area-${AreaName}`;

const productCardVariants = tv({
  base: [
    "bg-product-card",
    "border-product-card rounded-product-card border-(length:--border-product-card-width)",
    "px-product-card-x py-product-card-y",
    "shadow-product-card",
    "gap-product-card",
  ],
  variants: {
    layout: {
      basic: "basic-grid",
      horizontal: "horizontal-grid",
      custom: "",
    },
  },
  defaultVariants: {
    layout: "basic",
  },
});

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  price: string;
  stockStatus: string;
  badges?: Array<BadgeProps>;
  onAddToCart?: () => void;
  addToCartText?: string;
  // Layout props
  layout?: "basic" | "horizontal" | "custom";

  // Area assignments
  titleArea?: GridAreaType;
  imageArea?: GridAreaType;
  badgesArea?: GridAreaType;
  stockArea?: GridAreaType;
  priceArea?: GridAreaType;
  actionsArea?: GridAreaType;
}

export function ProductCardGridArea({
  imageUrl,
  name,
  price,
  stockStatus,
  badges = [],
  onAddToCart,
  addToCartText,
  layout = "basic",
  titleArea = "grid-area-title",
  imageArea = "grid-area-image",
  badgesArea = "grid-area-badges",
  stockArea = "grid-area-stock",
  priceArea = "grid-area-price",
  actionsArea = "grid-area-actions",
  className,
  ...props
}: ProductCardProps) {
  const productCardId = useId();

  return (
    <div className={productCardVariants({ layout, className })} {...props}>
      <h3
        className={clsx(
          "text-center text-product-card-name-color text-product-card-name-size font-product-card-name leading-product-card-name",
          titleArea
        )}
      >
        {name}
      </h3>

      <img
        src={imageUrl}
        alt={name}
        className={clsx(
          "w-full object-cover",
          "aspect-product-card-image",
          imageArea
        )}
      />

      {badges.length > 0 && (
        <div
          className={clsx(
            "flex flex-wrap justify-center items-center gap-product-card-badges",
            badgesArea
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
          "text-center text-product-card-stock-color text-product-card-stock-size font-product-card-stock",
          stockArea
        )}
      >
        {stockStatus}
      </p>

      <p
        className={clsx(
          "text-center text-product-card-price-color text-product-card-price-size font-product-card-price",
          priceArea
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
        className={actionsArea}
      >
        {addToCartText}
      </Button>
    </div>
  );
}
