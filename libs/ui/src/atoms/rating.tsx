import type { VariantProps } from "tailwind-variants";
import { tv } from "../utils";

const rating = tv({
  slots: {
    base: ["inline-flex items-center"],
    star: [
      "cursor-pointer transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-rating-ring",
      "text-rating data-[active=true]:text-rating-active",
    ],
    icon: ["token-icon-star"],
  },
  variants: {
    size: {
      sm: {
        base: "gap-rating-sm",
        star: "text-rating-sm",
        icon: "text-rating-sm",
      },
      md: {
        base: "gap-rating-md",
        star: "text-rating-md",
        icon: "text-rating-md",
      },
      lg: {
        base: "gap-rating-lg",
        star: "text-rating-lg",
        icon: "text-rating-lg",
      },
    },
    // User can rate
    isInteractive: {
      true: {
        star: [
          /* setting with tailwind selector patterns
         "hover:text-rating-active",
          "hover:pattern-[++]:text-rating",
          "hover:pattern-[--]:text-rating-active",*/
          "hover:text-rating-active",
          "hover:[&~span]:text-rating",
          "[&:has(~span:hover)]:text-rating-active",
        ],
      },
      false: {
        star: "cursor-default",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof rating> {
  value?: number;
  maxValue?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
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
  const { base, star, icon } = rating({
    size,
    isInteractive: !readOnly,
  });
  return (
    <div
      className={base({ size, className })}
      role="radiogroup"
      aria-label="Rating"
      {...props}
    >
      {Array.from({ length: maxValue }).map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={star({
              isInteractive: !readOnly,
            })}
            // for example user is not logged in so he can not make rating
            onClick={() => !readOnly && onChange?.(starValue)}
            data-active={starValue <= value}
            role="radio"
            aria-checked={starValue === value}
            aria-posinset={starValue}
            aria-setsize={maxValue}
            tabIndex={readOnly ? -1 : 0}
          >
            <span className={icon({ size })}></span>
          </span>
        );
      })}
    </div>
  );
}
