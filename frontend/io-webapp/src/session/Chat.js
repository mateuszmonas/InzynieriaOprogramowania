import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import Reactions from "./Reactions";
import "./chat.css";


const Chat = ({ state, dispatch }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [reactionShown, setReactionShown] = useState(false);
  const onReactionClick = () => {
      setReactionShown(!reactionShown);
  }

  const handleEmojiSelect = (emoji) => {
    console.log(emoji);
    setReactionShown(!reactionShown);

    const msg = {
      type: "send", // or type reaction 
      content: emoji.native,
    };

    state.socket.sendMessage(msg);
  }

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
    <div className="chat">
      <div className="chatFooter">
      {!reactionShown &&
        <textarea
          className="chatText"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      }
      {!reactionShown &&
        <div onClick={onReactionClick}>
          <span className="reactionIcon">😀</span>
        </div>
      }
        {reactionShown &&
          <div className="reactions">
            <Reactions
              handleEmojiSelect={handleEmojiSelect}
            />
          </div>
        }
        {!reactionShown &&
          <FiSend
            onClick={(e) => {
              send(e);
            }}
            size={40}
          />
        }
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