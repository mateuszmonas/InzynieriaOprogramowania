package c.team.session.controller;

import c.team.message.model.Message;
import c.team.session.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionController {

    private final SessionService sessionsService;

    @MessageMapping("/session/{sessionId}/send")
    @SendTo("/topic/session/{sessionId}")
    public Message sendMessage(@DestinationVariable String sessionId, @Payload final Message message){
        sessionsService.addMessageToSessionLog(sessionId, message);
        // Possibly some validation whether sender is in this session
        return message;
    }

    @MessageMapping("/session/{sessionId}/new-user")
    @SendTo("/topic/session/{sessionId}")
    public Message addParticipant(@DestinationVariable String sessionId, @Payload final Message message, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        headerAccessor.getSessionAttributes().put("sessionId", message.getSessionId());
        sessionsService.addGuestToSession(message.getSessionId(), message.getSender());
        return message;
    }
}
