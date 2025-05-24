import { Layout, LayoutColumn } from '@/components/Layout'
import repeat from '@lib/util/repeat'
import SkeletonProductPreview from '@modules/skeletons/components/skeleton-product-preview'

const SkeletonProductGrid = () => {
  return (
    <Layout className="mb-16 gap-y-10 md:mb-20 md:gap-y-16">
      {repeat(9).map((index) => (
        <LayoutColumn className="md:!col-span-4 !col-span-6" key={index}>
          <SkeletonProductPreview />
        </LayoutColumn>
      ))}
    </Layout>
  )
}

export default SkeletonProductGrid
