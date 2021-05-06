import React from "react";
import "./Navbar.css";

const Navbar = ({ state, dispatch }) => {
  const logoutHandler = () => {
    dispatch({ type: "SET_TOKEN", payload: "" });
    dispatch({ type: "SET_STAGE_START" });
    dispatch({ type: "SET_USERNAME", payload: "" });
    dispatch({ type: "SET_MESSAGE", payload: "" });
  };

  const LogButton = () => {
    return ["account", "quizList", "designer", "student", "lecturer"].includes(state.stage) ? (
      <>
        <button type="button" onClick={logoutHandler}>
          Log Out
        </button>
        <h4 className="username">{state.username}</h4>
      </>
    ) : (
      <>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "SET_STAGE_SIGNUP" });
            dispatch({ type: "SET_MESSAGE", payload: "" });
          }}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "SET_STAGE_LOGIN" });
            dispatch({ type: "SET_MESSAGE", payload: "" });
          }}
        >
          Log In
        </button>
      </>
    );
  };

  const DesignerButton = () => {
    return state.stage === "account" ? (
      <>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "SET_STAGE_QUIZ_LIST" });
          }}
        >
          Quiz List
        </button>
      </>
    ) : state.stage === "designer" || state.stage === "quizList" ? (
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
    </div>
  );
};

export default Navbar;
