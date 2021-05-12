package c.team.session.administration;

import c.team.account.UserAccountService;
import c.team.account.model.UserAccount;
import c.team.message.model.Message;
import c.team.session.administration.exception.SessionNotFoundException;
import c.team.session.administration.exception.SessionUnauthorizedAccessException;
import c.team.session.administration.model.Guest;
import c.team.session.administration.model.Session;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class SessionService {

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

        sessionRepository.save(session);
        log.info("Opened session: " + session.getId());

        // Add empty message so that messageId = 0 is neutral
        Message msg = Message.builder().build();
        addMessageToSessionLog(session.getId(), msg);
        return session;
    }

    public void closeSession(String sessionId) {
        Session session = this.findBySessionId(sessionId);
        session.setActive(false);
        sessionRepository.save(session);
        log.info("Closed session: " + sessionId);
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

    public void approveGuest(String sessionId, String guestId){
        Session session = this.findBySessionId(sessionId);
        session.getGuests().get(guestId).setApproved(true);
        sessionRepository.save(session);
    }

    public void removeGuestFromSession(String sessionId, String guestId){
        Session session = this.findBySessionId(sessionId);
        session.getGuests().remove(guestId);
        sessionRepository.save(session);
    }

    public void validateOwner(String sessionId, String potentialOwner) {
        Session session = this.findBySessionId(sessionId);
        UserAccount account = accountService.findByUsername(potentialOwner);
        if (!account.getId().equals(session.getLeaderAccountId()))
            throw new SessionUnauthorizedAccessException();
    }

    public void validateOwnerById(String sessionId, String ownerId) {
        Session session = this.findBySessionId(sessionId);
        if (!ownerId.equals(session.getLeaderAccountId()))
            throw new SessionUnauthorizedAccessException();
    }

    public Session findByPasscode(UUID passcode) {
        return sessionRepository.findSessionByPasscode(passcode)
                .orElseThrow(() -> new SessionNotFoundException("no session with passcode: " + passcode.toString()));
    }

    public Session findBySessionId(String sessionsId) {
        return sessionRepository.findSessionById(sessionsId)
                .orElseThrow(() -> new SessionNotFoundException("no sessions with id: " + sessionsId));
    }

    public Session findByGuestApprovalRoomId(UUID guestApprovalRoomId){
        return sessionRepository.findSessionByGuestApprovalRoomId(guestApprovalRoomId)
                .orElseThrow(() -> new SessionNotFoundException("no session with approval room: " + guestApprovalRoomId));
    }

    public List<Session> findByLeaderAccountId(String leaderAccountId){
        return sessionRepository.findSessionsByLeaderAccountId(leaderAccountId)
                .orElse(Collections.emptyList());
    }
}
