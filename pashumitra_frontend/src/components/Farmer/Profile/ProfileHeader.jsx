import { User } from "lucide-react"

const ProfileHeader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <User className="text-blue-600 mr-3" size={24} />
        <div>
          <h1 className="text-xl font-bold">User Profile</h1>
          <p className="text-gray-600 text-sm">View and update your profile information.</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
