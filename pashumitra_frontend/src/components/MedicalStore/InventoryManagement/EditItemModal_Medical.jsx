"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const EditItemModal = ({ item, onClose, onEditItem }) => {
  const [formData, setFormData] = useState({
    id: item.id,
    medicine: item.medicine,
    category: item.category,
    stock: item.stock.toString(),
    price: item.price.toString(),
    expiryDate: "",
    manufacturer: item.manufacturer,
  })

  // Convert date format for the input field
  useEffect(() => {
    // Try to parse the expiry date to a Date object
    const dateParts = item.expiryDate.split(" ")
    if (dateParts.length === 3) {
      const months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      }
      const month = months[dateParts[0]]
      const day = dateParts[1].replace(",", "").padStart(2, "0")
      const year = dateParts[2]

      if (month && day && year) {
        setFormData((prev) => ({
          ...prev,
          expiryDate: `${year}-${month}-${day}`,
        }))
      }
    }
  }, [item.expiryDate])

  const categories = ["Antibiotic", "Antiparasitic", "Supplement", "Antiseptic"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.medicine || !formData.category || !formData.expiryDate || !formData.manufacturer) {
      alert("Please fill in all required fields")
      return
    }

    // Format the date for display
    const date = new Date(formData.expiryDate)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

    // Format the data
    const updatedItem = {
      ...formData,
      id: item.id,
      stock: Number.parseInt(formData.stock, 10) || 0,
      price: Number.parseInt(formData.price, 10) || 0,
      expiryDate: formattedDate,
      outOfStock: Number.parseInt(formData.stock, 10) === 0,
      lowStock: Number.parseInt(formData.stock, 10) > 0 && Number.parseInt(formData.stock, 10) < 10,
      // Check if expiry date is within 3 months
      expiringSoon: new Date(formData.expiryDate) - new Date() < 90 * 24 * 60 * 60 * 1000,
    }

    onEditItem(updatedItem)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 md:mx-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Edit Item</h3>
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="medicine" className="block text-sm font-medium text-gray-700">
                Medicine <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="medicine"
                id="medicine"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                value={formData.medicine}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                id="category"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                id="price"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                id="expiryDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
                Manufacturer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="manufacturer"
                id="manufacturer"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                value={formData.manufacturer}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditItemModal
