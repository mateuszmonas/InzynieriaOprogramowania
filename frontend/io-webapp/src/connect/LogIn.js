import React from "react";

import "./Start.css";

const LogIn = (props) => {
  // console.log(setStage);
  const [creds, setCreds] = React.useState({ name: "", password: "" });
  const [message, setMessage] = React.useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    /*
      TODO 
    */
    //placeholder
    if (creds.name === "admin" && creds.password === "admin") {
      props.setStage("account");
    } else {
      setMessage("Failed to log in");
      props.setStage("logIn");
    }
    //end placeholder
  };

  return (
    <div className="startSection">
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="guestName">Name</label>
          <input
            type="text"
            id="logInName"
            name="logInName"
            value={creds.name}
            onChange={(e) => setCreds({ ...creds, name: e.target.value })}
          ></input>
        </div>
        <div>
          <label htmlFor="sessionCode">Password</label>
          <input
            type="password"
            id="logInPassword"
            name="logInPassword"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          ></input>
        </div>
        <button type="submit">Log in</button>
      </form>
      <h1>{message}</h1>
    </div>
  );
};

export default LogIn;
