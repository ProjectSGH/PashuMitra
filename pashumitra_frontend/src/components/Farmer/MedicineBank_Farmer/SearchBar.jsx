import { Search } from "lucide-react"

const SearchBar = () => {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="text-gray-400" size={18} />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="Search medicines..."
      />
    </div>
  )
}

export default SearchBar
