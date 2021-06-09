import React from "react";
import Socket from "../socket";

import "./Account.css";

const Account = ({ state, dispatch }) => {
  const [passcode, setPasscode] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [isOwner, setIsOwner] = React.useState(false);
  const [needsApproval, setNeedsApproval] = React.useState(false);

  const handleJoin = (e) => {
    e.preventDefault();

    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/session/connect", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({username: state.username, passcode: passcode}),
      })
          .then((response) => response.json())
          .then((data) => {
              console.log(data);
              const gotPermission = !data.guestApproval;
          if (data.sessionId && !isOwner) {
            dispatch({ type: "SET_SESSION_ID", payload: data.sessionId });
            console.log("HANDLEJOIN: " + state.sessionId)
          }
          dispatch({ type: "SET_APPROVAL_ROOM_ID", payload: data.guestApprovalRoomId });
          dispatch({ type: "SET_SESSION_TITLE", payload: data.sessionTitle });
          dispatch({ type: "SET_GUEST_ID", payload: data.guestId });
          if (isOwner) {
            dispatch({ type: "SET_STAGE_LECTURER" });
            dispatch({
              type: "SET_SOCKET",
              payload: Socket.connect(state, dispatch, "session", true),
            });
          } else if (!gotPermission) {
            dispatch({ type: "SET_STAGE_STUDENT_NEEDS_APPROVAL" });
          } else {
            dispatch({ type: "SET_STAGE_STUDENT" });
          }
        })
        .catch((error) => {
          console.error(error);
          dispatch({ type: "SET_MESSAGE", payload: "Failed to join session" });
        });
    })();
  };

  const handleCreate = (e) => {
    e.preventDefault();

    (async () => {
        await fetch(process.env.REACT_APP_BACKEND_URL + "/session/create", {
            method: "POST",
            headers: {
                Authorization: state.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionTitle: title,
                guestApproval: needsApproval,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
          setIsOwner(true);
          setPasscode(data.passcode);
          dispatch({ type: "SET_SESSION_ID", payload: data.sessionId });
          dispatch({
            type: "SET_APPROVAL_ROOM_ID",
            payload: data.approvalRoomId,
          });
          dispatch({
            type: "SET_MESSAGE",
            payload: "Your session passcode is:\n" + data.passcode,
          });
        })
        .catch((error) => {
          console.error(error);
          dispatch({
            type: "SET_MESSAGE",
            payload: "Failed to create session",
          });
        });
    })();
  };

  return (
    <div className="account">
      <div className="login">
        <h2>Create a session</h2>
        <label htmlFor="sessionTitle">Session Title: </label>
        <input
          type="input"
          id="sessionTitle"
          name="sessionTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <label htmlFor="sessionTitle">
          Do you want students to be manually approved before joining?
          <input
            type="checkbox"
            id="needsApproval"
            name="needsApproval"
            value={needsApproval}
            onChange={(e) => setNeedsApproval(e.target.checked)}
          ></input>
        </label>
        <button type="button" className="submit" onClick={handleCreate}>
          Create new session
        </button>
        {isOwner && (
          <>
            <h4>{state.message}</h4>
            <button type="button" className="submit" onClick={handleJoin}>
              Join this session
            </button>
          </>
        )}
      </div>
      {!isOwner && (
        <div className="login">
          <h2>Join a session</h2>
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
          <h4>{state.message}</h4>
        </div>
      )}
    </div>
  );
};

export default Account;
