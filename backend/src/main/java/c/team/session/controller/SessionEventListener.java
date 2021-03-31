package c.team.session.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionEventListener {

    private SimpMessageSendingOperations sendingOperations;

    @EventListener
    public void handleParticipantConnect(final SessionConnectedEvent event) {
        // Something to do after connecting to server
    }

    @EventListener
    public void handleParticipantDisconnect(final SessionDisconnectEvent event) {
        // Something to do on disconnect to server
    }
}
