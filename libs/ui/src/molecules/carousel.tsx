import * as carousel from '@zag-js/carousel'
import { normalizeProps, useMachine } from '@zag-js/react'
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  createContext,
  useContext,
  useId,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'
import { Button } from '../atoms/button'
import type { IconType } from '../atoms/icon'
import { Image } from '../atoms/image'

type CarouselImageComponent<T extends ElementType = typeof Image> =
  T extends typeof Image
    ? typeof Image
    : T extends ElementType
      ? 'src' extends keyof ComponentPropsWithoutRef<T>
        ? 'alt' extends keyof ComponentPropsWithoutRef<T>
          ? T
          : never
        : never
      : never

const carouselVariants = tv({
  slots: {
    wrapper: ['relative w-fit'],
    root: ['relative overflow-hidden', 'rounded-carousel'],
    control: [
      'flex absolute bottom-0 left-1/2 -translate-x-1/2',
      'gap-carousel-control p-carousel-control',
      'bg-carousel-control-bg',
      'rounded-carousel',
    ],
    slideGroup: [
      'overflow-hidden',
      'scrollbar-hide',
      'data-[dragging]:cursor-grabbing',
    ],
    slide: [
      'relative flex-shrink-0',
      'flex items-center justify-center',
      'overflow-hidden',
    ],
    prevTrigger: '',
    nextTrigger: '',
    indicatorGroup: [
      'flex justify-center w-full items-center gap-carousel-indicator',
    ],
    indicator: [
      'aspect-carousel-indicator bg-carousel-indicator-bg w-carousel-indicator',
      'data-[current]:bg-carousel-indicator-bg-active',
      'data-[current]:border-carousel-indicator-border-active',
      'rounded-carousel-indicator border border-carousel-indicator-border',
    ],
    autoplayIcon: ['icon-[mdi--play]', 'data-[pressed=true]:icon-[mdi--pause]'],
    autoplayTrigger: [
      'absolute top-carousel-trigger-top right-carousel-trigger-right z-50',
      'bg-carousel-trigger-bg',
    ],
    spacer: ['flex-1'],
  },
  compoundSlots: [
    {
      slots: ['autoplayTrigger', 'indicator', 'prevTrigger', 'nextTrigger'],
      class: [
        'p-carousel-trigger',
        'focus:outline-none text-carousel-trigger-fg focus:ring-2 focus:ring-carousel-focus-ring focus:ring-offset-2',
      ],
    },
    {
      slots: ['prevTrigger', 'nextTrigger'],
      class: [
        'bg-carousel-trigger-bg hover:bg-carousel-trigger-bg-hover text-carousel-trigger-size',
        'hover:text-carousel-trigger-fg-hover',
      ],
    },
  ],
  variants: {
    objectFit: {
      cover: {
        slide: '*:w-full *:h-full *:object-cover',
      },
      contain: {
        slide: '*:w-full *:h-full *:object-contain',
      },
      fill: {
        slide: '*:w-full *:h-full *:object-fill',
      },
      none: {
        slide: '',
      },
    },

    aspectRatio: {
      square: {
        slide: 'aspect-square',
      },
      landscape: {
        slide: 'aspect-video',
      },
      portrait: {
        slide: 'aspect-portrait',
      },
      wide: {
        slide: 'aspect-wide',
      },
      none: {
        slide: '', //  custom content
      },
    },
    size: {
      sm: {
        root: [
          'data-[orientation=horizontal]:max-w-carousel-root-sm',
          'data-[orientation=vertical]:max-h-carousel-root-sm',
        ],
        slide: [
          'data-[orientation=horizontal]:max-w-carousel-root-sm',
          'data-[orientation=vertical]:max-h-carousel-root-sm',
        ],
      },
      md: {
        root: [
          'data-[orientation=horizontal]:max-w-carousel-root-md',
          'data-[orientation=vertical]:max-h-carousel-root-md',
        ],
        slide: [
          'data-[orientation=horizontal]:max-w-carousel-root-md',
          'data-[orientation=vertical]:max-h-carousel-root-md',
        ],
      },
      lg: {
        root: [
          'data-[orientation=horizontal]:max-w-carousel-root-lg',
          'data-[orientation=vertical]:max-h-carousel-root-lg',
        ],
        slide: [
          'data-[orientation=horizontal]:max-w-carousel-root-lg',
          'data-[orientation=vertical]:max-h-carousel-root-lg',
        ],
      },
      full: {
        root: [
          'data-[orientation=horizontal]:w-full',
          'data-[orientation=vertical]:h-full',
        ],
      },
    },
  },
  defaultVariants: {
    aspectRatio: 'square',
    objectFit: 'cover',
    size: 'md',
  },
})

