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
      console.log("Socket received message:", newMessage);
      const farmerKey = newMessage.farmerId?.toString();
      
      // Prevent duplicates by checking if message already exists
      setMessages((prev) => {
        const existingMessages = prev[farmerKey] || [];
        const isDuplicate = existingMessages.some(msg => 
          msg._id === newMessage._id || 
          (msg.timestamp === newMessage.timestamp && msg.message === newMessage.message)
        );
        
        if (isDuplicate) {
          console.log("Duplicate message detected, skipping");
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
          toast.success("Consultation approved successfully! Chat is now available.");
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

  // Fetch farmers & consultations - FIXED: Use proper farmer user ID
  const fetchFarmersAndConsultations = async () => {
    try {
      console.log("Fetching consultations for doctor:", doctorId);
      const consultRes = await axios.get(
        `http://localhost:5000/api/consultations/doctor/${doctorId}/requests`
      );

      console.log("Consultations API response:", consultRes.data);

      if (!consultRes.data || consultRes.data.length === 0) {
        console.log("No consultation requests found");
        setFarmers([]);
        setLoading(false);
        return;
      }

      // Create a map to avoid duplicates - Use farmerUserId for chat
      const farmersMap = new Map();

      consultRes.data
        .filter((c) => c && c._id && c.farmerUserId) // Only include items with farmerUserId
        .forEach((c) => {
          const farmerUserKey = c.farmerUserId;
          
          if (!farmersMap.has(farmerUserKey)) {
            farmersMap.set(farmerUserKey, {
              _id: farmerUserKey, // This is the user ID for chat
              requestId: c._id,
              fullName: c.fullName || "Unknown Farmer",
              email: c.email || "",
              phone: c.phone || "No phone",
              status: c.status || "pending",
              consultationDate: c.date,
              startTime: c.startTime,
              endTime: c.endTime,
              fee: c.fee || 0,
            });
          }
        });

      const farmersList = Array.from(farmersMap.values());
      console.log("Processed farmers list for chat:", farmersList);

      const consultMap = {};
      const detailsMap = {};

      farmersList.forEach((f) => {
        if (f.requestId) {
          consultMap[f.requestId] = f.status;
          detailsMap[f.requestId] = {
            date: f.consultationDate,
            startTime: f.startTime,
            endTime: f.endTime,
          };
        }
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

  // Check if chat is allowed
  const isChatAvailable = (farmer) => {
    if (!farmer.requestId || consultations[farmer.requestId] !== "approved") {
      return false;
    }
    return true;
  };

  // Open chat
  const openChat = (farmer) => {
    if (farmer.requestId && !isChatAvailable(farmer)) {
      toast.error(
        "Chat will be available after you approve the consultation.",
        { duration: 4000, position: "bottom-right" }
      );
      return;
    }

    const farmerId = farmer._id.toString();
    setSelectedFarmer(farmer);
    setActiveChat(farmer);
    setShowSidebar(false);

    if (socketRef.current) {
      socketRef.current.emit("joinRoom", {
        farmerId,
        doctorId,
      });
    }

    fetchMessages(farmerId);
  };

  // Fetch messages - FIXED: Remove duplicate socket emission
  const fetchMessages = async (farmerId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/messages/${farmerId}/${doctorId}`
      );
      console.log("Fetched messages:", res.data);
      setMessages((prev) => ({ ...prev, [farmerId]: res.data }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Send message - FIXED: Remove duplicate emission
  const handleSendMessage = async () => {
    if (!selectedFarmer || !message.trim()) return;

    if (!isChatAvailable(selectedFarmer)) {
      toast.error("You can only send messages after approving the consultation.");
      return;
    }

    try {
      const newMessage = {
        farmerId: selectedFarmer._id.toString(),
        doctorId,
        sender: "doctor",
        message,
      };

      console.log("Sending message:", newMessage);

      // Send to backend - the backend will handle socket emission
      await axios.post("http://localhost:5000/api/chat/send", newMessage);

      // DO NOT emit via socket here - backend already does it
      // This was causing duplicate messages

      setMessage("");
      
      // Refresh messages to get the latest from DB
      setTimeout(() => {
        fetchMessages(selectedFarmer._id.toString());
      }, 100);
      
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    }
  };

  // Confirm / Approve consultation
  const handleConfirmConsultation = async (requestId, farmerId) => {
    try {
      console.log("Approving consultation:", requestId);

      const response = await axios.put(
        `http://localhost:5000/api/consultations/${requestId}/approve`
      );

      console.log("Approval response:", response.data);

      setConsultations((prev) => ({ ...prev, [requestId]: "approved" }));
      setFarmers((prev) =>
        prev.map((f) =>
          f.requestId === requestId ? { ...f, status: "approved" } : f
        )
      );

      if (socketRef.current) {
        socketRef.current.emit("consultationApproved", {
          requestId,
          farmerId,
          doctorId,
          status: "approved",
        });
      }

      toast.success("Consultation approved successfully! Chat is now available.", {
        duration: 4000,
        position: "bottom-right",
      });
    } catch (err) {
      console.error("Approval error:", err);
      const errorMessage = err.response?.data?.error || "Failed to approve consultation";
      toast.error(errorMessage, {
        duration: 5000,
        position: "bottom-right",
      });
    }
  };

  const handleRejectConsultation = async (requestId, farmerId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/consultations/${requestId}/reject`
      );

      setConsultations((prev) => ({ ...prev, [requestId]: "rejected" }));
      setFarmers((prev) =>
        prev.map((f) =>
          f.requestId === requestId ? { ...f, status: "rejected" } : f
        )
      );

      if (socketRef.current) {
        socketRef.current.emit("consultationRejected", {
          requestId,
          farmerId,
          doctorId,
          status: "rejected",
        });
      }

      toast.error("Consultation rejected", {
        duration: 4000,
        position: "bottom-right",
      });
    } catch (err) {
      console.error(err);
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
                  const uniqueKey = `${farmer._id}-${farmer.requestId || "no-request"}`;
                  const isApproved = farmer.requestId && consultations[farmer.requestId] === "approved";

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
                              {messages[farmer._id]?.length > 0 &&
                                formatTime(
                                  messages[farmer._id][messages[farmer._id].length - 1]?.timestamp
                                )}
                            </span>
                          </div>
                          <p className="truncate text-sm text-gray-600">
                            {farmer.email}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {farmer.phone}
                          </p>

                          {/* Consultation status */}
                          <div className="mt-1">
                            {farmer.requestId && consultations[farmer.requestId] === "pending" && (
                              <p className="text-sm text-amber-600 font-medium">
                                Pending approval
                              </p>
                            )}
                            {farmer.requestId && consultations[farmer.requestId] === "approved" && (
                              <div>
                                <p className="text-sm text-green-600 font-medium">
                                  ✅ Consultation Approved - Chat Available
                                </p>
                                <p className="text-xs text-gray-500">
                                  Scheduled:{" "}
                                  {new Date(farmer.consultationDate).toLocaleDateString()}{" "}
                                  at {farmer.startTime}
                                </p>
                              </div>
                            )}
                            {farmer.requestId && consultations[farmer.requestId] === "rejected" && (
                              <p className="text-sm text-red-600 font-medium">
                                Consultation rejected
                              </p>
                            )}
                            {!farmer.requestId && (
                              <p className="text-sm text-gray-500">
                                No active consultation
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Last message preview */}
                      {messages[farmer._id]?.length > 0 && (
                        <p className="truncate text-sm text-gray-600 mt-2 ml-15">
                          {
                            messages[farmer._id][messages[farmer._id].length - 1]?.message
                          }
                        </p>
                      )}

                      {/* Consultation buttons */}
                      {farmer.requestId && consultations[farmer.requestId] === "pending" && (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmConsultation(farmer.requestId, farmer._id);
                            }}
                            className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectConsultation(farmer.requestId, farmer._id);
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
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {activeChat.fullName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {activeChat.email} •{" "}
                      {consultations[activeChat.requestId] === "approved"
                        ? "Online - Chat Available"
                        : "Chat not available"}
                    </p>
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
                {messages[selectedFarmer?._id?.toString()]?.length > 0 ? (
                  messages[selectedFarmer._id.toString()]?.map((msg, index) => {
                    // Debug log to see what we're rendering
                    console.log(`Rendering message ${index}:`, msg);
                    
                    return (
                      <motion.div
                        key={msg._id || `${msg.timestamp}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${
                          msg.sender === "doctor" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex flex-col max-w-[70%] ${
                            msg.sender === "doctor" ? "items-end" : "items-start"
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
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User2 className="w-10 h-10 text-green-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {activeChat.fullName}
                      </p>
                      <p className="text-sm">
                        {consultations[activeChat.requestId] === "approved"
                          ? "Send a message to start the conversation"
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