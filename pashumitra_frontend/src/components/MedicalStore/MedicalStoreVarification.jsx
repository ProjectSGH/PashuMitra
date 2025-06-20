import { useState } from "react";
import axios from "axios";

const StoreVerificationForm = ({ userId, onClose }) => {
  const [form, setForm] = useState({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    storeEmail: ""
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...form,
      userId,
    };

    console.log("📤 Sending store data:", payload); // ✅ Confirm this is not empty

    await axios.post("http://localhost:5000/api/medicalstore", payload);

    alert("Store details submitted for verification!");
    onClose();
  } catch (err) {
    console.error("❌ Axios Error:", err.response?.data || err.message);
    alert("Failed to submit store details");
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800">Store Verification</h2>
        <input
          type="text"
          placeholder="Store Name"
          value={form.storeName}
          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Store Address"
          value={form.storeAddress}
          onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="tel"
          placeholder="Store Phone"
          value={form.storePhone}
          onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Store Email"
          value={form.storeEmail}
          onChange={(e) => setForm({ ...form, storeEmail: e.target.value })}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreVerificationForm;
