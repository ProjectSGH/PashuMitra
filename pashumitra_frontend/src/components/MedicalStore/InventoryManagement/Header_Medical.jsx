import { Package } from "lucide-react"

const Header = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="bg-purple-100 p-3 rounded-lg">
          <Package className="h-6 w-6 text-purple-600" />
        </div>
        <h1 className="ml-4 text-2xl font-bold text-gray-900">Inventory Management</h1>
      </div>
      <p className="mt-2 text-gray-600">
        Track and manage your medicine inventory. Monitor stock levels, prices, and expiry dates.
      </p>
    </div>
  )
}

export default Header
