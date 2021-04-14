import React from "react";

const Participants = (props) => {
  const [waiting, setWaiting] = React.useState([]);

  const addWaiting = (newWaiting) => {
    setWaiting((waiting) => [
      ...waiting,
      newWaiting
    ]);
  };

  // React.useEffect(() => {
  //   props.socket.addMessageListener(addWaiting);
  //   return () => props.socket.removeMessageListener(addWaiting);
  // }, []);

  // const acceptHandler = (guestId) => {
  //   const newWaiting = waiting.filter((item) => item.guestId !== guestId);
  //   setWaiting(newWaiting);
  //   props.socket.sendApproval(guestId, true);
  // }
  
  // const rejectHandler = (guestId) => {
  //   const newWaiting = waiting.filter((item) => item.guestId !== guestId);
  //   setWaiting(newWaiting);
  //   props.socket.sendApproval(guestId, false);
  // }


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
              <div className="waiting" key={msg.guestId}>
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
  }
  else {
    return <></>
  }
};

export default Participants;
