import React, { useState } from "react";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi 👋 I can help plan your trip!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();

      const botMessage = {
        text: data?.reply || "No response from AI",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        { text: "Error connecting to AI 😢", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 💬 Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        💬
      </button>

      {/* 🪟 Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-xl p-4 flex flex-col">
          {/* Messages */}
          <div className="h-60 overflow-y-auto mb-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`px-3 py-2 rounded-lg inline-block ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="text-left text-sm text-gray-500">
                Typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-2 flex-1 rounded-lg outline-none"
              placeholder="Ask about trips..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-3 rounded-lg hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
