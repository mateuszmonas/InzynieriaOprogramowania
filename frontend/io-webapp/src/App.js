import "./App.css";
import React from "react";
import { initialState, reducer } from "./reducer";

import Start from "./connect/Start";
import Account from "./presession/Account";
import Session from "./session/Session";
import Navbar from "./session/Navbar";

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  
  return (
    <div className="App">
      <Navbar state={state} dispatch={dispatch} />
      {state.stage === "account" ? (
        <Account state={state} dispatch={dispatch} />
      ) : ["guest", "student", "lecturer"].includes(state.stage) ? (
        <Session state={state} dispatch={dispatch} />
      ) : (
        <Start state={state} dispatch={dispatch} />
      )}
    </div>
  );
}

export default App;
