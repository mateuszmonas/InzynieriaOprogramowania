package c.team.session;

import c.team.account.UserAccountService;
import c.team.account.model.UserAccount;
import c.team.message.model.Message;
import c.team.session.exception.SessionNotFoundException;
import c.team.session.model.Session;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionConnectedEvent.class);

    private final SessionRepository sessionRepository;

    public UUID createSession(String leaderUsername, String title){
        Session session = Session.builder()
                .leaderUsername(leaderUsername)
                .title(title)
                .active(true)
                .passcode(UUID.randomUUID())
                .log(new ArrayList<>())
                .build();

        UUID passcode = sessionRepository.save(session).getPasscode();
        LOGGER.info("Opened session: " + session.getId());
        return passcode;
    }

    public void closeSession(String sessionId){
        Session session = this.findBySessionId(sessionId);
        session.setActive(false);
        sessionRepository.save(session);
        LOGGER.info("Closed session: " + sessionId);
    }

    public void addMessageToSessionLog(String sessionId, Message message){
        Session session = this.findBySessionId(sessionId);
        session.getLog().add(message);
        sessionRepository.save(session);
    }

    public Session findByPasscode(UUID passcode){
        return Optional.ofNullable(sessionRepository.findSessionByPasscode(passcode))
                .orElseThrow(() -> new SessionNotFoundException("no session with passcode: " + passcode.toString()));
    }

    public Session findBySessionId(String sessionsId){
        return Optional.ofNullable(sessionRepository.findSessionById(sessionsId))
                .orElseThrow(() -> new SessionNotFoundException("no sessions with id: " + sessionsId));
    }
}
