import React from "react";

import Socket from "../socket";

import Chat from "./Chat";
import Participants from "./Participants";
import Question from "./Question";
import Creator from "./Creator";
import Stats from "./Stats";

import "./Session.css";
import Sessionbar from "./Sessionbar";
import QuestionPicker from "./QuestionPicker";

const Session = ({ state, dispatch }) => {
  React.useEffect(() => {
    if (state.stage === "lecturer") {
      dispatch({
        type: "SET_APPROVAL_SOCKET",
        payload: Socket.connect(state, dispatch, "judge", true),
      });
    }
  }, []);

  React.useEffect(async () => {
    console.log("ASYNC1: " + state.sessionId);
    console.log("ASYNC2: " + state.awaitsApproval);
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
      if (state.sessionId !== null && state.sessionId.length > 0) {
        const socket = Socket.connect(state, dispatch, "session");
        dispatch({
          type: "SET_SOCKET",
          payload: socket,
        });
      }
    }
  }, [state.sessionId, state.awaitsApproval, state.approvalRoomId]);

  return (
    <section className="fullsession">
      {/* <Sessionbar state={state} dispatch={dispatch} /> */}
      <div className="session">
        {state.stage === "lecturer" ? (
          <>
            <QuestionPicker state={state} dispatch={dispatch} />
            <Stats state={state} dispatch={dispatch} />
          </>
        ) : (
          <Question state={state} dispatch={dispatch} />
        )}
        <div className="sessionRightSidebar">
          <Participants state={state} dispatch={dispatch} />
          <Chat state={state} dispatch={dispatch} />
        </div>
      </div>
    </section>
  );
};

export default Session;
