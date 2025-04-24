"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, StoreIcon, Clock } from "lucide-react"

// Mock data for stores
const nearbyStores = [
  { id: 1, name: "HealthMart Pharmacy", address: "123 Main St", distance: 0.5, hasStock: false },
  { id: 2, name: "MediCare Drugstore", address: "456 Oak Ave", distance: 0.8, hasStock: false },
  { id: 3, name: "Village Pharmacy", address: "789 Elm St", distance: 1.2, hasStock: false },
]

const alternateStores = [
  {
    id: 4,
    name: "Central Pharmacy",
    address: "101 Center St",
    distance: 3.5,
    hasStock: true,
    estimatedDeliveryTime: 25,
  },
  {
    id: 5,
    name: "Town Drugstore",
    address: "202 Market St",
    distance: 4.2,
    hasStock: true,
    estimatedDeliveryTime: 35,
  },
  {
    id: 6,
    name: "Rural MediCenter",
    address: "303 Farm Rd",
    distance: 5.8,
    hasStock: true,
    estimatedDeliveryTime: 45,
  },
]

export default function MedicineForm({
  medicineName,
  setMedicineName,
  selectedNearbyStore,
  setSelectedNearbyStore,
  selectedAlternateStore,
  setSelectedAlternateStore,
  onRequestTransport,
  transportRequested,
}) {
  const [filteredAlternateStores, setFilteredAlternateStores] = useState(alternateStores)

  useEffect(() => {
    // In a real app, this would filter based on medicine availability
    setFilteredAlternateStores(alternateStores)
  }, [medicineName])

  const handleNearbyStoreChange = (event) => {
    const storeId = event.target.value
    const store = nearbyStores.find((s) => s.id.toString() === storeId) || null
    setSelectedNearbyStore(store)
  }

  const handleAlternateStoreChange = (event) => {
    const storeId = event.target.value
    const store = alternateStores.find((s) => s.id.toString() === storeId) || null
    setSelectedAlternateStore(store)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Request Medicine Transport</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="medicine-name" className="block text-sm font-medium text-gray-700 mb-1">
            Medicine Name
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              id="medicine-name"
              type="text"
              placeholder="Enter medicine name"
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              disabled={transportRequested}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="nearby-store" className="block text-sm font-medium text-gray-700 mb-1">
            Select Nearby Store (Out of Stock)
          </label>
          <select
            id="nearby-store"
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            disabled={transportRequested}
            onChange={handleNearbyStoreChange}
            value={selectedNearbyStore?.id || ""}
          >
            <option value="" disabled>Select nearby store</option>
            {nearbyStores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name} ({store.distance} miles)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="alternate-store" className="block text-sm font-medium text-gray-700 mb-1">
            Select Alternate Store (In Stock)
          </label>
          <select
            id="alternate-store"
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            disabled={!selectedNearbyStore || transportRequested}
            onChange={handleAlternateStoreChange}
            value={selectedAlternateStore?.id || ""}
          >
            <option value="" disabled>Select alternate store with stock</option>
            {filteredAlternateStores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name} ({store.distance} miles) ~{store.estimatedDeliveryTime} min
              </option>
            ))}
          </select>
        </div>

        <button
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            (!medicineName || !selectedNearbyStore || !selectedAlternateStore || transportRequested)
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
          disabled={!medicineName || !selectedNearbyStore || !selectedAlternateStore || transportRequested}
          onClick={onRequestTransport}
        >
          Request Transport
        </button>
      </div>
    </div>
  )
}
