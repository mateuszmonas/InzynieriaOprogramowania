import React from "react";
import "./Navbar.css";

const Navbar = (props) => {
  const logoutHandler = () => {
    props.setToken("");
    props.setStage("start");
  };

  const LogButton = () => {
    return props.stage === "account" ||
      props.stage === "student" ||
      props.stage === "lecturer" ? (
      <button type="button" onClick={logoutHandler}>
        Log Out
      </button>
    ) : (
      <>
        <button type="button" onClick={() => props.setStage("signUp")}>
          Sign Up
        </button>
        <button type="button" onClick={() => props.setStage("logIn")}>
          Log In
        </button>
      </>
    );
  };

  return (
    <div className="navbar">
      <LogButton />
    </div>
  );
};

export default Navbar;
