"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Eye, FileText, ImageIcon, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const VerificationDetailsModal = ({ isOpen, onClose, verification }) => {
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")

  if (!verification) return null

  const documents = [
    {
      id: 1,
      name: "License",
      filename: "medical_license.pdf",
      type: "pdf",
      icon: FileText,
      url: "/placeholder-document.pdf",
    },
    {
      id: 2,
      name: "ID Proof",
      filename: "aadhar_card.jpg",
      type: "image",
      icon: ImageIcon,
      url: "/placeholder-id.jpg",
    },
    {
      id: 3,
      name: "Qualification",
      filename: "degree_certificate.pdf",
      type: "pdf",
      icon: FileText,
      url: "/placeholder-certificate.pdf",
    },
  ]

  const handleDownload = (document) => {
    toast.success(`Downloading ${document.filename}`)
    // Simulate download
    const link = document.createElement("a")
    link.href = document.url
    link.download = document.filename
    link.click()
  }

  const handleViewDocument = (document) => {
    setSelectedDocument(document)
    setShowDocumentViewer(true)
  }

  const handleApprove = () => {
    toast.success(`${verification.userDetails.name} verification approved`)
    setShowApproveModal(false)
    onClose()
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }
    toast.success(`${verification.userDetails.name} verification rejected`)
    setShowRejectModal(false)
    setRejectionReason("")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Main Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
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
                    Verification Details - {verification.userDetails.name}
                  </h2>
                  <p className="text-gray-600 mt-1">Review user information and uploaded documents</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Name: </span>
                        <span className="text-gray-600">{verification.userDetails.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Role: </span>
                        <span className="text-gray-600">{verification.role}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email: </span>
                        <span className="text-gray-600">{verification.userDetails.email}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Phone: </span>
                        <span className="text-gray-600">{verification.contact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Specialization: </span>
                        <span className="text-gray-600">Veterinary Medicine</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Experience: </span>
                        <span className="text-gray-600">10 years</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {documents.map((document) => {
                      const IconComponent = document.icon
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
                                <h4 className="font-medium text-gray-900">{document.name}</h4>
                                <p className="text-sm text-gray-500">{document.filename}</p>
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
                      )
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
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
                  <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.name}</h3>
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
                      src="/document-preview.png"
                      alt={selectedDocument.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">PDF Preview</p>
                      <p className="text-sm text-gray-500 mt-2">{selectedDocument.filename}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Approve Confirmation Modal */}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Approve Verification</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to approve this verification request? This action cannot be undone.
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

          {/* Reject Confirmation Modal */}
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
                  <h3 className="text-xl font-semibold text-gray-900">Reject Verification</h3>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">Please provide a reason for rejecting this verification request.</p>
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
  )
}

export default VerificationDetailsModal
