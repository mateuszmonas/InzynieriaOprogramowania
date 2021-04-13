import React from "react";

import LogIn from "./LogIn";
import SignUp from "./SignUp";

import "./Start.css";

const Start = (props) => {
  const { stage, setStage, setToken, setUsername } = props;
  const [message, setMessage] = React.useState("");
  const [creds, setCreds] = React.useState({ name: "", sessionCode: "" });

  const submitHandler = (e) => {
    e.preventDefault();
    /*
      TODO 
    */
    //placeholder
    if (creds.name === "") {
      setMessage("You need to choose a name");
      props.setStage("start");
    } else if (creds.sessionCode == 123456) {
      props.setStage("student");
    } else {
      setMessage("Session with this code does not exist");
      props.setStage("start");
    }
    //end placeholder
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
            <button type="submit" className="submit">Join</button>
          </form>
        <h1>{message}</h1>
        </div>
    );
  }
};

export default Start;
