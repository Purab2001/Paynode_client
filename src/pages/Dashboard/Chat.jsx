import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProfileImage from "../../ui/ProfileImage";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "HR Team",
      content: "Welcome to the team chat! Feel free to ask any questions.",
      timestamp: "2 hours ago",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Thank you! I'm excited to be here.",
      timestamp: "1 hour ago",
      isOwn: true,
    },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        content: message,
        timestamp: "Just now",
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Team Chat</h1>
          <p className="mt-2 text-gray-600">
            Communicate with your team members and HR
          </p>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              General Chat
            </h2>
            <p className="text-sm text-gray-500">Team discussion and updates</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isOwn ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {!msg.isOwn && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <ProfileImage user={null} size={24} />
                      </div>
                      <p className="text-xs font-medium">{msg.sender}</p>
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.isOwn ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
