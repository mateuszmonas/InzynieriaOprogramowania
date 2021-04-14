import React from "react";
import Socket from "../socket";

import "./Account.css";

const Account = (props) => {
  const [passcode, setPasscode] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isOwner, setIsOwner] = React.useState(false);
  const [needsApproval, setNeedsApproval] = React.useState(false);

  //props.setStage("lecturer")

  const handleJoin = (e) => {
    e.preventDefault();

    (async () => {
      await fetch("http://localhost:8080/session/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: props.username, passcode: passcode }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const gotPermission = !data.guestApproval;
          props.setSessionID(data.sessionId);
          props.setSessionTitle(data.sessionTitle);
          props.setGuestID(data.guestId);
          if (isOwner) {
            props.setStage("lecturer");
            console.log("lecturer");
            props.setSocket(Socket.connect(props.username, data.sessionId, data.guestId, "session", false, props.setStage, props.setSocket));
          } else if (!gotPermission) {
            props.setStage("awaitsApproval");
            console.log("awaitsApproval");
            props.setSocket(Socket.connect(props.username, data.sessionId, data.guestId, "approval", false, props.setStage, props.setSocket));
            props.socket.sendRequest();
          } else {
            props.setStage("student");
            console.log("student");
            props.setSocket(Socket.connect(props.username, data.sessionId, data.guestId, "session", false, props.setStage, props.setSocket));
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage("Failed to join session");
        });
    })();
  };

  const handleCreate = (e) => {
    e.preventDefault();
    console.log("creating");
    console.log({ username: props.username, sessionTitle: title, guestApproval: needsApproval });

    (async () => {
      await fetch("http://localhost:8080/session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: props.username, sessionTitle: title, guestApproval: needsApproval }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsOwner(true);
          setPasscode(data.passcode);
          props.setApprovalRoomID(data.approvalRoomId);
          setMessage("Your session passcode is:\n" + data.passcode);
        })
        .catch((error) => {
          console.error(error);
          setMessage("Failed to create session");
        });
    })();
  };

  return (
    <div className="account">
      <div className="login">
        <h2>If you are a lecturer...</h2>
        <label htmlFor="sessionTitle">Session Title: </label>
        <input
          type="input"
          id="sessionTitle"
          name="sessionTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <label htmlFor="sessionTitle">Do you want students to be manually approved before joining?</label>
        <input
          type="checkbox"
          id="needsApproval"
          name="needsApproval"
          value={needsApproval}
          onChange={(e) => setNeedsApproval(e.target.checked)}
        ></input>
        <button type="button" className="submit" onClick={handleCreate}>
          Create new session
        </button>
        {isOwner && (
          <>
            <h4>{message}</h4>
            <button type="button" className="submit" onClick={handleJoin}>
              Join this session
            </button>
          </>
        )}
      </div>
      {!isOwner && (
        <div className="login">
          <h2>If you are a student...</h2>
          <label htmlFor="sessionPasscode">Session Passcode: </label>
          <input
            type="input"
            id="sessionPasscode"
            name="sessionPasscode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          ></input>
          <button type="button" className="submit" onClick={handleJoin}>
            Join session
          </button>
          <h4>{message}</h4>
        </div>
      )}
    </div>
  );
};

export default Account;
