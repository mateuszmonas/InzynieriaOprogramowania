import React, { useState, useEffect } from "react";
import Socket from '../socket';


const Chat = ({socket, setSocket, username, sessionId}) => {
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
    socket.onmessage = function(e) {
      console.log('message', e.data);
  };
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
