"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  UserCheck,
  Filter,
  Calendar,
  Clock,
  Pill,
  Edit,
  ClipboardList,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Stethoscope,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Separate Consultation Details Modal Component
const ConsultationDetailsModal = ({
  selectedConsultation,
  onClose,
  onEdit,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Consultation Details
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {selectedConsultation ? (
          <>
            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Patient Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Farmer Name
                    </label>
                    <p className="text-gray-900">
                      {selectedConsultation.farmerName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Contact
                    </label>
                    <p className="text-gray-900">
                      {selectedConsultation.farmerEmail || "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedConsultation.farmerPhone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Animal
                    </label>
                    <p className="text-gray-900">
                      {selectedConsultation.animalType || "N/A"}
                    </p>
                    {selectedConsultation.animalBreed && (
                      <p className="text-gray-600 text-sm">
                        Breed: {selectedConsultation.animalBreed}
                      </p>
                    )}
                    {selectedConsultation.animalAge && (
                      <p className="text-gray-600 text-sm">
                        Age: {selectedConsultation.animalAge}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Consultation Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Date & Time
                    </label>
                    <p className="text-gray-900">
                      {selectedConsultation.date
                        ? new Date(
                            selectedConsultation.date
                          ).toLocaleDateString()
                        : "N/A"}{" "}
                      at {selectedConsultation.startTime || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedConsultation.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedConsultation.status === "follow_up"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedConsultation.status === "completed"
                        ? "Completed"
                        : selectedConsultation.status === "follow_up"
                        ? "Follow-up Required"
                        : selectedConsultation.status || "Unknown"}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Medical Information
              </h3>
              <div className="space-y-4">
                {selectedConsultation.symptoms && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Symptoms
                    </label>
                    <p className="text-gray-900 mt-1">
                      {selectedConsultation.symptoms}
                    </p>
                  </div>
                )}

                {selectedConsultation.diagnosis && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Diagnosis
                    </label>
                    <p className="text-gray-900 mt-1">
                      {selectedConsultation.diagnosis}
                    </p>
                  </div>
                )}

                {selectedConsultation.consultationNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Consultation Notes
                    </label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {selectedConsultation.consultationNotes}
                    </p>
                  </div>
                )}

                {selectedConsultation.treatmentPlan && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Treatment Plan
                    </label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {selectedConsultation.treatmentPlan}
                    </p>
                  </div>
                )}

                {selectedConsultation.medicationsPrescribed &&
                  selectedConsultation.medicationsPrescribed.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2">
                        Medications Prescribed
                      </label>
                      <div className="space-y-2">
                        {selectedConsultation.medicationsPrescribed.map(
                          (med, index) => (
                            <div
                              key={index}
                              className="border rounded p-3 bg-gray-50"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Pill className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-gray-900">
                                  {med.name || "Unnamed Medication"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Dosage:</span>
                                  <p className="text-gray-900">
                                    {med.dosage || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-600">
                                    Duration:
                                  </span>
                                  <p className="text-gray-900">
                                    {med.duration || "N/A"}
                                  </p>
                                </div>
                                <div className="md:col-span-2">
                                  <span className="text-gray-600">
                                    Instructions:
                                  </span>
                                  <p className="text-gray-900">
                                    {med.instructions || "N/A"}
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
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {selectedConsultation.recommendations}
                    </p>
                  </div>
                )}

                {selectedConsultation.nextSteps && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Next Steps
                    </label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
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

      <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
        <button
          onClick={() => {
            onClose();
            onEdit();
          }}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Consultation
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Separate Consultation Edit Modal Component
const ConsultationEditModal = ({
  selectedConsultation,
  consultationData,
  onClose,
  onUpdate,
  onConsultationDataChange,
  isSubmitting,
}) => {
  // Local handlers that don't cause re-renders
  const handleTextChange = (field, value) => {
    onConsultationDataChange({
      ...consultationData,
      [field]: value,
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = consultationData.medicationsPrescribed.map(
      (med, i) => (i === index ? { ...med, [field]: value } : med)
    );

    onConsultationDataChange({
      ...consultationData,
      medicationsPrescribed: updatedMedications,
    });
  };

  const handleAddMedication = () => {
    const newMedications = [
      ...consultationData.medicationsPrescribed,
      { name: "", dosage: "", duration: "", instructions: "" },
    ];

    onConsultationDataChange({
      ...consultationData,
      medicationsPrescribed: newMedications,
    });
  };

  const handleRemoveMedication = (index) => {
    let newMedications;
    if (consultationData.medicationsPrescribed.length <= 1) {
      newMedications = [
        { name: "", dosage: "", duration: "", instructions: "" },
      ];
    } else {
      newMedications = consultationData.medicationsPrescribed.filter(
        (_, i) => i !== index
      );
    }

    onConsultationDataChange({
      ...consultationData,
      medicationsPrescribed: newMedications,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Edit Consultation -{" "}
            {selectedConsultation?.farmerName || "Unknown Farmer"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Stethoscope className="w-4 h-4 inline mr-1" />
              Symptoms
            </label>
            <textarea
              value={consultationData.symptoms}
              onChange={(e) => handleTextChange("symptoms", e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the symptoms observed..."
              disabled={isSubmitting}
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis
            </label>
            <textarea
              value={consultationData.diagnosis}
              onChange={(e) => handleTextChange("diagnosis", e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter diagnosis..."
              disabled={isSubmitting}
            />
          </div>

          {/* Consultation Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Notes
            </label>
            <textarea
              value={consultationData.consultationNotes}
              onChange={(e) =>
                handleTextChange("consultationNotes", e.target.value)
              }
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter consultation notes, observations, and findings..."
              disabled={isSubmitting}
            />
          </div>

          {/* Treatment Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment Plan
            </label>
            <textarea
              value={consultationData.treatmentPlan}
              onChange={(e) =>
                handleTextChange("treatmentPlan", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter treatment plan..."
              disabled={isSubmitting}
            />
          </div>

          {/* Medications Prescribed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Medications Prescribed
              </label>
              <button
                type="button"
                onClick={handleAddMedication}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1 disabled:opacity-50"
                disabled={isSubmitting}
              >
                <Pill className="w-4 h-4" />
                Add Medication
              </button>
            </div>
            {consultationData.medicationsPrescribed.map((med, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 border rounded relative"
              >
                <button
                  onClick={() => handleRemoveMedication(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
                  disabled={isSubmitting}
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
                <input
                  type="text"
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) =>
                    handleMedicationChange(index, "name", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) =>
                    handleMedicationChange(index, "dosage", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={med.duration}
                  onChange={(e) =>
                    handleMedicationChange(index, "duration", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  placeholder="Instructions"
                  value={med.instructions}
                  onChange={(e) =>
                    handleMedicationChange(
                      index,
                      "instructions",
                      e.target.value
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendations
            </label>
            <textarea
              value={consultationData.recommendations}
              onChange={(e) =>
                handleTextChange("recommendations", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter recommendations..."
              disabled={isSubmitting}
            />
          </div>

          {/* Next Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Steps
            </label>
            <textarea
              value={consultationData.nextSteps}
              onChange={(e) => handleTextChange("nextSteps", e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter next steps and recommendations..."
              disabled={isSubmitting}
            />
          </div>

          {/* Consultation Duration and Follow-up Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Consultation Duration (minutes)
              </label>
              <input
                type="number"
                value={consultationData.consultationDuration}
                onChange={(e) =>
                  handleTextChange(
                    "consultationDuration",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                min="1"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Follow-up Date (if needed)
              </label>
              <input
                type="date"
                value={consultationData.followUpDate}
                onChange={(e) =>
                  handleTextChange("followUpDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Status
            </label>
            <select
              value={consultationData.status}
              onChange={(e) => handleTextChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <option value="completed">Completed</option>
              <option value="follow_up">Follow-up Required</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </button>
          <div className="space-x-3">
            <button
              onClick={onUpdate}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              disabled={isSubmitting}
              type="button"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? "Updating..." : "Update Consultation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate Follow Up Modal Component
const FollowUpModal = ({
  followUpData,
  onClose,
  onSchedule,
  onFollowUpDataChange,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-md w-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Schedule Follow-up</h2>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Follow-up Date
          </label>
          <input
            type="date"
            value={followUpData.followUpDate}
            onChange={(e) =>
              onFollowUpDataChange({
                ...followUpData,
                followUpDate: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={followUpData.notes}
            onChange={(e) =>
              onFollowUpDataChange({ ...followUpData, notes: e.target.value })
            }
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional notes for the follow-up..."
          />
        </div>
      </div>

      <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSchedule}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Schedule Follow-up
        </button>
      </div>
    </div>
  </div>
);

// Main Component
export default function PatientHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [consultationData, setConsultationData] = useState({
    consultationNotes: "",
    diagnosis: "",
    treatmentPlan: "",
    nextSteps: "",
    followUpDate: "",
    medicationsPrescribed: [
      { name: "", dosage: "", duration: "", instructions: "" },
    ],
    consultationDuration: 30,
    status: "completed",
    symptoms: "",
    recommendations: "",
  });

  const [followUpData, setFollowUpData] = useState({
    followUpDate: "",
    notes: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?._id;

  // Fetch consultation history with animal details and symptoms
  const fetchConsultationHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/consultations/doctor/${doctorId}/history`,
        {
          params: {
            status: statusFilter,
            search: searchTerm,
          },
        }
      );

      console.log("🔍 RAW API RESPONSE:", response.data);

      // Check if we have consultations and what animal data they contain
      if (
        response.data.consultations &&
        response.data.consultations.length > 0
      ) {
        console.log(
          "📋 First consultation object:",
          response.data.consultations[0]
        );
        console.log("🐾 Animal details in first consultation:", {
          animalType: response.data.consultations[0].animalType,
          animalBreed: response.data.consultations[0].animalBreed,
          animalAge: response.data.consultations[0].animalAge,
          symptoms: response.data.consultations[0].symptoms,
        });
      }

      // Process the data to ensure animal details and symptoms are included
      const processedData = (response.data.consultations || []).map(
        (consultation) => ({
          ...consultation,
          // Ensure animal details are properly set
          animalType: consultation.animalType || "Not specified",
          animalBreed: consultation.animalBreed || "Not specified",
          animalAge: consultation.animalAge || "Not specified",
          symptoms: consultation.symptoms || "No symptoms recorded",
          // Ensure status display is set
          statusDisplay:
            consultation.status === "completed"
              ? "Completed"
              : consultation.status === "follow_up"
              ? "Follow-up Required"
              : consultation.status === "approved"
              ? "Active"
              : "Pending",
          statusColor:
            consultation.status === "completed"
              ? "bg-green-100 text-green-800"
              : consultation.status === "follow_up"
              ? "bg-yellow-100 text-yellow-800"
              : consultation.status === "approved"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800",
        })
      );

      console.log("✅ Processed consultation data:", processedData);
      setPatientData(processedData);
    } catch (err) {
      console.error("❌ Error fetching consultation history:", err);
      toast.error("Failed to load patient history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchConsultationHistory();
    }
  }, [doctorId, statusFilter, searchTerm]);

  // Fetch consultation details
  const fetchConsultationDetails = async (consultationId) => {
    try {
      console.log("Fetching consultation details for:", consultationId);
      const response = await axios.get(
        `http://localhost:5000/api/consultations/${consultationId}`
      );
      console.log("Consultation details:", response.data);
      setSelectedConsultation(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Error fetching consultation details:", err);
      console.error("Error response:", err.response?.data);
      toast.error("Failed to load consultation details. Please try again.");
    }
  };

  // Fetch consultation for editing
  const fetchConsultationForEdit = async (consultationId) => {
    try {
      console.log("Fetching consultation for edit:", consultationId);
      const response = await axios.get(
        `http://localhost:5000/api/consultations/${consultationId}`
      );
      console.log("Consultation for edit:", response.data);

      setSelectedConsultation(response.data);
      setConsultationData({
        consultationNotes: response.data.consultationNotes || "",
        diagnosis: response.data.diagnosis || "",
        treatmentPlan: response.data.treatmentPlan || "",
        nextSteps: response.data.nextSteps || "",
        followUpDate: response.data.followUpDate
          ? response.data.followUpDate.split("T")[0]
          : "",
        medicationsPrescribed:
          response.data.medicationsPrescribed?.length > 0
            ? response.data.medicationsPrescribed
            : [{ name: "", dosage: "", duration: "", instructions: "" }],
        consultationDuration: response.data.consultationDuration || 30,
        status: response.data.status || "completed",
        symptoms: response.data.symptoms || "",
        recommendations: response.data.recommendations || "",
      });
      setShowEditModal(true);
    } catch (err) {
      console.error("Error fetching consultation for edit:", err);
      console.error("Error response:", err.response?.data);
      toast.error("Failed to load consultation data. Please try again.");
    }
  };

  // Update consultation
  const handleUpdateConsultation = async () => {
    if (!selectedConsultation) return;

    try {
      setIsSubmitting(true);
      const response = await axios.put(
        `http://localhost:5000/api/consultations/${selectedConsultation.id}/update`,
        consultationData
      );

      toast.success("Consultation updated successfully!");
      setShowEditModal(false);
      fetchConsultationHistory();
    } catch (err) {
      console.error("Error updating consultation:", err);
      console.error("Error response:", err.response?.data);
      toast.error("Failed to update consultation");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Schedule follow-up
  const handleScheduleFollowUp = async () => {
    if (!selectedConsultation) return;

    try {
      await axios.put(
        `http://localhost:5000/api/consultations/${selectedConsultation.id}/schedule-followup`,
        followUpData
      );

      toast.success("Follow-up scheduled successfully!");
      setShowFollowUpModal(false);
      setFollowUpData({ followUpDate: "", notes: "" });
      fetchConsultationHistory();
    } catch (err) {
      console.error("Error scheduling follow-up:", err);
      toast.error("Failed to schedule follow-up");
    }
  };

  // Complete consultation
  const handleCompleteConsultation = async (consultationId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/consultations/${consultationId}/complete`
      );

      toast.success("Consultation marked as completed!");
      fetchConsultationHistory();
    } catch (err) {
      console.error("Error completing consultation:", err);
      toast.error("Failed to complete consultation");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Modals */}
      {showDetailsModal && (
        <ConsultationDetailsModal
          selectedConsultation={selectedConsultation}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() =>
            selectedConsultation &&
            fetchConsultationForEdit(selectedConsultation.id)
          }
        />
      )}

      {showEditModal && (
        <ConsultationEditModal
          selectedConsultation={selectedConsultation}
          consultationData={consultationData}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateConsultation}
          onConsultationDataChange={setConsultationData}
          isSubmitting={isSubmitting}
        />
      )}

      {showFollowUpModal && (
        <FollowUpModal
          followUpData={followUpData}
          onClose={() => setShowFollowUpModal(false)}
          onSchedule={handleScheduleFollowUp}
          onFollowUpDataChange={setFollowUpData}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Patient History & Consultations
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage and review all patient consultations and treatment records
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
                placeholder="Search by farmer name, animal type, or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
              >
                <option value="all">All Consultations</option>
                <option value="completed">Completed</option>
                <option value="follow_up">Follow-up Required</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading consultation history...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmer Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Animal Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symptoms
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue/Diagnosis
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Consultation Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patientData.map((patient) => (
                      <motion.tr
                        key={patient.id}
                        variants={itemVariants}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.farmerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.farmerEmail}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.farmerPhone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">
                              {patient.animalType}
                            </div>
                            {patient.animalBreed &&
                              patient.animalBreed !== "Not specified" && (
                                <div className="text-gray-600 text-xs">
                                  Breed: {patient.animalBreed}
                                </div>
                              )}
                            {patient.animalAge &&
                              patient.animalAge !== "Not specified" && (
                                <div className="text-gray-600 text-xs">
                                  Age: {patient.animalAge}
                                </div>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div
                            className="text-sm text-gray-900 line-clamp-2"
                            title={patient.symptoms}
                          >
                            {patient.symptoms}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div
                            className="text-sm text-gray-900 truncate"
                            title={patient.issue}
                          >
                            {patient.issue}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {patient.treatmentDate}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.startTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${patient.statusColor}`}
                          >
                            {patient.statusDisplay}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {/* Your existing action buttons */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fetchConsultationDetails(patient.id)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fetchConsultationForEdit(patient.id)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </motion.button>
                          {patient.status === "approved" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleCompleteConsultation(patient.id)
                              }
                              className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </motion.button>
                          )}
                          {patient.status === "completed" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedConsultation(patient);
                                setShowFollowUpModal(true);
                              }}
                              className="text-orange-600 hover:text-orange-900 inline-flex items-center gap-1"
                            >
                              <UserCheck className="w-4 h-4" />
                              Follow-up
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Cards */}
              <div className="md:hidden">
                {patientData.map((patient) => (
                  <motion.div
                    key={patient.id}
                    variants={itemVariants}
                    className="p-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {patient.farmerName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {patient.farmerEmail}
                        </p>
                        <p className="text-sm text-gray-600">
                          {patient.farmerPhone}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${patient.statusColor}`}
                      >
                        {patient.statusDisplay}
                      </span>
                    </div>

                    {/* Animal Details */}
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Animal Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">
                            Type:
                          </span>
                          <p className="text-blue-800">{patient.animalType}</p>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">
                            Breed:
                          </span>
                          <p className="text-blue-800">{patient.animalBreed}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-blue-700 font-medium">
                            Age:
                          </span>
                          <p className="text-blue-800">{patient.animalAge}</p>
                        </div>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="mb-3 p-3 bg-amber-50 rounded-lg">
                      <h4 className="text-sm font-medium text-amber-900 mb-1">
                        Symptoms
                      </h4>
                      <p className="text-sm text-amber-800">
                        {patient.symptoms}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Issue/Diagnosis:
                        </span>
                        <p className="text-sm text-gray-900">{patient.issue}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date:
                        </span>
                        <p className="text-sm text-gray-900">
                          {patient.treatmentDate} at {patient.startTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fetchConsultationDetails(patient.id)}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200 inline-flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fetchConsultationForEdit(patient.id)}
                        className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-200 inline-flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </motion.button>
                      {patient.status === "approved" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCompleteConsultation(patient.id)}
                          className="flex-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors duration-200 inline-flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete
                        </motion.button>
                      )}
                      {patient.status === "completed" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedConsultation(patient);
                            setShowFollowUpModal(true);
                          }}
                          className="flex-1 bg-orange-50 text-orange-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors duration-200 inline-flex items-center justify-center gap-1"
                        >
                          <UserCheck className="w-4 h-4" />
                          Follow-up
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Empty State */}
              {patientData.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    No consultation records found matching your criteria.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
