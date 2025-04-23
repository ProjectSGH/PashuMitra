import { Truck } from "lucide-react"

const PageHeader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <Truck className="text-blue-600 mr-3" size={24} />
        <div>
          <h1 className="text-xl font-bold">Transport Requests</h1>
          <p className="text-gray-600 text-sm">
            View and process medicine transport requests from farmers in your area.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PageHeader
