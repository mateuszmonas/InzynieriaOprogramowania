import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";

import "./chat.css";

const Chat = ({ state, dispatch }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const parseMessage = (message) => {
    setMessages((messages) => [
      {
        id: message.id,
        username: message.sender,
        message: JSON.parse(message.content),
        time: message.timestamp,
      },
      ...messages,
    ]);
  };

  const send = async (e) => {
    e.preventDefault();
    const msg = {
      type: "send",
      content: message,
    };

    state.socket.sendMessage(msg);
    setMessage("");
  };

  useEffect(() => {
    if (state.stage === "lecturer") {
      if (state.socket) {
        state.socket.addMessageListener(parseMessage);
      }
      return () => {
        if (state.socket) {
          state.socket.removeMessageListener(parseMessage);
        }
      };
    } else {
      console.log("SOCKET CHAT " + state.socket);
      if (state.socket && state.socket.messageListeners.length < 1) {
        state.socket.addMessageListener(parseMessage);
      }
      return () => {
        if (state.socket && state.socket.messageListeners.length > 1) {
          state.socket.removeMessageListener(parseMessage);
        }
      };
    }
  }, [state.setChatVisible, send]);

  return (
    <div
      className="chat"
      style={state.isParticipantsVisible ? { maxHeight: "70%", minHeight: "70%" } : {}}
    >
      <div className="chatFooter">
        <textarea
          style={{resize: "none"}}
          className="chatText"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <FiSend
          onClick={(e) => {
            send(e);
          }}
          size={40}
        />
      </div>
      <div className="chatContent">
        {messages.map((msg) => {
          return (
            <div
              className={
                msg.username === state.username
                  ? "chatMessageBubbleMine"
                  : "chatMessageBubble"
              }
            >
              <h6>[{msg.time}]</h6>
              <h4>{msg.username}:</h4>
              <p>{msg.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
