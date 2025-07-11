const SkeletonCartTotals = ({ header = true }) => {
  return (
    <div className="flex flex-col">
      {header && <div className="mb-4 h-4 w-32 bg-gray-100"></div>}
      <div className="flex items-center justify-between">
        <div className="h-3 w-32 bg-gray-100"></div>
        <div className="h-3 w-32 bg-gray-100"></div>
      </div>

      <div className="my-4 flex items-center justify-between">
        <div className="h-3 w-24 bg-gray-100"></div>
        <div className="h-3 w-24 bg-gray-100"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="h-3 w-28 bg-gray-100 "></div>
        <div className="h-3 w-20 bg-gray-100"></div>
      </div>

      <div className="my-4 w-full border-gray-200 border-b border-dashed"></div>

      <div className="flex items-center justify-between">
        <div className="mb-4 h-6 w-32 bg-gray-100"></div>
        <div className="mb-4 h-6 w-24 bg-gray-100"></div>
      </div>
    </div>
  )
}

export default SkeletonCartTotals
