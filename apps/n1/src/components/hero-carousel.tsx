'use client'
import { Carousel, type CarouselSlide } from '@new-engine/ui/molecules/carousel'

interface HeroCarouselProps {
  slides: CarouselSlide[]
}
export function HeroCarousel({ slides }: HeroCarouselProps) {
  return (
    <Carousel
      slides={slides}
      slideCount={slides.length}
      aspectRatio="none"
      className="h-full w-full"
    />
  )
}
