"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  User, 
  Package, 
  Building, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  Eye,
  Trash2,
  AlertTriangle,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMedicineVerification() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // "pending", "verified", "all"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, [filter]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/admin/communitymedicines";
      
      if (filter === "pending") {
        url += "?verified=false";
      } else if (filter === "verified") {
        url += "?verified=true";
      }

      const res = await axios.get(url);
      setMedicines(res.data.data || []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      toast.error("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (medicineId) => {
    try {
      setActionLoading(medicineId);
      await axios.patch(`http://localhost:5000/api/admin/communitymedicines/${medicineId}/verify`);
      
      // Update local state
      setMedicines(prev => prev.filter(med => med._id !== medicineId));
      toast.success("Medicine verified successfully!");
    } catch (err) {
      console.error("Error verifying medicine:", err);
      toast.error("Failed to verify medicine");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (medicineId) => {
    if (!confirm("Are you sure you want to delete this medicine? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(medicineId);
      await axios.delete(`http://localhost:5000/api/admin/communitymedicines/${medicineId}`);
      
      // Update local state
      setMedicines(prev => prev.filter(med => med._id !== medicineId));
      toast.success("Medicine deleted successfully!");
    } catch (err) {
      console.error("Error deleting medicine:", err);
      toast.error("Failed to delete medicine");
    } finally {
      setActionLoading(null);
    }
  };

  const openModal = (medicine) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedMedicine(null);
    setShowModal(false);
  };

  const getStatusBadge = (medicine) => {
    if (medicine.verifiedByAdmin) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
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

  const filteredMedicines = medicines.filter(medicine =>
    medicine.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats and Filters */}
      <div className=" mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm  p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Verification</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {medicines.filter(m => !m.verifiedByAdmin).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm  p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Verified</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {medicines.filter(m => m.verifiedByAdmin).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Medicines</p>
                <p className="text-2xl font-semibold text-gray-900">{medicines.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unique Organizations</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(medicines.map(m => m.organizationName)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === "pending"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("verified")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === "verified"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === "all"
                      ? "bg-white text-gray-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="bg-white rounded-lg shadow-sm  overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No medicines found</h3>
              <p className="text-gray-500">
                {filter === "pending" 
                  ? "No pending medicines for verification" 
                  : "No medicines match your search criteria"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity & Expiry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedicines.map((medicine) => (
                    <motion.tr
                      key={medicine._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {medicine.medicineName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {medicine.manufacturer}
                            </div>
                            {medicine.category && (
                              <span className={`inline-block px-2 py-1 text-xs rounded-md mt-1 ${getCategoryColor(medicine.category)}`}>
                                {medicine.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{medicine.organizationName}</div>
                        <div className="text-sm text-gray-500">{medicine.contactPerson}</div>
                        <div className="text-sm text-gray-500">{medicine.contactNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <strong>{medicine.quantity}</strong> units
                        </div>
                        {medicine.expiryDate && (
                          <div className="text-sm text-gray-500">
                            Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Max {medicine.distributionLimit} per farmer
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(medicine)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal(medicine)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {!medicine.verifiedByAdmin && (
                            <button
                              onClick={() => handleVerify(medicine._id)}
                              disabled={actionLoading === medicine._id}
                              className="text-green-600 hover:text-green-900 p-1 rounded transition-colors disabled:opacity-50"
                              title="Verify Medicine"
                            >
                              {actionLoading === medicine._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(medicine._id)}
                            disabled={actionLoading === medicine._id}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors disabled:opacity-50"
                            title="Delete Medicine"
                          >
                            {actionLoading === medicine._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Medicine Details Modal */}
      <AnimatePresence>
        {showModal && selectedMedicine && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Medicine Details</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Medicine Information */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-blue-500" />
                        Medicine Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Name</label>
                          <p className="text-gray-900">{selectedMedicine.medicineName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Manufacturer</label>
                          <p className="text-gray-900">{selectedMedicine.manufacturer}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Category</label>
                          <span className={`inline-block px-2 py-1 text-xs rounded-md ${getCategoryColor(selectedMedicine.category)}`}>
                            {selectedMedicine.category}
                          </span>
                        </div>
                        {selectedMedicine.composition && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Composition</label>
                            <p className="text-gray-900">{selectedMedicine.composition}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Building className="w-5 h-5 mr-2 text-purple-500" />
                        Organization Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Organization</label>
                          <p className="text-gray-900">{selectedMedicine.organizationName}</p>
                        </div>
                        {selectedMedicine.contactPerson && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Contact Person</label>
                            <p className="text-gray-900">{selectedMedicine.contactPerson}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Contact Number</label>
                          <p className="text-gray-900">{selectedMedicine.contactNumber}</p>
                        </div>
                        {selectedMedicine.email && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-900">{selectedMedicine.email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-500" />
                        Stock Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Quantity</label>
                          <p className="text-gray-900">{selectedMedicine.quantity} units</p>
                        </div>
                        {selectedMedicine.expiryDate && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                            <p className="text-gray-900">
                              {new Date(selectedMedicine.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {selectedMedicine.batchNumber && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Batch Number</label>
                            <p className="text-gray-900">{selectedMedicine.batchNumber}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Distribution Limit</label>
                          <p className="text-gray-900">{selectedMedicine.distributionLimit} per farmer</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Pricing</label>
                          <p className="text-gray-900">
                            {selectedMedicine.isFree ? "Free" : "Paid Service"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-orange-500" />
                        Verification Status
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <div className="mt-1">
                            {getStatusBadge(selectedMedicine)}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Donation Date</label>
                          <p className="text-gray-900">
                            {new Date(selectedMedicine.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedMedicine.storeId && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Store</label>
                            <p className="text-gray-900">{selectedMedicine.storeId.storeName}</p>
                            <p className="text-sm text-gray-500">{selectedMedicine.storeId.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedMedicine.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{selectedMedicine.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!selectedMedicine.verifiedByAdmin && (
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                      <button
                        onClick={() => handleDelete(selectedMedicine._id)}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          handleVerify(selectedMedicine._id);
                          closeModal();
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Verify Medicine
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}