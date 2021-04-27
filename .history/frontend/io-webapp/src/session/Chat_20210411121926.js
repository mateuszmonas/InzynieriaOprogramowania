import React, { useState, useEffect } from "react";

const Chat = (props) => {
  const [message, setMessage] = useState()

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

  useEffect(()=>{console.log(props)},[])
  return (
    <div className="chat">
      <section>
        <h3>Here be reactions</h3>
        <form>
          <input type="text" id="chatMessage" name="chatMessage" value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
          <button 
            type="button"
            onClick={() => {
              console.log(message)
            }}
          >
            Send
          </button>
        </form>
      </section>
      {sampleChat.reverse().map((msg) => {
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
