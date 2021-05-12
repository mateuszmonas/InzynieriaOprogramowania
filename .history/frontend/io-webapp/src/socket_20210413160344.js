import React, { useState } from 'react';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import moment from "moment";

class Socket {
  constructor(socket, stompClient, username, sessionID, newMessage) {
    this.socket = socket;
    this.stompClient = stompClient;
    this.username = username;
    this.sessionID = sessionID;
    this.newMessage = newMessage;
  }

  static connect = (name, sessionID) => {
    if (name) {
      const socket = new SockJS("http://localhost:8080/session-handling");
      const stompClient = Stomp.over(socket);
      const username = name;
      const sock = new Socket(socket, stompClient, username, sessionID);
      stompClient.connect({}, sock.onConnected, sock.onError);

      console.log("POGGERS");
      return sock;
    }
  };

  onConnected = () => {
    console.log('xd')
    this.stompClient.subscribe(`/topic/session/${this.sessionID}`, this.onMessageReceived);
    // stompClient.send("/app/session/123/new-user",
    //     {},
    //     JSON.stringify({sender: username, type: 'CONNECT'})
    // )
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

  onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);

    if (message.type === "CONNECT") {
      console.log(message);
    } else if (message.type === "DISCONNECT") {
      console.log(message);
    } else {
      this.newMessage = message;

      

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
}

export default Socket;
