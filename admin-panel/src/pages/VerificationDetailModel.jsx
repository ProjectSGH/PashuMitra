"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Eye,
  FileText,
  ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const VerificationDetailsModal = ({
  isOpen,
  onClose,
  verification,
  onStatusChange,
}) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = "http://localhost:5000";

  if (!verification) return null;

  // Check if action buttons should be shown (only for pending status)
  const showActionButtons = verification.verificationStatus === "pending";

  // Documents
  const documents = verification.verificationDocument
    ? [
        {
          id: 1,
          name: "Verification Document",
          filename: verification.verificationDocument.url.split("/").pop(),
          type: verification.verificationDocument.url.endsWith(".pdf")
            ? "pdf"
            : "image",
          icon: verification.verificationDocument.url.endsWith(".pdf")
            ? FileText
            : ImageIcon,
          url: verification.verificationDocument.url,
        },
      ]
    : [];

  // Download
  const handleDownload = (document) => {
    const link = document.createElement("a");
    link.href = document.url;
    link.download = document.filename;
    link.click();
    toast.success(`Downloading ${document.filename}`);
  };

  // View
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  // Approve API
  const handleApprove = async () => {
    if (!verification?._id) {
      toast.error("Invalid verification ID");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/admin/verification/${verification._id}/approve`
      );
      toast.success(
        `${
          verification.fullName || verification.user?.email
        } approved successfully`
      );
      setShowApproveModal(false);
      onClose();
      onStatusChange && onStatusChange(res.data.verification);
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve verification");
    } finally {
      setLoading(false);
    }
  };

  // Reject API
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/admin/verification/${verification._id}/reject`,
        { reason: rejectionReason }
      );
      toast.success(
        `${
          verification.fullName || verification.user?.email
        } rejected successfully`
      );
      setShowRejectModal(false);
      setRejectionReason("");
      onClose();
      onStatusChange && onStatusChange(res.data.verification);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject verification");
    } finally {
      setLoading(false);
    }
  };

  // Render Additional Details based on role
  const renderAdditionalDetails = () => {
    const role = verification.user?.role;
    if (role === "Doctor") {
      return (
        <>
          <div>
            <span className="font-medium text-gray-700">License Number: </span>
            <span className="text-gray-600">
              {verification.licenseNumber || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Specialization: </span>
            <span className="text-gray-600">
              {verification.doctor?.specialization || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Experience: </span>
            <span className="text-gray-600">
              {verification.doctor?.experience || "N/A"} years
            </span>
          </div>
        </>
      );
    } else if (role === "MedicalStore") {
      return (
        <>
          <div>
            <span className="font-medium text-gray-700">Store Name: </span>
            <span className="text-gray-600">
              {verification.storeName || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">License Number: </span>
            <span className="text-gray-600">
              {verification.licenseNumber || "N/A"}
            </span>
          </div>
        </>
      );
    } else if (role === "Farmer") {
      return (
        <>
          <div>
            <span className="font-medium text-gray-700">Full Name: </span>
            <span className="text-gray-600">
              {verification.fullName || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Village / City: </span>
            <span className="text-gray-600">
              {verification.farmer?.village ||
                verification.farmer?.state ||
                "N/A"}
            </span>
          </div>
        </>
      );
    } else {
      return null;
    }
  };

  // Render status message for non-pending verifications
  const renderStatusMessage = () => {
    if (verification.verificationStatus === "approved") {
      const approvedDate = verification.updatedAt || verification.createdAt;
      const formattedDate = approvedDate
        ? new Date(approvedDate).toLocaleDateString()
        : "Unknown date";

      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              This verification has been approved
            </span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Approved on {formattedDate}
          </p>
        </div>
      );
    } else if (verification.verificationStatus === "rejected") {
      const rejectedDate = verification.updatedAt || verification.createdAt;
      const formattedDate = rejectedDate
        ? new Date(rejectedDate).toLocaleDateString()
        : "Unknown date";

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">
              This verification has been rejected
            </span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            Rejected on {formattedDate}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Main Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Verification Details -{" "}
                    {verification.fullName || verification.user?.email}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Review user information and uploaded documents
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Status Message for non-pending verifications */}
                {renderStatusMessage()}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">
                          Name:{" "}
                        </span>
                        <span className="text-gray-600">
                          {verification.fullName || verification.user?.email}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Role:{" "}
                        </span>
                        <span className="text-gray-600">
                          {verification.user?.role}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Email:{" "}
                        </span>
                        <span className="text-gray-600">
                          {verification.user?.email}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Phone:{" "}
                        </span>
                        <span className="text-gray-600">
                          {verification.user?.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Additional Details
                    </h3>
                    <div className="space-y-3">{renderAdditionalDetails()}</div>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Uploaded Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {documents.map((document) => {
                      const IconComponent = document.icon;
                      return (
                        <div
                          key={document.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <IconComponent className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {document.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {document.filename}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDocument(document)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleDownload(document)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons - Only show for pending verifications */}
                {showActionButtons && (
                  <div className="flex gap-4">
                    <button
                      disabled={loading}
                      onClick={() => setShowApproveModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => setShowRejectModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Document Viewer Modal */}
          {showDocumentViewer && selectedDocument && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60"
              onClick={() => setShowDocumentViewer(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDocument.name}
                  </h3>
                  <button
                    onClick={() => setShowDocumentViewer(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 h-96 flex items-center justify-center bg-gray-50">
                  {selectedDocument.type === "image" ? (
                    <img
                      src={selectedDocument.url}
                      alt={selectedDocument.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={selectedDocument.url}
                      title={selectedDocument.name}
                      className="w-full h-full"
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Approve Modal */}
          {showApproveModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60"
              onClick={() => setShowApproveModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Approve Verification
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to approve this verification request?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Reject Modal */}
          {showRejectModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60"
              onClick={() => setShowRejectModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Reject Verification
                  </h3>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">
                  Please provide a reason for rejecting this verification
                  request.
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none h-24 mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default VerificationDetailsModal;
