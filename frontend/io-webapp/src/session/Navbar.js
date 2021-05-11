import React from "react";
import "./navbar.css";
import "../common.css";

const Navbar = ({ state, dispatch }) => {
  const logoutHandler = () => {
    dispatch({ type: "SET_TOKEN", payload: "" });
    dispatch({ type: "SET_STAGE_START" });
    dispatch({ type: "SET_USERNAME", payload: "" });
    dispatch({ type: "SET_MESSAGE", payload: "" });
  };

  const closeHandler = (e) => {
    e.preventDefault();

    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/session/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: state.username,
          sessionId: state.sessionId,
        }),
      })
        .then((_) => {
          dispatch({ type: "SET_SESSION_ID", payload: "" });
          dispatch({ type: "SET_STAGE_ACCOUNT" });
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

  const leaveSessionHandler = (e) => {
    dispatch({ type: "SET_MESSAGE", payload: "" });
    if (state.stage === "lecturer") {
      closeHandler(e);
    } else if (state.stage === "guest") {
      dispatch({ type: "SET_STAGE_START" });
    } else {
      dispatch({ type: "SET_STAGE_ACCOUNT" });
    }
  };

  const LogButton = () => {
    return ["account", "quizList", "designer", "student", "lecturer"].includes(
      state.stage
    ) ? (
      <>
        <div className="navbarButton" onClick={logoutHandler}>
          Log Out
        </div>
        <div
          style={{
            fontWeight: "bold",
          }}
          className="navbarButton"
          onClick={() => dispatch({ type: "SET_STAGE_ACCOUNT" })}
        >
          {state.username}
        </div>
      </>
    ) : (
      <>
        <div
          className="navbarButton"
          onClick={() => {
            dispatch({ type: "SET_STAGE_SIGNUP" });
            dispatch({ type: "SET_MESSAGE", payload: "" });
          }}
        >
          Sign Up
        </div>
        <div
          className="navbarButton"
          onClick={() => {
            dispatch({ type: "SET_STAGE_LOGIN" });
            dispatch({ type: "SET_MESSAGE", payload: "" });
          }}
        >
          Log In
        </div>
      </>
    );
  };

  const DesignerButton = () => {
    return state.stage === "account" ? (
      <>
        <div
          className="navbarButton"
          onClick={() => {
            dispatch({ type: "SET_STAGE_QUIZ_LIST" });
          }}
        >
          Quiz List
        </div>
      </>
    ) : state.stage === "designer" || state.stage === "quizList" ? (
      <>
        <div
          className="navbarButton"
          onClick={() => {
            dispatch({ type: "SET_STAGE_ACCOUNT" });
          }}
        >
          Sessions
        </div>
      </>
    ) : (
      <></>
    );
  };

  const SessionButton = () => {
    return ["lecturer", "student", "guest"].includes(state.stage) ? (
      <>
        <div className="navbarLeft">
          <div
            className="navbarButton"
            onClick={leaveSessionHandler}
            style={{
              borderStyle: "hidden solid hidden hidden",
              borderWidth: "0px 2px 0px 0px"}}
          >
            {state.stage === "lecturer" ? "Close Session" : "Leave Session"}
          </div>
          <div
            style={{
              fontWeight: "bold",
              borderStyle: "hidden solid hidden hidden",
              borderWidth: "0px 2px 0px 0px"
            }}
            className="navbarText"
          >
            {state.sessionTitle}
          </div>
        </div>
      </>
    ) : (
      <></>
    );
  };

  return (
    <div className="navbar">
      <LogButton />
      <DesignerButton />
      <SessionButton />
    </div>
  );
};

export default Navbar;
