import { User } from "lucide-react";

const ProfileHeader = ({ userData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <User className="text-blue-600 mr-3" size={24} />
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            User Profile
            {!userData?.farmerProfile?.isVerified && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                ✅ Verified
              </span>
            )}
          </h1>
          <p className="text-gray-600 text-sm">
            View and update your profile information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
