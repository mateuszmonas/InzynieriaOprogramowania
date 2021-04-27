import React from "react";
import Socket from "../socket";

import LogIn from "./LogIn";
import SignUp from "./SignUp";

import "./Start.css";

const Start = ({ state, dispatch }) => {
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
          dispatch({ type: "SET_SESSION_ID", payload: data.sessionId });
          dispatch({ type: "SET_APPROVAL_ROOM_ID", payload: data.guestApprovalRoomId });
          dispatch({ type: "SET_SESSION_TITLE", payload: data.sessionTitle });
          dispatch({ type: "SET_GUEST_ID", payload: data.guestId });
          dispatch({ type: "SET_USERNAME", payload: username });
          if (!gotPermission) {
            dispatch({ type: "SET_STAGE_GUEST_NEEDS_APPROVAL" });
          } else {
            dispatch({ type: "SET_STAGE_GUEST" });
          }
        })
        .catch((error) => {
          console.error(error);
          dispatch({ type: "SET_MESSAGE", payload: "Failed to join session" });
        });
    })();
  };

  if (state.stage === "login") {
    return <LogIn state={state} dispatch={dispatch} />;
  } else if (state.stage === "signUp") {
    return <SignUp state={state} dispatch={dispatch} />;
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
        <h1>{state.message}</h1>
      </div>
    );
  }
};

export default Start;
