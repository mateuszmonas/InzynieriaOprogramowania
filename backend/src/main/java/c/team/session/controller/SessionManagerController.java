package c.team.session.controller;

import c.team.account.UserAccountService;
import c.team.account.model.UserAccount;
import c.team.participants.list.ParticipantListRequest;
import c.team.participants.list.ParticipantListResponse;
import c.team.session.SessionService;
import c.team.session.exception.SessionClosedException;
import c.team.session.exception.SessionNotFoundException;
import c.team.session.exception.SessionUnauthorizedAccessException;
import c.team.session.model.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/session")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionManagerController {

    private final SessionService sessionsService;
    private final UserAccountService accountService;

    @PostMapping("create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<SessionCreateResponse> createSession(@RequestBody SessionCreateRequest request){
        Session session = sessionsService.createSession(
                request.getUsername(),
                request.getSessionTitle(),
                request.isGuestApproval()
        );
        SessionCreateResponse response = new SessionCreateResponse(
                session.getId(),
                session.getPasscode().toString(),
                session.getGuestApprovalRoomId() == null ? "" : session.getGuestApprovalRoomId().toString()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("connect")
    public ResponseEntity<GuestResponse> connectToSession(@RequestBody GuestRequest request){
        Session session = sessionsService.findByPasscode(UUID.fromString(request.getPasscode()));
        if(session.isActive()) {
            GuestResponse response = new GuestResponse(
                    session.isGuestApproval() ? "" : session.getId(),
                    session.getTitle(),
                    session.isGuestApproval(),
                    session.getGuestApprovalRoomId() == null ? "" : session.getGuestApprovalRoomId().toString(),
                    UUID.randomUUID().toString()
            );
            return ResponseEntity.ok(response);
        }
        throw new SessionClosedException();
    }

    // Test session ID: 6075aa1270cdc94a69b24c33
    // Test session title: ParticipantListTest
    // Test session passcode: 13024218-87fb-4b66-b39b-8f0bb329d40a
    @PostMapping("participant-list")
    public ResponseEntity<ParticipantListResponse> getParticipantsList(@RequestBody ParticipantListRequest request){
        Session session = sessionsService.findBySessionId(request.getSessionId());
        UserAccount sessionLeader = accountService.findByUserId(session.getLeaderAccountId());
        if(!( request.getAccountUsername().equals(sessionLeader.getUsername())
                || session.getGuests().containsKey(request.getGuestId()) ))
            throw new SessionUnauthorizedAccessException();

        ParticipantListResponse response = new ParticipantListResponse(
                sessionLeader.getUsername(),
                session.getGuests().values()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("close")
    public void closeSession(@RequestBody SessionCloseRequest request){
        sessionsService.closeSession(request.getSessionId(), request.getUsername());
    }

    // Every exception that goes back to frontend requires such handler
    @ExceptionHandler(SessionClosedException.class)
    public final ResponseEntity<Error> handleException(SessionClosedException ex){
        return ResponseEntity.status(HttpStatus.GONE).build();
    }

    @ExceptionHandler(SessionNotFoundException.class)
    public final ResponseEntity<Error> handleException(SessionNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @ExceptionHandler(SessionUnauthorizedAccessException.class)
    public final ResponseEntity<Error> handleException(SessionUnauthorizedAccessException ex){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Duplicate from UserAccountController, probably a universal exception handler can be created
    @ExceptionHandler(UsernameNotFoundException.class)
    public final ResponseEntity<Error> handleException(UsernameNotFoundException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
