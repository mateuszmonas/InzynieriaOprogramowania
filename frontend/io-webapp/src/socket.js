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
    console.log(state.sessionId)
    this.socket = socket;
    this.stompClient = stompClient;
    this.state = state;
    this.dispatch = dispatch;
    this.type = type;
    this.isLeader = isLeader;
    this.messageListeners = [];
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
      this.stompClient.subscribe(
        `/topic/session/${this.state.sessionId}`,
        this.onMessageReceived
      );
      const msg = { sender: this.state.guestId, type: "CONNECT" };

      if (!this.isLeader) {
        this.stompClient.send(
          `/app/session/${this.state.sessionId}/new-user`,
          {},
          JSON.stringify(msg)
        );
      }
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

  sendMessage = (message) => {
    if (message && this.stompClient) {
      const chatMessage = {
        sender: this.state.username,
        content: message,
        type: "COMMENT",
        timestamp: moment().calendar(),
      };
      this.stompClient.send(
        `/app/session/${this.state.sessionId}/send`,
        {},
        JSON.stringify(chatMessage)
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
        `/app/session/${this.state.approvalRoomId}/guest-approval-request`,
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
      console.log(chatMessage);
      this.stompClient.send(
        `/app/session/${this.state.approvalRoomId}/guest-approval-response/${guestId}`,
        {},
        JSON.stringify(chatMessage)
      );
    }
  };

  onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log(this.messageListeners);
    console.log(message);

    if (message.type === "CONNECT") {
      console.log(message);
    } else if (message.type === "DISCONNECT") {
      console.log(message);
    } else {
      for (const listener of this.messageListeners) {
        console.log(listener);
        console.log(message);
        listener(message);
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
