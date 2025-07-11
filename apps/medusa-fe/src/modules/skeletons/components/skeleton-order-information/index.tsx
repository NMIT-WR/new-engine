import SkeletonCartTotals from '@modules/skeletons/components/skeleton-cart-totals'

const SkeletonOrderInformation = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 border-gray-200 border-b py-10 lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-4 h-4 w-32 bg-gray-100"></div>
          <div className="h-3 w-2/6 bg-gray-100"></div>
          <div className="my-2 h-3 w-3/6 bg-gray-100"></div>
          <div className="h-3 w-1/6 bg-gray-100"></div>
        </div>
        <div className="flex flex-col">
          <div className="mb-4 h-4 w-32 bg-gray-100"></div>
          <div className="h-3 w-2/6 bg-gray-100"></div>
          <div className="my-2 h-3 w-3/6 bg-gray-100"></div>
          <div className="h-3 w-2/6 bg-gray-100"></div>
          <div className="mt-2 h-3 w-1/6 bg-gray-100"></div>
          <div className="my-4 h-4 w-32 bg-gray-100"></div>
          <div className="h-3 w-1/6 bg-gray-100"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 py-10 lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-4 h-4 w-32 bg-gray-100"></div>
          <div className="h-3 w-2/6 bg-gray-100"></div>
          <div className="my-4 h-3 w-3/6 bg-gray-100"></div>
        </div>

        <SkeletonCartTotals />
      </div>
    </div>
  )
}

export default SkeletonOrderInformation
