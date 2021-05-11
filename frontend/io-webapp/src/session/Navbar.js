import React from "react";
import "./Navbar.css";
import "../common.css";

const Navbar = ({ state, dispatch }) => {
  const logoutHandler = () => {
    dispatch({ type: "SET_TOKEN", payload: "" });
    dispatch({ type: "SET_STAGE_START" });
    dispatch({ type: "SET_USERNAME", payload: "" });
    dispatch({ type: "SET_MESSAGE", payload: "" });
  };

  const sessionHistoryHandler = () => {
    dispatch({ type: "SET_STAGE_SESSION_HISTORY"});
    dispatch({ type: "SESSION_HISTORY_VISIBLE" });
  };

  const LogButton = () => {
    return ["account", "quizList", "designer", "student", "lecturer", "sessionHistory"].includes(state.stage) ? (
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
    return state.stage === "account" || state.stage === "sessionHistory" ? (
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

  const TimelineButton = () => {
    return ["account", "designer", "quizList"].includes(state.stage) ? (
      <>
        <div
          className="navbarButton"
          onClick={() => sessionHistoryHandler()}>
          Session history
        </div>
      </>
    ) : state.stage === "sessionHistory" ? (
      <>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "SET_STAGE_ACCOUNT" });
          }}
        >
          Sessions
        </button>
      </>
    ) : (
      <></>
    );
  };

  return (
    <div className="navbar">
      <LogButton />
      <DesignerButton />
      <TimelineButton />
    </div>
  );
};

export default Navbar;
