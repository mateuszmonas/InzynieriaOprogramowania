package c.team.session.controller;

import c.team.session.SessionService;
import c.team.session.model.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/session")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SessionManagerController {

    private final SessionService sessionsService;

    @PostMapping("create")
    @ResponseStatus(HttpStatus.CREATED)
    public UUID createSession(@RequestBody SessionCreateRequest request){
        return sessionsService.createSession(request.getUsername(), request.getSessionTitle());
    }

    @PostMapping("connect")
    public ResponseEntity<GuestResponse> connectToSession(@RequestBody GuestRequest request){
        Session session = sessionsService.findByPasscode(UUID.fromString(request.getPasscode()));
        GuestResponse response = new GuestResponse(session.getId(), session.getTitle());
        return ResponseEntity.ok(response);
    }

    @PostMapping("close")
    public void closeSession(@RequestBody SessionCloseRequest request){
        sessionsService.closeSession(request.getSessionId());
    }
}
