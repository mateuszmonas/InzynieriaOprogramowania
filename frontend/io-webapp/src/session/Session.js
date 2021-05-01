import React from "react";

import Socket from "../socket";

import Chat from "./Chat";
import Participants from "./Participants";
import Question from "./Question";
import Creator from "./Creator";
import Stats from "./Stats";

import "./Session.css";
import Sessionbar from "./Sessionbar";

const Session = ({ state, dispatch }) => {
  React.useEffect(() => {
    if (state.stage === "lecturer") {
      dispatch({
        type: "SET_APPROVAL_SOCKET",
        payload: Socket.connect(state, dispatch, "judge", true),
      });
    }
  }, []);

  React.useEffect(() => {
    if (state.stage === "lecturer") {
      dispatch({
        type: "SET_SOCKET",
        payload: Socket.connect(state, dispatch, "session", true),
      });
    } else if (state.awaitsApproval) {
      dispatch({
        type: "SET_SOCKET",
        payload: Socket.connect(state, dispatch, "approval"),
      });
    } else {
      dispatch({
        type: "SET_SOCKET",
        payload: Socket.connect(state, dispatch, "session"),
      });
    }
  }, [state.sessionId, state.awaitsApproval, state.approvalRoomId]);

  return (
    <section className="fullsession">
      <Sessionbar state={state} dispatch={dispatch} />
      <div className="session">
        {state.stage === "lecturer" ? (
          state.isStatsVisible ? (
            <Stats state={state} dispatch={dispatch} />
          ) : (
            <Creator state={state} dispatch={dispatch} />
          )
        ) : (
          <Question state={state} dispatch={dispatch} />
        )}
        {<Chat state={state} dispatch={dispatch} />}
        {<Participants state={state} dispatch={dispatch} />}
      </div>
    </section>
  );
};

export default Session;
