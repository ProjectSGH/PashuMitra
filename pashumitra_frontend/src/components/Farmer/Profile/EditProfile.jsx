import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfileModal = ({ userData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: userData.fullName || userData.farmerProfile?.fullName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.farmerProfile?.address || "",
    village: userData.farmerProfile?.village || "",
    city: userData.farmerProfile?.city || "",
    state: userData.farmerProfile?.state || "",
    pincode: userData.farmerProfile?.pincode || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userData._id}`,
        formData
      );
      onUpdate(res.data.user); // update parent with new data
      onClose(); // close modal
      toast.success("Profile updated successfully!", {
        duration: 4000,
        position: "bottom-right",
        style: {
          backgroundColor: "#4CAF50",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
        },
      });
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[500px]">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            "fullName",
            "email",
            "phone",
            "address",
            "village",
            "city",
            "state",
            "pincode",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                required
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
