import { Edit } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./EditProfile";
import axios from "axios";
import toast from "react-hot-toast"; // for better user feedback

const ProfileInformation = ({ userData, onUserUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleVerificationUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("document", file);

    try {
      setIsUploading(true);
      const res = await axios.post(
        `http://localhost:5000/api/farmer/varify/upload/${userData.farmerProfile?._id}`,
        formData
      );
      toast.success("Verification document submitted!");
      // Optionally, refetch user data:
      onUserUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Profile Information</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Edit className="mr-2" size={16} />
            Edit Profile
          </button>
        </div>

        {showModal && (
          <EditProfileModal
            userData={userData}
            onClose={() => setShowModal(false)}
            onUpdate={onUserUpdate}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Email" value={userData.email} />
          <InfoField label="Phone Number" value={userData.phone} />
          <InfoField
            label="Full Name"
            value={userData.fullName || userData.farmerProfile?.fullName}
          />
          <InfoField label="Address" value={userData.farmerProfile?.address} />
          <InfoField label="Village" value={userData.farmerProfile?.village} />
          <InfoField
            label="City/District"
            value={userData.farmerProfile?.city}
          />
          <InfoField label="State" value={userData.farmerProfile?.state} />
          <InfoField label="Pin-Code" value={userData.farmerProfile?.pincode} />
        </div>
      </div>
      {/* Verification Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          Farmer Verification
          {userData.isVerified && (
            <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
              ✅ Verified
            </span>
          )}
        </h3>
        {userData.farmerProfile?.verificationStatus === "not_submitted" ||
        userData.farmerProfile?.verificationStatus === "rejected" ? (
          <form className="space-y-4" onSubmit={handleVerificationUpload}>
            <input
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              type="submit"
              disabled={isUploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Submit for Verification"}
            </button>
          </form>
        ) : (
          <div className="text-sm text-gray-700">
            {userData.farmerProfile?.verificationStatus === "pending" && (
              <p className="text-yellow-600">
                ✅ Document uploaded. Awaiting review.
              </p>
            )}
            {userData.farmerProfile?.verificationStatus === "approved" && (
              <p className="text-green-600">✅ You are verified.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const InfoField = ({ label, value }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-gray-700">
        {value}
      </div>
    </div>
  );
};

export default ProfileInformation;
