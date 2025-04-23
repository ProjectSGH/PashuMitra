import { Pill } from "lucide-react"

const PageHeader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <Pill className="text-blue-600" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold">Request Medicines</h1>
          <p className="text-gray-600 text-sm">
            Request medicines from other stores or suppliers to replenish your inventory.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PageHeader
