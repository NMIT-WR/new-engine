import * as carousel from "@zag-js/carousel";
import { useMachine, normalizeProps } from "@zag-js/react";
import { useId, type ReactNode, type ElementType } from "react";
import { tv, type VariantProps } from "tailwind-variants";
//import { Icon, type IconType } from "../atoms/icon";
import { Button } from "../atoms/button";
import { Image } from "../atoms/image";

const carouselVariants = tv({
  slots: {
    root: ["relative overflow-hiddn", "bg-red-600"],
    control: [
      "flex absolute bottom-0 left-1/2 -translate-x-1/2",
      "gap-2 p-2",
      "bg-carousel-control-bg",
      "rounded-carousel",
    ],
    slideGroup: [
      "overflow-hdden",
      // Hide scrollbars
      "bg-yellow-600 p-4",
      "scrollbar-hide",
      "data-[dragging]:cursor-grabbing",
    ],
    slide: [
      "relative flex-shrink-0",
      "flex items-center justify-center",
      "bg-blue-600 p-4",
      "overflow-hdden",
    ],
    prevTrigger: [],
    nextTrigger: [],
    indicatorGroup: ["flex justify-center items-center gap-2"],
    indicator: [
      "aspect-carousel-indicator w-carousel-indicator",
      "data-[current]:bg-carousel-indicator-active",
    ],
    autoplayTrigger: [
      "flex justify-center items-center rounded-carousel",
      "text-carousel-trigger border-none cursor-pointer",
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
        slide: "*:w-full *:h-full *:object-cover",
      },
      contain: {
        slide: "*:w-full *:h-full *:object-contain",
      },
      fill: {
        slide: "*:w-full *:h-full *:object-fill",
      },
      none: {
        slide: "",
      },
    },

    aspectRatio: {
      square: {
        slide: "aspect-carousel-square",
      },
      landscape: {
        slide: "aspect-carousel-landscape",
      },
      portrait: {
        slide: "aspect-carousel-portrait",
      },
      wide: {
        slide: "aspect-carousel-wide",
      },
      none: {
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
    objectFit: "cover",
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
  autoplayTrigger?: boolean;
  showControl?: boolean;
}

export function Carousel({
  /* Data */
  slides,
  id,

  /* Tailwind variants */
  size = "md",
  objectFit = "cover",
  aspectRatio = "square",

  /* Zag.js carousel config */
  orientation = "horizontal",
  slideCount = slides.length,
  loop = true,
  autoplay = false,
  allowMouseDrag = true,
  slidesPerPage = 1,
  slidesPerMove = 1,
  spacing = "0px",
  padding = "0px",
  dir = "ltr",

  /* Others */
  autoplayTrigger = true,
  showControl = true,
  className,
  as,
  onPageChange,
  ...props
}: CarouselProps) {
  const service = useMachine(carousel.machine as any, {
    id: useId(),
    slideCount,
    autoplay,
    orientation,
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
  } = carouselVariants({ size, objectFit, aspectRatio });

  return (
    <div className={root()} {...api.getRootProps()}>
      {/* images */}
      {autoplayTrigger && slideCount > 1 && (
        <Button
          icon="icon-[mdi--play]"
          className="text-md bg-black right-8 top-12 z-10 rounded-full px-0 py-0 absolute h-4 w-4"
          {...api.getAutoplayTriggerProps()}
        />
      )}
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
      {showControl && slideCount > 1 && (
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
      )}
    </div>
  );
}
