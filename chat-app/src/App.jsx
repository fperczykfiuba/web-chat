import React, { useState, useEffect } from "react";
import "./App.css";
import chatScript from "./chatScript.json"; // Import the external script

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScriptActive, setIsScriptActive] = useState(false); // Flag to start the script

  useEffect(() => {
    if (isScriptActive && currentIndex < chatScript.length) {
      const { user, text, color, delay } = chatScript[currentIndex];
      const timeout = setTimeout(() => {
        setMessages((prev) => [...prev, { user, text, color }]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout); // Clean up timeout on unmount
    }
  }, [isScriptActive, currentIndex]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setMessages((prev) => [...prev, { user: "You", text: input, color: "#000" }]);
      setInput(""); // Clear input field
      if (!isScriptActive) {
        setIsScriptActive(true); // Activate the script after the first message
      }
    }
  };

  const clearChat = () => {
    setMessages([]); // Clear all messages
    setCurrentIndex(0); // Reset the script to the beginning
    setIsScriptActive(false); // Deactivate the script
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.user === "You" ? "message-sent" : "message-received"
            }`}
          >
            <strong style={{ color: msg.color }}>{`<${msg.user}>`}</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="controls">
        <form className="message-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
        <button onClick={clearChat} className="clear-button">
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default App;
