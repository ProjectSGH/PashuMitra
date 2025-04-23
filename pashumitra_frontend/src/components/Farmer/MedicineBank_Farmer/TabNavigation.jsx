"use client"

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-4 border-b border-gray-200 w-full">
        <button
          className={`py-2 px-1 font-medium ${
            activeTab === "available" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("available")}
        >
          Available Medicines
        </button>
        <button
          className={`py-2 px-1 font-medium ${
            activeTab === "requests" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          My Requests
        </button>
      </div>

      {activeTab === "available" && (
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Filter:</span>
          <select className="border border-gray-300 rounded-md text-sm p-1 focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="all">All</option>
            <option value="antibiotic">Antibiotic</option>
            <option value="antiparasitic">Antiparasitic</option>
            <option value="anti-inflammatory">Anti-inflammatory</option>
            <option value="supplement">Supplement</option>
          </select>
        </div>
      )}
    </div>
  )
}

export default TabNavigation
