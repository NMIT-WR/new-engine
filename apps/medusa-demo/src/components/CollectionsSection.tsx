import { Carousel } from '@/components/Carousel'
import { LocalizedButtonLink, LocalizedLink } from '@/components/LocalizedLink'
import { getCollectionsList } from '@lib/data/collections'
import Image from 'next/image'

export const CollectionsSection = async ({
  className,
}: {
  className: string
}) => {
  const collections = await getCollectionsList(0, 20, [
    'id',
    'title',
    'handle',
    'metadata',
  ])

  if (!collections) {
    return null
  }

  return (
    <Carousel
      heading={<h3 className="text-md md:text-2xl">Collections</h3>}
      button={
        <>
          <LocalizedButtonLink
            href="/store"
            size="md"
            className="h-full flex-1 max-md:hidden md:h-auto"
          >
            View All
          </LocalizedButtonLink>
          <LocalizedButtonLink href="/store" size="sm" className="md:hidden">
            View All
          </LocalizedButtonLink>
        </>
      }
      className={className}
    >
      {collections.collections.map((collection) => (
        <div
          className="w-[70%] max-w-124 flex-shrink-0 sm:w-[60%] lg:w-full"
          key={collection.id}
        >
          <LocalizedLink href={`/collections/${collection.handle}`}>
            {typeof collection.metadata?.image === 'object' &&
              collection.metadata.image &&
              'url' in collection.metadata.image &&
              typeof collection.metadata.image.url === 'string' && (
                <div className="relative mb-4 aspect-[3/4] w-full md:mb-10">
                  <Image
                    src={collection.metadata.image.url}
                    alt={collection.title}
                    fill
                  />
                </div>
              )}
            <h3 className="mb-2 md:mb-4 md:text-lg">{collection.title}</h3>
            {typeof collection.metadata?.description === 'string' &&
              collection.metadata?.description.length > 0 && (
                <p className="text-grayscale-500 text-xs md:text-md">
                  {collection.metadata.description}
                </p>
              )}
          </LocalizedLink>
        </div>
      ))}
    </Carousel>
  )
}
