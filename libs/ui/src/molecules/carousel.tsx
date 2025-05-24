import * as carousel from "@zag-js/carousel";
import { useMachine, normalizeProps } from "@zag-js/react";
import { useId, type ReactNode, type ElementType } from "react";
import { tv, type VariantProps } from "tailwind-variants";
//import { Icon, type IconType } from "../atoms/icon";
import { Button } from "../atoms/button";
import { Image } from "../atoms/image";

const carouselVariants = tv({
  slots: {
    wrapper: ["relative"],
    root: ["relative overflow-hidden", "rounded-carousel"],
    control: [
      "flex absolute bottom-0 left-1/2 -translate-x-1/2",
      "gap-carousel-control p-carousel-control",
      "bg-carousel-control-bg",
      "rounded-carousel",
    ],
    slideGroup: [
      "overflow-hidden",
      "scrollbar-hide",
      "data-[dragging]:cursor-grabbing",
    ],
    slide: [
      "relative flex-shrink-0",
      "flex items-center justify-center",
      "overflow-hidden",
    ],
    prevTrigger: [],
    nextTrigger: [],
    indicatorGroup: [
      "flex justify-center w-full items-center gap-carousel-indicator",
    ],
    indicator: [
      "aspect-carousel-indicator w-carousel-indicator",
      "data-[current]:bg-carousel-indicator-active",
    ],
    autoplayIcon: ["icon-[mdi--play]", "data-[pressed=true]:icon-[mdi--pause]"],
    autoplayTrigger: ["absolute top-1 right-1 z-10"],
    spacer: ["flex-1"],
  },
  compoundSlots: [
    {
      slots: ["autoplayTrigger", "indicator", "prevTrigger", "nextTrigger"],
      class: [
        "p-carousel-trigger bg-carousel-trigger-bg",
        "focus:outline-none text-carousel-trigger-text focus:ring-2 focus:ring-carousel-focus-ring focus:ring-offset-2",
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
        slide: [
          "data-[orientation=horizontal]:max-w-carousel-root-sm",
          "data-[orientation=vertical]:max-h-carousel-root-sm",
        ],
      },
      md: {
        root: [
          "data-[orientation=horizontal]:max-w-carousel-root-md",
          "data-[orientation=vertical]:max-h-carousel-root-md",
        ],
        slide: [
          "data-[orientation=horizontal]:max-w-carousel-root-md",
          "data-[orientation=vertical]:max-h-carousel-root-md",
        ],
      },
      lg: {
        root: [
          "data-[orientation=horizontal]:max-w-carousel-root-lg",
          "data-[orientation=vertical]:max-h-carousel-root-lg",
        ],
        slide: [
          "data-[orientation=horizontal]:max-w-carousel-root-lg",
          "data-[orientation=vertical]:max-h-carousel-root-lg",
        ],
      },
      full: {
        root: [
          "data-[orientation=horizontal]:w-full",
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
  size,
  objectFit,
  aspectRatio,

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
  autoplayTrigger = false,
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
    wrapper,
    root,
    control,
    slideGroup,
    slide: slideSlot,
    indicatorGroup,
    indicator,
    prevTrigger,
    nextTrigger,
    // autoplayIcon,
    autoplayTrigger: autoplayTriggerSlot,
  } = carouselVariants({ size, objectFit, aspectRatio });

  return (
    <div className={wrapper()}>
      <div className={root()} {...api.getRootProps()}>
        {/* images */}
        {autoplayTrigger && slideCount > 1 && (
          <Button
            icon={api.isPlaying ? "icon-[mdi--pause]" : "icon-[mdi--play]"}
            className={autoplayTriggerSlot()}
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
