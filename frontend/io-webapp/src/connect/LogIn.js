import React from "react";

import "./Start.css";

const LogIn = (props) => {
  const [creds, setCreds] = React.useState({ username: "", password: "" });
  const [message, setMessage] = React.useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    (async () => {
      await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creds),
      })
        .then((response) => response.json())
        .then((data) => {
          props.setToken(data);
          props.setUsername(creds.username);
          props.setStage("account");
        })
        .catch((error) => {
          console.error(error);
          setMessage("Failed to log in");
          props.setStage("logIn");
        });
    })();
  };

  return (
    <div className="login">
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="logInName">Name</label>
          <input
            type="text"
            id="logInName"
            name="logInName"
            value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
          ></input>
        </div>
        <div>
          <label htmlFor="logInPassword">Password</label>
          <input
            type="password"
            id="logInPassword"
            name="logInPassword"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          ></input>
        </div>
        <button type="submit" className="submit">Log in</button>
      </form>
      <h1>{message}</h1>
    </div>
  );
};

export default LogIn;
