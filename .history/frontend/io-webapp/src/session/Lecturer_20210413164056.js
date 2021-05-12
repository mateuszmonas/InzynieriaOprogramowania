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
    const [newMessage, setNewMessage] = React.useState(props.socket.newMessage)
  
    React.useEffect(() => {
      if (!chat && !participants) {
        setQuestionWidth("100%");
      } else {
        setQuestionWidth("75%");
      }
    }, [chat, participants]);

    React.useEffect(() => {console.log('gówno')},[props.socket])
  
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
          sessionTitle={props.sessionTitle}
        />
        <div className="session">
          <Creator width={questionWidth} />
          {chat && <Chat socket={props.socket} setSocket={props.setSocket} username={props.username} sessionId={props.sessionID}/>}
          {participants && <Participants stage={props.stage}/>}
        </div>
      </section>
    );
  };

export default Lecturer
