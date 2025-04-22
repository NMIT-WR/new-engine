import Image from "next/image"
import { getCollectionsList } from "@lib/data/collections"
import { Carousel } from "@/components/Carousel"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"

export const CollectionsSection: React.FC<{ className?: string }> = async ({
  className,
}) => {
  const collections = await getCollectionsList(0, 20, [
    "id",
    "title",
    "handle",
    "metadata",
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
          className="w-[70%] sm:w-[60%] lg:w-full max-w-124 flex-shrink-0"
          key={collection.id}
        >
          <LocalizedLink href={`/collections/${collection.handle}`}>
            {typeof collection.metadata?.image === "object" &&
              collection.metadata.image &&
              "url" in collection.metadata.image &&
              typeof collection.metadata.image.url === "string" && (
                <div className="relative mb-4 md:mb-10 w-full aspect-[3/4]">
                  <Image
                    src={collection.metadata.image.url}
                    alt={collection.title}
                    fill
                  />
                </div>
              )}
            <h3 className="md:text-lg mb-2 md:mb-4">{collection.title}</h3>
            {typeof collection.metadata?.description === "string" &&
              collection.metadata?.description.length > 0 && (
                <p className="text-xs text-grayscale-500 md:text-md">
                  {collection.metadata.description}
                </p>
              )}
          </LocalizedLink>
        </div>
      ))}
    </Carousel>
  )
}
