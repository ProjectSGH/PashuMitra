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
<div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-8 w-full max-w-lg mx-auto">
  <h3 className="text-xl font-bold text-gray-900 mb-6 flex flex-wrap items-center gap-3">
    {userData.role} Verification
    {isVerified && (
      <span className="text-green-700 text-xs font-semibold bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-green-200">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Verified
      </span>
    )}
  </h3>

  {verificationStatus === "not_submitted" || verificationStatus === "rejected" ? (
    <form className="space-y-5" onSubmit={handleVerificationUpload}>
      <label className="block w-full cursor-pointer">
        <span className="text-gray-800 text-sm font-medium mb-2 block">Upload Document</span>
        <div className="flex items-center justify-between border-2 border-dashed border-gray-200 rounded-lg px-4 py-3 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 bg-gray-50">
          <span className={`text-sm truncate max-w-[70%] ${file?.name ? "text-gray-900 font-medium" : "text-gray-500"}`}>
            {file?.name || "Choose an image or PDF..."}
          </span>
          <div className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Browse
          </div>
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
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 font-semibold shadow-sm hover:shadow-md"
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
    <div className="text-sm space-y-3">
      {verificationStatus === "pending" && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="w-5 h-5 text-amber-600 mt-0.5">📄</div>
          <div>
            <p className="text-amber-800 font-medium">Verification Under Review</p>
            <p className="text-amber-700 mt-1">Your document has been submitted and is currently being reviewed by our team.</p>
          </div>
        </div>
      )}
      {verificationStatus === "approved" && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <div>
            <p className="text-green-800 font-semibold">Verification Successful</p>
            <p className="text-green-700 text-sm mt-0.5">Your account has been verified.</p>
          </div>
        </div>
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
