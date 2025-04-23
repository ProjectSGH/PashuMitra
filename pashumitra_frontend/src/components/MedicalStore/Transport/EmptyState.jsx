import { Truck } from "lucide-react"

const EmptyState = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-10">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Truck className="text-blue-600" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Transport Request Management Coming Soon</h2>
        <p className="text-gray-600 max-w-md">
          This page will display transport requests from farmers and allow you to process them.
        </p>
      </div>
    </div>
  )
}

export default EmptyState
