import "./App.css";
import React from "react";

import Start from "./connect/Start";
import Account from "./presession/Account";
import Student from "./session/Student";
import Lecturer from "./session/Lecturer";
import Navbar from "./session/Navbar";
import Sessionbar from "./session/Sessionbar";

function App() {
  const [stage, setStage] = React.useState("start");
  const [token, setToken] = React.useState("");

  if (stage === "account") {
    return (
      <div className="App">
        <Navbar stage={stage} setStage={setStage} setToken={setToken}/>
        <Account setStage={setStage} />
      </div>
    );
  } else if (stage === "student") {
    return (
      <div className="App">
        <Navbar stage={stage} setStage={setStage} setToken={setToken}/>
        <Student setStage={setStage} />
      </div>
    );
  } else if (stage === "lecturer") {
    return (
      <div className="App">
        <Navbar stage={stage} setStage={setStage} setToken={setToken}/>
        <Lecturer setStage={setStage} />
      </div>
    );
  } else {
    return (
      <div className="App">
        <Navbar stage={stage} setStage={setStage} setToken={setToken}/>
        <Start stage={stage} setStage={setStage} setToken={setToken} />
      </div>
    );
  }
}

export default App;
