"use client";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User2,
  Phone,
  ArrowLeft,
  Check,
  CheckCheck,
  Send,
  MessageCircle,
} from "lucide-react";
import axios from "axios";

export default function ConsultDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping] = useState(false); // placeholder typing indicator
  const [messages, setMessages] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const socketRef = useRef(null);

  // ✅ initialize socket only once
  useEffect(() => {
    const socket = io("http://localhost:5000"); // no transports
    socketRef.current = socket;

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => ({
        ...prev,
        [newMessage.doctorId]: [
          ...(prev[newMessage.doctorId] || []),
          newMessage,
        ],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ✅ get farmerId from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const farmerId = user?._id;

  // ✅ Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/doctors");
        setDoctors(res.data);

        // initialize empty message threads
        const initialMessages = {};
        res.data.forEach((doc) => {
          initialMessages[doc._id] = [];
        });
        setMessages(initialMessages);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // ✅ Open chat with a doctor
  const openChat = (doctor) => {
    setSelectedDoctor(doctor);
    setActiveChat(doctor);

    if (socketRef.current) {
      socketRef.current.emit("joinRoom", {
        farmerId,
        doctorId: doctor._id,
      });
    }

    fetchMessages(doctor._id);
  };

  // ✅ Fetch messages from backend
  const fetchMessages = async (doctorId) => {
    try {
      const farmer = JSON.parse(localStorage.getItem("user"));
      const farmerId = farmer?._id;

      const res = await axios.get(
        `http://localhost:5000/api/chat/messages/${farmerId}/${doctorId}`
      );

      setMessages((prev) => ({
        ...prev,
        [doctorId]: res.data,
      }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!selectedDoctor || !message.trim()) return;

    try {
      const farmer = JSON.parse(localStorage.getItem("user"));
      const farmerId = farmer?._id;

      const newMessage = {
        farmerId,
        doctorId: selectedDoctor._id,
        sender: "farmer",
        message,
      };

      // save to DB
      await axios.post("http://localhost:5000/api/chat/send", newMessage);

      // emit through socket
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", newMessage);
      }

      setMessage("");
      fetchMessages(selectedDoctor._id);
    } catch (err) {
      console.error("Error sending message:", err);
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
      hour: "2-digit",
      minute: "2-digit",
    });

  // ✅ Seen / Delivered icon
  const StatusIcon = ({ seen }) => {
    if (!seen) return <Check className="w-3 h-3 text-gray-400" />;
    return <CheckCheck className="w-3 h-3 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="container mx-auto">
        <motion.div
          className="flex h-[85vh] rounded-xl overflow-hidden bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left: Doctors List */}
          <motion.div
            animate={{ width: activeChat ? "35%" : "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`
              overflow-y-auto p-4 border-r bg-gray-50
              ${activeChat ? "hidden md:block" : "block"} 
              w-full md:w-auto
            `}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Consult a Doctor
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex flex-col space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-gray-200 rounded-xl w-full"
                    ></div>
                  ))}
                </div>
              </div>
            ) : doctors.length === 0 ? (
              <p className="text-gray-500">No doctors available right now.</p>
            ) : (
              <div
                className={`grid ${
                  activeChat ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
                } gap-6`}
              >
                {doctors.map((doctor) => (
                  <motion.article
                    key={doctor._id}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-xl border bg-white p-4 shadow-sm relative overflow-hidden"
                  >
                    {/* Online status */}
                    <div className="absolute top-4 right-4">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex items-center gap-3">
                      {doctor.doctorProfile?.imageUrl ? (
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={doctor.doctorProfile.imageUrl}
                          alt={doctor.doctorProfile?.fullName}
                          className="h-12 w-12 rounded-full object-cover border-2 border-blue-100"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          <User2 className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold">
                          {doctor.doctorProfile?.fullName}
                        </h3>
                        <p className="truncate text-sm text-gray-500">
                          {doctor.doctorProfile?.specialization}
                        </p>
                      </div>

                      {/* Mobile Chat Button */}
                      <button
                        onClick={() => openChat(doctor)}
                        className="md:hidden bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>

                    {/* Fee + Experience */}
                    <div className="mt-3 text-sm text-gray-600">
                      <div>
                        {doctor.doctorProfile?.experience} yrs experience
                      </div>
                      <div>Fee: ₹{doctor.doctorProfile?.fee || 300}</div>
                    </div>

                    {/* Chat Button desktop */}
                    <div className="mt-4 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openChat(doctor)}
                        className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700"
                      >
                        <MessageCircle size={16} /> Chat
                      </motion.button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Chat Panel */}
          <AnimatePresence>
            {activeChat && (
              <motion.div
                key="chat-panel"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col h-full w-full bg-white"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3 bg-blue-600 text-white relative">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onMouseEnter={() => setShowProfile(true)}
                    onMouseLeave={() => setShowProfile(false)}
                  >
                    {activeChat.doctorProfile?.imageUrl ? (
                      <img
                        src={activeChat.doctorProfile.imageUrl}
                        alt={activeChat.doctorProfile?.fullName}
                        className="h-10 w-10 rounded-full object-cover border-2 border-blue-400"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                        <User2 className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold">
                        {activeChat.doctorProfile?.fullName}
                      </h2>
                      <p className="text-sm text-white/80">
                        {activeChat.doctorProfile?.specialization}
                      </p>
                    </div>

                    {/* Hover profile card */}
                    <AnimatePresence>
                      {showProfile && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-14 left-4 w-64 p-4 bg-white text-gray-800 rounded-xl shadow-xl z-50"
                        >
                          <h3 className="font-semibold text-lg">
                            {activeChat.doctorProfile?.fullName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {activeChat.doctorProfile?.specialization}
                          </p>
                          <p className="text-sm text-gray-600">
                            Experience: {activeChat.doctorProfile?.experience}{" "}
                            yrs
                          </p>
                          <p className="text-sm text-gray-600">
                            Fee: ₹{activeChat.doctorProfile?.fee || 300}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Call Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md"
                    >
                      <Phone className="w-5 h-5" />
                    </motion.button>

                    {/* Back Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveChat(null)}
                      className="flex items-center gap-1 text-sm bg-blue-700 px-3 py-2 rounded-lg hover:bg-blue-800 shadow-md"
                    >
                      <ArrowLeft className="w-4 h-4" />{" "}
                      <span className="hidden md:inline">Back</span>
                    </motion.button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages[selectedDoctor?._id]?.map((msg) => (
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
                        className={`flex flex-col max-w-[75%] ${
                          msg.sender === "farmer" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl shadow-sm ${
                            msg.sender === "farmer"
                              ? "bg-blue-100 rounded-br-none"
                              : "bg-white rounded-bl-none border"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <div className="flex items-center mt-1 space-x-1">
                          <span className="text-xs text-gray-500">
                            {formatTime(msg.timestamp)}
                          </span>
                          {msg.sender === "farmer" && (
                            <StatusIcon seen={msg.seen} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white p-3 rounded-2xl rounded-bl-none">
                        <div className="flex space-x-1">
                          {[0, 0.2, 0.4].map((delay, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-gray-500 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t bg-white p-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={`rounded-full p-3 ${
                      message.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
