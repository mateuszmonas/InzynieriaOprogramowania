import SockJS from "sockjs-client";
import Stomp from "stompjs";
import moment from "moment";

class Socket {
  constructor(
    socket,
    stompClient,
    state,
    dispatch,
    type,
    isLeader
  ) {
    this.socket = socket;
    this.stompClient = stompClient;
    this.state = state;
    this.dispatch = dispatch;
    this.type = type;
    this.isLeader = isLeader;
    this.messageListeners = [];
    this.questions = []
    this.quizId = ""
  }

  addMessageListener(listener) {
    this.messageListeners.push(listener);
  }

  removeMessageListener(listener) {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener);
  }

  static connect = (
    state,
    dispatch,
    type,
    isLeader = false,
  ) => {
    if (state) {
      const socket = new SockJS(process.env.REACT_APP_BACKEND_URL + "/session-handling");
      const stompClient = Stomp.over(socket);
      const sock = new Socket(
        socket,
        stompClient,
        state,
        dispatch,
        type,
        isLeader
      );
      stompClient.connect({}, sock.onConnected, sock.onError);

      return sock;
    }
  };

  onConnected = () => {
    if (this.type === "session") {
      this.stompClient.subscribe(    // subscribe chat messages
        `/topic/session/${this.state.sessionId}`,
        this.onMessageReceived
      );
      const msg = { sender: this.state.guestId, type: "CONNECT" };

      if (!this.isLeader) {
        this.stompClient.send(
            `/app/socket/session/${this.state.sessionId}/new-user`,
            {},
            JSON.stringify(msg)
        );
      }

      let msgType = this.isLeader ? 'quiz-answers' : 'quiz'; 
      this.stompClient.subscribe(    // subscribe quiz
        `/topic/session/${this.state.sessionId}/${msgType}`,
        this.onMessageReceived
      );

    } else if (this.type === "approval") {
      this.stompClient.subscribe(
        `/topic/session/${this.state.approvalRoomId}/guest-approval-response/guest-${this.state.guestId}`,
        this.onApprovalReceived
      );
      this.sendRequest();

    } else {
      this.stompClient.subscribe(
        `/topic/session/${this.state.approvalRoomId}/guest-approval-request`,
        this.onRequestReceived
      );
    }
  };

  onError = (error) => {
    console.log("Failed to connect to websocket");
    console.log(error);
  };


  /*
    COMMENT
    REPLY
    QUIZ
    QUIZ_ANSWERS
    EMOTE
  */
  sendMessage = (message) => {
    console.log("content...." + message.content);
    let types = {
      "send" : "COMMENT",
      "quiz-answers" : "QUIZ_ANSWERS",
      "quiz" : "QUIZ",
      "emote" : "EMOTE"
    }

    if (message && this.stompClient) {
      const messageToSend = {
        sender: this.state.username,
        content: JSON.stringify(message.content),
        type: types[message.type],
        timestamp: moment().calendar(),
      };

      if (message.type === "emote")
        message.type = "send";

      console.log(messageToSend);
      this.stompClient.send(
          `/app/socket/session/${this.state.sessionId}/${message.type}`,
          {},
          JSON.stringify(messageToSend)
      );
    }
  };

  sendRequest = () => {
    if (this.stompClient) {
      const chatMessage = {
        sender: this.state.username,
        content: this.state.guestId,
        type: "GUEST_APPROVAL",
      };
      this.stompClient.send(
          `/app/socket/session/${this.state.approvalRoomId}/guest-approval-request`,
          {},
          JSON.stringify(chatMessage)
      );
    }
  };

  sendApproval = (guestId, isApproved) => {
    if (this.stompClient) {
      const chatMessage = {
        content: isApproved,
        type: "GUEST_APPROVAL",
      };
      this.stompClient.send(
          `/app/socket/session/${this.state.approvalRoomId}/guest-approval-response/${guestId}`,
          {},
          JSON.stringify(chatMessage)
      );
    }
  };

  onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    if (message.type === "CONNECT") {
      console.log(message);   // consider deleting
    } else if (message.type === "DISCONNECT") {
      console.log(message);   // consider deleting
    } else {
      if(message.type === 'QUIZ'){
        const quiz = JSON.parse(message.content);
        this.quizId = quiz.id;
        this.questions.push.apply(this.questions, quiz.questions);
      }
      if(message.type === "COMMENT" || message.type === "EMOTE"){
        for (const listener of this.messageListeners) {
          listener(message);
        }
      }

      // messageElement.classList.add('chat-message')

      // const avatarContainer = document.createElement('div')
      // avatarContainer.className = 'img_cont_msg'
      // const avatarElement = document.createElement('div')
      // avatarElement.className = 'circle user_img_msg'
      // const avatarText = document.createTextNode(message.sender[0])
      // avatarElement.appendChild(avatarText);
      // avatarElement.style['background-color'] = getAvatarColor(message.sender)
      // avatarContainer.appendChild(avatarElement)

      // messageElement.style['background-color'] = getAvatarColor(message.sender)

      // flexBox.appendChild(avatarContainer)

      // const time = document.createElement('span')
      // time.className = 'msg_time_send'
      // time.innerHTML = message.time
      // messageElement.appendChild(time)
    }
  };



  onApprovalReceived = (payload) => {
    const message = JSON.parse(payload.body);

    // if (message.type === "GUEST_APPROVAL") {
    if (message.content === true) {
      // const newSocket = Socket.connect(
      //   this.state,
      //   this.dispatch,
      //   "session",
      //   this.isLeader,
      // );
      if (this.state.stage === "guest") {
        this.dispatch({type: "SET_STAGE_GUEST"})
      } else {
        this.dispatch({type: "SET_STAGE_STUDENT"})
      }
      this.dispatch({type: "SET_SESSION_ID", payload: message.sessionId})
      // this.setSocket(newSocket);
      // this.setStage("student");
      // this.setSessionID(message.sessionId);
    } else {
      if (this.state.stage === "guest") {
        this.dispatch({type: "SET_STAGE_START"})
      } else {
        this.dispatch({type: "SET_STAGE_ACCOUNT"})
      }
      // this.setSocket(new Socket("","","",""));
    }
    // }
  };
  
  onRequestReceived = (payload) => {
    const message = JSON.parse(payload.body);

    if (message.type === "GUEST_APPROVAL") {
      console.log(this.state);
      console.log(this.messageListeners);
      for (const listener of this.messageListeners) {
        listener(message);
      }
    }
  };
}

export default Socket;
