import { useState, useRef, useEffect } from "react"
import { ArrowLeft, ImageIcon, Send, Mic, X, Check, Clock } from "lucide-react"
import ChatBubble from "./ChatBubble_Farmer"

export default function ChatWindow({ expert, messages, onSendMessage, onBackClick }) {
  const [newMessage, setNewMessage] = useState("")
  const [attachments, setAttachments] = useState([])
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage.trim(), attachments)
      setNewMessage("")
      setAttachments([])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAttachments((prev) => [...prev, e.target.result])
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        {onBackClick && (
          <button onClick={onBackClick} className="mr-2 p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}
        <div className="flex items-center">
          <div className="relative">
            <img
              src={expert.profilePicture || "/placeholder.svg"}
              alt={expert.name}
              className="h-10 w-10 rounded-full object-cover border border-gray-200"
            />
            <span
              className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                expert.isOnline ? "bg-green-400" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{expert.name}</p>
            <p className="text-xs text-gray-500">{expert.specialization}</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} formatTime={formatTime} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="p-2 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                <img
                  src={attachment || "/placeholder.svg"}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute top-0 right-0 p-1 bg-gray-800 bg-opacity-50 rounded-bl-md"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none min-h-[40px] max-h-[120px]"
              rows={1}
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              multiple
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
              title="Attach image"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600" title="Voice message">
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && attachments.length === 0}
              className={`p-2 rounded-full ${
                !newMessage.trim() && attachments.length === 0
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}