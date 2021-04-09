import "./App.css";
import React from "react";

import Start from "./connect/Start";
import Account from "./presession/Account";
import Student from "./session/Student";
import Lecturer from "./session/Lecturer";
import Navbar from "./session/Navbar";

function App() {
  const [stage, setStage] = React.useState("start");
  const [token, setToken] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [sessionID, setSessionID] = React.useState("");

  if (stage === "account") {
    return (
      <div className="App">
        <Navbar
          stage={stage}
          setStage={setStage}
          setToken={setToken}
          username={username}
          setUsername={setUsername}
        />
        <Account
          setStage={setStage}
          sessionID={sessionID}
          setSessionID={setSessionID}
          username={username}
        />
      </div>
    );
  } else if (stage === "student") {
    return (
      <div className="App">
        <Navbar
          stage={stage}
          setStage={setStage}
          setToken={setToken}
          username={username}
          setUsername={setUsername}
        />
        <Student
          username={username}
          stage={stage}
          setStage={setStage}
          sessionID={sessionID}
          setSessionID={setSessionID}
        />
      </div>
    );
  } else if (stage === "lecturer") {
    return (
      <div className="App">
        <Navbar
          stage={stage}
          setStage={setStage}
          setToken={setToken}
          username={username}
          setUsername={setUsername}
        />
        <Lecturer
          username={username}
          stage={stage}
          setStage={setStage}
          sessionID={sessionID}
          setSessionID={setSessionID}
        />
      </div>
    );
  } else {
    return (
      <div className="App">
        <Navbar
          stage={stage}
          setStage={setStage}
          setToken={setToken}
          username={username}
          setUsername={setUsername}
        />
        <Start
          stage={stage}
          setStage={setStage}
          setToken={setToken}
          setUsername={setUsername}
        />
      </div>
    );
  }
}

export default App;
