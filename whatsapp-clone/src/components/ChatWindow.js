import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  ref,
  onChildAdded,
  push,
  set,
  off
} from "firebase/database";
import "./ChatWindow.css";

function ChatWindow({ currentUser, targetUser }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // For auto-scroll
  const textareaRef = useRef(null); // For dynamic height

  const isValidChat =
    currentUser && targetUser && currentUser.phone && targetUser.phone;

  const chatId = isValidChat
    ? currentUser.phone < targetUser.phone
      ? `${currentUser.phone}_${targetUser.phone}`
      : `${targetUser.phone}_${currentUser.phone}`
    : null;

  useEffect(() => {
    if (!isValidChat) return;

    const messagesRef = ref(db, `chats/${chatId}/messages`);

    const messageListener = onChildAdded(messagesRef, (snapshot) => {
      const msg = snapshot.val();

      setMessages((prevMessages) => {
        if (!prevMessages.some((message) => message.timestamp === msg.timestamp)) {
          return [...prevMessages, msg];
        }
        return prevMessages;
      });
    });

    return () => off(messagesRef, "child_added", messageListener);
  }, [chatId, isValidChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (text.trim() === "" || !isValidChat) return;

    const newMessage = {
      text,
      sender: currentUser.phone,
      timestamp: Date.now()
    };

    const newMsgRef = push(ref(db, `chats/${chatId}/messages`));
    await set(newMsgRef, newMessage);

    setText("");
  };

  const handleInputChange = (e) => {
    setText(e.target.value);

    const el = textareaRef.current;
    if (el) {
      el.style.height = "30px"; // Reset first
      el.style.height = Math.min(el.scrollHeight, 80) + "px";
    }
  };

  return (
    <div className="chat-window">
      {!isValidChat ? (
        <div>Loading chat...</div>
      ) : (
        <>
          <div className="chat-header">
            <h3>{targetUser.username || "User"}</h3>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => {
              const isSender = msg.sender === currentUser.phone;

              return (
                <div
                  key={idx}
                  className={`message-row ${isSender ? "sent" : "received"}`}
                >
                  <div className="message-bubble">{msg.text}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <textarea
              ref={textareaRef}
              className="chat-input-field"
              value={text}
              onChange={handleInputChange}
              placeholder="Andika ubutumwa..."
              rows={1}
              style={{ height: "30px" }}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
