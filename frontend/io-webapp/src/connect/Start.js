import React from "react";
import Socket from "../socket";

import LogIn from "./LogIn";
import SignUp from "./SignUp";

import "./Start.css";

const Start = (props) => {
  const { stage, setStage, setToken, setUsername } = props;
  const [message, setMessage] = React.useState("");
  const [creds, setCreds] = React.useState({ name: "", sessionCode: "" });

  const submitHandler = (e) => {
    e.preventDefault();
    const username = creds.name;

    (async () => {
      await fetch("http://localhost:8080/session/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          passcode: creds.sessionCode,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const gotPermission = !data.guestApproval;
          props.setSessionID(data.sessionId);
          props.setSessionTitle(data.sessionTitle);
          props.setGuestID(data.guestId);
          props.setUsername(username);
          if (!gotPermission) {
            props.setStage("awaitsApprovalGuest");
            props.setSocket(
              Socket.connect(
                username,
                data.guestApprovalRoomId,
                data.guestId,
                "approval",
                false,
                true,
                props.setStage,
                props.setSocket,
                props.setSessionID
              )
            );
            props.socket.sendRequest();
          } else {
            props.setStage("guest");
            props.setSocket(
              Socket.connect(
                username,
                data.sessionId,
                data.guestId,
                "session",
                false,
                true,
                props.setStage,
                props.setSocket,
                props.setSessionID
              )
            );
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage("Failed to join session");
        });
    })();
  };

  if (stage === "logIn") {
    return (
      <LogIn
        setStage={setStage}
        setToken={setToken}
        setUsername={setUsername}
        socket={props.socket}
        setSocket={props.setSocket}
      />
    );
  } else if (stage === "signUp") {
    return <SignUp setStage={setStage} setMessage={setMessage} />;
  } else {
    return (
      <div className="login">
        <h2>Join as a guest</h2>
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="guestName">Name:</label>
            <input
              type="text"
              id="guestName"
              name="guestName"
              value={creds.name}
              onChange={(e) => setCreds({ ...creds, name: e.target.value })}
            ></input>
          </div>
          <div>
            <label htmlFor="sessionCode">Enter session code here:</label>
            <input
              type="text"
              id="sessionCode"
              name="sessionCode"
              value={creds.sessionCode}
              onChange={(e) =>
                setCreds({ ...creds, sessionCode: e.target.value })
              }
            ></input>
          </div>
          <button type="submit" className="submit">
            Join
          </button>
        </form>
        <h1>{message}</h1>
      </div>
    );
  }
};

export default Start;
