import { Check, Clock } from "lucide-react"

export default function ChatBubble({ message, formatTime }) {
  const isUser = message.sender === "user"
  const isTyping = message.status === "typing"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] ${
          isUser
            ? "bg-blue-600 text-white rounded-t-lg rounded-bl-lg"
            : "bg-white text-gray-800 border border-gray-200 rounded-t-lg rounded-br-lg"
        } ${isTyping ? "animate-pulse" : ""}`}
      >
        {!isUser && message.expert && (
          <div className="flex items-center p-2 border-b border-gray-100">
            <img
              src={message.expert.profilePicture || "/placeholder.svg"}
              alt={message.expert.name}
              className="h-6 w-6 rounded-full object-cover mr-2"
            />
            <span className="text-xs font-medium">{message.expert.name}</span>
          </div>
        )}

        <div className="p-3">
          {isTyping ? (
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
              <div
                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "600ms" }}
              ></div>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap break-words">{message.content}</p>

              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {message.attachments.map((attachment, index) => (
                    <img
                      key={index}
                      src={attachment || "/placeholder.svg"}
                      alt={`Attachment ${index + 1}`}
                      className="rounded-md max-h-40 w-auto object-cover cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {!isTyping && (
          <div className={`px-3 pb-1 flex items-center justify-end ${isUser ? "text-blue-200" : "text-gray-400"}`}>
            <span className="text-xs">{formatTime(new Date(message.timestamp))}</span>
            {isUser && (
              <span className="ml-1">
                {message.status === "sent" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}