import React from "react";

const Participants = (props) => {
  const [waiting, setWaiting] = React.useState([]);

  const addWaiting = (newWaiting) => {
    setWaiting((waiting) => [
      ...waiting,
      newWaiting
    ]);
  };

  React.useEffect(() => {
    if (props.socket && props.socket.messageListeners.length < 1) {
      props.socket.addMessageListener(addWaiting);
    }
    return () => {
      if (props.socket && props.socket.messageListeners.length > 1) {
        props.socket.removeMessageListener(addWaiting);
      }
    };
  }, [props.visible, props.participants]);

  const acceptHandler = (event, guestId) => {
    const newWaiting = waiting.filter((item) => item.content !== guestId);
    setWaiting(newWaiting);
    props.socket.sendApproval(guestId, true);
  }
  
  const rejectHandler = (event, guestId) => {
    const newWaiting = waiting.filter((item) => item.content !== guestId);
    setWaiting(newWaiting);
    props.socket.sendApproval(guestId, false);
  }


  if (props.visible) {
    return (
      <div className="participants">
        {props.participants.map((msg) => {
          return (
            <div className="accepted" key={msg.id}>
              <h4>{msg.username}</h4>
              <button type="button">Message</button>
            </div>
          );
        })}

        {waiting.map((msg) => {
          if (props.stage === "lecturer") {
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
