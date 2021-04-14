import SockJS from "sockjs-client";
import Stomp from "stompjs";
import moment from "moment";

class Socket {
  constructor(
    socket,
    stompClient,
    username,
    sessionID,
    guestID,
    type,
    isGuest,
    setStage,
    setSocket,
  ) {
    this.socket = socket;
    this.stompClient = stompClient;
    this.username = username;
    this.sessionID = sessionID;
    this.guestID = guestID;
    this.type = type;
    this.isGuest = isGuest;
    this.setStage = setStage;
    this.setSocket = setSocket;
    this.messageListeners = [];
  }

  addMessageListener(listener) {
    this.messageListeners.push(listener);
  }

  removeMessageListener(listener) {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener);
  }

  static connect = (name, sessionID, guestID, type, isGuest, setStage, setSocket) => {
    if (name) {
      const socket = new SockJS("http://localhost:8080/session-handling");
      const stompClient = Stomp.over(socket);
      const username = name;
      const sock = new Socket(
        socket,
        stompClient,
        username,
        sessionID,
        guestID,
        type,
        isGuest,
        setStage,
        setSocket,
      );
      stompClient.connect({}, sock.onConnected, sock.onError);

      return sock;
    }
  };

  onConnected = () => {
    if (this.type === "session") {
      this.stompClient.subscribe(
        `/topic/session/${this.sessionID}`,
        this.onMessageReceived
      );
      const msg = { sender: this.guestID, type: "CONNECT" };
      console.log(msg);
      this.stompClient.send(
        `/app/session/${this.sessionID}/new-user`,
        {},
        JSON.stringify(msg)
      );
    } else if (this.type === "approval") {
      this.stompClient.subscribe(
        `/topic/session/${this.sessionID}`,
        this.onApprovalReceived
      );
    } else {
      this.stompClient.subscribe(
        `/topic/session/${this.sessionId}/guest-approval-request`,
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
        sender: this.username,
        content: message,
        type: "COMMENT",
        timestamp: moment().calendar(),
      };
      this.stompClient.send(
        `/app/session/${this.sessionID}/send`,
        {},
        JSON.stringify(chatMessage)
      );
    }
  };

  sendRequest = () => {
    if (this.stompClient) {
      const chatMessage = {
        sender: this.name,
        content: this.guestID,
        type: "GUEST_APPROVAL"
      };
      this.stompClient.send(
        `/app/session/${this.sessionID}/guest-approval-request`,
        {},
        JSON.stringify(chatMessage)
      );
    }
  };
  
  sendApproval = (guestID, isApproved) => {
    if (this.stompClient) {
      const chatMessage = {
        content: isApproved,
        type: "GUEST_APPROVAL",
      };
      this.stompClient.send(
        `/app/session/${this.sessionID}/guest-approval-response/${guestID}`,
        {},
        JSON.stringify(chatMessage)
      );
    }
  };

  onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    if (message.type === "CONNECT") {
      console.log(message);
    } else if (message.type === "DISCONNECT") {
      console.log(message);
    } else {
      console.log("COMMENT MOMENT");
      console.log(this.messageListeners);
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

    if (message.type === "GUEST_APPROVAL") {
      if (message.content === true) {
        this.setStage("student");
        this.setSocket(
          Socket.connect(
            this.name,
            message.sessionId,
            this.guestID,
            "session",
            this.setStage,
            this.setSocket
          )
        );
      } else {
        if (this.isGuest) {
          this.setStage("");
        } else {
          this.setStage("student");
        }
        this.setSocket(new Socket());
      }
    }
  };

  onRequestReceived = (payload) => {
    const message = JSON.parse(payload.body);
  
    if (message.type === "GUEST_APPROVAL") {
      for (const listener of this.messageListeners) {
        listener(message);
      }
    }
  };
}

export default Socket;
