import React from "react";

const Sessionbar = ({ state, dispatch }) => {
  const handleClose = (e) => {
    e.preventDefault();

    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/session/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: state.username,
          sessionId: state.sessionId,
        }),
      })
          .then((_) => {
          dispatch({ type: "SET_SESSION_ID", payload: "" });
          dispatch({ type: "SET_STAGE_ACCOUNT" });
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

  const leaveSessionHandler = (e) => {
    dispatch({ type: "SET_MESSAGE", payload: "" });
    if (state.stage === "lecturer") {
      handleClose(e);
    } else if (state.stage === "guest") {
      dispatch({ type: "SET_STAGE_START" });
    } else {
      dispatch({ type: "SET_STAGE_ACCOUNT" });
    }
  };

  return (
    <div className="sessionbar">
      <div>
        <h3>{state.sessionTitle}</h3>
        <button type="button" className="leave" onClick={leaveSessionHandler}>
          Leave Session
        </button>
      </div>
      {!state.awaitsApproval && (
        <>
          {state.stage === "lecturer" && (
            <button
              type="button"
              className="view"
              onClick={(e) =>
                dispatch(
                  state.isStatsVisible
                    ? { type: "SET_CREATOR_VISIBLE" }
                    : { type: "SET_STATS_VISIBLE" }
                )
              }
            >
              Stats
            </button>
          )}
          <button
            type="button"
            className="view"
            onClick={(e) =>
              dispatch(
                state.isChatVisible
                  ? { type: "NOTHING_VISIBLE" }
                  : { type: "CHAT_VISIBLE" }
              )
            }
          >
            Chat
          </button>
          <button
            type="button"
            className="view"
            onClick={(e) =>
              dispatch(
                state.isParticipantsVisible
                  ? { type: "NOTHING_VISIBLE" }
                  : {
                      type: "PARTICIPANTS_VISIBLE",
                      payload: { e, state, dispatch },
                    }
              )
            }
          >
            Participants
          </button>
        </>
      )}
    </div>
  );
};

export default Sessionbar;
