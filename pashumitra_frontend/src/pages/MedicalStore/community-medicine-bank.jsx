"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, User, Package, ChevronDown, Building, Mail, Shield, Search, Plus, X } from "lucide-react"

export default function CommunityMedicineBank() {
  const [activeTab, setActiveTab] = useState("available")
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    medicineName: "",
    composition: "",
    category: "",
    manufacturer: "",
    quantity: "",
    expiryDate: "",
    batchNumber: "",
    description: "",
    isFree: true,
    distributionLimit: 1
  })
  const [medicines, setMedicines] = useState([]);
  const [medicineDatabase, setMedicineDatabase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
    fetchMedicineDatabase();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/community-medicines?status=Available&verified=true");
      setMedicines(res.data.data || []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicineDatabase = async () => {
    try {
      setSearchLoading(true);
      const res = await axios.get("http://localhost:5000/api/medicine-list");
      setMedicineDatabase(res.data || []);
    } catch (err) {
      console.error("Error fetching medicine database:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = medicineDatabase.filter(medicine =>
        medicine.name.toLowerCase().includes(query.toLowerCase()) ||
        medicine.composition.toLowerCase().includes(query.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const selectMedicine = (medicine) => {
    setFormData(prev => ({
      ...prev,
      medicineName: medicine.name,
      composition: medicine.composition,
      category: medicine.category,
      manufacturer: medicine.manufacturer
    }));
    setSearchQuery(medicine.name);
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    setFormData(prev => ({
      ...prev,
      medicineName: "",
      composition: "",
      category: "",
      manufacturer: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add storeId - you might want to get this from authentication context
      const submitData = {
        ...formData,
        storeId: "65a1b2c3d4e5f6a7b8c9d0e1", // This should come from your auth system
        quantity: parseInt(formData.quantity),
        distributionLimit: parseInt(formData.distributionLimit)
      };

      await axios.post("http://localhost:5000/api/community-medicines", submitData);
      alert("Medicine donated successfully!");

      // Clear the form after submission
      setFormData({
        organizationName: "",
        contactPerson: "",
        contactNumber: "",
        email: "",
        medicineName: "",
        composition: "",
        category: "",
        manufacturer: "",
        quantity: "",
        expiryDate: "",
        batchNumber: "",
        description: "",
        isFree: true,
        distributionLimit: 1
      });
      setSearchQuery("");

      // Refresh the available medicines list
      fetchMedicines();

      // Switch tab back to "Available Medicines"
      setActiveTab("available");
    } catch (err) {
      console.error("Error submitting medicine:", err);
      alert("Failed to donate medicine.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Available": { color: "bg-green-100 text-green-800", label: "Available" },
      "Distributed": { color: "bg-gray-100 text-gray-800", label: "Distributed" },
      "Expired": { color: "bg-red-100 text-red-800", label: "Expired" }
    };
    return statusConfig[status] || statusConfig["Available"];
  };

  const getCategoryColor = (category) => {
    const colors = {
      "antibiotic": "bg-blue-50 text-blue-700 border-blue-200",
      "supplement": "bg-green-50 text-green-700 border-green-200",
      "antiparasitic": "bg-purple-50 text-purple-700 border-purple-200",
      "painkiller": "bg-orange-50 text-orange-700 border-orange-200",
      "vaccine": "bg-red-50 text-red-700 border-red-200",
      "default": "bg-gray-50 text-gray-700 border-gray-200"
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg border-b"
      >
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
          >
            <Package className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Community Medicine Bank
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6 text-lg">
            Share unused medicines with fellow farmers and access donated medicines when needed. 
            <span className="block text-sm text-gray-500 mt-2">Together we can reduce waste and help each other.</span>
          </p>

          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-inner border">
              <button
                onClick={() => setActiveTab("available")}
                className={`px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === "available" 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Available Medicines
              </button>
              <button
                onClick={() => setActiveTab("donate")}
                className={`px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === "donate" 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Donate Medicine
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "available" ? (
            <motion.div
              key="available"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {medicines.map((medicine, index) => {
                    const statusBadge = getStatusBadge(medicine.status);
                    const categoryColor = getCategoryColor(medicine.category);
                    
                    return (
                      <motion.div
                        key={medicine._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                      >
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {medicine.medicineName}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">{medicine.manufacturer}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                                {statusBadge.label}
                              </span>
                              {medicine.verifiedByAdmin && (
                                <div className="flex items-center text-green-600 text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Verified
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Category */}
                          {medicine.category && (
                            <div className="mb-4">
                              <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${categoryColor}`}>
                                {medicine.category}
                              </span>
                            </div>
                          )}

                          {/* Medicine Details */}
                          <div className="space-y-3 mb-4">
                            {medicine.composition && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Package className="w-4 h-4 mr-2 text-blue-500" />
                                <span className="font-medium">Composition:</span>
                                <span className="ml-1">{medicine.composition}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="font-medium text-gray-900">Quantity:</span>
                              <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                                {medicine.quantity} units
                              </span>
                            </div>

                            {medicine.expiryDate && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                                <span>Expires: {new Date(medicine.expiryDate).toLocaleDateString()}</span>
                              </div>
                            )}

                            {medicine.batchNumber && (
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">Batch:</span>
                                <span className="ml-2 text-gray-900">{medicine.batchNumber}</span>
                              </div>
                            )}
                          </div>

                          {/* Organization & Contact */}
                          <div className="border-t pt-4 space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="w-4 h-4 mr-2 text-purple-500" />
                              <span>{medicine.organizationName}</span>
                            </div>
                            {medicine.contactPerson && (
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2 text-green-500" />
                                <span>{medicine.contactPerson}</span>
                              </div>
                            )}
                            {medicine.contactNumber && (
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">Contact:</span>
                                <span className="ml-2">{medicine.contactNumber}</span>
                              </div>
                            )}
                            {medicine.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-4 h-4 mr-2 text-red-500" />
                                <span>{medicine.email}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {medicine.description && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">{medicine.description}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-6">
                            <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-200 hover:shadow-blue-300">
                              Request Medicine
                            </button>
                            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium">
                              Contact
                            </button>
                          </div>

                          {/* Distribution Info */}
                          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                            <span>{medicine.isFree ? "Free Medicine" : "Paid Service"}</span>
                            <span>Max {medicine.distributionLimit} per farmer</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {!loading && medicines.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Medicines Available</h3>
                  <p className="text-gray-500">Be the first to donate medicines to help the community.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="donate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Donate Medicine</h2>
                  <p className="text-gray-600">Help your farming community by donating unused medicines</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Organization & Contact Information */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Organization & Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                        <input
                          type="text"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          placeholder="Enter organization name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                        <input
                          type="text"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          placeholder="Contact person name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="contact@organization.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medicine Details */}
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Medicine Details
                    </h3>
                    
                    {/* Medicine Search */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Medicine Database
                        <span className="text-xs text-gray-500 ml-2">(Optional - for quick filling)</span>
                      </label>
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search for medicine name, composition, or manufacturer..."
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={searchLoading}
                          />
                          {searchLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                          )}
                          {!searchLoading && searchQuery && (
                            <button
                              type="button"
                              onClick={clearSearch}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        
                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                          {showSearchResults && searchResults.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            >
                              {searchResults.map((medicine, index) => (
                                <div
                                  key={medicine._id || index}
                                  onClick={() => selectMedicine(medicine)}
                                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{medicine.name}</div>
                                      <div className="text-sm text-gray-600">{medicine.composition}</div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(medicine.category)}`}>
                                        {medicine.category}
                                      </span>
                                      <Plus className="w-4 h-4 text-green-500" />
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 flex justify-between">
                                    <span>{medicine.manufacturer}</span>
                                    {medicine.type && (
                                      <span className="text-gray-400">Type: {medicine.type}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {showSearchResults && searchResults.length === 0 && searchQuery.length > 1 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                            No medicines found in database. Please add manually.
                          </div>
                        )}
                      </div>
                      {medicineDatabase.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Database contains {medicineDatabase.length} medicines. Search by name, composition, or manufacturer.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name *</label>
                        <input
                          type="text"
                          name="medicineName"
                          value={formData.medicineName}
                          onChange={handleInputChange}
                          placeholder="Enter medicine name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <div className="relative">
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            required
                          >
                            <option value="">Select category</option>
                            <option value="Antibiotic">Antibiotic</option>
                            <option value="Supplement">Supplement</option>
                            <option value="Antiparasitic">Antiparasitic</option>
                            <option value="Painkiller">Painkiller</option>
                            <option value="Vaccine">Vaccine</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Composition</label>
                        <input
                          type="text"
                          name="composition"
                          value={formData.composition}
                          onChange={handleInputChange}
                          placeholder="Active ingredients"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                        <input
                          type="text"
                          name="manufacturer"
                          value={formData.manufacturer}
                          onChange={handleInputChange}
                          placeholder="Manufacturer name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          placeholder="Number of units"
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
                        <input
                          type="text"
                          name="batchNumber"
                          value={formData.batchNumber}
                          onChange={handleInputChange}
                          placeholder="Batch/Lot number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Distribution Limit</label>
                        <input
                          type="number"
                          name="distributionLimit"
                          value={formData.distributionLimit}
                          onChange={handleInputChange}
                          placeholder="Max units per farmer"
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Additional information about the medicine, usage instructions, storage conditions..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                      />
                    </div>

                    <div className="mt-4 flex items-center">
                      <input
                        type="checkbox"
                        name="isFree"
                        checked={formData.isFree}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">This medicine is free for the community</label>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold text-lg shadow-lg shadow-green-200 hover:shadow-green-300"
                  >
                    Donate Medicine to Community
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