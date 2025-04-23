import ProfileHeader from "../components/Profile/ProfileHeader"
import ProfileCard from "../components/Profile/ProfileCard"
import ProfileInformation from "../components/Profile/ProfileInformation"

const UserProfile = () => {
  // User data (in a real app, this would come from an API or context)
  const userData = {
    fullName: "John Doe",
    role: "Store",
    email: "store@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street",
    village: "Greenfield Village",
    city: "Farmtown",
    state: "Agricultural State",
    pinCode: "123456",
  }

  return (
    <div className="h-auto mt-5 bg-gray-50 flex flex-col mb-5">
      <main className="flex-grow container mx-auto px-4 py-6">
        <ProfileHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <ProfileCard userData={userData} />
          </div>
          <div className="md:col-span-2">
            <ProfileInformation userData={userData} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserProfile
