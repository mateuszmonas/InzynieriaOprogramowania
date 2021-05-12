import React, { useState, useEffect } from "react";

const Chat = ({socket}) => {
  const [message, setMessage] = useState()
  const sampleChat = [
    {
      id: 1,
      username: "Alice",
      message: "Hello",
      time: "21:37",
    },
  ];
  

  useEffect(()=>{
    let oldMessages = [...messages]
    oldMessages.push({
        id: 1,
        username: socket.newMessage.sender,
        message: socket.newMessage.content,
        time: socket.newMessage.timestamp,
    })
    setMessages(curr=>{})
    socket.newMessage && console.log(`newMessage: ${socket.newMessage}`)
    
   },[socket])
  useEffect(()=>{
    console.log(socket)
    
   },[])

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
              socket.sendMessage(message);
            }}
          >
            Send
          </button>
        </form>
      </section>
      {messages && messages.map((msg) => {
        return (
          <div key={msg.id}>
            <h6>{msg.time}</h6>
            <h4>{msg.username}:</h4>
            <p>{msg.message}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Chat;