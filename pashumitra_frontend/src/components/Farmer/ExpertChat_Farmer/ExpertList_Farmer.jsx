import { Search } from "lucide-react"
import ExpertCard from "./ExpertCard_Farmer"

export default function ExpertList({ experts, selectedExpert, onSelectExpert, searchQuery, onSearchChange }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search experts..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {experts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No experts found. Try a different search.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {experts.map((expert) => (
              <li key={expert.id}>
                <ExpertCard
                  expert={expert}
                  isSelected={selectedExpert?.id === expert.id}
                  onClick={() => onSelectExpert(expert)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}