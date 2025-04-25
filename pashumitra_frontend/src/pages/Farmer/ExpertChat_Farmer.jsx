"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ArrowLeft, ImageIcon, Send, Mic, X, Check, Clock } from "lucide-react"
import ExpertList from "../../components/Farmer/ExpertChat_Farmer/ExpertList_Farmer"
import ChatWindow from "../../components/Farmer/ExpertChat_Farmer/ChatWindow_Farmer"

// Mock data for experts
const initialExperts = [
  {
    id: "exp-1",
    name: "Dr. Sarah Johnson",
    profilePicture: "/placeholder.svg?height=200&width=200",
    specialization: "Veterinarian - Large Animals",
    isOnline: true,
    rating: 4.9,
  },
  {
    id: "exp-2",
    name: "Dr. Michael Chen",
    profilePicture: "/placeholder.svg?height=200&width=200",
    specialization: "Veterinarian - Small Animals",
    isOnline: true,
    rating: 4.8,
  },
  {
    id: "exp-3",
    name: "Dr. Emily Rodriguez",
    profilePicture: "/placeholder.svg?height=200&width=200",
    specialization: "Animal Nutritionist",
    isOnline: false,
    rating: 4.7,
    lastActive: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "exp-4",
    name: "Dr. James Wilson",
    profilePicture: "/placeholder.svg?height=200&width=200",
    specialization: "Poultry Specialist",
    isOnline: true,
    rating: 4.6,
  },
  {
    id: "exp-5",
    name: "Dr. Aisha Patel",
    profilePicture: "/placeholder.svg?height=200&width=200",
    specialization: "Livestock Health",
    isOnline: false,
    rating: 4.9,
    lastActive: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: "exp-6",
    name: "Dr. Robert Kim",
    profilePicture: "/placeholder.svg?height=200&width=200",
    specialization: "Equine Specialist",
    isOnline: true,
    rating: 4.7,
  },
]

// Initial messages
const initialMessages = [
  {
    id: "msg-1",
    content: "Welcome to Expert Veterinary Chat! How can I help you today?",
    sender: "expert",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: "read",
    expert: initialExperts[0],
  },
]

function ExpertChatApp() {
  const [experts, setExperts] = useState(initialExperts)
  const [selectedExpert, setSelectedExpert] = useState(null)
  const [messages, setMessages] = useState(initialMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [showChatOnMobile, setShowChatOnMobile] = useState(false)

  // Filter experts based on search query
  const filteredExperts = experts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Select first expert by default
  useEffect(() => {
    if (experts.length > 0 && !selectedExpert) {
      setSelectedExpert(experts[0])
    }
  }, [experts, selectedExpert])

  // Handle sending a new message
  const handleSendMessage = (content, attachments = []) => {
    if (!selectedExpert) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date(),
      attachments,
      status: "sent",
    }

    setMessages((prev) => [...prev, newMessage])

    // Simulate expert typing
    setTimeout(() => {
      const expertIsTyping = {
        id: `typing-${Date.now()}`,
        content: "",
        sender: "expert",
        timestamp: new Date(),
        status: "typing",
        expert: selectedExpert,
      }

      setMessages((prev) => [...prev, expertIsTyping])
    }, 1000)

    // Simulate expert response
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.status !== "typing"))

      const expertResponse = {
        id: `msg-${Date.now() + 1}`,
        content: `Thank you for your message. I'll look into this issue with your ${
          attachments.length > 0 ? "animal based on the images" : "animal"
        } and provide advice shortly.`,
        sender: "expert",
        timestamp: new Date(),
        status: "sent",
        expert: selectedExpert,
      }

      setMessages((prev) => [...prev, expertResponse])
    }, 3000)
  }

  const handleExpertSelect = (expert) => {
    setSelectedExpert(expert)
    setShowChatOnMobile(true)
  }

  const handleBackToExperts = () => {
    setShowChatOnMobile(false)
  }

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Expert Veterinary Chat</h1>
          <p className="text-gray-600">Get real-time advice for your animal health concerns</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Expert list - hide on mobile when chat is shown */}
        {(!showChatOnMobile) && (
          <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white">
            <ExpertList
              experts={filteredExperts}
              selectedExpert={selectedExpert}
              onSelectExpert={handleExpertSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}

        {/* Chat window */}
        {(showChatOnMobile) && selectedExpert && (
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
            <ChatWindow
              expert={selectedExpert}
              messages={messages.filter((msg) => !msg.expert || msg.expert.id === selectedExpert.id)}
              onSendMessage={handleSendMessage}
              onBackClick={handleBackToExperts}
            />
          </div>
        )}
      </div>
    </main>
  )
}

export default ExpertChatApp