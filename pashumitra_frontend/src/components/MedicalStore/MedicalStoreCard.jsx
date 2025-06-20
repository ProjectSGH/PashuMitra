import { useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

export default function MedicalStoreCard({ storeData, refreshStoreData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...storeData });

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/medicalstore/${storeData._id}`, {
        ...form,
        varificationStatus: "Pending",
      });
      alert("Store details updated. Verification status set to Pending.");
      setIsEditing(false);
      refreshStoreData(); // Refetch updated data
    } catch (error) {
      alert("Failed to update store data");
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 mt-4 shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Store Information</h2>
        <span className="text-green-600 flex items-center">
          <CheckCircle className="mr-1" size={18} />
          Approved
        </span>
      </div>

      <div className="space-y-2">
        <input
          disabled={!isEditing}
          value={form.storeName}
          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          disabled={!isEditing}
          value={form.storeAddress}
          onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          disabled={!isEditing}
          value={form.storePhone}
          onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          disabled={!isEditing}
          value={form.storeEmail}
          onChange={(e) => setForm({ ...form, storeEmail: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
        ) : (
          <>
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setForm({ ...storeData }); // Reset form
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
