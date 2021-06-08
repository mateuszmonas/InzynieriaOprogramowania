package c.team.session.administration.controller;

import c.team.account.UserAccountService;
import c.team.account.model.UserAccount;
import c.team.participants.list.ParticipantListRequest;
import c.team.participants.list.ParticipantListResponse;
import c.team.security.model.UserPrincipal;
import c.team.session.administration.SessionService;
import c.team.session.administration.exception.SessionClosedException;
import c.team.session.administration.exception.SessionNotFoundException;
import c.team.session.administration.exception.SessionUnauthorizedAccessException;
import c.team.session.administration.model.*;
<<<<<<< HEAD
import c.team.session.history.SessionHistoryResponse;
import c.team.timeline.TimelineRequest;
import c.team.timeline.TimelineResponse;
=======
>>>>>>> 8b8fa1e8366a11ef04c7bdb9396d61ff28e694e1
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
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
    public ResponseEntity<SessionCreateResponse> createSession(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody @Valid SessionCreateRequest request) {
        Session session = sessionsService.createSession(
                userPrincipal.getUsername(),
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

    @PostMapping("/{sessionId}/close")
    @ResponseStatus(HttpStatus.OK)
    public void closeSession(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable String sessionId) {
        sessionsService.validateOwnerById(sessionId, userPrincipal.getId());
        sessionsService.closeSession(sessionId);
    }

    @PostMapping("connect")
    public ResponseEntity<GuestResponse> connectToSession(@RequestBody @Valid GuestRequest request) {
        Session session = sessionsService.findByPasscode(UUID.fromString(request.getPasscode()));
        if (session.isActive()) {
            String guestId = sessionsService.addGuestToSession(session.getId(), request.getUsername());
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

<<<<<<< HEAD
    @PostMapping("participant-list")
    public ResponseEntity<ParticipantListResponse> getParticipantsList(@RequestBody ParticipantListRequest request){
        Session session = sessionsService.findBySessionId(request.getSessionId());
=======
    @PostMapping("/{sessionId}/participant/list")
    public ResponseEntity<ParticipantListResponse> getParticipantsList(@RequestBody ParticipantListRequest request, @PathVariable String sessionId) {
        Session session = sessionsService.findBySessionId(sessionId);
>>>>>>> 8b8fa1e8366a11ef04c7bdb9396d61ff28e694e1
        UserAccount sessionLeader = accountService.findByUserId(session.getLeaderAccountId());
        if (!(request.getIdentification().equals(sessionLeader.getUsername())
                || session.getGuests().containsKey(request.getIdentification())))
            throw new SessionUnauthorizedAccessException();

        ParticipantListResponse response = new ParticipantListResponse(
                sessionLeader.getUsername(),
                session.getGuests().values().stream()
                        .filter(Guest::isApproved)
                        .collect(Collectors.toList())
        );
        return ResponseEntity.ok(response);
    }

<<<<<<< HEAD
    @PostMapping("close")
    public void closeSession(@RequestBody @Valid SessionCloseRequest request) {
        sessionsService.closeSession(request.getSessionId(), request.getUsername());
    }

    // Request used for one particular session
    @GetMapping("timeline")
    public ResponseEntity<TimelineResponse> getTimeline(@RequestBody TimelineRequest request){
        Session session = sessionsService.findBySessionId(request.getSessionId());
        sessionsService.validateOwner(session.getId(), request.getUsername());
        TimelineResponse response = new TimelineResponse(session.getLog());
        return ResponseEntity.ok(response);
    }

=======
>>>>>>> 8b8fa1e8366a11ef04c7bdb9396d61ff28e694e1
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
