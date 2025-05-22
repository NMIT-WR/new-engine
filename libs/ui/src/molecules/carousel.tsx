import * as carousel from "@zag-js/carousel";
import { useMachine, normalizeProps } from "@zag-js/react";
import { useId, type ReactNode, type ElementType } from "react";
import { tv, type VariantProps } from "tailwind-variants";
//import { Icon, type IconType } from "../atoms/icon";
import { Button } from "../atoms/button";

const carouselVariants = tv({
  slots: {
    root: [
      "grid relative items-start justify-center rounded-carousel",
      "bg-carousel-bg",
    ],
    itemGroup: [
      "flex-1 overflow-hidden rounded-carousel-item",
      // Hide scrollbars
      "data-[dragging]:cursor-grabbing",
      "scrollbar-none [-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]",
    ],
    item: [
      "flex justify-center items-center",
      "bg-carousel-item-bg border border-carousel-item-border rounded-carousel-item",
      "overflow-hidden",
    ],
    image: ["w-full h-full transition-carousel-image"],
    control: [
      "flex absolute place-self-end justify-self-center gap-2 bg-carousel-control-bg",
      " p-2 rounded-carousel-control ",
    ],
    prevTrigger: [
      "flex items-center justify-center rounded-carousel-control",
      "bg-carousel-btn-bg hover:bg-carousel-btn-hover active:bg-carousel-btn-active",
      "disabled:bg-carousel-btn-disabled disabled:cursor-not-allowed disabled:opacity-50",
      "text-carousel-btn-text disabled:text-carousel-btn-text-disabled",
      "focus:outline-none focus:ring-2 focus:ring-carousel-focus-ring focus:ring-offset-2",
      "transition-carousel cursor-pointer border-none",
    ],
    nextTrigger: [
      "flex items-center justify-center rounded-carousel-control",
      "bg-carousel-btn-bg hover:bg-carousel-btn-hover active:bg-carousel-btn-active",
      "disabled:bg-carousel-btn-disabled disabled:cursor-not-allowed disabled:opacity-50",
      "text-carousel-btn-text disabled:text-carousel-btn-text-disabled",
      "focus:outline-none focus:ring-2 focus:ring-carousel-focus-ring focus:ring-offset-2",
      "transition-carousel cursor-pointer border-none",
    ],
    indicatorGroup: ["flex justify-center items-center gap-2"],
    indicator: [
      "h-4 w-4",
      "bg-carousel-indicator rounded-carousel-indicator cursor-pointer",
      "transition-carousel-indicator border-none",
      "hover:bg-carousel-indicator-hover",
      "focus:outline-none focus:ring-2 focus:ring-carousel-focus-ring focus:ring-offset-2",
      "data-[current]:bg-carousel-indicator-active",
    ],
    autoplayTrigger: [
      "flex justify-center items-center rounded-carousel-control",
      "bg-carousel-btn-bg hover:bg-carousel-btn-hover",
      "text-carousel-btn-text border-none cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-carousel-focus-ring focus:ring-offset-2",
      "transition-carousel",
    ],
    spacer: ["flex-1"],
  },
  compoundSlots: [
    {
      slots: ["autoplayTrigger", "indicator", "prevTrigger", "nextTrigger"],
      class: "px-0 py-0",
    },
  ],
  variants: {
    orientation: {
      horizontal: {
        root: "flex-col",
        control: "flex-row",
        indicatorGroup: "flex-row",
      },
      vertical: {
        root: "flex-row",
        control: "flex-col",
        indicatorGroup: "flex-col",
      },
    },
    size: {
      sm: {
        /* root: "max-w-carousel-horizontal-sm",
        item: "h-carousel-item-sm text-carousel-sm",
        indicator: "size-carousel-indicator-sm",
        control: "gap-1",
        prevTrigger: "size-carousel-control-sm text-sm",
        nextTrigger: "size-carousel-control-sm text-sm",
        autoplayTrigger: "size-carousel-control-sm text-sm",*/
      },
      md: {
        /* root: "max-w-carousel-horizontal-md",
        item: "h-carousel-item-md text-carousel-md",
        indicator: "size-carousel-indicator-md",
        control: "gap-2",
        prevTrigger: "size-carousel-control-md text-base",
        nextTrigger: "size-carousel-control-md text-base",
        autoplayTrigger: "size-carousel-control-md text-base",*/
      },
      lg: {
        /* root: "max-w-carousel-horizontal-lg",
        item: "h-carousel-item-lg text-carousel-lg",
        indicator: "size-carousel-indicator-lg",
        control: "gap-3",
        prevTrigger: "size-carousel-control-lg text-lg",
        nextTrigger: "size-carousel-control-lg text-lg",
        autoplayTrigger: "size-carousel-control-lg text-lg",*/
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
  },
});

// Hybrid carousel item - supports both image src and custom content
export interface CarouselItem {
  id: string;
  // Image approach
  src?: string;
  alt?: string;
  // Custom content approach
  content?: ReactNode;
  // Polymorphic image component (for Next.js Image, etc.)
  as?: ElementType;
  // Additional props for the image component
  imageProps?: Record<string, any>;
}

export interface CarouselProps
  extends VariantProps<typeof carouselVariants>,
    carousel.Props {
  items: CarouselItem[];
  className?: string;
}

export function Carousel({
  items,
  id,
  orientation = "horizontal",
  size = "md",
  className,
  loop = false,
  autoplay = false,
  allowMouseDrag = true,
  slidesPerPage = 1,
  slidesPerMove = 1,
  spacing = "0px",
  onPageChange,
  ...props
}: CarouselProps) {
  const service = useMachine(carousel.machine as any, {
    id: useId(),
    slideCount: items.length,
    autoplay,
    allowMouseDrag,
    loop,
    slidesPerPage,
    slidesPerMove,
    spacing,
    onPageChange,
  });

  const api = carousel.connect(service as carousel.Service, normalizeProps);

  const {
    root,
    control,
    itemGroup,
    item,
    indicatorGroup,
    indicator,
    prevTrigger,
    nextTrigger,
  } = carouselVariants();

  return (
    <div className={root()} {...api.getRootProps()}>
      {/* images */}
      <div className={itemGroup()} {...api.getItemGroupProps()}>
        {items.map((image, index) => (
          <div className={item()} {...api.getItemProps({ index })} key={index}>
            <img src={image.src} alt={`Slide Image ${index}`} />
          </div>
        ))}
      </div>
      {/* controls */}
      <div className={control()} {...api.getControlProps()}>
        <Button
          className={prevTrigger()}
          {...api.getPrevTriggerProps()}
          icon="token-icon-carousel-prev"
        />
        <div className={indicatorGroup()} {...api.getIndicatorGroupProps()}>
          {api.pageSnapPoints.map((_, index) => (
            <Button
              className={indicator()}
              key={index}
              {...api.getIndicatorProps({ index })}
            />
          ))}
        </div>
        <Button
          className={nextTrigger()}
          {...api.getNextTriggerProps()}
          icon="token-icon-carousel-next"
        />
      </div>
    </div>
  );
}
