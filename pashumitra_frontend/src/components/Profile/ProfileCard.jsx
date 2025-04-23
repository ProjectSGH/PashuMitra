import { Mail, Phone, MapPin, LogOut } from "lucide-react"

const ProfileCard = ({ userData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Profile header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex flex-col items-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
          <User className="text-blue-600" size={48} />
        </div>
        <h2 className="text-white text-xl font-bold">{userData.fullName}</h2>
        <p className="text-white text-sm opacity-90">{userData.role}</p>
      </div>

      {/* Contact information */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="text-gray-400 mr-3" size={18} />
            <span className="text-gray-700">{userData.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="text-gray-400 mr-3" size={18} />
            <span className="text-gray-700">{userData.phone}</span>
          </div>
          <div className="flex">
            <MapPin className="text-gray-400 mr-3 mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="text-gray-700">{userData.address}</p>
              <p className="text-gray-700">
                {userData.village}, {userData.city}
              </p>
              <p className="text-gray-700">
                {userData.state} - {userData.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors">
          <LogOut className="mr-2" size={18} />
          <a href="/">Logout</a>
        </button>
      </div>
    </div>
  )
}

// Add the User icon import at the top
import { User } from "lucide-react"

export default ProfileCard
