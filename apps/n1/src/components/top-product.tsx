import Image, { type StaticImageData } from 'next/image'

interface TopProductProps {
  src: StaticImageData
  label: string
}
export function TopProduct({ src, label }: TopProductProps) {
  return (
    <div className="grid h-full w-full cursor-pointer place-items-center items-start duration-500 hover:scale-110 hover:shadow-xl">
      <Image
        src={src}
        alt={label}
        width={200}
        className="flex w-[clamp(150px,100%,250px)]"
      />
      <p className="text-center font-bold">{label}</p>
    </div>
  )
}
