import React from "react"
import { Chrono } from "react-chrono";

import "./Timeline.css";

const Timeline = ({ state, dispatch }) => {
    const items = [{
        title: "1:20",
        cardTitle: "user1",
        cardSubtitle:"time1",
    }, {
        title: "1:22",
        cardTitle: "user2",
        cardSubtitle:"time2",
    }, {
        title: "1:24",
        cardTitle: "user3",
        cardSubtitle:"time3",
    }, {
        title: "1:30",
        cardTitle: "user4",
        cardSubtitle:"time4",
    }, {
        title: "1:32",
        cardTitle: "user5",
        cardSubtitle:"time5",
    }, {
        title: "1:34",
        cardTitle: "user6",
        cardSubtitle:"time6",
    }];

    return (
        <div className="session-history-main">
            <div className="session-history-bg">
                <div className="session-history-scroll">
                    <div className="session-list">
                        <div className="session-in-list">a1</div>
                        <div className="session-in-list">a2</div>
                        <div className="session-in-list">a3</div>
                        <div className="session-in-list">a1</div>
                        <div className="session-in-list">a2</div>
                        <div className="session-in-list">a3</div>
                        <div className="session-in-list">a1</div>
                        <div className="session-in-list">a2</div>
                        <div className="session-in-list">a3</div>
                        <div className="session-in-list">a1</div>
                        <div className="session-in-list">a2</div>
                        <div className="session-in-list">a3</div>
                        <div className="session-in-list">a1</div>
                        <div className="session-in-list">a2</div>
                        <div className="session-in-list">a3</div>
                        <div className="session-in-list">a1</div>
                        <div className="session-in-list">a2</div>
                        <div className="session-in-list">a3</div>
                    </div>
                </div>
            </div>
            <div className="timeline">
                <div className="session-header">
                    <h2>Session name:</h2>
                </div>
                <Chrono
                    items={items}
                    mode="VERTICAL_ALTERNATING"
                    useReadMore="false"
                    hideControls="true"
                />
                {/*<div className="history" style={{ width: "400px", height: "800px" }}>*/}
                {/*    <h2>Session history</h2>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

export default Timeline;