package c.team.session.controller;

import c.team.session.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionEventListener {

    private SimpMessageSendingOperations sendingOperations;
    private SessionService sessionService;

    @EventListener
    public void handleParticipantConnect(final SessionConnectedEvent event) {
        // Something to do after connecting to server, probably not needed
    }

    @EventListener
    public void handleParticipantDisconnect(final SessionDisconnectEvent event) {
        final StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        final String guestName = (String) headerAccessor.getSessionAttributes().get("username");
        final String sessionId = (String) headerAccessor.getSessionAttributes().get("sessionId");
        sessionService.removeGuestFromSession(sessionId, guestName);
    }
}
