package c.team.session.controller;

import c.team.message.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class SessionEventListener {

    @Autowired
    private SimpMessageSendingOperations sendingOperations;

    @EventListener
    public void handleParticipantConnect(final SessionConnectedEvent event) {
        SessionController.LOGGER.info("NEW USER!");
    }

    @EventListener
    public void handleParticipantDisconnect(final SessionDisconnectEvent event) {
//        final StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        final String participant = (String) headerAccessor.getSessionAttributes().get("participantName");
//        final Message message = Message.builder().build();  // Stuff here
//        sendingOperations.convertAndSend("/???", message);  // topic/public
    }
}
