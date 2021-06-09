import React from "react"
import { Chrono } from "react-chrono";
import { FiArrowLeft } from "react-icons/fi";

import "./Timeline.css";
import "./Account.css"

const Timeline = ({ state, dispatch }) => {

  const ParseContent = (type, content) => { // Requires tests
    switch (type) {
      case "COMMENT":
        return content;
      case "QUIZ":
        return content.name;
      case "QUIZ_ANSWERS":
        return content[0][0];
    }
  }

  const ParseSessions = () => {
    return (
      <Chrono
        items={
          state
            .sessionHistory[state.pickedSession]
            .log
            .slice(1, state.sessionHistory[state.pickedSession].log.length)
            .map((message) => {
              return {
                title: message.type,
                cardTitle: message.sender,
                cardSubtitle: message.timestamp,
                cardDetailedText: ParseContent(message.type, message.content)
              }
            })
        }
        theme={{primary: "grey", secondary: "yellow", cardBgColor: "#cccccc"}}
        mode="VERTICAL"
        useReadMore="true"
        hideControls="false"
        scrollable="true"
      />
    );
  };

  React.useEffect(() => {
    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/history", {
        method: "GET",
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch({
            type: "SET_SESSION_HISTORY",
            payload: data.sessions,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);
  return (
    <div className="quizListView">
      <div className="session-history-header">
        <h3>Session history</h3>
        <div className="quizListHeaderButtons">
          <button
            type="button"
            onClick={(e) => {
              dispatch({ type: "SET_MESSAGE", payload: "" })
              dispatch({ type: "SET_STAGE_ACCOUNT" })
            }}
            className="submit"
          >
            Back <FiArrowLeft size={16}/>
          </button>
        </div>
      </div>
      <div className="session-history-view">
        <div className="session-history-content">
          {state.sessionHistory.map((session, index) => {
            return (
              <div className="session-history-element">
                <button
                  className="session-history-button"
                  onClick={(e) => {
                    dispatch({type: "SET_PICKED_SESSION_IN_HISTORY", payload: index})
                  }}
                >
                  {session.title}
                </button>
              </div>
            );
          })}
        </div>

        <div className="session-timeline-content">
          {state.isSessionTimelineVisible ? (
            <div>
              <div className="session-title">
                <h2 className="session-title-text">{state.sessionHistory[state.pickedSession].title}</h2>
              </div>
              <div className="timeline-content">
                <ParseSessions/>
              </div>
            </div>
          ) : (
            <div className="session-title">
              <h2>Select session to view timeline</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timeline;