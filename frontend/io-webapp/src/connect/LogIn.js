import React from "react";

import "./Start.css";

const LogIn = ({ state, dispatch }) => {
  const [creds, setCreds] = React.useState({ username: "", password: "" });

  const submitHandler = (e) => {
    e.preventDefault();

    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creds),
      })
          .then((response) => response.json())
          .then((data) => {
            dispatch({type: "SET_TOKEN", payload: data});
            dispatch({type: "SET_USERNAME", payload: creds.username});
          dispatch({ type: "SET_STAGE_ACCOUNT" });
          dispatch({ type: "SET_MESSAGE", payload: "" });
        })
        .catch((error) => {
          console.error(error);
          dispatch({ type: "SET_MESSAGE", payload: "Failed to log in" });
          dispatch({ type: "SET_STAGE_LOGIN" });
        });
    })();
  };

  return (
    <div className="login">
      <h2>Log In</h2>
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
        <div>
          <button
            type="button"
            className="submit"
            onClick={() => {
              dispatch({ type: "SET_STAGE_START" });
              dispatch({ type: "SET_MESSAGE", payload: "" });
            }}
          >
            Back
          </button>
          <button type="submit" className="submit">
            Log in
          </button>
        </div>
      </form>
      <h1>{state.message}</h1>
    </div>
  );
};

export default LogIn;
