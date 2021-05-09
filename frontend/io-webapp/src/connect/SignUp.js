import React from "react";

const SignUp = ({ state, dispatch }) => {
  const [creds, setCreds] = React.useState({
    username: "",
    password: "",
    email: "",
  });
  const [passwordCheck, setPasswordCheck] = React.useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (creds.password === passwordCheck) {
      (async () => {
        await fetch(process.env.REACT_APP_BACKEND_URL + "/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: creds.username,
            password: creds.password,
          }),
        })
            .then((_) => {
            dispatch({ type: "SET_STAGE_START" });
            dispatch({ type: "SET_MESSAGE", payload: "Signed up successfully" });
            setTimeout(() => {
              dispatch({ type: "SET_MESSAGE", payload: "" });
            }, 3000);
          })
          .catch((error) => {
            console.error(error);
            dispatch({ type: "SET_STAGE_SIGNUP" });
            dispatch({ type: "SET_MESSAGE", payload: "Failed to register" });
          });
      })();
    } else {
      dispatch({ type: "SET_STAGE_SIGNUP" });
      dispatch({ type: "SET_MESSAGE", payload: "Failed to register" });
    }
  };

  return (
    <div className="login">
      <h2>Sign Up</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="guestName">Name</label>
          <input
            type="text"
            id="signUpName"
            name="signUpName"
            value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
          ></input>
        </div>
        <div>
          <label htmlFor="signUpEmail">Email</label>
          <input
            type="text"
            id="signUpEmail"
            name="signUpEmail"
            value={creds.email}
            onChange={(e) => setCreds({ ...creds, email: e.target.value })}
          ></input>
        </div>
        <div>
          <label htmlFor="signUpPassword">Password</label>
          <input
            type="password"
            id="signUpPassword"
            name="signUpPassword"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          ></input>
        </div>
        <div>
          <label htmlFor="signUpPasswordRepeat">Repeat password</label>
          <input
            type="password"
            id="signUpPasswordRepeat"
            name="signUpPasswordRepeat"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          ></input>
        </div>
        <div>
          <button
            type="button"
            className="submit"
            onClick={() => dispatch({ type: "SET_STAGE_START" })}
          >
            Back
          </button>
          <button type="submit" className="submit">
            Sign up
          </button>
        </div>
      </form>
      <h1>{state.message}</h1>
    </div>
  );
};

export default SignUp;
