import React from "react";

import "./Account.css";

const Account = (props) => {
  const [passcode, setPasscode] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isOwner, setIsOwner] = React.useState(false);

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
          props.setSessionID(data.sessionId);
          props.setSessionTitle(data.sessionTitle);
          if (isOwner) {
            props.setStage("lecturer");
          } else {
            props.setStage("student");
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

    (async () => {
      await fetch("http://localhost:8080/session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: props.username, sessionTitle: title }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsOwner(true);
          setPasscode(data.passcode);
          setMessage("Your session passcode is " + data.passcode);
        })
        .catch((error) => {
          console.error(error);
          setMessage("Failed to create session");
        });
    })();
  };

  return (
    <div className="account">
      <label htmlFor="sessionTitle">Session Title: </label>
      <input
        type="input"
        id="sessionTitle"
        name="sessionTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <button type="button" onClick={handleCreate}>
        Create new session
      </button>
      {!isOwner ? (
        <div>
          <label htmlFor="sessionPasscode">Session Passcode: </label>
          <input
            type="input"
            id="sessionPasscode"
            name="sessionPasscode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          ></input>
          <button type="button" onClick={handleJoin}>
            Join session
          </button>
        </div>
      ) : (
        <div>
          <button type="button" onClick={handleJoin}>
            Join this session
          </button>
        </div>
      )}
      <h1>{message}</h1>
    </div>
  );
};

export default Account;
