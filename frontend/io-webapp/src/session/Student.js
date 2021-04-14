import React from "react";
import Socket from "../socket";

import Chat from "./Chat";
import Participants from "./Participants";
import Question from "./Question";

import "./Session.css";
import Sessionbar from "./Sessionbar";

const Student = (props) => {
  const [chat, setChat] = React.useState(false);
  const [isParticipants, setIsParticipants] = React.useState(false);
  const [questionWidth, setQuestionWidth] = React.useState("100%");
  const [participants, setParticipants] = React.useState([]);
  const [owner, setOwner] = React.useState("");

  React.useEffect(() => {
    if (!chat && !isParticipants) {
      setQuestionWidth("100%");
    } else {
      setQuestionWidth("75%");
    }
  }, [chat, isParticipants]);

  const participantsHandler = (e) => {
    e.preventDefault();
    console.log({
      guestId: props.guestID,
      accountUsername: "",
      sessionId: props.sessionID
    });

    (async () => {
      await fetch("http://localhost:8080/session/participant-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identification: props.guestID,
          sessionId: props.sessionID
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setOwner(data.leaderAccountName);
          setParticipants(data.participants);
          setChat(false);
          setIsParticipants(!isParticipants);
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

  return (
    <section className="fullsession">
      <Sessionbar
        sessionID={props.sessionID}
        setSessionID={props.setSessionID}
        username={props.username}
        chat={chat}
        toggleChat={setChat}
        participants={isParticipants}
        toggleParticipants={setIsParticipants}
        participantsHandler={participantsHandler}
        stage={props.stage}
        setStage={props.setStage}
        sessionTitle={props.sessionTitle}
      />
      <div className="session">
        <Question width={questionWidth} stage={props.stage} />
        {<Chat visible={chat} socket={props.socket}/>}
        {
          <Participants
            visible={isParticipants}
            stage={props.stage}
            owner={owner}
            participants={participants}
            // socket={new Socket()}
          />
        }
      </div>
    </section>
  );
};

export default Student;
