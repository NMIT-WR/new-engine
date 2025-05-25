import { Icon } from '@/components/Icon'

export default function Loading() {
  return (
    <div className="-ml-[calc(50vw-50%)] absolute top-20 left-0 flex h-screen w-[100vw] items-center justify-center md:top-40 lg:top-0 lg:w-full lg:max-w-[calc(100vw-((50vw-50%)+448px))] xl:max-w-[calc(100vw-((50vw-50%)+540px))]">
      <Icon name="loader" className="w-10 animate-spin md:w-20" />
    </div>
  )
}
