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
import c.team.timeline.TimelineRequest;
import c.team.timeline.TimelineResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/session")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionManagerController {

    private final SessionService sessionsService;
    private final UserAccountService accountService;

    @PostMapping("create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<SessionCreateResponse> createSession(@RequestBody @Valid SessionCreateRequest request) {
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
    public ResponseEntity<GuestResponse> connectToSession(@RequestBody @Valid GuestRequest request) {
        Session session = sessionsService.findByPasscode(UUID.fromString(request.getPasscode()));
        if(session.isActive()) {
            String guestId =  sessionsService.addGuestToSession(session.getId(), request.getUsername());
            GuestResponse response = new GuestResponse(
                    session.isGuestApproval() ? "" : session.getId(),
                    session.getTitle(),
                    session.isGuestApproval(),
                    session.getGuestApprovalRoomId() == null ? "" : session.getGuestApprovalRoomId().toString(),
                    guestId
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
        if(!( request.getIdentification().equals(sessionLeader.getUsername())
                || session.getGuests().containsKey(request.getIdentification()) ))
            throw new SessionUnauthorizedAccessException();

        ParticipantListResponse response = new ParticipantListResponse(
                sessionLeader.getUsername(),
                session.getGuests().values().stream()
                        .filter(Guest::isApproved)
                        .collect(Collectors.toList())
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("close")
    public void closeSession(@RequestBody @Valid SessionCloseRequest request) {
        sessionsService.closeSession(request.getSessionId(), request.getUsername());
    }

    // Test session ID: 6074cc8fffe6d61ae3952eb6
    // Test session name: TimelineTest
    // Test session passcode: 9c07fca0-58af-46d9-add9-86efc6681e4a
    @PostMapping("timeline")
    public ResponseEntity<TimelineResponse> getTimeline(@RequestBody TimelineRequest request){
        Session session = sessionsService.findBySessionId(request.getSessionId());
        sessionsService.validateOwner(session.getId(), request.getUsername());
        TimelineResponse response = new TimelineResponse(session.getLog());
        return ResponseEntity.ok(response);
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
