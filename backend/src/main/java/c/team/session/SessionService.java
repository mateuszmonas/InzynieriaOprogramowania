package c.team.session;

import c.team.account.UserAccountRepository;
import c.team.account.UserAccountService;
import c.team.account.model.UserAccount;
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

    private final UserAccountService userAccountService;
    private final SessionRepository sessionRepository;

    public UUID createSession(String leaderName, String title){
        UserAccount leaderAccount = userAccountService.findByUsername(leaderName);
        Session session = Session.builder()
                .leader(leaderAccount)
                .title(title)
                .passcode(UUID.randomUUID())
                .log(new ArrayList<>())
                .build();
        return sessionRepository.save(session).getPasscode();
    }

    public Session findByPasscode(UUID passcode){
        return Optional.ofNullable(sessionRepository.findSessionByPasscode(passcode))
                .orElseThrow(() -> new SessionNotFoundException("no session with passcode: " + passcode.toString()));
    }

    public Session findBySessionId(String sessionsId){
        return sessionRepository.findById(UUID.fromString(sessionsId))
                .orElseThrow(() -> new SessionNotFoundException("no sessions with id: " + sessionsId));
    }
}
