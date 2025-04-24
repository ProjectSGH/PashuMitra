"use client"
import { Edit, Trash2, AlertCircle } from "lucide-react"

const InventoryTable = ({ inventory, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medicine
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expiry Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manufacturer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventory.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                No items found
              </td>
            </tr>
          ) : (
            inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.medicine}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.outOfStock ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.lowStock ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.stock} units
                    </span>
                  )}
                  {item.lowStock && <AlertCircle className="inline-block ml-1 h-4 w-4 text-yellow-500" />}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className={item.expiringSoon ? "text-red-600 font-medium" : ""}>{item.expiryDate}</span>
                    {item.expiringSoon && (
                      <span className="ml-2 px-2 py-1 text-xs leading-4 font-medium rounded-full bg-red-100 text-red-800">
                        Expiring Soon
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.manufacturer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {(item.outOfStock || item.lowStock) && (
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Order
                      </button>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-blue-600 hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-red-600 hover:bg-gray-50"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default InventoryTable
