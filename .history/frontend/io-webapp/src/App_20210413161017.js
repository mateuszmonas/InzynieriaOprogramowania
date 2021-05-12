import "./App.css";
import React from "react";
import Socket from "./socket";

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
  const [sessionTitle, setSessionTitle] = React.useState("");
  const [socket, setSocket] = React.useState(Socket);

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
          setSessionTitle={setSessionTitle}
          socket={socket}
          setSocket={setSocket}
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
          sessionTitle={sessionTitle}
          socket={socket}
          setSocket={setSocket}
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
          sessionTitle={sessionTitle}
          socket={socket}
          setSocket={setSocket}
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
          socket={socket}
          setSocket={setSocket}
        />
      </div>
    );
  }
}

export default App;
