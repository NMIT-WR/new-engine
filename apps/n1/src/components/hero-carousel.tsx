'use client'
import { Carousel, type CarouselSlide } from '@new-engine/ui/molecules/carousel'

interface HeroCarouselProps {
  slides: CarouselSlide[]
}
export function HeroCarousel({ slides }: HeroCarouselProps) {
  return (
    <Carousel.Root
      slideCount={slides.length}
      aspectRatio="none"
      className="h-full w-full"
      autoplay
    >
      <Carousel.Slides slides={slides} />
      <Carousel.Control>
        <Carousel.Indicators />
      </Carousel.Control>
      <Carousel.Previous className="-translate-y-1/2 absolute top-1/2 left-0" />
      <Carousel.Next className="-translate-y-1/2 absolute top-1/2 right-0" />
    </Carousel.Root>
  )
}
