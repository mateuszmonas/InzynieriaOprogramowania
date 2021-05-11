import React from "react"
import { Chrono } from "react-chrono";

import "./Timeline.css";
import "./Account.css"

const Timeline = ({ state, dispatch }) => {
    const ParseSessions = () => {
        return (
            <Chrono
                cardHeight = "20"
                items={state
                    .sessionHistory[state.pickedSession]
                    .log
                    .slice(1, state.sessionHistory[state.pickedSession].log.length)
                    .map((message) => {
                        return {
                            title: message.type,
                            cardTitle: message.sender,
                            cardSubtitle: message.timestamp,
                            cardDetailedText: message.content   // need to parse that or add it to media
                        }
                    }) }
                mode="VERTICAL"
                useReadMore="true"
                hideControls="true"
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
                .then((response ) => response.json())
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
        <div className="quizList">
            <div className="quizList">
                <div className="session-history-scroll">
                    <div className="session-list">
                        {state.sessionHistory.map((session, index) => {
                            return (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                    dispatch({ type: "SET_PICKED_SESSION_IN_HISTORY", payload: index })
                                }}
                                    className="quizInList">
                                    {session.title}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="quizList">
                {state.isSessionTimelineVisible ? (
                    <div className="session-timeline">
                        <h2>{ state.sessionHistory[state.pickedSession].title }</h2>
                        <ParseSessions/>
                    </div>
                    ) : (
                <div className="session-header">
                    <h2>Select session to view timeline</h2>
                </div>
                )}
            </div>
        </div>
    );
}

export default Timeline;