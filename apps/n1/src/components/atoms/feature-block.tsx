import { Image } from '@new-engine/ui/atoms/image'
import NextImage from 'next/image'
import type { StaticImageData } from 'next/image'

interface FeatureBlockProps {
  maintText: string
  subText: string
  icon: StaticImageData
}

export function FeatureBlock({ maintText, subText, icon }: FeatureBlockProps) {
  return (
    <div className="flex items-center gap-4">
      <div>
        <Image
          as={NextImage}
          src={icon.src}
          width={icon.width}
          height={icon.height}
          alt="Icon"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-base text-fg-primary">
          {maintText}
        </span>
        <span className="text-2xs text-fg-secondary">{subText}</span>
      </div>
    </div>
  )
}
