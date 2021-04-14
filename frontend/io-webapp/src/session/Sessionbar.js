import React from "react";

const Sessionbar = (props) => {
  const toggleChat = () => {
    props.toggleChat(!props.chat);
    props.toggleParticipants(false);
  };

  const handleClose = (e) => {
    e.preventDefault();

    (async () => {
      await fetch("http://localhost:8080/session/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: props.username,
          sessionId: props.sessionID,
        }),
      })
        .then((_) => {
          props.setSessionID("");
          props.setStage("account");
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

  const leaveSessionHandler = (e) => {
    if (props.stage === "lecturer") {
      handleClose(e);
    } else if (props.stage === "guest") {
      props.setStage("");
    } else {
      props.setStage("account");
    }
  };

  return (
    <div className="sessionbar">
      <div>
        <h3>{props.sessionTitle}</h3>
        <button type="button" className="leave" onClick={leaveSessionHandler}>
          Leave Session
        </button>
      </div>
      {!(props.stage === "awaitsApproval") && (
        <>
          <button type="button" className="view" onClick={() => toggleChat()}>
            Chat
          </button>
          <button
            type="button"
            className="view"
            onClick={props.participantsHandler}
          >
            Participants
          </button>
        </>
      )}
    </div>
  );
};

export default Sessionbar;
