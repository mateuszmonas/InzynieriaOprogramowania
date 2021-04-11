package c.team.session.controller;

import c.team.message.exception.InvalidMessageTypeException;
import c.team.message.model.Message;
import c.team.message.model.MessageType;
import c.team.session.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Controller
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionController {

    private final SessionService sessionsService;

    @MessageMapping("/session/{sessionId}/send")
    @SendTo("/topic/session/{sessionId}")
    public Message sendMessage(@DestinationVariable String sessionId, @Payload final Message message){
        // Possibly throwing some exception if message type is wrong, but need to define "wrong" types
        sessionsService.addMessageToSessionLog(sessionId, message);
        // Possibly some validation whether sender is in this session
        return message;
    }

    @MessageMapping("/session/{sessionId}/new-user")
    @SendTo("/topic/session/{sessionId}")
    public Message addParticipant(@DestinationVariable String sessionId, @Payload final Message message, SimpMessageHeaderAccessor headerAccessor){
        if(message.getType() != MessageType.CONNECT)
            throw new InvalidMessageTypeException();
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        headerAccessor.getSessionAttributes().put("sessionId", message.getSessionId());
        sessionsService.addGuestToSession(message.getSessionId(), message.getSender());
        return message;
    }

    @MessageMapping("/session/{sessionApprovalId}/guest-approval-request")  // Here guest sends a request
    @SendTo("/topic/session/{sessionApprovalId}/guest-approval-request")    // Here room leader subscribes for requests
    public Message guestApprovalRequest(@DestinationVariable String sessionApprovalId, @Payload final Message message){
        if(message.getType() != MessageType.GUEST_APPROVAL)
            throw new InvalidMessageTypeException();
        return message;
    }

    // Routed to endpoint for particular guest
    @MessageMapping("/session/{sessionApprovalId}/guest-approval-response/{guestId}")       // Here room leader sends response
    @SendTo("/topic/session/{sessionApprovalId}/guest-approval-response/guest-{guestId}")   // Here guest subscribes to listen for response
    // Can be done with UserDestinationMessageHandler and @SentToUser but it's harder
    public Message guestApprovalResponse(@DestinationVariable String sessionApprovalId, @DestinationVariable String guestId, @Payload final Message message){
        if(message.getType() != MessageType.GUEST_APPROVAL)
            throw new InvalidMessageTypeException();
        return message;
    }

    @ExceptionHandler(InvalidMessageTypeException.class)
    public final ResponseEntity<Error> handleException(InvalidMessageTypeException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
