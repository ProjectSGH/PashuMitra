"use client";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User2,
  Phone,
  ArrowLeft,
  Check,
  CheckCheck,
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function DoctorChat() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [consultations, setConsultations] = useState({});
  const [consultationDetails, setConsultationDetails] = useState({});
  const [statusFilter, setStatusFilter] = useState("active"); // "active", "completed", "all"

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?._id;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedFarmer]);

  // Initialize socket with status listeners
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    // Join doctor's personal room for notifications
    if (doctorId) {
      socket.emit("joinUserRoom", doctorId);
    }

    socket.on("receiveMessage", (newMessage) => {
      // console.log("Socket received message:", newMessage);
      const farmerKey = newMessage.farmerId?.toString();

      // Prevent duplicates by checking if message already exists
      setMessages((prev) => {
        const existingMessages = prev[farmerKey] || [];
        const isDuplicate = existingMessages.some(
          (msg) =>
            msg._id === newMessage._id ||
            (msg.timestamp === newMessage.timestamp &&
              msg.message === newMessage.message)
        );

        if (isDuplicate) {
          // console.log("Duplicate message detected, skipping");
          return prev;
        }

        return {
          ...prev,
          [farmerKey]: [...existingMessages, newMessage],
        };
      });
    });

    // Listen for consultation status updates
    socket.on("consultationStatusUpdated", (data) => {
      if (data.requestId) {
        setConsultations((prev) => ({
          ...prev,
          [data.requestId]: data.status,
        }));

        setFarmers((prev) =>
          prev.map((f) =>
            f.requestId === data.requestId ? { ...f, status: data.status } : f
          )
        );

        if (data.status === "approved") {
          toast.success(
            "Consultation approved successfully! Chat is now available."
          );
        } else if (data.status === "rejected") {
          toast.error("Consultation rejected");
        }
      }
    });

    // Listen for new consultation requests
    socket.on("newConsultationRequest", (data) => {
      toast.success("New consultation request received!");
      fetchFarmersAndConsultations();
    });

    return () => socket.disconnect();
  }, [doctorId]);

  // ✅ CORRECTED: Group consultations by farmer and include consultation details
  const fetchFarmersAndConsultations = async () => {
    try {
      console.log("Fetching consultations for doctor:", doctorId);

      // Fetch ALL consultations (not just pending)
      const consultRes = await axios.get(
        `http://localhost:5000/api/consultations/doctor/${doctorId}/requests?status=all`
      );

      console.log("All consultations API response:", consultRes.data);

      if (!consultRes.data || consultRes.data.length === 0) {
        console.log("No consultation requests found");
        setFarmers([]);
        setLoading(false);
        return;
      }

      // Group consultations by farmerUserId
      const farmersMap = new Map();

      consultRes.data
        .filter((c) => c && c._id && c.farmerUserId && c.requestId)
        .forEach((c) => {
          const farmerUserId = c.farmerUserId;

          if (!farmersMap.has(farmerUserId)) {
            // First time seeing this farmer - create entry
            farmersMap.set(farmerUserId, {
              _id: farmerUserId, // Use farmerUserId as the main ID for chat
              farmerUserId: farmerUserId,
              fullName: c.fullName || "Unknown Farmer",
              email: c.email || "",
              phone: c.phone || "No phone",
              consultations: [], // Array to store all consultations for this farmer
              latestConsultation: null, // Track the most recent consultation
            });
          }

          const farmer = farmersMap.get(farmerUserId);
          const consultation = {
            requestId: c.requestId,
            status: c.status || "pending",
            consultationDate: c.date,
            startTime: c.startTime,
            endTime: c.endTime,
            fee: c.fee || 0,
            createdAt: c.createdAt,
            // FIX: Use animal details from the API response
            symptoms: c.symptoms || "",
            animalType: c.animalType || "Not specified",
            animalBreed: c.animalBreed || "Not specified",
            animalAge: c.animalAge || "Not specified",
          };

          farmer.consultations.push(consultation);

          // Update latest consultation if this one is newer
          if (
            !farmer.latestConsultation ||
            new Date(c.createdAt) >
              new Date(farmer.latestConsultation.createdAt)
          ) {
            farmer.latestConsultation = consultation;
          }
        });

      // Convert map to array and set the main consultation status based on latest consultation
      const farmersList = Array.from(farmersMap.values()).map((farmer) => ({
        ...farmer,
        // Use the latest consultation for main status and chat availability
        requestId: farmer.latestConsultation?.requestId,
        status: farmer.latestConsultation?.status || "none",
        consultationDate: farmer.latestConsultation?.consultationDate,
        startTime: farmer.latestConsultation?.startTime,
        endTime: farmer.latestConsultation?.endTime,
        fee: farmer.latestConsultation?.fee || 0,
        // FIX: Include latest consultation details from the API
        symptoms: farmer.latestConsultation?.symptoms || "",
        animalType: farmer.latestConsultation?.animalType || "Not specified",
        animalBreed: farmer.latestConsultation?.animalBreed || "Not specified",
        animalAge: farmer.latestConsultation?.animalAge || "Not specified",
      }));

      console.log(
        "Processed farmers list with consultation details:",
        farmersList
      );

      const consultMap = {};
      const detailsMap = {};

      // Create consultation maps for all consultations (not just latest)
      farmersList.forEach((farmer) => {
        farmer.consultations.forEach((consultation) => {
          if (consultation.requestId) {
            consultMap[consultation.requestId] = consultation.status;
            detailsMap[consultation.requestId] = {
              date: consultation.consultationDate,
              startTime: consultation.startTime,
              endTime: consultation.endTime,
              symptoms: consultation.symptoms,
              animalType: consultation.animalType,
              animalBreed: consultation.animalBreed,
              animalAge: consultation.animalAge,
            };
          }
        });
      });

      setConsultations(consultMap);
      setConsultationDetails(detailsMap);
      setFarmers(farmersList);
    } catch (err) {
      console.error("Error fetching consultations/farmers:", err);
      toast.error("Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchFarmersAndConsultations();
    }
  }, [doctorId]);

  // ✅ CORRECTED: Check if farmer has ANY approved consultation
  const isChatAvailable = (farmer) => {
    if (!farmer.consultations || farmer.consultations.length === 0) {
      return false;
    }

    // Check if any consultation is approved
    const hasApprovedConsultation = farmer.consultations.some(
      (consultation) => consultations[consultation.requestId] === "approved"
    );

    if (hasApprovedConsultation) {
      return true;
    }

    // Check if all consultations are completed
    const allCompleted = farmer.consultations.every(
      (consultation) => consultations[consultation.requestId] === "completed"
    );

    if (allCompleted) {
      return "completed";
    }

    return false;
  };
  // ✅ CORRECTED: Use farmerUserId for all chat operations
  const openChat = (farmer) => {
    const chatStatus = isChatAvailable(farmer);

    if (chatStatus === false) {
      toast.error(
        "Chat will be available after you approve the consultation.",
        { duration: 4000, position: "bottom-right" }
      );
      return;
    }

    if (chatStatus === "completed") {
      toast.info(
        "This consultation is completed. Approve a new request to continue chatting.",
        { duration: 4000, position: "bottom-right" }
      );
      return;
    }

    // Use farmerUserId for all chat operations
    const farmerUserId = farmer.farmerUserId.toString();
    setSelectedFarmer(farmer);
    setActiveChat(farmer);
    setShowSidebar(false);

    if (socketRef.current) {
      socketRef.current.emit("joinRoom", {
        farmerId: farmerUserId,
        doctorId,
      });
    }

    fetchMessages(farmerUserId);
  };
  // ✅ CORRECTED: Use farmerUserId for messages
  const fetchMessages = async (farmerUserId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/messages/${farmerUserId}/${doctorId}`
      );
      console.log("Fetched messages:", res.data);
      setMessages((prev) => ({ ...prev, [farmerUserId]: res.data }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // ✅ CORRECTED: Use farmerUserId for all message operations
  const handleSendMessage = async () => {
    if (!selectedFarmer || !message.trim()) return;

    if (!isChatAvailable(selectedFarmer)) {
      toast.error(
        "You can only send messages after approving the consultation."
      );
      return;
    }

    try {
      const newMessage = {
        farmerId: selectedFarmer.farmerUserId.toString(), // Use farmerUserId
        doctorId,
        sender: "doctor",
        message,
      };

      console.log("Sending message:", newMessage);

      // Send to backend
      await axios.post("http://localhost:5000/api/chat/send", newMessage);

      setMessage("");

      // Refresh messages to get the latest from DB
      setTimeout(() => {
        fetchMessages(selectedFarmer.farmerUserId.toString());
      }, 100);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    }
  };

  // ✅ CORRECTED: Use the proper IDs
  const handleConfirmConsultation = async (farmer) => {
    try {
      console.log("Farmer object for approval:", farmer);

      if (!farmer.requestId) {
        console.error("No requestId found for farmer:", farmer);
        toast.error("No consultation request found to approve");
        return;
      }

      console.log("Approving consultation with requestId:", farmer.requestId);
      console.log("Farmer user ID:", farmer.farmerUserId);

      const response = await axios.put(
        `http://localhost:5000/api/consultations/${farmer.requestId}/approve`
      );

      console.log("Approval response:", response.data);

      // Update state
      setConsultations((prev) => ({ ...prev, [farmer.requestId]: "approved" }));
      setFarmers((prev) =>
        prev.map((f) =>
          f.requestId === farmer.requestId ? { ...f, status: "approved" } : f
        )
      );

      // Emit socket event
      if (socketRef.current) {
        socketRef.current.emit("consultationApproved", {
          requestId: farmer.requestId,
          farmerId: farmer.farmerUserId, // Use farmerUserId for socket
          doctorId: doctorId,
          status: "approved",
        });
      }

      toast.success(
        "Consultation approved successfully! Chat is now available.",
        {
          duration: 4000,
          position: "bottom-right",
        }
      );
    } catch (err) {
      console.error("Approval error:", err);
      console.error("Error details:", err.response?.data);

      const errorMessage =
        err.response?.data?.error || "Failed to approve consultation";
      toast.error(errorMessage, {
        duration: 5000,
        position: "bottom-right",
      });
    }
  };

  // ✅ CORRECTED: Update reject function to use farmer object
  const handleRejectConsultation = async (farmer) => {
    try {
      console.log("Rejecting consultation for farmer:", farmer);

      if (!farmer.requestId) {
        console.error("No requestId found for farmer:", farmer);
        toast.error("No consultation request found to reject");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/consultations/${farmer.requestId}/reject`
      );

      setConsultations((prev) => ({ ...prev, [farmer.requestId]: "rejected" }));
      setFarmers((prev) =>
        prev.map((f) =>
          f.requestId === farmer.requestId ? { ...f, status: "rejected" } : f
        )
      );

      if (socketRef.current) {
        socketRef.current.emit("consultationRejected", {
          requestId: farmer.requestId,
          farmerId: farmer.farmerUserId,
          doctorId: doctorId,
          status: "rejected",
        });
      }

      toast.error("Consultation rejected", {
        duration: 4000,
        position: "bottom-right",
      });
    } catch (err) {
      console.error("Error rejecting consultation:", err);
      toast.error("Failed to reject consultation");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // FIXED: Better date formatting with validation
  const formatTime = (date) => {
    if (!date) return "";

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "";

      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error, date);
      return "";
    }
  };

  const formatMessageTime = (date) => {
    if (!date) return "Invalid Date";

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Invalid Date";

      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting message time:", error, date);
      return "Invalid Date";
    }
  };

  const StatusIcon = ({ seen }) =>
    !seen ? (
      <Check className="w-3 h-3 text-gray-400" />
    ) : (
      <CheckCheck className="w-3 h-3 text-green-500" />
    );

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile header */}
      {activeChat && (
        <div className="md:hidden flex items-center justify-between p-3 bg-green-50 border-b border-gray-200">
          <button
            onClick={() => setActiveChat(null)}
            className="p-2 text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <User2 className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-sm text-gray-900">
                {activeChat.fullName}
              </h2>
              <p className="text-xs text-gray-600">
                {consultations[activeChat.requestId] === "approved"
                  ? "Online - Chat Available"
                  : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`bg-white h-full w-full md:w-96 flex-shrink-0 border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
            activeChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
          } ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:relative absolute inset-0 z-10`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {user && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                    <User2 className="h-5 w-5 text-white" />
                  </div>
                )}
                <h1 className="text-xl font-bold text-gray-900">
                  Your Farmers
                </h1>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            {/* // In your sidebar header, add this after the search input: */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
              >
                <option value="active">Active (Pending & Approved)</option>
                <option value="pending">Pending Only</option>
                <option value="approved">Approved Only</option>
                <option value="completed">Completed</option>
                <option value="all">All Consultations</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500"
              />
            </div>
          </div>

          {/* Farmers list */}
          <div className="overflow-y-auto h-full pb-20 bg-white">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading farmers...
              </div>
            ) : filteredFarmers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm
                  ? "No farmers found"
                  : "No consultation requests yet"}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredFarmers.map((farmer) => {
                  const uniqueKey = `${farmer._id}-${
                    farmer.requestId || "no-request"
                  }`;

                  return (
                    <div
                      key={uniqueKey}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-2 ${
                        selectedFarmer?._id === farmer._id
                          ? "bg-blue-50 border-l-blue-500"
                          : "border-l-transparent"
                      }`}
                      onClick={() => openChat(farmer)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                          <User2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="truncate text-base font-semibold text-gray-900">
                              {farmer.fullName}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {farmer.consultationDate
                                ? new Date(
                                    farmer.consultationDate
                                  ).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                          <p className="truncate text-sm text-gray-600">
                            {farmer.email}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {farmer.phone}
                          </p>

                          {/* SIMPLIFIED: Always show animal details if available */}
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Animal: {farmer.animalType}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Breed: {farmer.animalBreed}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Age: {farmer.animalAge}
                              </span>
                            </div>

                            {/* Show symptoms if available */}
                            {farmer.symptoms &&
                              farmer.symptoms !== "Not specified" && (
                                <div className="bg-amber-50 p-2 rounded border border-amber-200">
                                  <div className="font-medium text-amber-700 text-xs mb-1">
                                    Symptoms:
                                  </div>
                                  <div className="text-amber-600 text-xs">
                                    {farmer.symptoms}
                                  </div>
                                </div>
                              )}

                            {/* Consultation Status */}
                            <div className="mt-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  farmer.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : farmer.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : farmer.status === "completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {farmer.status === "approved" && "✅ Approved"}
                                {farmer.status === "pending" &&
                                  "⏳ Pending Approval"}
                                {farmer.status === "completed" &&
                                  "✅ Completed"}
                                {farmer.status === "rejected" && "❌ Rejected"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Last message preview */}
                      {messages[farmer.farmerUserId]?.length > 0 && (
                        <p className="truncate text-sm text-gray-600 mt-2 ml-15">
                          {
                            messages[farmer.farmerUserId][
                              messages[farmer.farmerUserId].length - 1
                            ]?.message
                          }
                        </p>
                      )}

                      {/* Consultation buttons - Show if any consultation is pending */}
                      {farmer.consultations &&
                        farmer.consultations.some(
                          (consultation) =>
                            consultations[consultation.requestId] === "pending"
                        ) && (
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const pendingConsultation =
                                  farmer.consultations.find(
                                    (c) =>
                                      consultations[c.requestId] === "pending"
                                  );
                                if (pendingConsultation) {
                                  handleConfirmConsultation({
                                    ...farmer,
                                    requestId: pendingConsultation.requestId,
                                  });
                                }
                              }}
                              className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors font-medium"
                            >
                              Approve Latest
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const pendingConsultation =
                                  farmer.consultations.find(
                                    (c) =>
                                      consultations[c.requestId] === "pending"
                                  );
                                if (pendingConsultation) {
                                  handleRejectConsultation({
                                    ...farmer,
                                    requestId: pendingConsultation.requestId,
                                  });
                                }
                              }}
                              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div
          className={`flex-1 flex flex-col h-full ${
            activeChat ? "block" : "hidden md:block"
          }`}
        >
          {activeChat ? (
            <>
              {/* Desktop header */}
              <div className="hidden md:flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                    <User2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-900">
                      {activeChat.fullName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {activeChat.email} • {activeChat.phone}
                    </p>

                    {/* ALWAYS show animal details in chat header */}
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-blue-50 p-1 rounded text-center">
                        <div className="font-medium text-blue-700">Animal</div>
                        <div className="text-blue-600">
                          {activeChat.animalType}
                        </div>
                      </div>
                      <div className="bg-green-50 p-1 rounded text-center">
                        <div className="font-medium text-green-700">Breed</div>
                        <div className="text-green-600">
                          {activeChat.animalBreed}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-1 rounded text-center">
                        <div className="font-medium text-purple-700">Age</div>
                        <div className="text-purple-600">
                          {activeChat.animalAge}
                        </div>
                      </div>
                    </div>

                    {/* Show symptoms if available */}
                    {activeChat.symptoms &&
                      activeChat.symptoms !== "Not specified" && (
                        <div className="mt-2 bg-amber-50 p-2 rounded border border-amber-200">
                          <div className="font-medium text-amber-700 text-xs">
                            Symptoms:
                          </div>
                          <div className="text-amber-600 text-xs mt-1">
                            {activeChat.symptoms}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-600 hover:text-gray-900 p-2 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-600 hover:text-gray-900 p-2 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
                style={{
                  maxHeight: "calc(100vh - 140px)",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              >
                {selectedFarmer &&
                messages[selectedFarmer.farmerUserId]?.length > 0 ? (
                  messages[selectedFarmer.farmerUserId]?.map((msg, index) => {
                    return (
                      <motion.div
                        key={msg._id || `${msg.timestamp}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${
                          msg.sender === "doctor"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex flex-col max-w-[70%] ${
                            msg.sender === "doctor"
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              msg.sender === "doctor"
                                ? "bg-green-500 text-white rounded-br-md"
                                : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {msg.message}
                            </p>
                          </div>
                          <div className="flex items-center mt-1 space-x-1 px-1">
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(msg.timestamp)}
                            </span>
                            {msg.sender === "doctor" && (
                              <StatusIcon seen={msg.seen} />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User2 className="w-10 h-10 text-green-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {activeChat?.fullName}
                      </p>

                      {/* Show consultation details for pending requests */}
                      {consultations[activeChat?.requestId] === "pending" && (
                        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 text-left">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Consultation Request Details
                          </h4>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Animal:
                              </span>
                              <p className="text-sm text-gray-600">
                                {activeChat.animalType}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Breed:
                              </span>
                              <p className="text-sm text-gray-600">
                                {activeChat.animalBreed}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Age:
                              </span>
                              <p className="text-sm text-gray-600">
                                {activeChat.animalAge}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-sm font-medium text-gray-700">
                                Symptoms:
                              </span>
                              <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                                {activeChat.symptoms || "No symptoms provided"}
                              </p>
                            </div>
                          </div>

                          {/* Action buttons for pending consultations */}
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() =>
                                handleConfirmConsultation(activeChat)
                              }
                              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                            >
                              Approve Consultation
                            </button>
                            <button
                              onClick={() =>
                                handleRejectConsultation(activeChat)
                              }
                              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}

                      <p className="text-sm">
                        {activeChat &&
                        consultations[activeChat.requestId] === "approved"
                          ? "Send a message to start the conversation"
                          : consultations[activeChat.requestId] === "pending"
                          ? "Review the consultation request details above"
                          : "Approve the consultation to enable chat"}
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={!isChatAvailable(activeChat)}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-300">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={
                        isChatAvailable(activeChat)
                          ? "Type a message..."
                          : "Approve the consultation to enable chat"
                      }
                      disabled={!isChatAvailable(activeChat)}
                      className="w-full bg-transparent border-none text-gray-900 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none resize-none max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
                      rows="1"
                    />
                  </div>
                  {message.trim() && isChatAvailable(activeChat) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm"
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={!isChatAvailable(activeChat)}
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={!isChatAvailable(activeChat)}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <User2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Select a farmer to start chatting
              </h3>
              <p className="text-sm text-center max-w-md">
                Your conversations with farmers will appear here. <br />
                Approve consultations to enable messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
