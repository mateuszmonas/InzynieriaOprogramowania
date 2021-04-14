import React from 'react'

import Chat from "./Chat";
import Participants from "./Participants"
import Creator from "./Creator";

import "./Session.css";
import Sessionbar from "./Sessionbar";
import Socket from '../socket';

const Lecturer = (props) => {
    const [chat, setChat] = React.useState(false);
    const [isParticipants, setIsParticipants] = React.useState(false);
    const [questionWidth, setQuestionWidth] = React.useState("100%");
    const [participants, setParticipants] = React.useState([]);
    const [owner, setOwner] = React.useState("");
    const [waiting, setWaiting] = React.useState([]);
    // const [approvalSocket, setApprovalSocket] = React.useState(Socket.connect(props.username, props.approvalRoomID, props.guestID, "judge", false, props.setStage, props.setSocket))

    const addWaiting = (newWaiting) => {
      setWaiting([...waiting, newWaiting])
    }
  
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
        identification: props.username,
        sessionId: props.sessionID
      });
  
      (async () => {
        await fetch("http://localhost:8080/session/participant-list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identification: props.username,
            sessionId: props.sessionID
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setOwner(data.leaderAccountName);
            setParticipants(data.participants);
            setChat(false);
            setIsParticipants(!isParticipants);
            console.log("SNDKJSADNJASNDKASDN");
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
          <Creator width={questionWidth} />
        {<Chat visible={chat} socket={props.socket}/>}
        {
          <Participants
            visible={isParticipants}
            stage={props.stage}
            owner={owner}
            participants={participants}
            // socket={approvalSocket}
          />
        }
        </div>
      </section>
    );
  };

export default Lecturer
