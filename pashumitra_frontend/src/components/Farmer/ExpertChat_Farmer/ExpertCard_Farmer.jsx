export default function ExpertCard({ expert, isSelected, onClick }) {
    return (
      <div
        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? "bg-blue-50" : ""}`}
        onClick={onClick}
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={expert.profilePicture || "/placeholder.svg"}
              alt={expert.name}
              className="h-12 w-12 rounded-full object-cover border border-gray-200"
            />
            <span
              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                expert.isOnline ? "bg-green-400" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{expert.name}</p>
            <p className="text-sm text-gray-500 truncate">{expert.specialization}</p>
            <div className="flex items-center mt-1">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                expert.isOnline
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
              }`}>
                {expert.isOnline ? "Online" : "Offline"}
              </span>
              {expert.rating && (
                <div className="ml-2 flex items-center">
                  <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 15.934l-6.18 3.254 1.18-6.875L.5 7.914l6.902-1.004L10 .686l2.598 6.224 6.902 1.004-4.5 4.399 1.18 6.875L10 15.934z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 text-xs text-gray-600">{expert.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }