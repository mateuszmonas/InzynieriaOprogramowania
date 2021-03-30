import React from "react";

const Sessionbar = (props) => {
  const toggleChat = () => {
    props.toggleChat(!props.chat);
    props.toggleParticipants(false);
  }

  const toggleParticipants = () => {
    props.toggleChat(false);
    props.toggleParticipants(!props.participants);
  }

  return (
    <div className="sessionbar">
      <div>
          <button type="button" onClick={() => props.setStage("account")}>Leave Session</button>
      </div>
      <button type="button" onClick={() => toggleChat()}>Chat</button>
      <button type="button" onClick={() => toggleParticipants()}>Participants</button>
    </div>
  );
};

export default Sessionbar;