// === CONTEXT ===
interface CarouselContextValue {
  api: ReturnType<typeof carousel.connect>
  size?: 'sm' | 'md' | 'lg' | 'full'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'wide' | 'none'
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

const useCarouselContext = () => {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error('Carousel components must be used within Carousel.Root')
  }
  return context
}

// === TYPE DEFINITIONS ===
export type CarouselSlide = {
  id: string
  content?: ReactNode
  src?: string
  alt?: string
  imageProps?: Record<string, unknown>
}

export interface CarouselRootProps<T extends ElementType = typeof Image>
  extends VariantProps<typeof carouselVariants>,
    Omit<carousel.Props, 'id' | 'size'> {
  id?: string
  className?: string
  children: ReactNode
  imageAs?: CarouselImageComponent<T>
  width?: number
  height?: number
}

interface CarouselSlidesProps {
  slides: CarouselSlide[]
  size?: 'sm' | 'md' | 'lg' | 'full'
  imageAs?: ElementType
  width?: number
  height?: number
  className?: string
}

interface CarouselSlideProps {
  index: number
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

interface CarouselPreviousProps {
  className?: string
  icon?: IconType
}

interface CarouselNextProps {
  className?: string
  icon?: IconType
}

interface CarouselIndicatorsProps {
  className?: string
}

interface CarouselIndicatorProps {
  index: number
  className?: string
  children?: ReactNode
}

interface CarouselAutoplayProps {
  className?: string
}

interface CarouselControlProps {
  children: ReactNode
  className?: string
}

// === ROOT COMPONENT ===
export function Carousel<T extends ElementType = typeof Image>({
  /* Data */
  id,
  /* Tailwind variants */
  size,
  objectFit,
  aspectRatio,
  /* Zag.js carousel config */
  orientation = 'horizontal',
  slideCount = 1,
  loop = true,
  autoplay = false,
  allowMouseDrag = true,
  slidesPerPage = 1,
  slidesPerMove = 1,
  spacing = '0px',
  padding = '0px',
  dir = 'ltr',
  /* Others */
  className,
  children,
  onPageChange,
  ...props
}: CarouselRootProps<T>) {
  const fallbackId = useId()
  const service = useMachine(carousel.machine, {
    id: id ?? fallbackId,
    slideCount,
    autoplay,
    orientation,
    allowMouseDrag,
    loop,
    slidesPerPage,
    slidesPerMove,
    spacing,
    padding,
    dir,
    onPageChange,
    ...props,
  })

  const api = carousel.connect(service, normalizeProps)
  const { wrapper, root } = carouselVariants({ size, objectFit, aspectRatio })

  return (
    <CarouselContext.Provider value={{ api, size, objectFit, aspectRatio }}>
      <div className={wrapper({ className })}>
        <div className={root()} {...api.getRootProps()}>
          {children}
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

// === ITEMS CONTAINER ===
Carousel.Slides = function CarouselSlides({
  slides,
  size: overrideSize,
  imageAs,
  width,
  height,
  className,
}: CarouselSlidesProps) {
  const {
    api,
    size: contextSize,
    objectFit,
    aspectRatio,
  } = useCarouselContext()
  const size = overrideSize ?? contextSize
  const { slideGroup } = carouselVariants({
    size,
    objectFit,
    aspectRatio,
  })
  const ImageComponent = (imageAs || Image) as ElementType

  return (
    <div className={slideGroup({ className })} {...api.getItemGroupProps()}>
      {slides.map((slide, index) => (
        <Carousel.Slide key={slide.id} index={index}>
          {slide.content || (
            <ImageComponent
              as={imageAs === Image ? undefined : imageAs}
              src={slide.src || ''}
              alt={slide.alt || ''}
              width={width}
              height={height}
              {...slide.imageProps}
            />
          )}
        </Carousel.Slide>
      ))}
    </div>
  )
}

// === SINGLE ITEM ===
Carousel.Slide = function CarouselSlide({
  index,
  children,
  size: overrideSize,
  className,
}: CarouselSlideProps) {
  const {
    api,
    size: contextSize,
    objectFit,
    aspectRatio,
  } = useCarouselContext()
  const size = overrideSize ?? contextSize
  const { slide: slideSlot } = carouselVariants({
    size,
    objectFit,
    aspectRatio,
  })

  return (
    <div className={slideSlot({ className })} {...api.getItemProps({ index })}>
      {children}
    </div>
  )
}

// === PREVIOUS BUTTON ===
Carousel.Previous = function CarouselPrevious({
  className,
  icon = 'token-icon-carousel-prev' as IconType,
}: CarouselPreviousProps) {
  const { api } = useCarouselContext()
  const { prevTrigger } = carouselVariants()

  return (
    <Button
      className={prevTrigger({ className })}
      {...api.getPrevTriggerProps()}
      icon={icon}
    />
  )
}

// === NEXT BUTTON ===
Carousel.Next = function CarouselNext({
  className,
  icon = 'token-icon-carousel-next' as IconType,
}: CarouselNextProps) {
  const { api } = useCarouselContext()
  const { nextTrigger } = carouselVariants()

  return (
    <Button
      className={nextTrigger({ className })}
      {...api.getNextTriggerProps()}
      icon={icon}
    />
  )
}

// === INDICATORS GROUP ===
Carousel.Indicators = function CarouselIndicators({
  className,
  children,
}: CarouselIndicatorsProps & { children?: ReactNode }) {
  const { api } = useCarouselContext()
  const { indicatorGroup, indicator } = carouselVariants()

  // If children are provided, render them (custom indicators)
  if (children) {
    return (
      <div
        className={indicatorGroup({ className })}
        {...api.getIndicatorGroupProps()}
      >
        {children}
      </div>
    )
  }

  // Default indicators
  return (
    <div
      className={indicatorGroup({ className })}
      {...api.getIndicatorGroupProps()}
    >
      {api.pageSnapPoints.map((_, index) => (
        <Button
          className={indicator()}
          key={index}
          {...api.getIndicatorProps({ index })}
        />
      ))}
    </div>
  )
}

// === SINGLE INDICATOR ===
Carousel.Indicator = function CarouselIndicator({
  index,
  className,
  children,
}: CarouselIndicatorProps) {
  const { api } = useCarouselContext()
  const { indicator } = carouselVariants()

  return (
    <Button
      className={indicator({ className })}
      {...api.getIndicatorProps({ index })}
    >
      {children}
    </Button>
  )
}

// === AUTOPLAY TRIGGER ===
Carousel.Autoplay = function CarouselAutoplay({
  className,
}: CarouselAutoplayProps) {
  const { api } = useCarouselContext()
  const { autoplayTrigger: autoplayTriggerSlot } = carouselVariants()

  return (
    <Button
      icon={api.isPlaying ? 'icon-[mdi--pause]' : 'icon-[mdi--play]'}
      className={autoplayTriggerSlot({ className })}
      {...api.getAutoplayTriggerProps()}
    />
  )
}

// === CONTROL WRAPPER ===
Carousel.Control = function CarouselControl({
  children,
  className,
}: CarouselControlProps) {
  const { api } = useCarouselContext()
  const { control } = carouselVariants()

  return (
    <div className={control({ className })} {...api.getControlProps()}>
      {children}
    </div>
  )
}

// === EXPORT THE COMPOUND COMPONENT ===
Carousel.Root = Carousel
