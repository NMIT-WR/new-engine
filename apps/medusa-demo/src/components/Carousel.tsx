'use client'

import { Icon } from '@/components/Icon'
import { IconCircle } from '@/components/IconCircle'
import { Layout, LayoutColumn } from '@/components/Layout'
import type { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import * as React from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

export type CarouselProps = {
  heading?: React.ReactNode
  button?: React.ReactNode
  arrows?: boolean
} & React.ComponentPropsWithRef<'div'>

export const Carousel = ({
  heading,
  button,
  arrows = true,
  children,
  className,
}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    containScroll: 'trimSnaps',
    skipSnaps: true,
    active: true,
  })
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)

  const scrollPrev = React.useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = React.useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )
  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className={twMerge('overflow-hidden', className)}>
      <Layout>
        <LayoutColumn className="relative">
          <div className="mb-8 flex justify-between gap-x-10 gap-y-6 max-sm:flex-col sm:items-center md:mb-15">
            {heading}
            {(arrows || button) && (
              <div className="flex shrink-0 md:gap-6">
                {button}
                {arrows && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={scrollPrev}
                      disabled={prevBtnDisabled}
                      className={twJoin(
                        'transition-opacity max-md:hidden',
                        prevBtnDisabled && 'opacity-50'
                      )}
                      aria-label="Previous"
                    >
                      <IconCircle>
                        <Icon
                          name="arrow-left"
                          className="h-6 w-6 text-black"
                        />
                      </IconCircle>
                    </button>
                    <button
                      type="button"
                      onClick={scrollNext}
                      disabled={nextBtnDisabled}
                      className={twJoin(
                        'transition-opacity max-md:hidden',
                        nextBtnDisabled && 'opacity-50'
                      )}
                      aria-label="Next"
                    >
                      <IconCircle>
                        <Icon
                          name="arrow-right"
                          className="h-6 w-6 text-black"
                        />
                      </IconCircle>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div ref={emblaRef}>
            <div className="flex touch-pan-y gap-4 md:gap-10">{children}</div>
          </div>
        </LayoutColumn>
      </Layout>
    </div>
  )
}
