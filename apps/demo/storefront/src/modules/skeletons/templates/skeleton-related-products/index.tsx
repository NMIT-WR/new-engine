import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { Layout, LayoutColumn } from "@/components/Layout"

const SkeletonRelatedProducts = () => {
  return (
    <>
      <Layout>
        <LayoutColumn className="mt-26 md:mt-36">
          <h4 className="text-md md:text-2xl mb-8 md:mb-16">
            Related products
          </h4>
        </LayoutColumn>
      </Layout>
      <Layout className="gap-y-10 md:gap-y-16">
        {repeat(3).map((index) => (
          <LayoutColumn className="!col-span-6 md:!col-span-4" key={index}>
            <SkeletonProductPreview />
          </LayoutColumn>
        ))}
      </Layout>
    </>
  )
}

export default SkeletonRelatedProducts
