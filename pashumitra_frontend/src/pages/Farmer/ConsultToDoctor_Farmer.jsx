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
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ConsultDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [consultationStatus, setConsultationStatus] = useState({});
  const [consultationDetails, setConsultationDetails] = useState({});

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const farmerId = user?._id;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedDoctor]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    // Join farmer's personal room for notifications
    if (farmerId) {
      socket.emit("joinUserRoom", farmerId);
    }

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => ({
        ...prev,
        [newMessage.doctorId]: [
          ...(prev[newMessage.doctorId] || []),
          newMessage,
        ],
      }));
    });

    // Listen for consultation status updates
    socket.on("consultationStatusChanged", (data) => {
      if (data.doctorId) {
        setConsultationStatus(prev => ({
          ...prev,
          [data.doctorId]: data.status
        }));
        
        // Update consultation details if available
        if (data.consultationDetails) {
          setConsultationDetails(prev => ({
            ...prev,
            [data.doctorId]: data.consultationDetails
          }));
        }

        if (data.status === "approved") {
          toast.success(`Consultation with Dr. ${data.doctorName} has been approved! Chat is now available.`);
          
          // Auto-open chat if this doctor is selected
          if (selectedDoctor?._id === data.doctorId) {
            setActiveChat(selectedDoctor);
            if (socketRef.current) {
              socketRef.current.emit("joinRoom", { farmerId, doctorId: data.doctorId });
            }
            fetchMessages(data.doctorId);
          }
        } else if (data.status === "rejected") {
          toast.error(`Consultation with Dr. ${data.doctorName} was rejected.`);
        }
      }
    });

    return () => socket.disconnect();
  }, [farmerId, selectedDoctor]);

  // Enhanced function to fetch consultation status
  const fetchConsultationStatus = async (doctorId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/consultations/status/${doctorId}/${farmerId}`
      );
      return response.data;
    } catch (err) {
      console.log(`No consultation found for doctor ${doctorId}`);
      return { status: "none", consultation: null };
    }
  };

  // Fetch doctors with consultation status
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/doctors");
        const docs = res.data;

        const docsWithSchedule = await Promise.all(
          docs.map(async (doc) => {
            try {
              const schedRes = await axios.get(
                `http://localhost:5000/api/schedules/${doc._id}`
              );
              
              // Fetch consultation status for each doctor
              const consultationData = await fetchConsultationStatus(doc._id);
              
              // Update states
              setConsultationStatus(prev => ({
                ...prev,
                [doc._id]: consultationData.status
              }));
              
              if (consultationData.consultation) {
                setConsultationDetails(prev => ({
                  ...prev,
                  [doc._id]: consultationData.consultation
                }));
              }

              return { 
                ...doc, 
                schedule: schedRes.data,
                consultationStatus: consultationData.status,
                consultation: consultationData.consultation
              };
            } catch {
              return { ...doc, schedule: null, consultationStatus: "none", consultation: null };
            }
          })
        );

        setDoctors(docsWithSchedule);

        const initialMessages = {};
        docsWithSchedule.forEach((doc) => {
          initialMessages[doc._id] = [];
        });
        setMessages(initialMessages);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (farmerId) {
      fetchDoctors();
    }
  }, [farmerId]);

  const parseTimeToMinutes = (t) => {
    if (!t) return null;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const weekdayNames = [
    "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",
  ];

  const isDoctorAvailableNow = (schedule) => {
    if (!schedule) return false;
    const now = new Date();
    const day = weekdayNames[now.getDay()];
    const ds = schedule[day];
    if (!ds || !ds.available) return false;
    const start = parseTimeToMinutes(ds.startTime);
    const end = parseTimeToMinutes(ds.endTime);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    if (start === null || end === null) return false;
    return nowMin >= start && nowMin <= end;
  };

  const findNextAvailableSlot = (schedule) => {
    if (!schedule) return null;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const check = new Date();
      check.setDate(today.getDate() + i);
      const dayName = weekdayNames[check.getDay()];
      const ds = schedule[dayName];
      if (ds && ds.available && ds.startTime) {
        const [h, m] = ds.startTime.split(":").map(Number);
        const slotDate = new Date(
          check.getFullYear(), check.getMonth(), check.getDate(), h, m
        );
        return {
          day: dayName,
          dateISO: slotDate.toISOString(),
          startTime: ds.startTime,
          endTime: ds.endTime || `${h + 1}:${m.toString().padStart(2, '0')}`,
        };
      }
    }
    return null;
  };

  // Check if consultation is approved - chat available immediately after approval
  const isConsultationApproved = (doctorId) => {
    const consultation = consultationDetails[doctorId];
    return consultation && consultation.status === "approved";
  };

  const openChat = async (doctor) => {
    setSelectedDoctor(doctor);
    const status = consultationStatus[doctor._id];
    const consultationApproved = isConsultationApproved(doctor._id);

    console.log("Opening chat:", {
      doctor: doctor.doctorProfile?.fullName,
      status,
      consultationApproved
    });

    if (status === "approved") {
      // Consultation is approved - open chat immediately
      setActiveChat(doctor);
      setShowSidebar(false);
      
      if (socketRef.current) {
        socketRef.current.emit("joinRoom", { farmerId, doctorId: doctor._id });
      }
      fetchMessages(doctor._id);
      
      toast.success("Chat session started!");
    } else if (status === "pending") {
      toast.error("Your consultation request is pending approval. Please wait for the doctor to approve it.");
    } else if (status === "rejected") {
      toast.error("Your consultation request was rejected. Please request a new consultation.");
    } else {
      // No consultation - show request modal
      const nextSlot = findNextAvailableSlot(doctor.schedule);
      if (!nextSlot) {
        toast.error("Doctor is not available and no slots configured.");
        return;
      }
      setModalData({ doctor, slot: nextSlot });
    }
  };

  const confirmConsultation = async () => {
    const { doctor, slot } = modalData;
    
    try {
      const payload = {
        doctorId: doctor._id,
        farmerId,
        date: slot.dateISO.split('T')[0], // Send only date part
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
      
      console.log("Sending consultation request:", payload);
      
      const response = await axios.post("http://localhost:5000/api/consultations", payload);

      // Update consultation status
      setConsultationStatus(prev => ({
        ...prev,
        [doctor._id]: "pending"
      }));

      setConsultationDetails(prev => ({
        ...prev,
        [doctor._id]: response.data
      }));

      // Emit socket event for real-time notification to doctor
      if (socketRef.current) {
        socketRef.current.emit("consultationRequest", {
          doctorId: doctor._id,
          farmerId,
          date: payload.date,
          startTime: payload.startTime,
          doctorName: doctor.doctorProfile?.fullName
        });
      }

      toast.success(
        `Consultation requested for ${slot.day} ${new Date(slot.dateISO).toLocaleDateString()} at ${slot.startTime}. Waiting for doctor approval.`
      );

      setModalData(null);
      setShowSidebar(false);
      
    } catch (err) {
      console.error("Consultation request error:", err);
      
      if (err.response?.status === 409) {
        const errorMessage = err.response.data.message || "You already have a pending consultation with this doctor.";
        toast.error(errorMessage);
        
        setConsultationStatus(prev => ({
          ...prev,
          [doctor._id]: "pending"
        }));
      } else if (err.response?.status === 404) {
        toast.error("Farmer profile not found. Please try again.");
      } else {
        const errorMsg = err.response?.data?.error || "Failed to request consultation. Please try again.";
        toast.error(errorMsg);
      }
    }
  };

  const cancelConsultation = () => {
    setModalData(null);
  };

  const fetchMessages = async (doctorId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/messages/${farmerId}/${doctorId}`
      );
      setMessages((prev) => ({ ...prev, [doctorId]: res.data }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedDoctor || !message.trim()) return;

    // Check if consultation is approved before sending message
    if (!isConsultationApproved(selectedDoctor._id)) {
      toast.error("You can only send messages after consultation is approved.");
      return;
    }

    try {
      const newMessage = {
        farmerId,
        doctorId: selectedDoctor._id,
        sender: "farmer",
        message,
      };

      // Send to backend first
      await axios.post("http://localhost:5000/api/chat/send", newMessage);

      // Emit via socket - the socket response will update the UI
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", newMessage);
      }

      setMessage("");
      
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

  const formatMessageTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit",
    });

  const StatusIcon = ({ seen }) =>
    !seen ? (
      <Check className="w-3 h-3 text-gray-400" />
    ) : (
      <CheckCheck className="w-3 h-3 text-green-500" />
    );

  const getConsultationStatusDisplay = (doctorId) => {
    const status = consultationStatus[doctorId];
    const consultation = consultationDetails[doctorId];
    const isApproved = isConsultationApproved(doctorId);

    switch (status) {
      case "approved":
        return {
          text: "Consultation Approved - Chat Available",
          color: "text-green-600",
          icon: <Check className="w-4 h-4 mr-1" />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case "pending":
        return {
          text: "Pending Approval",
          color: "text-amber-600",
          icon: <Clock className="w-4 h-4 mr-1" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200"
        };
      case "rejected":
        return {
          text: "Consultation Rejected",
          color: "text-red-600",
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      default:
        return {
          text: "Request Consultation",
          color: "text-gray-600",
          icon: <Calendar className="w-4 h-4 mr-1" />,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.doctorProfile?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.doctorProfile?.specialization
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="bottom-right" />

      {/* Consultation Request Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-sm mx-4 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Request Consultation
            </h2>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Request consultation with Dr. {modalData.doctor.doctorProfile?.fullName}
              </p>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800">
                  Selected Slot:
                </p>
                <p className="text-sm text-blue-700">
                  {modalData.slot.day}, {new Date(modalData.slot.dateISO).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-700">
                  {modalData.slot.startTime} - {modalData.slot.endTime}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Fee: ₹{modalData.doctor.doctorProfile?.fee || 0}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Chat will be available immediately after doctor approves your request
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelConsultation}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmConsultation}
                className="flex-1 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors font-medium"
              >
                Request Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile header */}
      {activeChat && (
        <div className="md:hidden flex items-center justify-between p-3 bg-green-50 border-b border-gray-200">
          <button onClick={() => setActiveChat(null)} className="p-2 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {activeChat.doctorProfile?.imageUrl ? (
              <img
                src={activeChat.doctorProfile.imageUrl}
                alt={activeChat.doctorProfile?.fullName}
                className="h-8 w-8 rounded-full object-cover border-2 border-green-500"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <User2 className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="text-left">
              <h2 className="font-semibold text-sm text-gray-900">
                {activeChat.doctorProfile?.fullName}
              </h2>
              <p className="text-xs text-gray-600">
                {isConsultationApproved(activeChat._id) ? "Online" : "Offline"}
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
                  Consult a Doctor
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
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500"
              />
            </div>
          </div>

          {/* Doctors list */}
          <div className="overflow-y-auto h-full pb-20 bg-white">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading doctors...</div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? "No doctors found" : "No doctors available"}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredDoctors.map((doctor) => {
                  const statusDisplay = getConsultationStatusDisplay(doctor._id);
                  return (
                    <div
                      key={doctor._id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-2 ${
                        selectedDoctor?._id === doctor._id 
                          ? "bg-blue-50 border-l-blue-500" 
                          : "border-l-transparent"
                      }`}
                      onClick={() => openChat(doctor)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {doctor.doctorProfile?.imageUrl ? (
                            <img
                              src={doctor.doctorProfile.imageUrl}
                              alt={doctor.doctorProfile?.fullName}
                              className="h-12 w-12 rounded-full object-cover border-2 border-green-500"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                              <User2 className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <span className="absolute bottom-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="truncate text-base font-semibold text-gray-900">
                              {doctor.doctorProfile?.fullName}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {messages[doctor._id]?.length > 0 &&
                                formatTime(
                                  messages[doctor._id][messages[doctor._id].length - 1]?.timestamp
                                )}
                            </span>
                          </div>
                          <p className="truncate text-sm text-gray-600">
                            {doctor.doctorProfile?.specialization}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {doctor.doctorProfile?.experience} yrs • ₹{doctor.doctorProfile?.fee || 0}
                          </p>

                          {/* Consultation Status */}
                          <div className={`mt-2 p-2 rounded-lg border ${statusDisplay.bgColor} ${statusDisplay.borderColor}`}>
                            <div className="flex items-center text-sm font-medium">
                              {statusDisplay.icon}
                              <span className={statusDisplay.color}>
                                {statusDisplay.text}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {messages[doctor._id]?.length > 0 && (
                        <p className="truncate text-sm text-gray-600 mt-2 ml-15">
                          {
                            messages[doctor._id][messages[doctor._id].length - 1]?.message
                          }
                        </p>
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
                  {activeChat.doctorProfile?.imageUrl ? (
                    <img
                      src={activeChat.doctorProfile.imageUrl}
                      alt={activeChat.doctorProfile?.fullName}
                      className="h-10 w-10 rounded-full object-cover border-2 border-green-500"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                      <User2 className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {activeChat.doctorProfile?.fullName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {activeChat.doctorProfile?.specialization} • {
                        isConsultationApproved(activeChat._id) 
                          ? "Chat Available" 
                          : getConsultationStatusDisplay(activeChat._id).text
                      }
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
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              >
                {messages[selectedDoctor?._id]?.length > 0 ? (
                  messages[selectedDoctor?._id]?.map((msg) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        msg.sender === "farmer"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex flex-col max-w-[70%] ${
                          msg.sender === "farmer" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            msg.sender === "farmer"
                              ? "bg-green-500 text-white rounded-br-md"
                              : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <div className="flex items-center mt-1 space-x-1 px-1">
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(msg.timestamp)}
                          </span>
                          {msg.sender === "farmer" && (
                            <StatusIcon seen={msg.seen} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User2 className="w-10 h-10 text-green-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Dr. {activeChat.doctorProfile?.fullName}
                      </p>
                      <p className="text-sm">
                        {isConsultationApproved(activeChat._id) 
                          ? "Send a message to start the conversation" 
                          : getConsultationStatusDisplay(activeChat._id).text}
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-300">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={
                        isConsultationApproved(activeChat?._id) 
                          ? "Type a message..." 
                          : "Chat will be available after consultation approval"
                      }
                      disabled={!isConsultationApproved(activeChat?._id)}
                      className="w-full bg-transparent border-none text-gray-900 placeholder-gray-500 px-4 py-3 text-sm focus:outline-none resize-none max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
                      rows="1"
                    />
                  </div>
                  {message.trim() && isConsultationApproved(activeChat?._id) ? (
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
                        disabled={!isConsultationApproved(activeChat?._id)}
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={!isConsultationApproved(activeChat?._id)}
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
                Select a doctor to start chatting
              </h3>
              <p className="text-sm text-center max-w-md">
                Your conversations with doctors will appear here. <br />
                Start a consultation to begin messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}