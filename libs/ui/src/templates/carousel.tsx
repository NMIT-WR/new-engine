import type { ElementType } from 'react'
import type { IconType } from '../atoms/icon'
import {
  Carousel,
  type CarouselRootProps,
  type CarouselSlide,
} from '../molecules/carousel'

export interface CarouselTemplateProps<T extends ElementType>
  extends Omit<CarouselRootProps<T>, 'children' | 'slideCount'> {
  slides: CarouselSlide[]
  showControls?: boolean
  showIndicators?: boolean
  showAutoplay?: boolean
  prevIcon?: IconType
  nextIcon?: IconType
}

export function CarouselTemplate<T extends ElementType>({
  slides,
  showControls = true,
  showIndicators = true,
  showAutoplay = false,
  prevIcon = 'token-icon-carousel-prev',
  nextIcon = 'token-icon-carousel-next',
  size,
  objectFit,
  aspectRatio,
  orientation,
  loop,
  autoplay,
  allowMouseDrag,
  slidesPerPage,
  slidesPerMove,
  spacing,
  padding,
  imageAs,
  width,
  height,
  className,
  onPageChange,
  ...carouselProps
}: CarouselTemplateProps<T>) {
  return (
    <Carousel
      size={size}
      objectFit={objectFit}
      aspectRatio={aspectRatio}
      orientation={orientation}
      slideCount={slides.length}
      loop={loop}
      autoplay={autoplay}
      allowMouseDrag={allowMouseDrag}
      slidesPerPage={slidesPerPage}
      slidesPerMove={slidesPerMove}
      spacing={spacing}
      padding={padding}
      imageAs={imageAs}
      width={width}
      height={height}
      className={className}
      onPageChange={onPageChange}
      {...carouselProps}
    >
      <Carousel.Slides
        slides={slides}
        imageAs={imageAs}
        width={width}
        height={height}
      />

      {(showControls || showIndicators) && (
        <Carousel.Control>
          {showControls && <Carousel.Previous icon={prevIcon} />}
          {showControls && showIndicators && <div className="flex-1" />}
          {showIndicators && (
            <Carousel.Indicators>
              {slides.map((slide, index) => (
                <Carousel.Indicator key={slide.id} index={index} />
              ))}
            </Carousel.Indicators>
          )}
          {showControls && showIndicators && <div className="flex-1" />}
          {showControls && <Carousel.Next icon={nextIcon} />}
        </Carousel.Control>
      )}

      {showAutoplay && <Carousel.Autoplay />}
    </Carousel>
  )
}
