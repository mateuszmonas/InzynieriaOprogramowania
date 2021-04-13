import React from "react";

const Chat = (props) => {
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

  return (
    <div className="chat">
      <section>
        <h3>Here be reactions</h3>
        <form>
          <input type="text" id="chatMessage" name="chatMessage" />
          <button type="submit">Send</button>
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
