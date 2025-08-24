import { User } from "lucide-react";
import resources from "../../../resource";

const ProfileHeader = ({ userData, verificationData }) => {
  const isVerified = verificationData?.verificationStatus === "approved";

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        {/* Profile Title Section */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
            <User className="text-white" size={30} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">
              User Profile
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and update your profile information.
            </p>
          </div>
        </div>

        {/* ✅ Verification Badge */}
        {isVerified && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm sm:text-base font-medium self-start sm:self-auto">
            <img
              src={resources.customVerificationMark.src}
              alt="Verified"
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            Verified
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
