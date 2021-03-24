import "./App.css";
import React from "react";

import Start from "./connect/Start";
import Account from "./presession/Account";
import Student from "./session/Student";

function App() {
  const [stage, setStage] = React.useState("start");
  if (stage === "account") {
    return (
      <div className="App">
        <Account />
      </div>
    );
  } else if (stage === "student") {
    return (
      <div className="App">
        <Student />
      </div>
    );
  } else {
    return (
      <div className="App">
        <Start stage={stage} setStage={setStage} />
      </div>
    );
  }
}

export default App;
