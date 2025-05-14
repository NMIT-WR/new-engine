import { Layout, LayoutColumn } from "@/components/Layout"
import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = () => {
  return (
    <Layout className="gap-y-10 md:gap-y-16 mb-16 md:mb-20">
      {repeat(9).map((index) => (
        <LayoutColumn className="md:!col-span-4 !col-span-6" key={index}>
          <SkeletonProductPreview />
        </LayoutColumn>
      ))}
    </Layout>
  )
}

export default SkeletonProductGrid
