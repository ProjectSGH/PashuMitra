"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Pill,
  FileText,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  ChevronRight,
  FileDown,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PrescriptionService } from "../../hooks/Prescrition";

export default function FarmerConsultationHistory() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));
  const farmerId = user?._id;

  // Fetch consultation history
  const fetchConsultationHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/consultations/farmer/${farmerId}`
      );
      // console.log("Consultations data:", response.data); // Debug log
      setConsultations(response.data || []);
    } catch (err) {
      console.error("Error fetching consultation history:", err);
      toast.error("Failed to load consultation history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (farmerId) {
      fetchConsultationHistory();
    }
  }, [farmerId]);

  // Fetch detailed consultation
  const fetchConsultationDetails = async (consultationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/consultations/${consultationId}`
      );
      setSelectedConsultation(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Error fetching consultation details:", err);
      toast.error("Failed to load consultation details");
    }
  };

  // In your component, update the downloadPrescription function:
const downloadPrescription = async (consultation) => {
  try {
    // console.log("Consultation object:", consultation);
    
    // Check if consultation exists and has an ID
    if (!consultation) {
      toast.error("No consultation data available");
      return;
    }

    const consultationId = consultation._id || consultation.id;
    // console.log("Consultation ID:", consultationId);
    
    if (!consultationId) {
      toast.error("Invalid consultation data - missing ID");
      return;
    }

    // Show loading state
    toast.loading('Generating prescription...', { id: 'prescription' });
    
    // Use the backend service
    await PrescriptionService.downloadPrescription(consultationId);
    
    toast.success('Prescription downloaded successfully!', { id: 'prescription' });
  } catch (error) {
    console.error('Error downloading prescription:', error);
    toast.error(error.message || 'Failed to download prescription', { id: 'prescription' });
  }
};

  // Get doctor information - IMPROVED to handle various data structures
  const getDoctorInfo = (consultation) => {
    // console.log("Consultation data for doctor info:", consultation);

    // First check if we have doctorInfo from the backend
    if (
      consultation.doctorInfo &&
      consultation.doctorInfo.fullName !== "Doctor Not Available"
    ) {
      return {
        name: consultation.doctorInfo.fullName,
        specialization: consultation.doctorInfo.specialization,
      };
    }

    // Check if we have direct doctor data (from individual consultation fetch)
    if (
      consultation.doctorName &&
      consultation.doctorName !== "Unknown Doctor"
    ) {
      return {
        name: consultation.doctorName,
        specialization: consultation.doctorSpecialization || "General",
      };
    }

    // Final fallback
    return {
      name: "Doctor Not Available",
      specialization: "Unknown",
    };
  };

  // Filter consultations - UPDATED
  const filteredConsultations = consultations.filter((consultation) => {
    const doctorInfo = getDoctorInfo(consultation);
    const doctorName = doctorInfo.name.toLowerCase();

    const matchesSearch =
      doctorName.includes(searchTerm.toLowerCase()) ||
      consultation.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || consultation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get status display
  const getStatusDisplay = (status) => {
    switch (status) {
      case "completed":
        return {
          text: "Completed",
          color: "text-green-800",
          bgColor: "bg-green-100",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case "approved":
        return {
          text: "Active",
          color: "text-blue-800",
          bgColor: "bg-blue-100",
          icon: <Clock className="w-4 h-4" />,
        };
      case "pending":
        return {
          text: "Pending",
          color: "text-yellow-800",
          bgColor: "bg-yellow-100",
          icon: <Clock className="w-4 h-4" />,
        };
      case "follow_up":
        return {
          text: "Follow-up Required",
          color: "text-orange-800",
          bgColor: "bg-orange-100",
          icon: <AlertCircle className="w-4 h-4" />,
        };
      default:
        return {
          text: status || "Unknown",
          color: "text-gray-800",
          bgColor: "bg-gray-100",
          icon: <AlertCircle className="w-4 h-4" />,
        };
    }
  };

  // Consultation Details Modal - UPDATED to handle missing doctor data
  const ConsultationDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Consultation Details
          </h2>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {selectedConsultation ? (
            <>
              {/* Doctor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Doctor Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Doctor Name
                      </label>
                      <p className="text-gray-900">
                        {selectedConsultation.doctorName ||
                          "Doctor Not Available"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Specialization
                      </label>
                      <p className="text-gray-900">
                        {selectedConsultation.doctorSpecialization || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Consultation Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Date & Time
                      </label>
                      <p className="text-gray-900">
                        {new Date(
                          selectedConsultation.date
                        ).toLocaleDateString()}{" "}
                        at {selectedConsultation.startTime}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          getStatusDisplay(selectedConsultation.status).bgColor
                        } ${
                          getStatusDisplay(selectedConsultation.status).color
                        }`}
                      >
                        {getStatusDisplay(selectedConsultation.status).icon}
                        {getStatusDisplay(selectedConsultation.status).text}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Duration
                      </label>
                      <p className="text-gray-900">
                        {selectedConsultation.consultationDuration || 0} minutes
                      </p>
                    </div>
                    {selectedConsultation.followUpDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Follow-up Date
                        </label>
                        <p className="text-gray-900">
                          {new Date(
                            selectedConsultation.followUpDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Medical Information
                </h3>
                <div className="space-y-4">
                  {selectedConsultation.symptoms && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Symptoms Reported
                      </label>
                      <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">
                        {selectedConsultation.symptoms}
                      </p>
                    </div>
                  )}

                  {selectedConsultation.diagnosis && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Diagnosis
                      </label>
                      <p className="text-gray-900 mt-1 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        {selectedConsultation.diagnosis}
                      </p>
                    </div>
                  )}

                  {selectedConsultation.consultationNotes && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Doctor's Notes
                      </label>
                      <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                        {selectedConsultation.consultationNotes}
                      </p>
                    </div>
                  )}

                  {selectedConsultation.treatmentPlan && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Treatment Plan
                      </label>
                      <p className="text-gray-900 mt-1 bg-green-50 p-3 rounded-lg border border-green-100 whitespace-pre-wrap">
                        {selectedConsultation.treatmentPlan}
                      </p>
                    </div>
                  )}

                  {selectedConsultation.medicationsPrescribed &&
                    selectedConsultation.medicationsPrescribed.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Pill className="w-4 h-4" />
                          Medications Prescribed
                        </label>
                        <div className="space-y-3">
                          {selectedConsultation.medicationsPrescribed.map(
                            (med, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4 bg-white shadow-sm"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <Pill className="w-4 h-4 text-blue-500" />
                                  <span className="font-medium text-gray-900">
                                    {med.name || "Unnamed Medication"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      Dosage:
                                    </span>
                                    <p className="text-gray-900 mt-1">
                                      {med.dosage || "Not specified"}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      Duration:
                                    </span>
                                    <p className="text-gray-900 mt-1">
                                      {med.duration || "Not specified"}
                                    </p>
                                  </div>
                                  <div className="md:col-span-1">
                                    <span className="text-gray-600 font-medium">
                                      Instructions:
                                    </span>
                                    <p className="text-gray-900 mt-1">
                                      {med.instructions || "Not specified"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {selectedConsultation.recommendations && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Recommendations
                      </label>
                      <p className="text-gray-900 mt-1 bg-yellow-50 p-3 rounded-lg border border-yellow-100 whitespace-pre-wrap">
                        {selectedConsultation.recommendations}
                      </p>
                    </div>
                  )}

                  {selectedConsultation.nextSteps && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Next Steps
                      </label>
                      <p className="text-gray-900 mt-1 bg-purple-50 p-3 rounded-lg border border-purple-100 whitespace-pre-wrap">
                        {selectedConsultation.nextSteps}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No consultation data available.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <button
            onClick={() => downloadPrescription(selectedConsultation)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download Prescription
          </button>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Modal */}
      {showDetailsModal && <ConsultationDetailsModal />}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Consultations
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            View your consultation history and prescriptions
          </p>
        </div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by doctor name or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
              >
                <option value="all">All Consultations</option>
                <option value="completed">Completed</option>
                <option value="approved">Active</option>
                <option value="pending">Pending</option>
                <option value="follow_up">Follow-up Required</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Consultations List */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading your consultations...</p>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "No consultations found matching your criteria."
                  : "You haven't had any consultations yet."}
              </p>
            </div>
          ) : (
            filteredConsultations.map((consultation) => {
              const statusDisplay = getStatusDisplay(consultation.status);
              const doctorInfo = getDoctorInfo(consultation);

              return (
                <motion.div
                  key={consultation._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                      },
                    },
                  }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => fetchConsultationDetails(consultation._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {doctorInfo.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {doctorInfo.specialization}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${statusDisplay.bgColor} ${statusDisplay.color}`}
                        >
                          {statusDisplay.icon}
                          {statusDisplay.text}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(consultation.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{consultation.startTime}</span>
                        </div>
                        {consultation.diagnosis && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Stethoscope className="w-4 h-4" />
                            <span className="truncate">
                              {consultation.diagnosis}
                            </span>
                          </div>
                        )}
                      </div>

                      {consultation.consultationNotes && (
                        <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                          {consultation.consultationNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchConsultationDetails(consultation._id);
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {consultation.status === "completed" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPrescription(consultation);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Prescription
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
