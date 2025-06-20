'use client'

import Image from 'next/image'
import { useState } from 'react'
import { tv } from 'tailwind-variants'
import { Button } from '@ui/atoms/button'
import { Image as ImageComponent } from '@ui/atoms/image'
import { Carousel } from '@ui/molecules/carousel'
import type { CarouselSlide } from '@ui/molecules/carousel'

interface GalleryProps {
  images: CarouselSlide[]
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide'
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

const galleryStyles = tv({
  slots: {
    root: '',
    mainCarousel: 'flex h-fit relative w-full',
    container: 'flex-shrink-0',
    scrollArea: 'scrollbar-thin',
    list: 'flex gap-gallery-list',
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
        root: 'flex flex-col gap-gallery-root w-full',
        mainCarousel: 'order-1',
        container: 'order-2',
        scrollArea: 'w-full overflow-x-auto overflow-y-hidden',
        list: 'flex-row py-gallery-list',
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

export function Gallery({
  images,
  aspectRatio = 'portrait',
  orientation = 'vertical',
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
            {images.map((image, index) => (
              <Button
                key={image.id}
                onClick={() => handleThumbnailClick(index)}
                className={trigger()}
                data-active={currentPage === index}
                aria-label={`View image ${index + 1}`}
                aria-current={currentPage === index ? 'true' : 'false'}
              >
                <ImageComponent
                  as={Image}
                  src={image.src || ''}
                  alt={image.alt || `Product image ${index + 1}`}
                  width={100}
                  height={100}
                  objectFit="cover"
                  quality={20}
                  //className={image()}
                />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Carousel */}
      <div className={mainCarousel()}>
        <Carousel
          slides={images}
          page={currentPage}
          slideCount={images.length}
          aspectRatio={aspectRatio}
          loop
          onPageChange={handlePageChange}
          size="full"
        />
      </div>
    </div>
  )
}
