'use client'

import { Button } from '@new-engine/ui/atoms/button'
import { Image as ImageComponent } from '@new-engine/ui/atoms/image'
import { Carousel } from '@new-engine/ui/molecules/carousel'
import type { CarouselSlide } from '@new-engine/ui/molecules/carousel'
import { tv } from '@new-engine/ui/utils'
import Image from 'next/image'
import { useState } from 'react'
import type { VariantProps } from 'tailwind-variants'

const galleryStyles = tv({
  slots: {
    root: '',
    mainCarousel: 'flex h-fit relative',
    container: 'flex-shrink-0',
    scrollArea: 'scrollbar-thin max-h-[60svh]',
    list: 'flex gap-gallery-sm',
    trigger: [
      'relative flex-shrink-0',
      'aspect-square',
      'overflow-hidden rounded-md border',
      'transition-all duration-200 cursor-pointer',
      'p-gallery-trigger',
      'data-[active=true]:border-gallery-trigger-active',
      'brightness-gallery-trigger',
      'hover:brightness-gallery-trigger-active data-[active=true]:brightness-gallery-trigger-active',
    ],
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex flex-col',
        mainCarousel: 'order-1',
        container: 'order-2',
        scrollArea: 'w-full overflow-x-auto overflow-y-hidden',
        list: 'flex-row py-gallery-sm',
      },
      vertical: {
        root: 'grid grid-cols-5 gap-gallery-root w-full',
        mainCarousel: 'col-span-4',
        container: 'col-span-1',
        scrollArea: 'h-full overflow-y-auto overflow-x-hidden',
        list: 'flex-col px-gallery-list',
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

interface GalleryProps extends VariantProps<typeof galleryStyles> {
  images: CarouselSlide[]
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide'
  size?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
  thumbnailSize?: number
  carouselSize?: number
  objectFit?: 'cover' | 'contain' | 'fill'
}

export function Gallery({
  images,
  aspectRatio = 'portrait',
  orientation,
  size = 'full',
  objectFit = 'cover',
  thumbnailSize = 60,
  carouselSize = 200,
  className,
}: GalleryProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const { trigger, root, container, scrollArea, list, mainCarousel } =
    galleryStyles({ orientation })

  const handlePageChange = (details: { page: number }) => {
    setCurrentPage(details.page)
  }

  const handleThumbnailClick = (index: number) => {
    // Since we can't programmatically control the carousel,
    // we'll just update our state to show which is active
    setCurrentPage(index)
  }

  return (
    <div className={root({ className })}>
      {/* Thumbnails */}
      <div className={container()}>
        <div className={scrollArea()}>
          <div className={list()}>
            {images.length > 1 &&
              images.map((image, index) => (
                <Button
                  key={image.id}
                  onClick={() => handleThumbnailClick(index)}
                  className={trigger()}
                  data-active={currentPage === index}
                  aria-label={`Zobrazit obrázek ${index + 1}`}
                  aria-current={currentPage === index ? 'true' : 'false'}
                >
                  <ImageComponent
                    as={Image}
                    src={image.src || ''}
                    alt={image.alt || `Obrázek produktu ${index + 1}`}
                    width={thumbnailSize}
                    height={thumbnailSize}
                    quality={40}
                  />
                </Button>
              ))}
          </div>
        </div>
      </div>

      {/* Main Carousel */}
      <div className={mainCarousel()}>
        <Carousel.Root
          imageAs={Image}
          page={currentPage}
          slideCount={images.length}
          aspectRatio={aspectRatio}
          loop
          onPageChange={handlePageChange}
          size={size}
          objectFit={objectFit}
          width={carouselSize}
          height={carouselSize}
        >
          <Carousel.Slides slides={images} />
        </Carousel.Root>
      </div>
    </div>
  )
}
