import React, { useEffect, useState } from "react";

const Chat = ({ visible, socket }) => {
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  const parseMessage = (message) => {
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

    socket.sendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    if (socket && socket.messageListeners.length < 1) {
      socket.addMessageListener(parseMessage);
    }
    return () => {
      if (socket && socket.messageListeners.length > 1) {
        socket.removeMessageListener(parseMessage);
      }
    };
  }, [visible, send]);


  if (visible) {
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
