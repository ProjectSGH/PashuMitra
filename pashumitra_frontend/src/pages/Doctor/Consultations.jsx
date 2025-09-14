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
  Search,
} from "lucide-react";
import axios from "axios";

export default function DoctorChat() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ DoctorId from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?._id;

  // ✅ initialize socket
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => ({
        ...prev,
        [newMessage.farmerId]: [
          ...(prev[newMessage.farmerId] || []),
          newMessage,
        ],
      }));
    });

    return () => socket.disconnect();
  }, []);

  // ✅ Fetch farmers
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/doctor/${doctorId}/farmers`
        );
        setFarmers(res.data);

        const initialMessages = {};
        res.data.forEach((f) => (initialMessages[f._id] = []));
        setMessages(initialMessages);
      } catch (err) {
        console.error("Error fetching farmers:", err);
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchFarmers();
  }, [doctorId]);

  // ✅ Open chat
  const openChat = (farmer) => {
    setSelectedFarmer(farmer);
    setActiveChat(farmer);
    setShowSidebar(false);

    if (socketRef.current) {
      socketRef.current.emit("joinRoom", {
        farmerId: farmer._id,
        doctorId,
      });
    }

    fetchMessages(farmer._id);
  };

  // ✅ Fetch messages
  const fetchMessages = async (farmerId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/messages/${farmerId}/${doctorId}`
      );
      setMessages((prev) => ({ ...prev, [farmerId]: res.data }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!selectedFarmer || !message.trim()) return;

    try {
      const newMessage = {
        farmerId: selectedFarmer._id,
        doctorId,
        sender: "doctor",
        message,
      };

      await axios.post("http://localhost:5000/api/chat/send", newMessage);

      if (socketRef.current) {
        socketRef.current.emit("sendMessage", newMessage);
      }

      setMessage("");
      fetchMessages(selectedFarmer._id);
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

  const StatusIcon = ({ seen }) =>
    !seen ? (
      <Check className="w-3 h-3 text-gray-400" />
    ) : (
      <CheckCheck className="w-3 h-3 text-blue-600" />
    );

  // Filter farmers based on search term
  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header for chat view */}
      {activeChat && (
        <div className="md:hidden flex items-center justify-between p-3 bg-blue-600 text-white">
          <button onClick={() => setActiveChat(null)} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <User2 className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-semibold text-sm">{activeChat.fullName}</h2>
          </div>
          <button className="p-2">
            <Phone className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex h-screen">
        {/* Sidebar for farmers list */}
        <div
          className={`bg-white h-full w-full md:w-96 flex-shrink-0 border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
            activeChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
          } ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:relative absolute inset-0 z-10`}
        >
          {/* Sidebar header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Your Farmers</h1>
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden text-gray-500"
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
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Farmers list */}
          <div className="overflow-y-auto h-full pb-20">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : filteredFarmers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? "No farmers found" : "No farmers yet"}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredFarmers.map((farmer) => (
                  <div
                    key={farmer._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedFarmer?._id === farmer._id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => openChat(farmer)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                        <User2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-gray-900">
                          {farmer.fullName || farmer.email}
                        </h3>
                        <p className="truncate text-sm text-gray-500">
                          {farmer.phone || "No phone"}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {messages[farmer._id]?.length > 0 &&
                          formatTime(
                            messages[farmer._id][
                              messages[farmer._id].length - 1
                            ].timestamp
                          )}
                      </div>
                    </div>
                    {messages[farmer._id]?.length > 0 && (
                      <p className="truncate text-sm text-gray-600 mt-1 ml-15">
                        {
                          messages[farmer._id][messages[farmer._id].length - 1]
                            .message
                        }
                      </p>
                    )}
                  </div>
                ))}
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
              <div className="hidden md:flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                    <User2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {activeChat.fullName}
                    </h2>
                    <p className="text-sm text-gray-500">{activeChat.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md"
                  >
                    <Phone className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveChat(null)}
                    className="md:hidden flex items-center gap-1 text-sm bg-blue-600 px-3 py-2 rounded-lg hover:bg-blue-700 shadow-md text-white"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </motion.button>
                </div>
              </div>

              {/* Messages area - Fixed height with proper flexbox constraints */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
                style={{ maxHeight: "calc(100vh - 130px)" }}
              >
                {messages[selectedFarmer?._id]?.length > 0 ? (
                  messages[selectedFarmer?._id]?.map((msg) => (
                    <motion.div
                      key={msg._id}
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
                        className={`flex flex-col max-w-[75%] ${
                          msg.sender === "doctor" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl shadow-sm ${
                            msg.sender === "doctor"
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
                          {msg.sender === "doctor" && (
                            <StatusIcon seen={msg.seen} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No messages yet</p>
                      <p className="text-sm">
                        Start a conversation with {activeChat.fullName}
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input - Fixed position at bottom */}
              <div className="border-t border-gray-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </div>
            </>
          ) : (
            // Empty state when no chat is selected
            <div className="hidden md:flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
              <MessageCircle className="w-24 h-24 mb-4 text-gray-300" />
              <h3 className="text-xl font-medium">
                Select a farmer to start chatting
              </h3>
              <p className="mt-2">Your conversations will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around">
        <button
          onClick={() => setShowSidebar(true)}
          className="flex flex-col items-center p-2 text-gray-600"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Chats</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-600">
          <User2 className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}
