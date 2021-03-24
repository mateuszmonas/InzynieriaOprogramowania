import React from "react";

const SignUp = (props) => {
  const [creds, setCreds] = React.useState({
    name: "",
    password: "",
    email: "",
  });
  const [passwordCheck, setPasswordCheck] = React.useState("");
  const [message, setMessage] = React.useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    /*
        TODO 
    */
    // placeholder
    if (creds.password === passwordCheck) {
      props.setStage("signedUp");
      props.setMessage("Signed up successfuly");
      setTimeout(() => {
        props.setMessage("");
      }, 3000);
    } else {
      setMessage("Passwords do not match");
      props.setStage("signUp");
    }
    // placeholder
  };

  return (
    <div className="startSection">
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="guestName">Name</label>
          <input
            type="text"
            id="signUpName"
            name="signUpName"
            value={creds.name}
            onChange={(e) => setCreds({ ...creds, name: e.target.value })}
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
        <button type="submit">Sign up</button>
      </form>
      <h1>{message}</h1>
    </div>
  );
};

export default SignUp;
