import React from "react";

const SignUp = (props) => {
  const [creds, setCreds] = React.useState({
    username: "",
    password: "",
    email: "",
  });
  const [passwordCheck, setPasswordCheck] = React.useState("");
  const [message, setMessage] = React.useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (creds.password === passwordCheck) {
      (async () => {
        await fetch("http://localhost:8080/register", {
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
            props.setStage("signedUp");
            props.setMessage("Signed up successfully");
            setTimeout(() => {
              props.setMessage("");
            }, 3000);
          })
          .catch((error) => {
            console.error(error);
            setMessage("Failed to register");
            props.setStage("signUp");
          });
      })();
    } else {
      setMessage("Failed to register");
      props.setStage("signUp");
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
            onClick={() => props.setStage("")}
          >
            Back
          </button>
          <button type="submit" className="submit">
            Sign up
          </button>
        </div>
      </form>
      <h1>{message}</h1>
    </div>
  );
};

export default SignUp;
