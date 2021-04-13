import React, { useEffect, useState } from "react";

const Chat = ({ socket }) => {
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  const sampleChat = [
    {
      id: 1,
      username: "Alice",
      message: "Hello",
      time: "21:37",
    },
    {
      id: 2,
      username: "Bob",
      message: "Hi",
      time: "21:38",
    },
  ];

  const parseMessage = (message) => {
    setMessages((messages) => [ ...messages, {
      id: message.id,
      username: message.sender,
      message: message.content,
      time: message.timestamp,
    } ]);
  }

  useEffect(() => {
    socket.addMessageListener(parseMessage);
    return () => socket.removeMessageListener(parseMessage);
  }, [])

  const send = async (e) => {
    e.preventDefault();

    socket.sendMessage(message);
    setMessage('');
  };

  return (
    <div className="chat">
      <section>
        <h3>Here be reactions</h3>
        <form onSubmit={send}>
          <input type="text" id="chatMessage" name="chatMessage" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button type="submit">Send</button>
        </form>
      </section>
      {messages.reverse().map((msg) => {
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
};

export default Chat;
