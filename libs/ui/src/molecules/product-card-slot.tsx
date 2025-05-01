import { useId, type HTMLAttributes } from "react";
import { Button } from "../atoms/button.tsx";
import { Badge, type BadgeProps } from "../atoms/badge.tsx";
import { slugify, tv } from "../utils.ts";
import type { VariantProps } from "tailwind-variants";
import { Rating, type RatingProps } from "../atoms/rating.tsx";

const productCardSlots = tv({
  slots: {
    base: "flex gap-product-card rounded-product-card border-product-card",
    imageSlot: "object-cover aspect-product-card-image",
    nameSlot:
      "text-product-card-name-color text-product-card-name-size font-product-card-name leading-product-card-name",
    priceSlot: "text-product-card-price-color text-product-card-price-size",
    stockStatusSlot:
      "text-product-card-stock-color text-product-card-stock-size font-product-card-stock",
    badgesSlot: "flex flex-wrap gap-product-card-badges",
    ratingSlot: "flex items-center",
    buttonSlot: "w-full",
  },
  variants: {
    layout: {
      column: {
        base: "flex-col justify-center items-center",
        imageSlot: "w-full",
      },
      row: {
        base: "flex-row justify-center items-center",
      },
    },
  },
  defaultVariants: {
    layout: "column",
  },
});

type ProductCardSlotVariants = VariantProps<typeof productCardSlots>;

export interface ProductCardProps
  extends ProductCardSlotVariants,
    HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  price: string;
  stockStatus: string;
  badges?: Array<BadgeProps>;
  rating?: RatingProps;
  onAddToCart?: () => void;
  addToCartText?: string;
}

export function ProductCardSlot({
  imageUrl,
  name,
  price,
  stockStatus,
  badges = [],
  rating,
  onAddToCart,
  addToCartText = "Do košíku",
  className,
  layout,
  ...props
}: ProductCardProps) {
  const productCardId = useId();

  const {
    base,
    imageSlot,
    nameSlot,
    priceSlot,
    badgesSlot,
    ratingSlot,
    buttonSlot,
    stockStatusSlot,
  } = productCardSlots({ layout });

  return (
    <div className={base({ className })} {...props}>
      <h3 className={nameSlot()}>{name}</h3>
      <img src={imageUrl} alt={name} className={imageSlot()} />
      {rating && (
        <div className={ratingSlot()}>
          <Rating {...rating} />
        </div>
      )}
      {badges.length > 0 && (
        <div className={badgesSlot()}>
          {badges.map((badge) => (
            <Badge
              key={`${productCardId}-${slugify(badge.children)}-${
                badge.variant
              }`}
              {...badge}
            >
              {badge.children}
            </Badge>
          ))}
        </div>
      )}
      <p className={stockStatusSlot()}>{stockStatus}</p>
      <p className={priceSlot()}>{price}</p>
      <div className={buttonSlot()}>
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
    </div>
  );
}
