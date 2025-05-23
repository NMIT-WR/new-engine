import * as carousel from "@zag-js/carousel";
import { useMachine, normalizeProps } from "@zag-js/react";
import { useId, type ReactNode, type ElementType } from "react";
import { tv, type VariantProps } from "tailwind-variants";
//import { Icon, type IconType } from "../atoms/icon";
import { Button } from "../atoms/button";
import { Image } from "../atoms/image";

const carouselVariants = tv({
  slots: {
    root: ["grid relative items-start", "bg-red-600"],
    control: [
      "flex absolute bottom-0 place-self-center w-fit gap-2 bg-carousel-control-bg",
      "p-2 rounded-carousel",
    ],
    slideGroup: [
      "flex overflow-hdden rounded-carousel",
      // Hide scrollbars
      "bg-yellow-600 p-4",
      "scrollbar-hide",
      "data-[dragging]:cursor-grabbing",
      "data-[orientation=horizontal]:h-full",
      "data-[orientation=vertical]:w-full",
    ],
    slide: [
      "flex  bg-blue-600 p-4 h-full",
      "border border-carousel-item-border rounded-carousel",
      "overflow-hdden",
    ],
    prevTrigger: [],
    nextTrigger: [],
    indicatorGroup: ["flex justify-center items-center gap-2"],
    indicator: [
      "aspect-carousel-indicator w-carousel-indicator",
      "rounded-carousel",
      "data-[current]:bg-carousel-indicator-active",
    ],
    autoplayTrigger: [
      "flex justify-center items-center rounded-carousel",
      "text-carousel-btn-text border-none cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-carousel-focus-ring focus:ring-offset-2",
    ],
    spacer: ["flex-1"],
  },
  compoundSlots: [
    {
      slots: ["autoplayTrigger", "indicator", "prevTrigger", "nextTrigger"],
      class: [
        "p-carousel-trigger bg-carousel-trigger-bg",
        "focus:outline-none focus:ring-2 focus:ring-carousel-focus-ring focus:ring-offset-2",
      ],
    },
  ],
  variants: {
    objectFit: {
      cover: {
        slide: "**:object-cover",
      },
      contain: {
        slide: "**:object-contain",
      },
      fill: {
        slide: "**:object-fill",
      },
    },
    aspectRatio: {
      square: {
        root: "aspect-carousel-square",
        slide: "aspect-carousel-square",
      },
      landscape: {
        root: "aspect-carousel-landscape",
        slide: "aspect-carousel-landscape",
      },
      portrait: {
        root: "aspect-carousel-portrait",
        slide: "aspect-carousel-portrait",
      },
      wide: {
        root: "aspect-carousel-wide",
        slide: "aspect-carousel-wide",
      },
      none: {
        root: "aspect-none",
        slide: "", //  custom content
      },
    },
    size: {
      sm: {
        root: [
          "data-[orientation=horizontal]:max-w-carousel-root-sm",
          "data-[orientation=vertical]:max-h-carousel-root-sm",
        ],
      },
      md: {
        root: [
          "data-[orientation=horizontal]:max-w-carousel-root-md p-4",
          "data-[orientation=vertical]:max-h-carousel-root-md",
        ],
      },
      lg: {
        root: [
          "data-[orientation=horizontal]:max-w-carousel-root-lg",
          "data-[orientation=vertical]:max-h-carousel-root-lg",
        ],
      },
      full: {
        root: [
          "data-[orientation=horizontal]:w-full p-4",
          "data-[orientation=vertical]:h-full",
        ],
      },
    },
  },
  defaultVariants: {
    aspectRatio: "square",
    objectFit: "fill",
    size: "md",
  },
});

export type CarouselSlide = {
  id: string;
  content?: ReactNode;
  src?: string;
  alt?: string;
  imageProps?: Record<string, any>;
};

interface CarouselProps
  extends VariantProps<typeof carouselVariants>,
    Omit<carousel.Props, "id" | "size"> {
  id?: string;
  slides: CarouselSlide[];
  className?: string;
  as?: ElementType;
  size?: "sm" | "md" | "lg";
}

export function Carousel({
  slides,
  id,
  orientation = "horizontal",
  slideCount = slides.length,
  size = "md",
  className,
  loop = false,
  //page = 0,
  autoplay = false,
  allowMouseDrag = true,
  slidesPerPage = 1,
  slidesPerMove = 1,
  spacing = "0px",
  padding = "0px",
  dir = "ltr",
  as,
  onPageChange,
  ...props
}: CarouselProps) {
  const service = useMachine(carousel.machine as any, {
    id: useId(),
    slideCount,
    autoplay,
    orientation,
    // page,
    allowMouseDrag,
    loop,
    slidesPerPage,
    slidesPerMove,
    spacing,
    padding,
    onPageChange,
  });

  const api = carousel.connect(service as carousel.Service, normalizeProps);

  const {
    root,
    control,
    slideGroup,
    slide: slideSlot,
    indicatorGroup,
    indicator,
    prevTrigger,
    nextTrigger,
  } = carouselVariants();

  return (
    <div className={root()} {...api.getRootProps()}>
      {/* images */}
      <div className={slideGroup()} {...api.getItemGroupProps()}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={slideSlot()}
            {...api.getItemProps({ index })}
          >
            {slide.content || (
              <Image
                as={as}
                src={slide.src || ""}
                alt={slide.alt || ""}
                {...slide.imageProps}
              />
            )}
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
