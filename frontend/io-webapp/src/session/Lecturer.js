import React from 'react'

import Chat from "./Chat";
import Participants from "./Participants"
import Creator from "./Creator";

import "./Session.css";
import Sessionbar from "./Sessionbar";

const Lecturer = (props) => {
    const [chat, setChat] = React.useState(false);
    const [participants, setParticipants] = React.useState(false);
    const [questionWidth, setQuestionWidth] = React.useState("100%");
  
    React.useEffect(() => {
      if (!chat && !participants) {
        setQuestionWidth("100%");
      } else {
        setQuestionWidth("75%");
      }
    }, [chat, participants]);
  
    return (
      <section className="fullsession">
        <Sessionbar
          sessionID={props.sessionID}
          setSessionID={props.setSessionID}
          username={props.username}
          chat={chat}
          toggleChat={setChat}
          participants={participants}
          toggleParticipants={setParticipants}
          stage={props.stage}
          setStage={props.setStage}
        />
        <div className="session">
          <Creator width={questionWidth} />
          {chat && <Chat />}
          {participants && <Participants />}
        </div>
      </section>
    );
  };

export default Lecturer
