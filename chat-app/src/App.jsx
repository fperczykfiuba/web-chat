import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import chatScript from "./chatScript.json"; // Import the external script

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScriptActive, setIsScriptActive] = useState(false);
  const messagesEndRef = useRef(null); // Ref to track the latest message

  useEffect(() => {
    if (isScriptActive && currentIndex < chatScript.length) {
      const { user, text, color, delay } = chatScript[currentIndex];
      const timeout = setTimeout(() => {
        setMessages((prev) => [...prev, { user, text, color }]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [isScriptActive, currentIndex]);

  useEffect(() => {
    // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setMessages((prev) => [...prev, { user: "YOU", text: input, color: "rgb(255 224 0)" }]);
      setInput("");
      if (!isScriptActive) {
        setIsScriptActive(true);
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentIndex(0);
    setIsScriptActive(false);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]); // Refocus every time a message is sent

  return (
    <div className="chat-container">
      <div className="chat-window">
              {messages.map((msg, index) => (
        <div
          key={index}
          className={`message-row ${
            msg.user === "YOU" ? "message-sent" : "message-received"
          }`}
        >
          <div className="message-user" style={{ color: msg.color }}>
            <strong>{`< ${msg.user} >`}</strong>
          </div>
          <div className="message-text">{msg.text}</div>
        </div>
      ))}
        {/* Move input field right behind the latest message */}
        <form className="message-form-inline" onSubmit={sendMessage}>
          <input
            ref={inputRef} // Keeps input always focused
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="" // No placeholder text
            autoComplete="off"
          />
        </form>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default App;
