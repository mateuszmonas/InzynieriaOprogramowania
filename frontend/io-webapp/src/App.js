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
  const [guestID, setGuestID] = React.useState("");
  const [socket, setSocket] = React.useState(new Socket("","",""));
  const [approvalRoomID, setApprovalRoomID] = React.useState("");


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
          setGuestID={setGuestID}
          socket={socket}
          setSocket={setSocket}
          approvalRoomID={approvalRoomID}
          setApprovalRoomID={setApprovalRoomID}
        />
      </div>
    );
  } else if (stage === "student" || stage === "guest" || stage === "awaitsApproval") {
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
          guestID={guestID}
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
          guestID={guestID}
          socket={socket}
          setSocket={setSocket}
          approvalRoomID={approvalRoomID}
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
          sessionID={sessionID}
          setSessionID={setSessionID}
          setToken={setToken}
          setSessionTitle={setSessionTitle}
          setGuestID={setGuestID}
          username={username}
          setUsername={setUsername}
          socket={socket}
          setSocket={setSocket}
        />
      </div>
    );
  }
}

export default App;
