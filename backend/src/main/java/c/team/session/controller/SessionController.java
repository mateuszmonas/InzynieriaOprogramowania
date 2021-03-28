package c.team.session.controller;

import c.team.message.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class SessionController {

    @MessageMapping("/???") // chat.send
    @SendTo("/???") // topic/public
    public Message sendMessage(@Payload final Message message){
        return message;
    }

    @MessageMapping("/???") // chat.newUser
    @SendTo("/???") // topic/public
    public Message addParticipant(@Payload final Message message, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("participantName", message.getSender());
        return message;
    }
}
