import { User } from "lucide-react";
import resources from "../../../resource";

const ProfileHeader = ({ userData, verificationData }) => {
  const isVerified = verificationData?.verificationStatus === "approved";

  console.log("👤 userData:", userData);
  console.log("✅ verificationData:", verificationData);
  console.log("✅ isVerified:", isVerified);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        {/* Profile Title Section */}
        <div className="flex items-center">
          <div className="bg-blue-600 p-2 rounded-full mr-4">
            <User className="text-white" size={30} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">User Profile</h1>
            <p className="text-gray-600 text-sm">
              View and update your profile information.
            </p>
          </div>
        </div>

        {/* ✅ Verification Badge */}
        {isVerified && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm font-medium">
            <img
              src={resources.customVerificationMark.src}
              alt="Verified"
              className="w-8 h-8"
            />
            Verified
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
