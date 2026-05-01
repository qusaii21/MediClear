"use client"

import { useState, useRef, useEffect } from "react"
import "../styles/Chatbot.css"
import axios from "axios";

function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hello! I'm your MediConnect AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return;
  
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
  
    try {
      // Retrieve patient_id from localStorage
      const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));
      const patientId = patientDetails?.patient_id;
  
      if (!patientId) {
        throw new Error("Patient ID not found. Please log in again.");
      }
  
      // Send the user message to the backend
      const response = await axios.post("http://localhost:4002/chat", {
        question: input,
        patient_id: patientId, // Include patient_id in the request
      });
  
      // Add the bot's response to the chat
      const botMessage = {
        id: Date.now().toString(),
        content: response.data.response || "I'm sorry, I couldn't process your request.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      const errorMessage = {
        id: Date.now().toString(),
        content: "An error occurred while communicating with the chatbot. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <i className="fas fa-stethoscope"></i>
          <h3>MediConnect Assistant</h3>
        </div>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}>
            {message.sender === "bot" && (
              <div className="avatar">
                <i className="fas fa-robot"></i>
              </div>
            )}

            <div className="message-content">
              <p>{message.content}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {message.sender === "user" && (
              <div className="avatar user-avatar">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message bot-message">
            <div className="avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  )
}

export default Chatbot

