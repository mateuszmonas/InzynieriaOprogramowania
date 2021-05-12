import React, { useState, useEffect } from "react";

const Chat = ({socket}) => {
  const [message, setMessage] = useState()
  const sampleChat = [];
  
  useEffect(()=>{
    sampleChat.push(socket.newMessage)
  },[socket])

  const [messages, setMessages] = useState(sampleChat)

  return (
    <div className="chat">
      <section>
        <h3>Here be reactions</h3>
        <form>
          <input type="text" id="chatMessage" name="chatMessage" value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
          <button 
            type="button"
            onClick={() => {
              // socket.sendMessage(message);
              setMessages([...messages,  {
                id: 2,
                username: "Nowy Bob",
                message: message,
                time: "21:38",
              },])
            }}
          >
            Send
          </button>
        </form>
      </section>
      {messages && messages.reverse().map((msg) => {
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
