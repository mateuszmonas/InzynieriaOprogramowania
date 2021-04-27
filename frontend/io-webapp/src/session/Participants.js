import React from "react";

const Participants = ({ state, dispatch }) => {
  const [waiting, setWaiting] = React.useState([]);

  const addWaiting = (newWaiting) => {
    setWaiting((waiting) => [
      ...waiting,
      newWaiting
    ]);
  };
  
  React.useEffect(() => {
    if (state.approvalSocket && state.approvalSocket.messageListeners.length < 1) {
      state.approvalSocket.addMessageListener(addWaiting);
    }
    return () => {
      if (state.approvalSocket && state.approvalSocket.messageListeners.length > 1) {
        state.approvalSocket.removeMessageListener(addWaiting);
      }
    };
  }, [state.visible, state.participants]);

  const acceptHandler = (event, guestId) => {
    const newWaiting = waiting.filter((item) => item.content !== guestId);
    setWaiting(newWaiting);
    state.socket.sendApproval(guestId, true);
  }
  
  const rejectHandler = (event, guestId) => {
    const newWaiting = waiting.filter((item) => item.content !== guestId);
    setWaiting(newWaiting);
    state.socket.sendApproval(guestId, false);
  }


  if (state.isParticipantsVisible) {
    return (
      <div className="participants">
        {state.participants.map((msg) => {
          return (
            <div className="accepted" key={msg.id}>
              <h4>{msg.username}</h4>
              <button type="button">Message</button>
            </div>
          );
        })}

        {waiting.map((msg) => {
          if (state.stage === "lecturer") {
            return (
              <div className="waiting" key={msg.content}>
                <h4>{msg.sender}</h4>
                <div>
                  <button type="button" onClick={(e) => {acceptHandler(e, msg.content)}}>Accept</button>
                  <button type="button" onClick={(e) => {rejectHandler(e, msg.content)}}>Reject</button>
                </div>
              </div>
            );
          } else return <></>;
        })}
      </div>
    );
  }
  else {
    return <></>
  }
};

export default Participants;
