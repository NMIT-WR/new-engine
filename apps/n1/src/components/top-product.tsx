import Image, { type StaticImageData } from 'next/image'

interface TopProductProps {
  src: StaticImageData
  label: string
}
export function TopProduct({ src, label }: TopProductProps) {
  return (
    <div className="grid h-full cursor-pointer place-items-center items-start px-0 duration-500 hover:scale-105 hover:shadow-xl">
      <Image
        src={src}
        alt={label}
        width={200}
        className="flex w-[clamp(150px,100%,260px)]"
      />
      <p className="text-center font-bold text-sm">{label}</p>
    </div>
  )
}
