import Image, { type StaticImageData } from 'next/image'

interface TopProductProps {
  src: StaticImageData
  label: string
}
export function TopProduct({ src, label }: TopProductProps) {
  return (
    <div className="grid cursor-pointer place-items-center duration-500 hover:scale-110 hover:shadow-xl">
      <Image src={src} alt={label} />
      <p className="font-bold">{label}</p>
    </div>
  )
}
