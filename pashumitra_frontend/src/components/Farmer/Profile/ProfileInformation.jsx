import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import EditProfileModal from "./EditProfile";
import axios from "axios";
import toast from "react-hot-toast"; // for better user feedback
import resources from "../../../resource";

const ProfileInformation = ({ userData, onUserUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("not_submitted");
  const [isVerified, setIsVerified] = useState(false);

  // ✅ Fetch verification status based on User._id (and role comes from userData.role)
  const fetchVerificationStatus = async () => {
    if (!userData?._id || !userData?.role) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/verification/status/${userData._id}?role=${userData.role}`
      );
      setVerificationStatus(res.data.verificationStatus);
      setIsVerified(res.data.isVerified);
    } catch (err) {
      console.error("Failed to fetch verification status", err);
    }
  };

  useEffect(() => {
    fetchVerificationStatus(); // runs once on mount
  }, [userData?._id, userData?.role]);

  // ✅ Upload verification document
  const handleVerificationUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("document", file);
    formData.append("role", userData.role);

    try {
      setIsUploading(true);
      await axios.post(
        `http://localhost:5000/api/verification/upload/${userData._id}`,
        formData
      );
      toast.success("Verification document submitted!");

      setFile(null); // clear file input

      await fetchVerificationStatus(); // ✅ fetch updated status immediately
      await onUserUpdate(); // refresh parent if needed
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
      <div className="bg-white p-6 rounded-lg shadow-md mt-8 w-full max-w-lg mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex flex-wrap items-center gap-2">
          {userData.role} Verification
          {isVerified && (
            <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
              ✅ Verified
            </span>
          )}
        </h3>

        {verificationStatus === "not_submitted" ||
        verificationStatus === "rejected" ? (
          <form className="space-y-4" onSubmit={handleVerificationUpload}>
            <label className="block w-full">
              <span className="text-gray-700 text-sm mb-1 block">Upload Document</span>
              <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:border-blue-500 transition">
                <span className="text-gray-600 text-sm truncate">
                  {file?.name || "Choose an image or PDF..."}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {isUploading ? (
                <>
                  <img
                    src={resources.CustomLoader.src}
                    alt="Loading"
                    className="w-5 h-5 animate-spin"
                  />
                  Uploading...
                </>
              ) : (
                "Submit for Verification"
              )}
            </button>
          </form>
        ) : (
          <div className="text-sm text-gray-700 space-y-2">
            {verificationStatus === "pending" && (
              <p className="text-yellow-600 font-medium">
                📄 Your verification document has been submitted. It is currently under review by our team. You’ll be notified once verified.
              </p>
            )}
            {verificationStatus === "approved" && (
              <p className="text-green-600 text-base font-semibold flex items-center gap-1">
                ✅ You are verified.
              </p>
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
