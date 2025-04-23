import { Pill } from "lucide-react"

const EmptyState = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-10">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Pill className="text-blue-600" size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Medicine Request Interface Coming Soon</h2>
        <p className="text-gray-600 max-w-md">
          This page will provide an interface for requesting medicines from suppliers and other stores.
        </p>
      </div>
    </div>
  )
}

export default EmptyState
