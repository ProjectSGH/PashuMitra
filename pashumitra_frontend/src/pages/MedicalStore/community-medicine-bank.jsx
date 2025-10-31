"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, User, Package, ChevronDown } from "lucide-react"

export default function CommunityMedicineBank() {
  const [activeTab, setActiveTab] = useState("available")
  const [formData, setFormData] = useState({
    medicineName: "",
    medicineType: "",
    quantity: "",
    expiryDate: "",
    condition: "",
    contactNumber: "",
    location: "",
    additionalNotes: "",
  })
  const [medicines, setMedicines] = useState([]);
  useEffect(() => {
  fetchMedicines();
}, []);
const fetchMedicines = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/community-medicines");
    setMedicines(res.data); // store the data in state
  } catch (err) {
    console.error("Error fetching medicines:", err);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:5000/api/community-medicines", formData);
    alert("Medicine donated successfully!");

    // Clear the form after submission
    setFormData({
      medicineName: "",
      medicineType: "",
      quantity: "",
      expiryDate: "",
      condition: "",
      contactNumber: "",
      location: "",
      additionalNotes: "",
    });

    // Refresh the available medicines list
    fetchMedicines();

    // Switch tab back to "Available Medicines"
    setActiveTab("available");
  } catch (err) {
    console.error("Error submitting medicine:", err);
    alert("Failed to donate medicine.");
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Community Medicine Bank</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Share unused medicines with fellow farmers and access donated medicines when needed. Together we can reduce
            waste and help each other.
          </p>

          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("available")}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeTab === "available" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Available Medicines
              </button>
              <button
                onClick={() => setActiveTab("donate")}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  activeTab === "donate" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Donate Medicine
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "available" ? (
            <motion.div
              key="available"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {medicines.map((medicine, index) => (
  <motion.div
    key={medicine._id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{medicine.medicineName}</h3>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          medicine.condition === "New/Unopened"
            ? "bg-green-100 text-green-800"
            : medicine.condition === "Good"
            ? "bg-blue-100 text-blue-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {medicine.condition}
      </span>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <Package className="w-4 h-4 mr-2" />
        <span>Type: {medicine.medicineType}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <span className="font-medium">Quantity: {medicine.quantity}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Expires: {new Date(medicine.expiryDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <User className="w-4 h-4 mr-2" />
        <span>Contact: {medicine.contactNumber}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="w-4 h-4 mr-2" />
        <span>Location: {medicine.location}</span>
      </div>
      {/* {medicine.additionalNotes && (
        <div className="flex items-center text-sm text-gray-600">
          <span>Notes: {medicine.additionalNotes}</span>
        </div>
      )} */}
    </div>

    <div className="flex gap-2">
      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
        Request Medicine
      </button>
      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 text-sm font-medium">
        Contact Donor
      </button>
    </div>
  </motion.div>
))}

            </motion.div>
          ) : (
            <motion.div
              key="donate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Donate Medicine</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name *</label>
                      <input
                        type="text"
                        name="medicineName"
                        value={formData.medicineName}
                        onChange={handleInputChange}
                        placeholder="Enter medicine name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Type *</label>
                      <div className="relative">
                        <select
                          name="medicineType"
                          value={formData.medicineType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          required
                        >
                          <option value="">Select type</option>
                          <option value="antibiotic">Antibiotic</option>
                          <option value="supplement">Supplement</option>
                          <option value="antiparasitic">Antiparasitic</option>
                          <option value="painkiller">Painkiller</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Available *</label>
                      <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="e.g., 5 bottles, 20 tablets"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                      <div className="relative">
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          required
                        >
                          <option value="">Select condition</option>
                          <option value="new">New/Unopened</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Village/Area name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="Any additional information about the medicine..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                  >
                    Donate Medicine
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
