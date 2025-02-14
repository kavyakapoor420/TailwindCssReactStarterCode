import { useState } from "react";
import axios from "axios";
import { MessageCircle, Bot, Send, X } from "lucide-react";

const Chatbot = () => {

  const API_KEY='AIzaSyCsA7wL-Xusb21c8oS37CQ9FpwlSGtQf_k'

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle chatbot visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle user message submission
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          contents: [{ parts: [{ text: input }] }]
        },
        {
          params: { key: API_KEY },
          headers: { "Content-Type": "application/json" }
        }
      );

      const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Something went wrong. Try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Chat Icon */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-purple-700 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition"
        >
          <Bot size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 bg-gradient-to-br from-purple-900 to-purple-700 text-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-purple-600">
            <h2 className="text-lg font-semibold">Safire Bot</h2>
            <button onClick={toggleChat} className="text-gray-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 space-y-3 h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm ${
                  msg.sender === "user" ? "bg-purple-500 ml-auto w-fit" : "bg-gray-800 w-fit"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-300">Typing...</div>}
          </div>

          {/* Input Field */}
          <div className="p-3 border-t border-purple-600 flex items-center">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 bg-purple-800 text-white rounded-lg outline-none"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
