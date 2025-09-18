import * as carousel from '@zag-js/carousel'
import { normalizeProps, useMachine } from '@zag-js/react'
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useId,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'
import { Button } from '../atoms/button'
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
    prevTrigger: ['bg-carousel-trigger-bg'],
    nextTrigger: ['bg-carousel-trigger-bg'],
    indicatorGroup: [
      'flex justify-center w-full items-center gap-carousel-indicator',
    ],
    indicator: [
      'aspect-carousel-indicator bg-carousel-indicator-bg w-carousel-indicator',
      'data-[current]:bg-carousel-indicator-bg-active',
      'rounded-carousel-indicator',
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

export type CarouselSlide = {
  id: string
  content?: ReactNode
  src?: string
  alt?: string
  imageProps?: Record<string, unknown>
}

interface CarouselProps<T extends ElementType = typeof Image>
  extends VariantProps<typeof carouselVariants>,
    Omit<carousel.Props, 'id' | 'size'> {
  id?: string
  slides: CarouselSlide[]
  className?: string
  imageAs?: CarouselImageComponent<T>
  autoplayTrigger?: boolean
  showControl?: boolean
  width?: number
  height?: number
}

export function Carousel<T extends ElementType = typeof Image>({
  /* Data */
  slides,
  id,
  /* Tailwind variants */
  size,
  objectFit,
  aspectRatio,
  /* Zag.js carousel config */
  orientation = 'horizontal',
  slideCount = slides.length,
  loop = true,
  autoplay = false,
  allowMouseDrag = true,
  slidesPerPage = 1,
  slidesPerMove = 1,
  spacing = '0px',
  padding = '0px',
  dir = 'ltr',

  /* Others */
  autoplayTrigger = false,
  showControl = true,
  className,
  imageAs,
  width,
  height,
  onPageChange,
  ...props
}: CarouselProps<T>) {
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
    autoplayTrigger: autoplayTriggerSlot,
  } = carouselVariants({ size, objectFit, aspectRatio })

  const ImageComponent = (imageAs || Image) as ElementType

  return (
    <div className={wrapper()}>
      <div className={root()} {...api.getRootProps()}>
        {/* images */}
        {autoplayTrigger && slideCount > 1 && (
          <Button
            icon={api.isPlaying ? 'icon-[mdi--pause]' : 'icon-[mdi--play]'}
            className={autoplayTriggerSlot()}
            {...api.getAutoplayTriggerProps()}
          />
        )}
        <div className={slideGroup()} {...api.getItemGroupProps()}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={slideSlot()}
              {...api.getItemProps({ index })}
            >
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
  )
}
