import "./App.css";
import React from "react";
import { initialState, reducer } from "./reducer";

import Start from "./connect/Start";
import Account from "./presession/Account";
import Session from "./session/Session";
import Navbar from "./session/Navbar";
import Timeline  from "./presession/Timeline";
import Designer from "./presession/Designer";
import QuizList from "./presession/QuizList";

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  
  return (
    <div className="App">
      <Navbar state={state} dispatch={dispatch} />
      {state.stage === "account" ? (
        <Account state={state} dispatch={dispatch} />
      ) : state.stage === "quizList" ? (
        <QuizList state={state} dispatch={dispatch} />
      ) : state.stage === "designer" ? (
        <Designer state={state} dispatch={dispatch} />
      ) : ["guest", "student", "lecturer"].includes(state.stage) ? (
        <Session state={state} dispatch={dispatch} />
      ) : state.stage === "session_history" ? (
          <Timeline state={state} dispatch={dispatch} />
      ) : (
        <Start state={state} dispatch={dispatch} />
      )}
    </div>
  );
}

export default App;
