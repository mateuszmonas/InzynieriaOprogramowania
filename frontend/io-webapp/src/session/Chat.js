import React, { useEffect, useState } from "react";

const Chat = ({ state, dispatch }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const parseMessage = (message) => {
    console.log(message);
    setMessages((messages) => [
      {
        id: message.id,
        username: message.sender,
        message: message.content,
        time: message.timestamp,
      },
      ...messages,
    ]);
  };

  const send = async (e) => {
    e.preventDefault();
    //state.socket.sendMessage(message);
    const msg = {
      type : "send",
      content: message,
    };

    state.socket.sendMessage(msg);
    setMessage("");
  };

  useEffect(() => {
    console.log(state.socket);
    if (state.socket && state.socket.messageListeners.length < 1) {
      state.socket.addMessageListener(parseMessage);
    }
    return () => {
      if (state.socket && state.socket.messageListeners.length > 1) {
        state.socket.removeMessageListener(parseMessage);
      }
    };
  }, [state.isChatVisible, send]);


  if (state.isChatVisible) {
    return (
      <div className="chat">
        <section>
          <h3>Here be reactions</h3>
          <form onSubmit={send}>
            <input
              type="text"
              id="chatMessage"
              name="chatMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </section>
        {messages.map((msg) => {
          return (
            <div key={msg.id}>
              <h6>[{msg.time}]</h6>
              <h4>{msg.username}:</h4>
              <p>{msg.message}</p>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <></>
  }
};

export default Chat;
