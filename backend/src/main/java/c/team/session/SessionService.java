package c.team.session;

import c.team.account.UserAccountService;
import c.team.account.model.UserAccount;
import c.team.message.model.Message;
import c.team.session.exception.SessionNotFoundException;
import c.team.session.exception.SessionUnauthorizedAccessException;
import c.team.session.model.Guest;
import c.team.session.model.Session;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.util.*;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionConnectedEvent.class);

    private final SessionRepository sessionRepository;
    private final UserAccountService accountService;

    public Session createSession(String leaderUsername, String title, boolean guestApproval){
        UserAccount account = accountService.findByUsername(leaderUsername);
        Session session = Session.builder()
                .leaderAccountId(account.getId())
                .title(title)
                .active(true)
                .passcode(UUID.randomUUID())
                .guestApproval(guestApproval)
                .log(new ArrayList<>())
                .guests(new HashMap<>())
                .build();

        if (guestApproval)
            session.setGuestApprovalRoomId(UUID.randomUUID());

        LOGGER.info("Opened session: " + session.getId());
        sessionRepository.save(session);

        // Add empty message so that messageId = 0 is neutral
        Message msg = Message.builder().build();
        addMessageToSessionLog(session.getId(), msg);
        return session;
    }

    public void closeSession(String sessionId, String potentialLeaderUsername){
        Session session = this.findBySessionId(sessionId);
        validateOwner(sessionId, potentialLeaderUsername);
        session.setActive(false);
        sessionRepository.save(session);
        LOGGER.info("Closed session: " + sessionId);
    }

    public void addMessageToSessionLog(String sessionId, Message message){
        Session session = this.findBySessionId(sessionId);
        message.setId(session.getLog().size());
        session.getLog().add(message);
        sessionRepository.save(session);
    }

    public String addGuestToSession(String sessionId, String guestName){
        Session session = this.findBySessionId(sessionId);
        String guestId = UUID.randomUUID().toString();
        Guest guest = Guest.builder()
                .id(guestId)
                .username(guestName)
                .approved(false)
                .build();
        session.getGuests().put(guest.getId(), guest);
        sessionRepository.save(session);
        return guestId;
    }

    public void removeGuestFromSession(String sessionId, String guestId){
        Session session = this.findBySessionId(sessionId);
        session.getGuests().remove(guestId);
        sessionRepository.save(session);
    }

    public void validateOwner(String sessionId, String potentialOwner){
        Session session = this.findBySessionId(sessionId);
        UserAccount account = accountService.findByUsername(potentialOwner);
        if(!account.getId().equals(session.getLeaderAccountId()))
            throw new SessionUnauthorizedAccessException();
    }

    public Session findByPasscode(UUID passcode){
        return Optional.ofNullable(sessionRepository.findSessionByPasscode(passcode))
                .orElseThrow(() -> new SessionNotFoundException("no session with passcode: " + passcode.toString()));
    }

    public Session findBySessionId(String sessionsId){
        return Optional.ofNullable(sessionRepository.findSessionById(sessionsId))
                .orElseThrow(() -> new SessionNotFoundException("no sessions with id: " + sessionsId));
    }

    public Session findByGuestApprovalRoomId(UUID guestApprovalRoomId){
        return sessionRepository.findSessionByGuestApprovalRoomId(guestApprovalRoomId)
                .orElseThrow(() -> new SessionNotFoundException("no session with approval room: " + guestApprovalRoomId));
    }
}
