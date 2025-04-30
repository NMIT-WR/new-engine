import type { VariantProps } from "tailwind-variants";
import { tv } from "../utils";

const ratingVariants = tv({
  base: ["inline-flex items-center"],
  variants: {
    size: {
      sm: "text-rating-sm gap-rating-sm",
      md: "text-rating-md gap-rating-md",
      lg: "text-rating-lg gap-rating-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const starStyles = tv({
  base: [
    "cursor-pointer transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-rating-ring",
  ],
  variants: {
    isActive: {
      true: "text-rating-active",
      false: "text-rating",
    },
    isInteractive: {
      true: [
        "hover:text-rating-active",
        "hover:[&~span]:text-rating",
        "[&:has(~span:hover)]:text-rating-active",
      ],
      false: "cursor-default",
    },
  },
  defaultVariants: {
    isActive: false,
    isInteractive: true,
  },
});

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof ratingVariants> {
  value?: number;
  maxValue?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
}

export function Rating({
  value = 0,
  maxValue = 5,
  readOnly = false,
  onChange,
  size = "md",
  className,
  ...props
}: RatingProps) {
  return (
    <div
      className={ratingVariants({ size, className })}
      role="radiogroup"
      aria-label="Rating"
      {...props}
    >
      {Array.from({ length: maxValue }).map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= value;
        return (
          <span
            key={index}
            className={starStyles({
              isActive,
              isInteractive: !readOnly,
            })}
            // for example user is not logged in so he can not make rating
            onClick={() => !readOnly && onChange?.(starValue)}
            role="radio"
            aria-checked={starValue === value}
            aria-posinset={starValue}
            aria-setsize={maxValue}
            tabIndex={readOnly ? -1 : 0}
          >
            <span className="token-icon-star"></span>
          </span>
        );
      })}
    </div>
  );
}
