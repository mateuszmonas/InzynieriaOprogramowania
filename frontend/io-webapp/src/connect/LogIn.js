import React from "react";

import "./Start.css";

const LogIn = (props) => {
  // console.log(setStage);
  const [creds, setCreds] = React.useState({ username: "", password: "" });
  const [message, setMessage] = React.useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    console.log(JSON.stringify(creds));
    (async () => {
        await fetch("http://localhost:8080/login", {
        method: "POST",
        // mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
          // 'Access-Control-Allow-Origin': "*",
          // "Accept": "application/json, text/plain, */*",
        },
        // 'credentials': 'same-origin',
        body: JSON.stringify(creds),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })();

    

    //placeholder
    // if (creds.name === "admin" && creds.password === "admin") {
    //   props.setStage("account");
    // } else {
    //   setMessage("Failed to log in");
    //   props.setStage("logIn");
    // }
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
            value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
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
