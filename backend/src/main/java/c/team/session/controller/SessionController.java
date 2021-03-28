package c.team.session.controller;

import c.team.message.model.Message;
import c.team.session.SessionService;
import c.team.session.model.GuestRequest;
import c.team.session.model.GuestResponse;
import c.team.session.model.Session;
import c.team.session.model.SessionRequest;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Controller
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionController {

    private final SessionService sessionsService;

    @PostMapping("session/create")
    @ResponseStatus(HttpStatus.CREATED)
    public UUID createSession(@RequestBody SessionRequest request){
        return sessionsService.createSession(request.getUsername(), request.getTitle());
    }

    @PostMapping("session/connect")
    public ResponseEntity<GuestResponse> connectToSession(@RequestBody GuestRequest request){
        Session session = sessionsService.findByPasscode(UUID.fromString(request.getPasscode()));
        UUID token = UUID.randomUUID(); // Needs to verify with session
        GuestResponse response = new GuestResponse(token, session.getId());
        return ResponseEntity.ok(response);
    }

    @MessageMapping("/session/{sessionId}/send") // chat.send
    @SendTo("/topic/session/{sessionId}") // topic/public
    public Message sendMessage(@Payload final Message message){
        Session session = sessionsService.findBySessionId(message.getSessionId());
        session.getLog().add(message);
        return message;
    }

    @MessageMapping("/session/{sessionId}/newUser") // chat.newUser
    @SendTo("/topic/session/{sessionId}") // topic/public
    public Message addParticipant(@DestinationVariable String sessionId, @Payload final Message message, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("participantName", message.getSender());
        Session session = sessionsService.findBySessionId(message.getSessionId());
        session.getLog().add(message);
        return message;
    }
}
