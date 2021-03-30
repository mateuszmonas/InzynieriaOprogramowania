import React from 'react'

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
  
    return (
      <div className="participants" >
        {sampleParticipants.map((msg) => {
          return (
            <div key={msg.id}>
              <h4>{msg.username}</h4>
              <button type="button">Message</button>
            </div>
          );
        })}
      </div>
    );
  };

export default Participants
