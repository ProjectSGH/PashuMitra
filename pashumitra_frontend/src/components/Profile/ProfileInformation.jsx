import { Edit } from "lucide-react"

const ProfileInformation = ({ userData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Profile Information</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition-colors">
          <Edit className="mr-2" size={16} />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="Full Name" value={userData.fullName} />
        <InfoField label="Email" value={userData.email} />
        <InfoField label="Phone Number" value={userData.phone} />
        <InfoField label="Address" value={userData.address} />
        <InfoField label="Village" value={userData.village} />
        <InfoField label="City/District" value={userData.city} />
        <InfoField label="State" value={userData.state} />
        <InfoField label="Pin-Code" value={userData.pinCode} />
      </div>
    </div>
  )
}

const InfoField = ({ label, value }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-gray-700">{value}</div>
    </div>
  )
}

export default ProfileInformation
