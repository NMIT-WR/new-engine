import Image from 'next/image'
import type * as React from 'react'

import { Carousel } from '@/components/Carousel'
import { LocalizedLink } from '@/components/LocalizedLink'
import { getCollectionsList } from '@lib/data/collections'
import { twMerge } from 'tailwind-merge'

type CollectionsSliderType = {
  heading?: React.ReactNode
  className?: string
}

export const CollectionsSlider = async ({
  heading = 'Collections',
  className,
}: CollectionsSliderType) => {
  const collections = await getCollectionsList(0, 20, [
    'id',
    'title',
    'handle',
    'metadata',
  ])

  if (!collections || !collections.collections.length) {
    return null
  }

  return (
    <Carousel
      heading={<h3 className="text-md md:text-2xl">{heading}</h3>}
      className={twMerge('mb-26 md:mb-36', className)}
    >
      {collections.collections.map((c) => (
        <div
          key={c.id}
          className="w-[70%] max-w-72 flex-shrink-0 sm:w-[60%] lg:w-full"
        >
          <LocalizedLink href={`/collections/${c.handle}`}>
            {typeof c.metadata?.image === 'object' &&
              c.metadata.image &&
              'url' in c.metadata.image &&
              typeof c.metadata.image.url === 'string' && (
                <div className="relative mb-4 aspect-[3/4] w-full md:mb-6">
                  <Image src={c.metadata.image.url} alt={c.title} fill />
                </div>
              )}
            <h3>{c.title}</h3>
          </LocalizedLink>
        </div>
      ))}
    </Carousel>
  )
}
