import type { HttpTypes } from '@medusajs/types'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import PlaceholderImage from '@modules/common/icons/placeholder-image'

type ThumbnailProps = {
  thumbnail?: HttpTypes.StoreProduct['thumbnail']
  images?: HttpTypes.StoreProduct['images']
  size?: 'small' | 'medium' | 'large' | 'full' | 'square' | '3/4'
  isFeatured?: boolean
  className?: string
  'data-testid'?: string
}

const Thumbnail = ({
  thumbnail,
  images,
  size = 'small',
  isFeatured,
  className,
  'data-testid': dataTestid,
}: ThumbnailProps) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={twMerge(
        'relative w-full overflow-hidden',
        className,
        isFeatured && 'aspect-[11/14]',
        !isFeatured && size !== 'square' && size !== '3/4' && 'aspect-[9/16]',
        size === 'square' && 'aspect-[1/1]',
        size === '3/4' && 'aspect-[3/4]',
        size === 'small' && 'w-[180px]',
        size === 'medium' && 'w-[290px]',
        size === 'large' && 'w-[440px]',
        size === 'full' && 'w-full'
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, 'size'> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <PlaceholderImage size={size === 'small' ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
