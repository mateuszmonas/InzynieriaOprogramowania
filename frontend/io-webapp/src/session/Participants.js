import React from "react";

const Participants = (props) => {
  const sampleParticipants = [
    {
      id: 1,
      username: "Alice",
    },
    {
      id: 2,
      username: "Bob",
    },
  ];

  const sampleWaiting = [
    {
      id: 3,
      username: "Charlie",
    },
    {
      id: 4,
      username: "Dave",
    },
  ];

  return (
    <div className="participants">
      {sampleParticipants.map((msg) => {
        return (
          <div className="accepted" key={msg.id}>
            <h4>{msg.username}</h4>
            <button type="button">Message</button>
          </div>
        );
      })}

      {sampleWaiting.map((msg) => {
        if (props.stage === "lecturer") {
          return (
            <div className="waiting" key={msg.id}>
              <h4>{msg.username}</h4>
              <div>
                <button type="button">Accept</button>
                <button type="button">Reject</button>
              </div>
            </div>
          );
        } else return <></>;
      })}
    </div>
  );
};

export default Participants;
