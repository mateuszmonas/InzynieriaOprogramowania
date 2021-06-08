import React from "react";
import {FiChevronDown, FiChevronUp} from "react-icons/fi";

import "./participants.css";
import "../common.css";

const Participants = ({ state, dispatch }) => {
  const [waiting, setWaiting] = React.useState([]);

  const addWaiting = (newWaiting) => {
    setWaiting((waiting) => [...waiting, newWaiting]);
  };

  const getParticipantsHandler = () =>
    (async () => {
      await fetch(
          process.env.REACT_APP_BACKEND_URL + `/session/${state.sessionId}/participant/list`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identification:
                  state.stage === "lecturer" ? state.username : state.guestId,
            }),
          }
      )
        .then((response) => response.json())
        .then((data) => {
          dispatch({
            type: "SET_SESSION_OWNER",
            payload: data.leaderAccountName,
          });
          dispatch({
            type: "SET_PARTICIPANTS",
            payload: [
              { id: "", username: data.leaderAccountName, approved: true },
              ...data.participants,
            ],
          });
        })
        .catch((error) => {
          console.error(error);
        });
    })();

  React.useEffect(() => {
    if (
      state.approvalSocket &&
      state.approvalSocket.messageListeners.length < 1
    ) {
      state.approvalSocket.addMessageListener(addWaiting);
    }
    return () => {
      if (
        state.approvalSocket &&
        state.approvalSocket.messageListeners.length > 1
      ) {
        state.approvalSocket.removeMessageListener(addWaiting);
      }
    };
  }, [state.visible, state.participants]);

  const acceptHandler = (event, guestId) => {
    const newWaiting = waiting.filter((item) => item.content !== guestId);
    setWaiting(newWaiting);
    state.socket.sendApproval(guestId, true);
  };

  const rejectHandler = (event, guestId) => {
    const newWaiting = waiting.filter((item) => item.content !== guestId);
    setWaiting(newWaiting);
    state.socket.sendApproval(guestId, false);
  };

  React.useEffect(() => {
    const interval = setInterval(() => getParticipantsHandler(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="participants"
      style={state.isParticipantsVisible ? {} : { height: "32px" }}
    >
      <div
        className="participantsHeader"
        style={state.isParticipantsVisible ? {} : { borderBottomWidth: "0px" }}
        onClick={() => dispatch({ type: "TOGGLE_PARTICIPANTS_VISIBLE" })}
      >
        <div className="participantsHeaderInfo">
          <div>Participants</div>
          <div style={{ fontSize: "16px", color: "gray" }}>
            {state.participants.length}
          </div>
        </div>
        {state.isParticipantsVisible ? (
          <FiChevronUp size={28} />
        ) : (
          <FiChevronDown size={28} />
        )}
      </div>

      <div
        className="participantsContent"
        style={state.isParticipantsVisible ? {} : { height: "0%" }}
      >
        {state.participants.map((msg) => {
          return (
            <div className="accepted" key={msg.id}>
              <h4>{msg.username}</h4>
            </div>
          );
        })}
        {waiting.map((msg) => {
          if (state.stage === "lecturer") {
            return (
              <div className="waiting" key={msg.content}>
                <h4>{msg.sender}</h4>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      acceptHandler(e, msg.content);
                    }}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      rejectHandler(e, msg.content);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          } else return <></>;
        })}
      </div>
    </div>
  );
};

export default Participants;
